package com.email.notifications.dtos;

import lombok.Data;

@Data
public class WelcomeEmail extends CommonEmailRequest {
    private String welcomeMessage;
    private User user;
}
