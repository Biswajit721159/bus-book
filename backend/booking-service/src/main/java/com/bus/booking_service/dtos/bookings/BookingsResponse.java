package com.bus.booking_service.dtos.bookings;

import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingsResponse {
    private boolean hasNext = false;
    private boolean hasPrevious = false;
    private int totalPage = 1;
    private int totalPages = 1;
    private long totalElements = 0;
    private List<BookingTicketResponseDTo> bookingData = new ArrayList<>();
    private List<BookingTicketResponseDTo> bookingTicketResponseDTo = new ArrayList<>();

    public BookingsResponse(List<BookingTicketResponseDTo> bookings, boolean hasNext, boolean hasPrevious) {
        this.bookingTicketResponseDTo = bookings != null ? bookings : new ArrayList<>();
        this.bookingData = this.bookingTicketResponseDTo;
        this.hasNext = hasNext;
        this.hasPrevious = hasPrevious;
        this.totalPage = 0;
        this.totalPages = 0;
        this.totalElements = this.bookingTicketResponseDTo.size();
    }

    public BookingsResponse(List<BookingTicketResponseDTo> bookings, boolean hasNext, boolean hasPrevious, int totalPages,
            long totalElements) {
        this.bookingTicketResponseDTo = bookings != null ? bookings : new ArrayList<>();
        this.bookingData = this.bookingTicketResponseDTo;
        this.hasNext = hasNext;
        this.hasPrevious = hasPrevious;
        this.totalPage = totalPages;
        this.totalPages = totalPages;
        this.totalElements = totalElements;
    }
}
