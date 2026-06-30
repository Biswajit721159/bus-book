package com.email.notifications.dtos;

import com.email.notifications.enums.EmailType;
import lombok.Data;

@Data
public class CommonEmailRequest {
    private EmailType type;
    private String toEmail;
    private String subject;
}
