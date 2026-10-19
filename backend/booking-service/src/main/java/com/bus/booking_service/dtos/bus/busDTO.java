package com.bus.booking_service.dtos.bus;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class busDTO {
    private Long busId;
    private String busName;

    public busDTO(NormalUserBusResponseDto bus) {
        this.busId = bus != null ? bus.getBusId() : null;
        this.busName = bus != null ? bus.getBusName() : null; // Decoupled representation
    }

    public static StationResponseDTO getStationDTO(NormalUserBusResponseDto bus, Long stationId) {
        if (bus == null || bus.getStations() == null || stationId == null) {
            return null;
        }
        return bus.getStations().stream().filter((StationResponseDTO station) -> station.getId() != null && station.getId().equals(
                stationId)).findFirst().orElse(null);
    }
}
