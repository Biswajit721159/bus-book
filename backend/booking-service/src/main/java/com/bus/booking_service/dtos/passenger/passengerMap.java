package com.bus.booking_service.dtos.passenger;

import com.bus.booking_service.dtos.masterList.masterListResponseDTO;
import com.bus.booking_service.entities.BookingSeats;
import com.bus.booking_service.enums.SeatStatus;
import lombok.Getter;

@Getter
public class passengerMap {
    private final Long id;
    private final String name;
    private final int seatNumber;
    private final SeatStatus status;

    public passengerMap(BookingSeats seats, masterListResponseDTO masterList) {
        this.id = seats.getId();
        this.seatNumber = seats.getSeatNumber();
        this.status = seats.getStatus();
        this.name = masterList == null ?
                "Passenger #" + seats.getPassengerId()
                : masterList.getName();
    }
}