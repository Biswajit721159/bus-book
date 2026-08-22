package com.bus.booking_service.dtos.bus;

import lombok.Getter;

import java.time.LocalTime;

@Getter
public class distStationDTO {
    private final Long distStationId;
    private final String stationName;
    private final LocalTime arrivalTime;

    public distStationDTO(Long stationId, NormalUserBusResponseDto bus) {
        StationResponseDTO station = busDTO.getStationDTO(bus, stationId);
        this.distStationId = stationId;
        this.stationName = station.getStationName();
        this.arrivalTime = station.getArrivalTime();
    }
}
