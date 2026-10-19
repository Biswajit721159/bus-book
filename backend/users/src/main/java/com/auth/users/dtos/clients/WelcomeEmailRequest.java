package com.auth.users.dtos.clients;

import com.auth.users.enums.EmailType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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
