package com.bus.booking_service.dtos.bus;

import lombok.Getter;

import java.time.LocalTime;

@Getter
public class sourceStationDTO {
    private final Long sourceStationId;
    private final String stationName;
    private final LocalTime arrivalTime;

    public sourceStationDTO(Long stationId, NormalUserBusResponseDto bus) {
        StationResponseDTO station = busDTO.getStationDTO(bus, stationId);
        this.sourceStationId = stationId;
        this.stationName = station.getStationName();
        this.arrivalTime = station.getArrivalTime();
    }
}
