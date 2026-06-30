package com.booking.bus.dtos.bus;
import com.booking.bus.entities.Bus;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
public class NormalUserBusResponseDto {
    private Long busId;
    private String busName;
    private int totalSeat;
    private List<StationResponseDTO> stations;

    public NormalUserBusResponseDto(Bus bus) {
        this.busId = bus.getId();
        this.busName = bus.getBusName();
        this.totalSeat = bus.getTotalSeat();
        this.stations = bus.getStations()
                .stream()
                .map(StationResponseDTO::new)
                .toList();
    }
}
