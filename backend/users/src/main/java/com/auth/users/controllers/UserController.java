package com.auth.users.controllers;

import com.auth.users.dtos.common.ApiResponse;
import com.auth.users.dtos.user.UpdateUserRequestDTO;
import com.auth.users.entities.User;
import com.auth.users.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @PutMapping("/updateUser")
    public ResponseEntity<ApiResponse<Void>> updateUser(
            @Valid @RequestBody UpdateUserRequestDTO body,
            Authentication authentication
    ) {
        if (authentication == null || !(authentication.getPrincipal() instanceof User currentUser)) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Unauthorized", HttpStatus.UNAUTHORIZED.value()));
        }

        currentUser.setName(body.getName());
        userRepository.save(currentUser);

        return ResponseEntity.ok(ApiResponse.success(
                "Profile updated successfully",
                null,
                HttpStatus.OK.value()
        ));
    }
}
