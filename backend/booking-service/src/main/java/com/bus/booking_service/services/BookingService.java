package com.bus.booking_service.services;

import com.bus.booking_service.dtos.BookingTicketResponseDTo;
import com.bus.booking_service.dtos.guestTicketResponseDTO;
import com.bus.booking_service.dtos.cancelTicketDTO;
import com.bus.booking_service.entities.BookingSeats;
import com.bus.booking_service.entities.Bookings;
import com.bus.booking_service.entities.Wishlist;
import com.bus.booking_service.entities.User;
import com.bus.booking_service.enums.BookingStatus;
import com.bus.booking_service.enums.SeatStatus;
import com.bus.booking_service.exceptions.BadRequestException;
import com.bus.booking_service.exceptions.UnauthorizedException;
import com.bus.booking_service.repository.BookingRepository;
import com.bus.booking_service.repository.BookingSeatRepository;
import com.bus.booking_service.repository.WishlistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bus.booking_service.enums.Role;
import com.bus.booking_service.exceptions.ResourceNotFoundException;
import org.springframework.web.client.RestClient;
import org.springframework.core.ParameterizedTypeReference;
import lombok.extern.slf4j.Slf4j;

import com.bus.booking_service.dtos.BookingQueryDTO;
import com.bus.booking_service.dtos.FrontendBookingDTO;
import com.bus.booking_service.dtos.common.ApiResponse;

import java.util.Map;
import java.util.HashMap;
import java.util.ArrayList;
import java.util.Arrays;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
public class BookingService {
    @Autowired
    BookingRepository bookingRepository;
    @Autowired
    BookingSeatRepository bookingSeatRepository;
    @Autowired
    WishlistService wishlistService;
    @Autowired
    WishlistRepository wishlistRepository;

    private final RestClient restClient = RestClient.builder().baseUrl("http://localhost:8005").build();

    private List<Long> getBusIdsByOwner(Long ownerId) {
        try {
            return restClient.get()
                    .uri("/api/buses/internal/owner/" + ownerId)
                    .retrieve()
                    .body(new ParameterizedTypeReference<List<Long>>() {
                    });
        } catch (Exception e) {
            log.error("Failed to fetch bus IDs for owner: {}", ownerId, e);
            return List.of();
        }
    }

    public List<BookingTicketResponseDTo> fetchBookingData(User user) {
        log.info("Fetching booking data for user: {}, role: {}", user.getEmail(), user.getRole());
        List<Bookings> bookingsData;
        if (user.getRole() == Role.SUPER_ADMIN) {
            bookingsData = bookingRepository.findAllByOrderByCreatedAtDesc();
        } else if (user.getRole() == Role.BUS_OWNER) {
            List<Long> busIds = getBusIdsByOwner(user.getId());
            if (busIds.isEmpty()) {
                bookingsData = List.of();
            } else {
                bookingsData = bookingRepository.findByBusIdInOrderByCreatedAtDesc(busIds);
            }
        } else {
            bookingsData = bookingRepository.findByCreatedByOrderByCreatedAtDesc(user.getId());
        }

        List<BookingTicketResponseDTo> finalBookings = bookingsData.stream()
                .map(BookingTicketResponseDTo::new)
                .toList();
        for (BookingTicketResponseDTo booking : finalBookings) {
            List<BookingSeats> seats = fetchSeatByBookingId(booking);
            booking.setPassengerSeatMap(seats);
        }
        wishlistService.updateWishListForAll(bookingsData, finalBookings, user);
        return finalBookings;
    }

    public List<BookingSeats> fetchSeatByBookingId(BookingTicketResponseDTo booking) {
        return bookingSeatRepository.findSeatDetailsByBookingId(booking.getId());
    }

    public BookingTicketResponseDTo fetchSeatByBookingId(Long id, User user) {
        Bookings booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        // Authorization check
        if (user.getRole() == Role.SUPER_ADMIN) {
            // Allowed
        } else if (user.getRole() == Role.BUS_OWNER) {
            List<Long> busIds = getBusIdsByOwner(user.getId());
            if (!busIds.contains(booking.getBusId())) {
                throw new UnauthorizedException("Unauthorized: You do not own this bus");
            }
        } else {
            if (!booking.getCreatedBy().equals(user.getId())) {
                throw new UnauthorizedException("Unauthorized: You did not create this booking");
            }
        }

        List<BookingSeats> bookingSeats = bookingSeatRepository.findSeatDetailsByBookingId(booking.getId());
        BookingTicketResponseDTo bookingTicketResponse = new BookingTicketResponseDTo(booking);
        bookingTicketResponse.setPassengerSeatMap(bookingSeats);
        Wishlist wishlist = wishlistRepository.findByBookingAndUser(booking, user.getId());
        if (wishlist != null) {
            bookingTicketResponse.updateWishListedStatus(true);
        }
        return bookingTicketResponse;
    }

    public BookingTicketResponseDTo updateCancelTicket(cancelTicketDTO body, User user) {
        List<BookingSeats> bookingSeats = bookingSeatRepository.findAllById(body.getSeatTicket());
        if (bookingSeats.isEmpty() || body.getSeatTicket().size() != bookingSeats.size()) {
            throw new BadRequestException("Some seats were not found");
        }

        // Authorization check for each seat
        for (BookingSeats seat : bookingSeats) {
            if (user.getRole() == Role.SUPER_ADMIN) {
                // Allowed
            } else if (user.getRole() == Role.BUS_OWNER) {
                List<Long> busIds = getBusIdsByOwner(user.getId());
                if (!busIds.contains(seat.getBookingId().getBusId())) {
                    throw new UnauthorizedException("Unauthorized: You do not own the bus for one of these seats");
                }
            } else {
                if (!seat.getCreatedBy().equals(user.getId())) {
                    throw new UnauthorizedException("Unauthorized: You did not book one of these seats");
                }
            }
        }

        long bookingId = bookingSeats.getFirst().getBookingId().getId();
        Bookings booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new BadRequestException("Booking is already cancelled");
        }
        if (booking.getBookingDate().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Cannot cancel a booking for a past journey");
        }

        bookingSeatRepository.updateSeatStatus(body.getSeatTicket(), SeatStatus.CANCELLED);

        List<BookingSeats> allSeats = bookingSeatRepository.findSeatDetailsByBookingId(bookingId);
        boolean allCancelled = allSeats.stream().allMatch(seat ->
                body.getSeatTicket().contains(seat.getId()) || seat.getStatus() == SeatStatus.CANCELLED
        );
        if (allCancelled) {
            booking.setStatus(BookingStatus.CANCELLED);
            bookingRepository.save(booking);
        }

        return fetchSeatByBookingId(bookingId, user);
    }

    public guestTicketResponseDTO fetchBookingDataForGuest(Long bookingId) {
        Bookings booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        List<BookingSeats> bookingSeats = bookingSeatRepository.findSeatDetailsByBookingId(bookingId);
        guestTicketResponseDTO guestTicketResponse = new guestTicketResponseDTO(booking);
        guestTicketResponse.updateBookingSeat(bookingSeats);
        return guestTicketResponse;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    private static class StationInternalDTO {
        private Long id;
        private String stationName;

        @Override
        public String toString() {
            return "StationInternalDTO{" +
                    "id=" + id +
                    ", stationName='" + stationName + '\'' +
                    '}';
        }
    }

    @Getter
    @Setter
    @NoArgsConstructor
    private static class BusInternalDTO {
        private Long busId;
        private String busName;
        private List<StationInternalDTO> stations;

        @Override
        public String toString() {
            return "BusInternalDTO{" +
                    "busName='" + busName + '\'' +
                    ", busId='" + busId + '\'' +
                    ", station data='" + stations.toString() + '\'' +
                    '}';
        }
    }

    private BusInternalDTO fetchBusDetailsInternal(Long busId) {
        try {
            ApiResponse<BusInternalDTO> response = restClient.get()
                    .uri("/api/buses/" + busId)
                    .retrieve()
                    .body(new ParameterizedTypeReference<ApiResponse<BusInternalDTO>>() {
                    });
            return response != null ? response.getData() : null;
        } catch (Exception e) {
            log.error("Failed to fetch details for bus ID: {}", busId, e);
            return null;
        }
    }

    public Map<String, Object> fetchBookingsPagination(BookingQueryDTO query, User user) {
        log.info("Fetching paginated bookings for user: {}, role: {}, query: {}", user.getEmail(), user.getRole(), query);
        List<Bookings> bookingsData;
        if (user.getRole() == Role.SUPER_ADMIN) {
            bookingsData = bookingRepository.findAllByOrderByCreatedAtDesc();
        } else if (user.getRole() == Role.BUS_OWNER) {
            List<Long> busIds = getBusIdsByOwner(user.getId());
            if (busIds.isEmpty()) {
                bookingsData = List.of();
            } else {
                bookingsData = bookingRepository.findByBusIdInOrderByCreatedAtDesc(busIds);
            }
        } else {
            bookingsData = bookingRepository.findByCreatedByOrderByCreatedAtDesc(user.getId());
        }

        List<FrontendBookingDTO> filteredBookings = new ArrayList<>();
        for (Bookings booking : bookingsData) {
            List<BookingSeats> seats = bookingSeatRepository.findSeatDetailsByBookingId(booking.getId());
            BusInternalDTO busDetails = fetchBusDetailsInternal(booking.getBusId());
            String busName = busDetails != null ? busDetails.getBusName() : "Bus #" + booking.getBusId();

            String srcName = null;
            String distName = null;
            if (busDetails != null && busDetails.getStations() != null) {
                for (StationInternalDTO st : busDetails.getStations()) {
                    if (st.getId().equals(booking.getSourceStationId())) {
                        srcName = st.getStationName();
                    }
                    if (st.getId().equals(booking.getDestinationStationId())) {
                        distName = st.getStationName();
                    }
                }
            }

            FrontendBookingDTO dto = new FrontendBookingDTO(booking, seats, busName, srcName, distName);

            // Filter by Email
            if (query.getEmail() != null && !query.getEmail().isBlank()) {
                if (!dto.getUseremail().toLowerCase().contains(query.getEmail().toLowerCase())) {
                    continue;
                }
            }
            // Filter by Src
            if (query.getSrc() != null && !query.getSrc().isBlank()) {
                if (!dto.getSrc().toLowerCase().contains(query.getSrc().toLowerCase())) {
                    continue;
                }
            }
            // Filter by Dist
            if (query.getDist() != null && !query.getDist().isBlank()) {
                if (!dto.getDist().toLowerCase().contains(query.getDist().toLowerCase())) {
                    continue;
                }
            }
            // Filter by BusName
            if (query.getBusName() != null && !query.getBusName().isBlank()) {
                if (!dto.getBus().get("bus_name").toLowerCase().contains(query.getBusName().toLowerCase())) {
                    continue;
                }
            }
            // Filter by BookingDate
            if (query.getBookingDate() != null && !query.getBookingDate().isBlank()) {
                String journeyDateStr = dto.getDate().substring(0, 10);
                if (!journeyDateStr.equals(query.getBookingDate())) {
                    continue;
                }
            }

            filteredBookings.add(dto);
        }

        int itemsPerPage = 10;
        int totalItems = filteredBookings.size();
        int totalPages = (int) Math.ceil((double) totalItems / itemsPerPage);
        if (totalPages == 0) totalPages = 1;

        int fromIndex = (query.getCurrentPage() - 1) * itemsPerPage;
        int toIndex = Math.min(fromIndex + itemsPerPage, totalItems);

        List<FrontendBookingDTO> paginatedList;
        if (fromIndex >= totalItems || fromIndex < 0) {
            paginatedList = List.of();
        } else {
            paginatedList = filteredBookings.subList(fromIndex, toIndex);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("totalPage", totalPages);
        result.put("bookingData", paginatedList);
        return result;
    }

    public List<FrontendBookingDTO> getBookingStatus(Long busId, LocalDateTime date, Integer pageNo) {
        log.info("Fetching booking status for bus ID: {}, date: {}, page: {}", busId, date, pageNo);
        org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(pageNo - 1, 10);
        org.springframework.data.domain.Page<Bookings> bookingsPage = bookingRepository.findByBusIdAndDate(busId, date, pageable);
        List<Bookings> bookings = bookingsPage.getContent();
        List<FrontendBookingDTO> result = new ArrayList<>();

        BusInternalDTO busDetails = fetchBusDetailsInternal(busId);
        String busName = busDetails != null ? busDetails.getBusName() : "Bus #" + busId;

        for (Bookings booking : bookings) {
            List<BookingSeats> seats = bookingSeatRepository.findSeatDetailsByBookingId(booking.getId());

            String srcName = null;
            String distName = null;
            if (busDetails != null && busDetails.getStations() != null) {
                for (StationInternalDTO st : busDetails.getStations()) {
                    if (st.getId().equals(booking.getSourceStationId())) {
                        srcName = st.getStationName();
                    }
                    if (st.getId().equals(booking.getDestinationStationId())) {
                        distName = st.getStationName();
                    }
                }
            }

            result.add(new FrontendBookingDTO(booking, seats, busName, srcName, distName));
        }

        return result;
    }
}
