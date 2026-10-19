package com.auth.users.dtos.user;

import com.auth.users.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminUserQueryDTO {
    @Builder.Default
    private int page = 1;

    @Builder.Default
    private int limit = 10;

    private String search;
    private String name;
    private String email;
    private Role role; // null = all roles
    private Boolean isBlocked; // null = all statuses
}
