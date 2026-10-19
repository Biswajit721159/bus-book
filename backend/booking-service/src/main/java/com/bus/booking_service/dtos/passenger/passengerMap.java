package com.bus.booking_service.dtos.passenger;

import com.bus.booking_service.dtos.masterList.masterListResponseDTO;
import com.bus.booking_service.entities.BookingSeats;
import com.bus.booking_service.enums.SeatStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class passengerMap {
    private Long id;
    private String name;
    private int seatNumber;
    private SeatStatus status;

    public passengerMap(BookingSeats seats, masterListResponseDTO masterList) {
        this.id = seats != null ? seats.getId() : null;
        this.seatNumber = seats != null ? seats.getSeatNumber() : 0;
        this.status = seats != null ? seats.getStatus() : null;
        this.name = masterList == null ? (seats != null ? "Passenger #" + seats.getPassengerId() : "Unknown") : masterList.getName();
    }
}
