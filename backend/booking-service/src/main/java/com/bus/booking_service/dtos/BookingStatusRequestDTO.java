package com.bus.booking_service.dtos;

import lombok.Data;

@Data
public class BookingStatusRequestDTO {
    private String date;
    private Long bus_id;
}
