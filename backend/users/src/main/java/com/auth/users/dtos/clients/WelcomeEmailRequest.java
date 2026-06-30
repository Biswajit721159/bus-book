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
public class WelcomeEmailRequest {
    private EmailType type;
    private String toEmail;
    private String subject;
    private String welcomeMessage;
    private UserFilter user;
}
