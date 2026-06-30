package com.booking.bus.dtos.Booking.cancelTicket;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class cancelTicketDTO {
    List<Long> seatTicket=new ArrayList<>();
}
