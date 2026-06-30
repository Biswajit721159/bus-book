package com.booking.bus.dtos.bus;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

@Data
public class BusRequestDTO {
    @NotBlank(message = "Bus Name is required")
    @Size(min = 3, max = 50, message = "Bus Name must be between 3 and 50 characters")
    private String busName;

    @Min(value = 1, message = "Total seat must be at least 1")
    @Max(value = 300, message = "Total seat cannot exceed 300")
    private int totalSeat;

    @NotEmpty(message = "At least one station is required")
    @Valid
    private List<StationRequestDTO> stations;
}
