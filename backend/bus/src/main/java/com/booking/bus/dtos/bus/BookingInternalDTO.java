package com.booking.bus.dtos.bus;

import com.booking.bus.enums.Booking.BookingStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingInternalDTO {

    private Long id;
    private Long createdBy;
    private Long busId;
    private Long sourceStationId;
    private Long destinationStationId;
    private Long paymentId;

    private LocalDateTime bookingDate;
    private BigDecimal totalAmount;
    private BookingStatus status;
    private boolean active;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}