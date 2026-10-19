package com.bus.booking_service.dtos.bus;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NormalUserBusResponseDto {
    private Long busId;
    private String busName;
    private int totalSeat;
    private Double averageRating;
    private Long totalReviewsCount;
    private Long totalRatingSum;
    private List<StationResponseDTO> stations;
}
