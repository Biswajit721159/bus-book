package com.bus.payment.services;

import com.bus.payment.dtos.PaymentRequestBodyDTO;
import com.bus.payment.dtos.common.ApiResponse;
import com.bus.payment.entities.Payment;
import com.bus.payment.entities.User;
import com.bus.payment.enums.PaymentStatus;
import com.bus.payment.exceptions.ConflictException;
import com.bus.payment.repository.PaymentRepository;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
public class PaymentService {
    @Autowired
    private PaymentRepository paymentRepository;

    private final RestClient restClient = RestClient.builder().baseUrl("http://localhost:8006").build();

    @Transactional
    public Long createPayment(PaymentRequestBodyDTO body, User currentUser) {
        log.info("Processing payment for user: {}", currentUser.getEmail());
        Payment newPayment = new Payment();
        newPayment.setBusId(body.getBusId());
        newPayment.setCreatedBy(currentUser.getId());
        newPayment.setCardNumber(body.getCardNumber());
        newPayment.setCardCvv(body.getCardCvv());
        newPayment.setCardHolderName(body.getCardHolderName());
        newPayment.setCardExpiryDate(body.getCardExpiryDate());
        newPayment.setTotalAmount(body.getTotalAmount());
        newPayment.setStatus(PaymentStatus.PROCESSING);
        
        paymentRepository.save(newPayment);

        // Make synchronous REST call to booking-service to confirm booking
        try {
            Map<String, Object> confirmPayload = new HashMap<>();
            confirmPayload.put("userId", currentUser.getId());
            confirmPayload.put("userName", currentUser.getName());
            confirmPayload.put("userEmail", currentUser.getEmail());
            confirmPayload.put("paymentId", newPayment.getId());
            confirmPayload.put("totalAmount", newPayment.getTotalAmount());
            confirmPayload.put("busId", newPayment.getBusId());

            ApiResponse<Map<String, Object>> response = restClient.post()
                    .uri("/api/booking/confirm")
                    .body(confirmPayload)
                    .retrieve()
                    .body(new ParameterizedTypeReference<ApiResponse<Map<String, Object>>>() {});

            if (response != null && response.getData() != null && Boolean.TRUE.equals(response.getData().get("success"))) {
                newPayment.setStatus(PaymentStatus.DONE);
                paymentRepository.save(newPayment);
                Number bookingIdNum = (Number) response.getData().get("bookingId");
                return bookingIdNum.longValue();
            } else {
                newPayment.setStatus(PaymentStatus.REFUNDED);
                paymentRepository.save(newPayment);
                throw new ConflictException("Seat lock expired. Your payment has been refunded.");
            }
        } catch (Exception e) {
            log.error("Failed to confirm booking for payment ID: {}", newPayment.getId(), e);
            newPayment.setStatus(PaymentStatus.REFUNDED);
            paymentRepository.save(newPayment);
            
            if (e instanceof ConflictException) {
                throw (ConflictException) e;
            }
            throw new ConflictException("Booking confirmation failed. Your payment has been refunded.");
        }
    }
}
