package com.email.notifications.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailConsumerService {

    private final EmailService emailService;
    private final ObjectMapper objectMapper;

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
            log.error("Error processing welcome email event: {}", message, e);
            throw new RuntimeException("Failed to process welcome email", e);
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
            log.error("Error processing OTP email event: {}", message, e);
            throw new RuntimeException("Failed to process OTP email", e);
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
            String pnrNumber = (String) payload.get("pnrNumber");
            String busName = (String) payload.get("busName");
            String source = (String) payload.get("source");
            String destination = (String) payload.get("destination");
            String journeyDate = (String) payload.get("journeyDate");
            String amount = (String) payload.get("amount");
            String passengerSeatsHtml = (String) payload.get("passengerSeatsHtml");

            String htmlBody = emailService.buildTicketEmail(name, bookingId, pnrNumber, busName, source, destination, journeyDate, amount,
                    passengerSeatsHtml);

            String displayRef = (pnrNumber != null && !pnrNumber.isBlank()) ? "PNR: " + pnrNumber : "Ticket #" + bookingId;
            emailService.sendHtmlEmail(email, "Booking Confirmation - " + displayRef, htmlBody);

        } catch (Exception e) {
            log.error("Error processing booking email event: {}", message, e);
            throw new RuntimeException("Failed to process booking email", e);
        }
    }
}
