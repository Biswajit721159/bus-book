package com.bus.payment.controllers;

import com.bus.payment.dtos.PaymentRequestBodyDTO;
import com.bus.payment.dtos.common.ApiResponse;
import com.bus.payment.entities.User;
import com.bus.payment.services.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * PaymentController
 *
 * <p>
 * <strong>Use / Purpose:</strong><br>
 * Handles payment processing and booking fulfillment:
 *
 * <ul>
 * <li>Receives payment transaction payload (card/UPI details, amount, seats, passenger information)
 * <li>Verifies and persists payment record
 * <li>Triggers booking confirmation in booking-service and emits booking notification events to Kafka
 * </ul>
 *
 * <p>
 * <strong>Client Applications:</strong><br>
 *
 * <ul>
 * <li><strong>Passenger / User Web App:</strong> Final step of the checkout flow ("Pay & Book Ticket").
 * </ul>
 */
@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {
    private final PaymentService paymentService;

    /**
     * Use: Processes ticket payment, verifies transaction details, generates booking record, and publishes notification events. App:
     * Passenger / User Web App (Checkout > Payment Step).
     */
    @PostMapping("/create")
    public ResponseEntity<ApiResponse<Long>> createPayment(@Valid @RequestBody PaymentRequestBodyDTO body, Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof User)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error("Unauthorized", HttpStatus.UNAUTHORIZED.value()));
        }
        User currentUser = (User) authentication.getPrincipal();
        Long bookingId = paymentService.createPayment(body, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Ticket booked successfully", bookingId, HttpStatus.OK.value()));
    }
}
