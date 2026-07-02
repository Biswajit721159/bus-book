package com.bus.payment.entities;

import com.bus.payment.enums.Role;
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
