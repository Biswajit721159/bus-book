package com.bus.booking_service.dtos;

import com.bus.booking_service.entities.Bookings;
import com.bus.booking_service.entities.BookingSeats;
import com.bus.booking_service.enums.SeatStatus;
import lombok.Data;

import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Data
public class FrontendBookingDTO {
    private String _id;
    private String useremail;
    private String bus_id;
    private Map<String, String> bus;
    private String src;
    private String dist;
    private String date;
    private BigDecimal total_money;
    private int total_distance;
    private List<String> seat_record = new ArrayList<>();
    private List<String> person = new ArrayList<>();
    private List<Boolean> status = new ArrayList<>();
    private String createdAt;
    private String updatedAt;

    public FrontendBookingDTO(Bookings booking, List<BookingSeats> seats, String busName, String srcName, String distName) {
        this._id = String.valueOf(booking.getId());
        this.useremail = "user" + booking.getCreatedBy() + "@example.com";
        this.bus_id = String.valueOf(booking.getBusId());
        
        this.bus = new HashMap<>();
        this.bus.put("bus_name", busName != null ? busName : "Bus #" + booking.getBusId());
        
        this.src = srcName != null ? srcName : "Station #" + booking.getSourceStationId();
        this.dist = distName != null ? distName : "Station #" + booking.getDestinationStationId();
        
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");
        this.date = booking.getBookingDate().format(formatter);
        this.total_money = booking.getTotalAmount();
        this.total_distance = 0;
        this.createdAt = booking.getCreatedAt().format(formatter);
        this.updatedAt = booking.getUpdatedAt() != null ? booking.getUpdatedAt().format(formatter) : this.createdAt;

        for (BookingSeats seat : seats) {
            this.seat_record.add(String.valueOf(seat.getSeatNumber()));
            this.person.add("Passenger #" + seat.getPassengerId());
            this.status.add(seat.getStatus() == SeatStatus.CONFIRMED);
        }
    }
}
