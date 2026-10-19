package com.booking.bus.dtos.bus;

import com.booking.bus.entities.Station;
import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalTime;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class StationResponseDTO {
    private Long id;
    private String stationName;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm:ss")
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
