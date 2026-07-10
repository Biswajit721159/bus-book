package com.bus.booking_service.dtos;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingConfirmRequestDTO {
    private Long userId;
    private String userName;
    private String userEmail;
    private Long paymentId;
    private BigDecimal totalAmount;
    private Long busId;
}
