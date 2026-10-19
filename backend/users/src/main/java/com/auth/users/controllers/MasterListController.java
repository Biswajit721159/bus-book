package com.auth.users.controllers;

import com.auth.users.appExceptions.UnauthorizedException;
import com.auth.users.dtos.common.ApiResponse;
import com.auth.users.dtos.masterlistDTOs.RequestDTO;
import com.auth.users.dtos.masterlistDTOs.ResponseDTO;
import com.auth.users.entities.User;
import com.auth.users.services.MasterListService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/**
 * MasterListController
 *
 * <p>
 * <strong>Use / Purpose:</strong><br>
 * Manages saved co-passengers / master passenger list for regular users:
 *
 * <ul>
 * <li>Retrieving saved passenger profiles (name, age, gender) for quick booking autofill
 * <li>Adding new passengers to master list
 * <li>Updating and deleting passenger details
 * <li>Internal API for booking-service to resolve passenger details by IDs
 * </ul>
 *
 * <p>
 * <strong>Client Applications:</strong><br>
 *
 * <ul>
 * <li><strong>Passenger / User Web App:</strong> Passenger selection step during booking and User Profile > Master List management.
 * <li><strong>Booking Microservice:</strong> Inter-service resolution of passenger names/ages on tickets.
 * </ul>
 */
@RestController
@RequestMapping("/api/master-list")
@Tag(name = "This end point is for add, edit, delete from master list")
@RequiredArgsConstructor
public class MasterListController {

    private final MasterListService masterListService;

    @Value("${gateway.internal.secret:bus-booking-internal-secret-token}")
    private String gatewayInternalSecret;

    private User getAuthenticatedUser(Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof User user)) {
            throw new UnauthorizedException("Unauthorized: Authentication required");
        }
        return user;
    }

    /**
     * Use: Retrieves the list of saved co-passengers for the authenticated user.
     */
    @GetMapping("")
    public ResponseEntity<ApiResponse<List<ResponseDTO>>> getUser(Authentication authentication) {
        User currentUser = getAuthenticatedUser(authentication);
        List<ResponseDTO> responseList = masterListService.getMasterList(currentUser);
        return ResponseEntity.ok(ApiResponse.success("Master list fetched successfully", responseList, HttpStatus.OK.value()));
    }

    /**
     * Use: Saves a new passenger (name, age, gender) into the user's master list.
     */
    @PostMapping("")
    public ResponseEntity<ApiResponse<ResponseDTO>> addUser(@Valid @RequestBody RequestDTO body, Authentication authentication) {
        User currentUser = getAuthenticatedUser(authentication);
        ResponseDTO newRecord = masterListService.addMasterListRecord(body, currentUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("User added to master list successfully", newRecord,
                HttpStatus.CREATED.value()));
    }

    /**
     * Use: Updates existing saved passenger profile information by ID.
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> updateUser(@PathVariable Long id, @Valid @RequestBody RequestDTO body,
            Authentication authentication) {
        User currentUser = getAuthenticatedUser(authentication);
        masterListService.updateMasterListRecord(id, body, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Record updated successfully", null, HttpStatus.OK.value()));
    }

    /**
     * Use: Soft-deletes / removes a passenger from the user's master list.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id, Authentication authentication) {
        User currentUser = getAuthenticatedUser(authentication);
        masterListService.deleteMasterListRecord(id, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Record soft-deleted successfully", null, HttpStatus.OK.value()));
    }

    /**
     * Use: Internal inter-service endpoint returning passenger details for an array of passenger IDs. Protected by X-Gateway-Secret
     * verification to prevent unauthenticated public scraping.
     */
    @GetMapping("/internal/{ids}")
    public ResponseEntity<ApiResponse<List<ResponseDTO>>> getMasterListForInternal(@PathVariable List<Long> ids,
            @RequestHeader(value = "X-Gateway-Secret", required = false) String gatewaySecret) {
        if (gatewaySecret == null || !gatewaySecret.equals(gatewayInternalSecret)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ApiResponse.error("Access denied: Invalid internal secret",
                    HttpStatus.FORBIDDEN.value()));
        }
        List<ResponseDTO> response = masterListService.getMasterListByIds(ids);
        return ResponseEntity.ok(ApiResponse.success("Master list fetched successfully", response, HttpStatus.OK.value()));
    }
}
