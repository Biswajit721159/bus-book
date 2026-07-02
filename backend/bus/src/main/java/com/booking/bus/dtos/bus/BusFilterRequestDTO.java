package com.booking.bus.dtos.bus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BusFilterRequestDTO {
    private int page = 1;
    private boolean approved;
    private boolean pending;
    private boolean rejected;
}
