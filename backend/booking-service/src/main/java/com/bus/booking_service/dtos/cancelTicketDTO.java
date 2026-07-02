package com.bus.booking_service.dtos;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class cancelTicketDTO {
    List<Long> seatTicket=new ArrayList<>();
}
