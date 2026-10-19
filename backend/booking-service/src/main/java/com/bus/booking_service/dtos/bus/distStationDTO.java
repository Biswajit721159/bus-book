package com.bus.booking_service.dtos.bus;

import java.time.LocalTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class distStationDTO {
    private Long distStationId;
    private String stationName;
    private LocalTime arrivalTime;

    public distStationDTO(Long stationId, NormalUserBusResponseDto bus) {
        StationResponseDTO station = busDTO.getStationDTO(bus, stationId);
        this.distStationId = stationId;
        this.stationName = station != null ? station.getStationName() : null;
        this.arrivalTime = station != null ? station.getArrivalTime() : null;
    }
}
