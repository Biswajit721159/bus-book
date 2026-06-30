package com.booking.bus.controllers.Booking;

import com.booking.bus.config.EntryGate;
import com.booking.bus.config.GatewayHeaderFilter;
import com.booking.bus.dtos.Booking.BookingTicketResponseDTo;
import com.booking.bus.dtos.Booking.cancelTicket.cancelTicketDTO;
import com.booking.bus.entities.User;
import com.booking.bus.enums.Role;
import com.booking.bus.exceptions.BadRequestException;
import com.booking.bus.exceptions.UnauthorizedException;
import com.booking.bus.services.BookingService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(BookingController.class)
@Import({EntryGate.class, GatewayHeaderFilter.class})
public class BookingControllerTest {

    @TestConfiguration
    static class TestConfig {
        @Bean
        public FilterRegistrationBean<GatewayHeaderFilter> gatewayHeaderFilterRegistration(GatewayHeaderFilter filter) {
            FilterRegistrationBean<GatewayHeaderFilter> registration = new FilterRegistrationBean<>(filter);
            registration.setEnabled(false);
            return registration;
        }
    }

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private BookingService bookingService;

    private User currentUser;

    @BeforeEach
    void setUp() {
        currentUser = User.builder()
                .id(1L)
                .name("Test User")
                .email("user@example.com")
                .role(Role.NORMAL_USER)
                .build();
    }

    private MockHttpServletRequestBuilder addGatewayHeaders(MockHttpServletRequestBuilder builder) {
        return builder
                .header("X-User-Id", "1")
                .header("X-User-Email", "user@example.com")
                .header("X-User-Name", "Test User")
                .header("X-User-Role", "NORMAL_USER");
    }

    @Test
    void fetchBookings_Success() throws Exception {
        BookingTicketResponseDTo mockBooking = Mockito.mock(BookingTicketResponseDTo.class);
        when(bookingService.fetchBookingData(currentUser)).thenReturn(List.of(mockBooking));

        mockMvc.perform(addGatewayHeaders(get("/api/booking")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Bookings successfully fetched"))
                .andExpect(jsonPath("$.data").isArray());
    }

    @Test
    void fetchBookings_Unauthorized() throws Exception {
        mockMvc.perform(get("/api/booking"))
                .andExpect(status().isForbidden());
    }

    @Test
    void fetchBookingById_Success() throws Exception {
        BookingTicketResponseDTo mockBooking = Mockito.mock(BookingTicketResponseDTo.class);
        when(bookingService.fetchSeatByBookingId(1L, currentUser)).thenReturn(mockBooking);

        mockMvc.perform(addGatewayHeaders(get("/api/booking/1")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Booking successfully fetched"));
    }

    @Test
    void fetchBookingById_Unauthorized() throws Exception {
        mockMvc.perform(get("/api/booking/1"))
                .andExpect(status().isForbidden());
    }

    @Test
    void cancelTicket_Success() throws Exception {
        BookingTicketResponseDTo mockBooking = Mockito.mock(BookingTicketResponseDTo.class);
        when(bookingService.updateCancelTicket(any(cancelTicketDTO.class), eq(currentUser))).thenReturn(mockBooking);

        String jsonRequest = "{\"seatTicket\":[1,2]}";

        mockMvc.perform(addGatewayHeaders(post("/api/booking/cancel"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonRequest))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Ticket cancelled successfully"));
    }

    @Test
    void cancelTicket_Unauthorized() throws Exception {
        String jsonRequest = "{\"seatTicket\":[1,2]}";

        mockMvc.perform(post("/api/booking/cancel")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonRequest))
                .andExpect(status().isForbidden());
    }

    @Test
    void cancelTicket_PastJourney_BadRequest() throws Exception {
        when(bookingService.updateCancelTicket(any(cancelTicketDTO.class), eq(currentUser)))
                .thenThrow(new BadRequestException("Cannot cancel a booking for a past journey"));

        String jsonRequest = "{\"seatTicket\":[1,2]}";

        mockMvc.perform(addGatewayHeaders(post("/api/booking/cancel"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonRequest))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Cannot cancel a booking for a past journey"));
    }

    @Test
    void cancelTicket_AlreadyCancelled_BadRequest() throws Exception {
        when(bookingService.updateCancelTicket(any(cancelTicketDTO.class), eq(currentUser)))
                .thenThrow(new BadRequestException("Booking is already cancelled"));

        String jsonRequest = "{\"seatTicket\":[1,2]}";

        mockMvc.perform(addGatewayHeaders(post("/api/booking/cancel"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonRequest))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Booking is already cancelled"));
    }

    @Test
    void cancelTicket_UnauthorizedService() throws Exception {
        when(bookingService.updateCancelTicket(any(cancelTicketDTO.class), eq(currentUser)))
                .thenThrow(new UnauthorizedException("Unauthorized"));

        String jsonRequest = "{\"seatTicket\":[1,2]}";

        mockMvc.perform(addGatewayHeaders(post("/api/booking/cancel"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonRequest))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Unauthorized"));
    }
}
