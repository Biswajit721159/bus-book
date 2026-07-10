package com.bus.booking_service.dtos;

import lombok.Data;

@Data
public class BookingQueryDTO {
    private int currentPage = 1;
    private String Email;
    private String Src;
    private String Dist;
    private String BookingDate;
    private String BusName;
}
