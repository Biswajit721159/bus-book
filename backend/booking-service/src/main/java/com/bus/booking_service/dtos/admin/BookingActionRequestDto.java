package com.bus.booking_service.dtos.admin;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for admin actions such as approve or reject a booking.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingActionRequestDto {
    /**
     * Optional reason for rejection. Ignored for approve actions.
     */
    private String reason;
}
