package com.auth.users.services;

import com.auth.users.entities.User;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@Slf4j
public class NotificationClientService {

    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;


    private final ObjectMapper objectMapper = new ObjectMapper();

    public void sendEmailOtpRequest(String to, String subject, String otp, String purpose, User user) {
        try {
            Map<String, Object> payload = new HashMap<>();
            payload.put("name", user.getName());
            payload.put("email", to);
            payload.put("otp", otp);
            payload.put("purpose", purpose);
            payload.put("expiryMinutes", 10);

            String jsonMessage = objectMapper.writeValueAsString(payload);
            kafkaTemplate.send("otp-email-topic", jsonMessage);
            log.info("Successfully published OTP email event to Kafka for: {}", to);
        } catch (Exception e) {
            log.error("Failed to publish OTP email event to Kafka for: {}", to, e);
        }
    }

    public void sendWelcomeEmailRequest(String to, String subject, String welcomeMessage, User user) {
        try {
            Map<String, Object> payload = new HashMap<>();
            payload.put("name", user.getName());
            payload.put("email", to);

            String jsonMessage = objectMapper.writeValueAsString(payload);
            kafkaTemplate.send("welcome-email-topic", jsonMessage);
            log.info("Successfully published Welcome email event to Kafka for: {}", to);
        } catch (Exception e) {
            log.error("Failed to publish Welcome email event to Kafka for: {}", to, e);
        }
    }
}
