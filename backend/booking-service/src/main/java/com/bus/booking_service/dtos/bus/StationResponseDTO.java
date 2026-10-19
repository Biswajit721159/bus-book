package com.bus.booking_service.dtos.bus;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StationResponseDTO {
    private Long id;
    private String stationName;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm[:ss]")
    private LocalTime arrivalTime;

    private int distanceFromLastStation;
    private int stationOrder;
}
