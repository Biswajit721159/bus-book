package com.entry.api_getway.entities;

import com.entry.api_getway.enums.Role;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    private Long id;
    private String name;
    private String email;
    private Role role;
}
