package com.bus.booking_service.dtos.bus;

import lombok.Getter;

@Getter
public class busDTO {
    private final Long busId;
    private final String busName;

    public busDTO(NormalUserBusResponseDto bus) {
        this.busId = bus.getBusId();
        this.busName = bus.getBusName(); // Decoupled representation
    }

    public static StationResponseDTO getStationDTO(NormalUserBusResponseDto bus, Long stationId) {
        return bus.getStations()
                .stream()
                .filter((StationResponseDTO station) -> station.getId().equals(stationId))
                .findFirst()
                .orElse(null);
    }
}