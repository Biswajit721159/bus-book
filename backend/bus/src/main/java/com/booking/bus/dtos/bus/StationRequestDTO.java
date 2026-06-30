package com.booking.bus.dtos.bus;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalTime;

@Data
public class StationRequestDTO {
    @NotBlank(message = "Station Name is required")
    @Size(min = 3, max = 50, message = "Station Name must be between 3 and 50 characters")
    private String stationName;

    @NotNull(message = "Arrival time is required")
    private LocalTime arrivalTime;

    @PositiveOrZero(message = "Distance from last station cannot be negative")
    private int distanceFromLastStation;
}
