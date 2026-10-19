package com.auth.users.controllers;

import com.auth.users.appExceptions.ResourceNotFoundException;
import com.auth.users.dtos.common.ApiResponse;
import com.auth.users.dtos.user.*;
import com.auth.users.entities.User;
import com.auth.users.enums.Role;
import com.auth.users.repository.UserRepository;
import com.auth.users.services.AdminUserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

/**
 * UserController
 *
 * <p>
 * <strong>Use / Purpose:</strong><br>
 * Manages user profile updates as well as Super Admin user management:
 * <ul>
 * <li>Updating logged-in user profile attributes.
 * <li>Super Admin viewing, searching, paginating, and filtering all platform users.
 * <li>Super Admin blocking/unblocking users.
 * <li>Super Admin updating user roles and profiles.
 * <li>Super Admin deleting users.
 * <li>Super Admin fetching system-wide user statistics.
 * </ul>
 *
 * <p>
 * <strong>Client Applications:</strong><br>
 * <ul>
 * <li><strong>Passenger / User Web App:</strong> User Account / Profile Settings page.
 * <li><strong>Super Admin Dashboard:</strong> User Management Console.
 * </ul>
 */
@Slf4j
@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;
    private final AdminUserService adminUserService;

    /**
     * Updates display name and profile details of the authenticated passenger/owner.
     */
    @Transactional
    @PutMapping({"/updateUser", ""})
    public ResponseEntity<ApiResponse<Void>> updateUser(@Valid @RequestBody UpdateUserRequestDTO body, Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof User currentUser)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error("Unauthorized", HttpStatus.UNAUTHORIZED.value()));
        }

        User user = userRepository.findById(currentUser.getId()).orElseThrow(() -> new ResourceNotFoundException(
                "User not found with id: " + currentUser.getId()));

        user.setName(body.getName().trim());
        userRepository.save(user);
        log.info("Updated profile for user ID: {}", user.getId());

        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", null, HttpStatus.OK.value()));
    }

    // =========================================================================
    // SUPER ADMIN USER MANAGEMENT ENDPOINTS
    // =========================================================================

    /**
     * Super Admin: Fetch paginated and filtered users. Supports role filter (NORMAL_USER, BUS_OWNER, SUPER_ADMIN), status filter (blocked),
     * and search text across name, email, phone, and company.
     */
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @PostMapping("/getUserByPage")
    public ResponseEntity<ApiResponse<PaginatedUsersResponseDTO>> getUserByPage(@RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer limit, @RequestParam(required = false) String search,
            @RequestParam(required = false) String name, @RequestParam(required = false) String email,
            @RequestParam(required = false) Role role, @RequestParam(required = false) Boolean isBlocked,
            @RequestBody(required = false) AdminUserQueryDTO body) {

        AdminUserQueryDTO query = body != null ? body : new AdminUserQueryDTO();

        if (page != null) {
            query.setPage(page);
        }
        if (limit != null) {
            query.setLimit(limit);
        }
        if (search != null && !search.isBlank()) {
            query.setSearch(search);
        }
        if (name != null && !name.isBlank()) {
            query.setName(name);
        }
        if (email != null && !email.isBlank()) {
            query.setEmail(email);
        }
        if (role != null) {
            query.setRole(role);
        }
        if (isBlocked != null) {
            query.setIsBlocked(isBlocked);
        }

        PaginatedUsersResponseDTO result = adminUserService.getUsersPaged(query);
        return ResponseEntity.ok(ApiResponse.success("Users retrieved successfully", result, HttpStatus.OK.value()));
    }

    /**
     * Super Admin: Get aggregated platform user statistics.
     */
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<UserStatsDTO>> getUserStats() {
        UserStatsDTO stats = adminUserService.getUserStats();
        return ResponseEntity.ok(ApiResponse.success("User statistics retrieved successfully", stats, HttpStatus.OK.value()));
    }

    /**
     * Super Admin: Toggle user block / unblock status.
     */
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @RequestMapping(value = {"/{id}/toggle-block", "/{id}/block"}, method = {RequestMethod.PATCH, RequestMethod.PUT, RequestMethod.POST})
    public ResponseEntity<ApiResponse<AdminUserResponseDTO>> toggleBlockUser(@PathVariable Long id, Authentication authentication) {

        Long currentAdminId = null;
        if (authentication != null && authentication.getPrincipal() instanceof User currentUser) {
            currentAdminId = currentUser.getId();
        }

        AdminUserResponseDTO updated = adminUserService.toggleBlock(id, currentAdminId);
        String action = updated.isBlocked() ? "blocked" : "unblocked";
        return ResponseEntity.ok(ApiResponse.success("User " + action + " successfully", updated, HttpStatus.OK.value()));
    }

    /**
     * Super Admin: Update user information (name, phone, company, role, blocked status).
     */
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<AdminUserResponseDTO>> updateUserByAdmin(@PathVariable Long id,
            @Valid @RequestBody AdminUpdateUserDTO body) {

        AdminUserResponseDTO updated = adminUserService.updateUser(id, body);
        return ResponseEntity.ok(ApiResponse.success("User updated successfully", updated, HttpStatus.OK.value()));
    }

    /**
     * Super Admin: Permanently delete a user account.
     */
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUserByAdmin(@PathVariable Long id, Authentication authentication) {

        Long currentAdminId = null;
        if (authentication != null && authentication.getPrincipal() instanceof User currentUser) {
            currentAdminId = currentUser.getId();
        }

        adminUserService.deleteUser(id, currentAdminId);
        return ResponseEntity.ok(ApiResponse.success("User deleted successfully", null, HttpStatus.OK.value()));
    }
}
