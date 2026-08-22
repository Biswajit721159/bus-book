package com.bus.booking_service.dtos.bus;

import com.bus.booking_service.entities.Station;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;

@Data
@NoArgsConstructor
public class StationResponseDTO {
    private Long id;
    private String stationName;
    private LocalTime arrivalTime;
    private int distanceFromLastStation;
    private int stationOrder;

    public StationResponseDTO(Station station) {
        this.id = station.getId();
        this.stationName = station.getStationName();
        this.arrivalTime = station.getArrivalTime();
        this.distanceFromLastStation = station.getDistanceFromLastStation();
        this.stationOrder = station.getStationOrder();
    }
}
