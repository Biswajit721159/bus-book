package com.booking.bus.internals;

import com.booking.bus.dtos.bus.BookingInternalDTO;
import com.booking.bus.dtos.common.ApiResponse;
import com.booking.bus.exceptions.ResourceNotFoundException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.client.RestClient;

@Slf4j
@Configuration
public class BookingApi {
    public final RestClient restClient;

    public BookingApi(@Value("${booking.service.url}") String bookingApi, ObjectMapper objectMapper) {
        this.restClient = RestClient.builder().baseUrl(bookingApi).messageConverters(converters -> {
            converters.removeIf(c -> c instanceof MappingJackson2HttpMessageConverter);
            converters.add(new MappingJackson2HttpMessageConverter(objectMapper));
        }).build();
    }

    public BookingInternalDTO getBookings(Long bookingId) {
        try {
            ApiResponse<BookingInternalDTO> response = restClient.get().uri("/api/booking/internal/{bookingId}", bookingId).retrieve().body(
                    new ParameterizedTypeReference<ApiResponse<BookingInternalDTO>>() {
                    });
            log.debug("Internal booking response for {}: {}", bookingId, response);
            if (response == null || response.getData() == null) {
                throw new ResourceNotFoundException("Booking not found with id: " + bookingId);
            }
            return response.getData();
        } catch (Exception e) {
            log.error("Failed to fetch internal booking with id: {}", bookingId, e);
            throw new ResourceNotFoundException("Booking not found with id: " + bookingId);
        }
    }
}
