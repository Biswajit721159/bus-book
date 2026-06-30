package com.email.notifications.dtos;

import lombok.Data;

@Data
public class RegisterEmailRequest extends CommonEmailRequest {
    private String otp;
    private int otpExpirationMinutes;
    private String purpose;
    private User user;
}
