package com.bus.booking_service.dtos;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;

@Data
public class CheckSeatCountRequestBodyDTO {
    @NotBlank(message = "Source station is required")
    @Size(min = 3, max = 50, message = "Source station must be between 3 and 50 characters")
    private String source;

    @NotBlank(message = "Destination station is required")
    @Size(min = 3, max = 50, message = "Destination station must be between 3 and 50 characters")
    private String dist;

    @NotNull(message = "Bus id is required")
    private Long busId;

    @NotNull(message = "Booking date is required")
    @FutureOrPresent(message = "Booking date cannot be in the past")
    private LocalDate bookingDate;
}
