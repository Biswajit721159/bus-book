package com.bus.booking_service.dtos;

import com.bus.booking_service.entities.BookingSeats;
import com.bus.booking_service.enums.SeatStatus;
import lombok.Data;

@Data
public class SeatMapDTO {
    private int seatNumber;
    private SeatStatus status;

    SeatMapDTO(BookingSeats seat) {
        this.seatNumber = seat.getSeatNumber();
        this.status = seat.getStatus();
    }
}
