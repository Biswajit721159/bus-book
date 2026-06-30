package com.booking.bus.controllers.Booking;

import com.booking.bus.dtos.Booking.PaymentRequestBodyDTO;
import com.booking.bus.dtos.common.ApiResponse;
import com.booking.bus.entities.User;
import com.booking.bus.services.PaymentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {
    @Autowired
    PaymentService paymentService;
    @PostMapping("/create")
    public ResponseEntity<ApiResponse<Long>> createPayment(@Valid @RequestBody PaymentRequestBodyDTO body, Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof User)) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Unauthorized", HttpStatus.UNAUTHORIZED.value()));
        }
        User currentUser = (User) authentication.getPrincipal();
        Long bookingId = paymentService.createPayment(body,currentUser);
        return ResponseEntity.ok(ApiResponse.success("Ticket booked successfully", bookingId, HttpStatus.OK.value()));
    }
}
