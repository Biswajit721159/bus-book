package com.booking.bus.dtos.bus;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BusRequestDTO {
    @NotBlank(message = "Bus Name is required")
    @Size(min = 3, max = 50, message = "Bus Name must be between 3 and 50 characters")
    private String busName;

    @Min(value = 1, message = "Total seat must be at least 1")
    @Max(value = 300, message = "Total seat cannot exceed 300")
    private int totalSeat;

    @NotNull(message = "Stations list is required")
    @Size(min = 2, max = 30, message = "A bus route must have at least 2 stations (source and destination)")
    @Valid
    private List<StationRequestDTO> stations;

    private String status;
}
