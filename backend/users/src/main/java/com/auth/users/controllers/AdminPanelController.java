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

@RestController
@RequestMapping("/api/Adminpanel")
public class AdminPanelController {

    @PostMapping("/logInByToken")
    public ResponseEntity<ApiResponse<AdminPanelUserDTO>> logInByToken(Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof User currentUser)) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Unauthorized", HttpStatus.UNAUTHORIZED.value()));
        }

        AdminPanelUserDTO responseData = AdminPanelUserDTO.builder()
                .fullName(currentUser.getName())
                .email(currentUser.getEmail())
                .companyName(currentUser.getCompanyName())
                .phoneNumber(currentUser.getPhoneNumber())
                .role(currentUser.getRole() == Role.SUPER_ADMIN ? "200" : "100")
                .build();

        return ResponseEntity.ok(ApiResponse.success(
                "Session valid",
                responseData,
                HttpStatus.OK.value()
        ));
    }
}
