package com.booking.bus.dtos.Booking;
import com.booking.bus.entities.Booking.BookingSeats;
import com.booking.bus.enums.Booking.SeatStatus;
import lombok.Getter;

import java.util.ArrayList;
import java.util.List;

@Getter
class passengerMap {
    private final Long id;
    private final String name;
    private final int seatNumber;
    private final SeatStatus status;

    passengerMap(BookingSeats seats) {
        this.id = seats.getId();
        this.seatNumber = seats.getSeatNumber();
        this.status = seats.getStatus();
        this.name = "Passenger #" + seats.getPassengerId();
    }
}

@Getter
public class passengerSeatMap {
    List<passengerMap> seatDetails = new ArrayList<>();
    public passengerSeatMap(List<BookingSeats> seats) {
        for (BookingSeats seat : seats) {
            seatDetails.add(new passengerMap(seat));
        }
    }
}
