package com.bus.booking_service.entities;

import com.bus.booking_service.enums.Role;
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
