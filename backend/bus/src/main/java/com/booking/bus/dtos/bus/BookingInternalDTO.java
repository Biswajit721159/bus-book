package com.booking.bus.dtos.bus;

import com.booking.bus.enums.Booking.BookingStatus;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
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

    @JsonProperty("isActive")
    private boolean active;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
