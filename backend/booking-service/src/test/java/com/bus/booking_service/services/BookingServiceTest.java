package com.bus.booking_service.services;

import com.bus.booking_service.dtos.BookingQueryDTO;
import com.bus.booking_service.dtos.cancelTicketDTO;
import com.bus.booking_service.dtos.bookings.BookingTicketResponseDTo;
import com.bus.booking_service.dtos.bus.NormalUserBusResponseDto;
import com.bus.booking_service.dtos.bus.StationResponseDTO;
import com.bus.booking_service.dtos.internal.BusInternalDTO;
import com.bus.booking_service.dtos.internal.StationInternalDTO;
import com.bus.booking_service.entities.BookingSeats;
import com.bus.booking_service.entities.Bookings;
import com.bus.booking_service.entities.User;
import com.bus.booking_service.enums.BookingStatus;
import com.bus.booking_service.enums.Role;
import com.bus.booking_service.enums.SeatStatus;
import com.bus.booking_service.exceptions.BadRequestException;
import com.bus.booking_service.exceptions.ResourceNotFoundException;
import com.bus.booking_service.internals.busApi;
import com.bus.booking_service.internals.userApi;
import com.bus.booking_service.repository.BookingRepository;
import com.bus.booking_service.repository.BookingSeatRepository;
import com.bus.booking_service.repository.WishlistRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class BookingServiceTest {

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private BookingSeatRepository bookingSeatRepository;

    @Mock
    private WishlistRepository wishlistRepository;

    @Mock
    private busApi busApi;

    @Mock
    private userApi userApi;

    @Mock
    private WishlistService wishlistService;

    @InjectMocks
    private BookingService bookingService;

    @Test
    void findByIdReturnsBookingWhenItExists() {
        Bookings booking = booking(11L, 101L, 7L, BookingStatus.CONFIRMED, LocalDateTime.now().plusDays(1));
        when(bookingRepository.findById(11L)).thenReturn(Optional.of(booking));

        Bookings result = bookingService.findById(11L);

        assertThat(result).isSameAs(booking);
    }

    @Test
    void findByIdThrowsResourceNotFoundWhenMissing() {
        when(bookingRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> bookingService.findById(99L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Booking not found with id: 99");
    }

    @Test
    void fetchBookingsPaginationReturnsOnlyBookingsOwnedByBusOwner() {
        User owner = user(5L, Role.BUS_OWNER);
        Bookings booking = booking(21L, 5L, 101L, BookingStatus.CONFIRMED, LocalDateTime.of(2026, 8, 10, 9, 0));
        BookingSeats seat = seat(31L, booking, 501L, 12, SeatStatus.CONFIRMED, 5L);
        BookingQueryDTO query = new BookingQueryDTO();
        query.setCurrentPage(1);
        query.setBusName("express");
        query.setSrc("kol");
        query.setDist("del");

        when(busApi.getBusIdsByOwner(5L)).thenReturn(List.of(101L));
        when(bookingRepository.findByBusIdInOrderByCreatedAtDesc(List.of(101L))).thenReturn(List.of(booking));
        when(bookingSeatRepository.findSeatDetailsByBookingId(21L)).thenReturn(List.of(seat));
        when(busApi.fetchBusDetailsInternal(101L)).thenReturn(busDetails());

        Map<String, Object> result = bookingService.fetchBookingsPagination(query, owner);

        assertThat(result).containsEntry("totalPage", 1);
        assertThat((List<?>) result.get("bookingData")).hasSize(1);
    }

    @Test
    void fetchBookingsPaginationReturnsEmptyListWhenBusOwnerHasNoBuses() {
        User owner = user(5L, Role.BUS_OWNER);
        BookingQueryDTO query = new BookingQueryDTO();
        query.setCurrentPage(1);
        when(busApi.getBusIdsByOwner(5L)).thenReturn(List.of());

        Map<String, Object> result = bookingService.fetchBookingsPagination(query, owner);

        assertThat(result).containsEntry("totalPage", 1);
        assertThat((List<?>) result.get("bookingData")).isEmpty();
        verify(bookingRepository, never()).findByBusIdInOrderByCreatedAtDesc(anyList());
    }

    @Test
    void updateCancelTicketRejectsMissingSeats() {
        cancelTicketDTO request = new cancelTicketDTO();
        request.setSeatTicket(List.of(1L, 2L));
        when(bookingSeatRepository.findAllById(List.of(1L, 2L))).thenReturn(List.of());

        assertThatThrownBy(() -> bookingService.updateCancelTicket(request, user(9L, Role.NORMAL_USER)))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("Some seats were not found");
    }

    @Test
    void updateCancelTicketCancelsBookingWhenAllSeatsAreCancelled() {
        User user = user(9L, Role.NORMAL_USER);
        Bookings booking = booking(41L, 9L, 101L, BookingStatus.CONFIRMED, LocalDateTime.now().plusDays(2));
        BookingSeats seatOne = seat(1L, booking, 601L, 1, SeatStatus.CONFIRMED, 9L);
        BookingSeats seatTwo = seat(2L, booking, 602L, 2, SeatStatus.CONFIRMED, 9L);
        cancelTicketDTO request = new cancelTicketDTO();
        request.setSeatTicket(List.of(1L, 2L));

        when(bookingSeatRepository.findAllById(List.of(1L, 2L))).thenReturn(List.of(seatOne, seatTwo));
        when(bookingRepository.findById(41L)).thenReturn(Optional.of(booking));
        when(bookingSeatRepository.findSeatDetailsByBookingId(41L)).thenReturn(List.of(seatOne, seatTwo));
        when(busApi.getBusById(101L)).thenReturn(normalBus());
        when(userApi.fetchMasterListUsers(List.of(601L, 602L))).thenReturn(List.of());

        BookingTicketResponseDTo result = bookingService.updateCancelTicket(request, user);

        assertThat(result.getId()).isEqualTo(41L);
        assertThat(booking.getStatus()).isEqualTo(BookingStatus.CANCELLED);
        verify(bookingSeatRepository).updateSeatStatus(List.of(1L, 2L), SeatStatus.CANCELLED);
        verify(bookingRepository).save(booking);
    }

    private static User user(Long id, Role role) {
        return User.builder()
                .id(id)
                .name("Test User")
                .email("test@example.com")
                .role(role)
                .build();
    }

    private static Bookings booking(Long id, Long createdBy, Long busId, BookingStatus status, LocalDateTime bookingDate) {
        return Bookings.builder()
                .id(id)
                .createdBy(createdBy)
                .busId(busId)
                .sourceStationId(1L)
                .destinationStationId(2L)
                .bookingDate(bookingDate)
                .totalAmount(BigDecimal.valueOf(2500))
                .status(status)
                .createdAt(LocalDateTime.of(2026, 7, 1, 10, 30))
                .updatedAt(LocalDateTime.of(2026, 7, 1, 10, 45))
                .build();
    }

    private static BookingSeats seat(Long id, Bookings booking, Long passengerId, int seatNumber, SeatStatus status, Long createdBy) {
        return BookingSeats.builder()
                .id(id)
                .bookingId(booking)
                .passengerId(passengerId)
                .seatNumber(seatNumber)
                .status(status)
                .createdBy(createdBy)
                .build();
    }

    private static BusInternalDTO busDetails() {
        BusInternalDTO bus = new BusInternalDTO();
        bus.setBusId(101L);
        bus.setBusName("Night Express");
        StationInternalDTO source = new StationInternalDTO();
        source.setId(1L);
        source.setStationName("Kolkata");
        StationInternalDTO destination = new StationInternalDTO();
        destination.setId(2L);
        destination.setStationName("Delhi");
        bus.setStations(List.of(source, destination));
        return bus;
    }

    private static NormalUserBusResponseDto normalBus() {
        NormalUserBusResponseDto bus = new NormalUserBusResponseDto();
        bus.setBusId(101L);
        bus.setBusName("Night Express");
        StationResponseDTO source = new StationResponseDTO();
        source.setId(1L);
        source.setStationName("Kolkata");
        source.setStationOrder(1);
        source.setDistanceFromLastStation(0);
        StationResponseDTO destination = new StationResponseDTO();
        destination.setId(2L);
        destination.setStationName("Delhi");
        destination.setStationOrder(2);
        destination.setDistanceFromLastStation(1500);
        bus.setStations(List.of(source, destination));
        return bus;
    }
}
