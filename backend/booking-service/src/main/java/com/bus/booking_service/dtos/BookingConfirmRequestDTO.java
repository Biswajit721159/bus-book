package com.bus.booking_service.dtos;

import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

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
