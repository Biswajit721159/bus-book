package com.bus.booking_service.dtos;

import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class TicketLockRequestBodyDTO {
    private Long busId;
    private String source;
    private String dist;
    private LocalDate bookingDate;
    private List<Long> passengerIds;
    private List<Long> seatIds;
}
