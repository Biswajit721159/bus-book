package com.bus.booking_service.dtos.internal;

import lombok.Data;

@Data
public class StationInternalDTO {
    private Long id;
    private String stationName;

    @Override
    public String toString() {
        return "StationInternalDTO{" + "id=" + id + ", stationName='" + stationName + '\'' + '}';
    }
}
