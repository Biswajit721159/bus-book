package com.booking.bus.dtos.bus;

import com.booking.bus.entities.Bus;
import com.booking.bus.enums.BusStatus;
import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDateTime;
import java.util.List;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class NormalUserBusResponseDto {
    private Long id;
    private Long busId;
    private String busName;
    private int totalSeat;
    private BusStatus status;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime createdAt;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime updatedAt;

    private Double averageRating;
    private Long totalReviewsCount;
    private Long totalRatingSum;
    private List<StationResponseDTO> stations;

    public NormalUserBusResponseDto(Bus bus) {
        this.id = bus.getId();
        this.busId = bus.getId();
        this.busName = bus.getBusName();
        this.totalSeat = bus.getTotalSeat();
        this.status = bus.getStatus();
        this.createdAt = bus.getCreatedAt();
        this.updatedAt = bus.getUpdatedAt();
        this.averageRating = bus.getAverageRating();
        this.totalReviewsCount = bus.getTotalReviewsCount();
        this.totalRatingSum = bus.getTotalRatingSum();
        this.stations = bus.getStations().stream().map(StationResponseDTO::new).toList();
    }
}
