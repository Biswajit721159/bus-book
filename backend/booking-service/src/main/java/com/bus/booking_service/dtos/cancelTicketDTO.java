package com.bus.booking_service.dtos;

import java.util.ArrayList;
import java.util.List;
import lombok.Data;

@Data
public class cancelTicketDTO {
    List<Long> seatTicket = new ArrayList<>();
}
