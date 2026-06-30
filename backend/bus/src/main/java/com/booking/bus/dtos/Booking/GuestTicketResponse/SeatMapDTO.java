package com.booking.bus.dtos.Booking.GuestTicketResponse;

import com.booking.bus.entities.Booking.BookingSeats;
import com.booking.bus.enums.Booking.SeatStatus;
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
