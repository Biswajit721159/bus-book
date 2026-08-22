package com.bus.booking_service.dtos.internal;

import lombok.Data;

import java.util.List;

@Data
public class BusInternalDTO {
    private Long busId;
    private String busName;
    private List<StationInternalDTO> stations;

    @Override
    public String toString() {
        return "BusInternalDTO{" +
                "busName='" + busName + '\'' +
                ", busId='" + busId + '\'' +
                ", station data='" + stations.toString() + '\'' +
                '}';
    }
}