package com.auth.users.services;

import com.auth.users.entities.User;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.HashMap;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class NotificationClientService {

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    public void sendEmailOtpRequest(String to, String subject, String otp, String purpose, User user) {
        try {
            Map<String, Object> payload = new HashMap<>();
            payload.put("name", user.getName());
            payload.put("email", to);
            payload.put("otp", otp);
            payload.put("purpose", purpose);
            payload.put("expiryMinutes", 10);

            String jsonMessage = objectMapper.writeValueAsString(payload);
            kafkaTemplate.send("otp-email-topic", to, jsonMessage).whenComplete((result, ex) -> {
                if (ex != null) {
                    log.error("Failed to publish OTP email event to Kafka for: {}", to, ex);
                } else {
                    log.info("Successfully published OTP email event to Kafka topic for: {}", to);
                }
            });
        } catch (Exception e) {
            log.error("Failed to serialize OTP email event for: {}", to, e);
        }
    }

    public void sendWelcomeEmailRequest(String to, String subject, String welcomeMessage, User user) {
        try {
            Map<String, Object> payload = new HashMap<>();
            payload.put("name", user.getName());
            payload.put("email", to);

            String jsonMessage = objectMapper.writeValueAsString(payload);
            kafkaTemplate.send("welcome-email-topic", to, jsonMessage).whenComplete((result, ex) -> {
                if (ex != null) {
                    log.error("Failed to publish Welcome email event to Kafka for: {}", to, ex);
                } else {
                    log.info("Successfully published Welcome email event to Kafka topic for: {}", to);
                }
            });
        } catch (Exception e) {
            log.error("Failed to serialize Welcome email event for: {}", to, e);
        }
    }
}
