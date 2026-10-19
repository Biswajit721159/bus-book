package com.auth.users.dtos.user;

import com.auth.users.enums.Role;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminUserResponseDTO {
    private Long id;
    private String name;
    private String email;
    private Role role;
    private boolean isBlocked;
    private boolean isEmailVerified;
    private String phoneNumber;
    private String companyName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
