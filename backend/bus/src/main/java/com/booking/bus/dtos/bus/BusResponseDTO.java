package com.booking.bus.dtos.bus;

import com.booking.bus.entities.Bus;
import com.booking.bus.enums.BusStatus;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class BusResponseDTO {
    private Long id;
    private String busName;
    private int totalSeat;
    private BusStatus status;
    private boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<StationResponseDTO> stations;

    public BusResponseDTO(Bus bus) {
        this.id = bus.getId();
        this.busName = bus.getBusName();
        this.totalSeat = bus.getTotalSeat();
        this.status = bus.getStatus();
        this.active = bus.isActive();
        this.createdAt = bus.getCreatedAt();
        this.updatedAt = bus.getUpdatedAt();
        this.stations = bus.getStations()
                .stream()
                .map(StationResponseDTO::new)
                .toList();
    }
}
