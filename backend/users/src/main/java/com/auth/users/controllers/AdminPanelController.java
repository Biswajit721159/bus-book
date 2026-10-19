package com.auth.users.controllers;

import com.auth.users.dtos.common.ApiResponse;
import com.auth.users.dtos.user.AdminPanelUserDTO;
import com.auth.users.entities.User;
import com.auth.users.enums.Role;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * AdminPanelController
 *
 * <p>
 * <strong>Use / Purpose:</strong><br>
 * Manages admin/owner portal session validation:
 *
 * <ul>
 * <li>Validates existing JWT token on app load for admin/owner and returns profile details with access level role code (e.g. "200" for
 * SUPER_ADMIN, "100" for BUS_OWNER).
 * </ul>
 *
 * <p>
 * <strong>Client Applications:</strong><br>
 *
 * <ul>
 * <li><strong>Bus Owner Portal & Super Admin Dashboard:</strong> Session persistence on page reload/navigation.
 * </ul>
 */
@RestController
@RequestMapping("/api/Adminpanel")
public class AdminPanelController {

    /**
     * Use: Validates stored JWT token on admin/owner portal load and returns user profile with role permissions. App: Bus Owner Portal &
     * Super Admin Dashboard (App Initializer / Protected Route Auth Guard).
     */
    @PostMapping("/logInByToken")
    public ResponseEntity<ApiResponse<AdminPanelUserDTO>> logInByToken(Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof User currentUser)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error("Unauthorized", HttpStatus.UNAUTHORIZED.value()));
        }

        if (currentUser.getRole() == Role.NORMAL_USER) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ApiResponse.error(
                    "Access denied. Admin or Bus Owner privileges required.", HttpStatus.FORBIDDEN.value()));
        }

        String roleCode = currentUser.getRole() == Role.SUPER_ADMIN ? "200" : "100";
        AdminPanelUserDTO responseData = AdminPanelUserDTO.builder().fullName(currentUser.getName()).email(currentUser.getEmail())
                .companyName(currentUser.getCompanyName()).phoneNumber(currentUser.getPhoneNumber()).role(roleCode).build();

        return ResponseEntity.ok(ApiResponse.success("Session valid", responseData, HttpStatus.OK.value()));
    }
}
