package com.booking.bus.internals;

import com.booking.bus.dtos.bus.BookingInternalDTO;
import com.booking.bus.dtos.common.ApiResponse;
import com.booking.bus.entities.Bookings;
import com.booking.bus.exceptions.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.web.client.RestClient;

@Configuration
public class BookingApi {
    public final RestClient restClient;

    public BookingApi(@Value("${booking.service.url}") String bookingApi) {
        this.restClient = RestClient.builder().baseUrl(bookingApi).build();
    }

    public BookingInternalDTO getBookings(Long bookingId) {
        try {
            ApiResponse<BookingInternalDTO> response = restClient
                    .get()
                    .uri("/api/booking/internal/{bookingId}", bookingId)
                    .retrieve()
                    .body(new ParameterizedTypeReference<ApiResponse<BookingInternalDTO>>() {});
            System.out.println("booking" + response);
            if (response == null || response.getData() == null) {
                throw new ResourceNotFoundException("Booking not found with id: " + bookingId);
            }
            return response.getData();
        } catch (Exception e) {
            System.out.println(e);
            throw new ResourceNotFoundException("Booking not found with id: " + bookingId);
        }
    }
}
