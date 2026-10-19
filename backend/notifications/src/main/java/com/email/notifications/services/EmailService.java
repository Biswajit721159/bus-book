package com.email.notifications.services;

import jakarta.mail.internet.MimeMessage;
import java.nio.charset.StandardCharsets;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.util.StreamUtils;

@Service
@Slf4j
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender javaMailSender;

    @Value("classpath:templates/welcome-email.html")
    private Resource welcomeEmailTemplate;

    @Value("classpath:templates/otp-email.html")
    private Resource otpTemplate;

    @Value("classpath:templates/ticket-email.html")
    private Resource ticketBookTemplate;

    @Value("${spring.mail.username:}")
    private String mailUsername;

    @Value("${spring.mail.password:}")
    private String mailPassword;

    // This is for sending email
    public void sendHtmlEmail(String to, String subject, String htmlBody) {
        if (mailUsername == null || mailUsername.isBlank() || mailPassword == null || mailPassword.isBlank()) {
            log.warn("Skipping email send to {}: Mail credentials not configured in .env" +
                    " (SPRING_MAIL_USERNAME / SPRING_MAIL_PASSWORD)", to);
            return;
        }
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);
            javaMailSender.send(message);
            log.info("Email successfully sent to {}", to);
        } catch (Exception e) {
            log.error("Exception while sending HTML email to: {}", to, e);
            throw new RuntimeException("Failed to send email to " + to, e);
        }
    }

    public String buildWelcomeEmail(String name, String email) {
        try {
            String template = StreamUtils.copyToString(welcomeEmailTemplate.getInputStream(), StandardCharsets.UTF_8);
            return template.replace("{{name}}", name).replace("{{email}}", email);
        } catch (Exception e) {
            log.error("Failed to read email template", e);
            return "<h2>Hi " + name + ",</h2><p>Welcome to BusBooking! Your email " + email + " is registered.</p>";
        }
    }

    public String buildOtpEmail(String name, String otp, String purpose, int expiryMinutes) {
        try {
            String template = StreamUtils.copyToString(otpTemplate.getInputStream(), StandardCharsets.UTF_8);
            return template.replace("{{name}}", name).replace("{{otp}}", otp).replace("{{purpose}}", purpose).replace("{{expiry}}", String
                    .valueOf(expiryMinutes));
        } catch (Exception e) {
            log.error("Failed to read OTP email template", e);
            return "<h2>Hello " + name + ",</h2><p>Your OTP is <strong>" + otp + "</strong>. It will expire in " + expiryMinutes +
                    " minutes.</p>";
        }
    }

    public String buildTicketEmail(String name, Long bookingId, String pnrNumber, String busName, String source, String destination,
            String journeyDate, String amount, String passengerSeatsHtml) {
        try {
            String template = StreamUtils.copyToString(ticketBookTemplate.getInputStream(), StandardCharsets.UTF_8);
            String displayPnr = (pnrNumber != null && !pnrNumber.isBlank()) ? pnrNumber : String.valueOf(bookingId);
            return template.replace("{{name}}", name).replace("{{bookingId}}", String.valueOf(bookingId)).replace("{{pnrNumber}}",
                    displayPnr).replace("{{busName}}", busName).replace("{{source}}", source).replace("{{destination}}", destination)
                    .replace("{{journeyDate}}", journeyDate).replace("{{amount}}", amount).replace("{{passengerSeats}}",
                            passengerSeatsHtml);
        } catch (Exception e) {
            log.error("Failed to read ticket email template", e);
            String displayPnr = (pnrNumber != null && !pnrNumber.isBlank()) ? pnrNumber : String.valueOf(bookingId);
            return "<h2>Booking Confirmed!</h2>" + "<p>Hi " + name + ", your booking (PNR: " + displayPnr + " / #" + bookingId +
                    ") is confirmed.</p>" + "<p>Bus: " + busName + " (" + source + " to " + destination + ")</p>" + "<p>Date: " +
                    journeyDate + "</p>" + "<p>Amount: " + amount + "</p>" + "<h3>Passengers:</h3><ul>" + passengerSeatsHtml + "</ul>";
        }
    }
}
