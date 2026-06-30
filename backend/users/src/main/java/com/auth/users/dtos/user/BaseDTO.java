package com.auth.users.dtos.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class BaseDTO {
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    protected String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, max = 20,
            message = "Password must be between 6 and 20 characters")
    protected String password;
}
