package com.bus.booking_service.dtos;

import java.time.LocalDate;
import java.util.List;
import lombok.Data;

@Data
public class TicketLockRequestBodyDTO {
    private Long busId;
    private String source;
    private String dist;
    private LocalDate bookingDate;
    private List<Long> passengerIds;
    private List<Long> seatIds;
}
