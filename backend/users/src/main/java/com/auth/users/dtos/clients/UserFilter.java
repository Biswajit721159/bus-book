package com.auth.users.dtos.clients;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class UserFilter {
    private String name;
    private String email;
}
