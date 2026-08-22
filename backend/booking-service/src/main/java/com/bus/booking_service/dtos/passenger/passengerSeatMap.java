package com.bus.booking_service.dtos.passenger;

import com.bus.booking_service.entities.BookingSeats;
import lombok.Getter;

import java.util.ArrayList;
import java.util.List;

@Getter
public class passengerSeatMap {
    List<passengerMap> seatDetails = new ArrayList<>();
    public passengerSeatMap(List<BookingSeats> seats) {
        for (BookingSeats seat : seats) {
            seatDetails.add(new passengerMap(seat,null));
        }
    }
}
