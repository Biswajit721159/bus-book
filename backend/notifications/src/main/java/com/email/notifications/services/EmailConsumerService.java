package com.email.notifications.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.util.Map;

@Slf4j
@Service
public class EmailConsumerService {

    @Autowired
    private EmailService emailService;

    @Autowired
    private ObjectMapper objectMapper;

    @KafkaListener(topics = "welcome-email-topic", groupId = "notification-group")
    public void consumeWelcomeEmail(String message) {
        log.info("Received welcome email event: {}", message);
        try {
            Map<?, ?> payload = objectMapper.readValue(message, Map.class);
            String name = (String) payload.get("name");
            String email = (String) payload.get("email");

            String htmlBody = emailService.buildWelcomeEmail(name, email);
            emailService.sendHtmlEmail(email, "Welcome to BusBooking!", htmlBody);
        } catch (Exception e) {
            log.error("Error processing welcome email event", e);
        }
    }

    @KafkaListener(topics = "otp-email-topic", groupId = "notification-group")
    public void consumeOtpEmail(String message) {
        log.info("Received OTP email event: {}", message);
        try {
            Map<?, ?> payload = objectMapper.readValue(message, Map.class);
            String name = (String) payload.get("name");
            String email = (String) payload.get("email");
            String otp = (String) payload.get("otp");
            String purpose = (String) payload.get("purpose");
            Number expiryNum = (Number) payload.get("expiryMinutes");
            int expiryMinutes = expiryNum != null ? expiryNum.intValue() : 10;

            String htmlBody = emailService.buildOtpEmail(name, otp, purpose, expiryMinutes);
            emailService.sendHtmlEmail(email, "OTP Verification - BusBooking", htmlBody);
        } catch (Exception e) {
            log.error("Error processing OTP email event", e);
        }
    }

    @KafkaListener(topics = "booking-email-topic", groupId = "notification-group")
    public void consumeBookingEmail(String message) {
        log.info("Received booking email event: {}", message);
        try {
            Map<?, ?> payload = objectMapper.readValue(message, Map.class);
            String name = (String) payload.get("name");
            String email = (String) payload.get("email");
            Number bookingIdNum = (Number) payload.get("bookingId");
            Long bookingId = bookingIdNum != null ? bookingIdNum.longValue() : null;
            String busName = (String) payload.get("busName");
            String source = (String) payload.get("source");
            String destination = (String) payload.get("destination");
            String journeyDate = (String) payload.get("journeyDate");
            String amount = (String) payload.get("amount");
            String passengerSeatsHtml = (String) payload.get("passengerSeatsHtml");

            String htmlBody = emailService.buildTicketEmail(name, bookingId, busName, source, destination, journeyDate, amount, passengerSeatsHtml);
            emailService.sendHtmlEmail(email, "Booking Confirmation - Ticket #" + bookingId, htmlBody);
        } catch (Exception e) {
            log.error("Error processing booking email event", e);
        }
    }
}
