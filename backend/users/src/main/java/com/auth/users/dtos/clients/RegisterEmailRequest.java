package com.auth.users.dtos.clients;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.auth.users.enums.EmailType;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RegisterEmailRequest {
    private EmailType type;
    private String toEmail;
    private String subject;
    private String otp;
    private int otpExpirationMinutes;
    private String purpose;
    private UserFilter user;
}
