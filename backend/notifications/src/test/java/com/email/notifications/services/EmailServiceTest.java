package com.email.notifications.services;

import jakarta.mail.internet.MimeMessage;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.mail.javamail.JavaMailSender;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@SpringBootTest
public class EmailServiceTest {

    @Autowired
    private EmailService emailService;

    @MockBean
    private JavaMailSender javaMailSender;

    private MimeMessage mimeMessage;

    @BeforeEach
    void setUp() {
        mimeMessage = Mockito.mock(MimeMessage.class);
        when(javaMailSender.createMimeMessage()).thenReturn(mimeMessage);
    }

    @Test
    void testSendHtmlEmail_Success() {
        emailService.sendHtmlEmail("test@example.com", "Subject", "<p>Hello</p>");
        verify(javaMailSender).send(any(MimeMessage.class));
    }

    @Test
    void testBuildWelcomeEmail() {
        String rendered = emailService.buildWelcomeEmail("John Doe", "john@example.com");
        assertThat(rendered).contains("John Doe");
        assertThat(rendered).contains("john@example.com");
    }

    @Test
    void testBuildOtpEmail() {
        String rendered = emailService.buildOtpEmail("John Doe", "123456", "Registration", 10);
        assertThat(rendered).contains("John Doe");
        assertThat(rendered).contains("123456");
        assertThat(rendered).contains("Registration");
        assertThat(rendered).contains("10");
    }

    @Test
    void testBuildTicketEmail() {
        String rendered = emailService.buildTicketEmail(
                "John Doe",
                100L,
                "Express Bus",
                "New York",
                "Boston",
                "2026-07-01",
                "$50",
                "<li>Seat 12A</li>"
        );
        assertThat(rendered).contains("John Doe");
        assertThat(rendered).contains("100");
        assertThat(rendered).contains("Express Bus");
        assertThat(rendered).contains("New York");
        assertThat(rendered).contains("Boston");
        assertThat(rendered).contains("2026-07-01");
        assertThat(rendered).contains("$50");
        assertThat(rendered).contains("Seat 12A");
    }
}
