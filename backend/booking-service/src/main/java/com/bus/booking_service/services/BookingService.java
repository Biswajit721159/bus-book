package com.bus.booking_service.services;

import com.bus.booking_service.constant.AppConstant;
import com.bus.booking_service.dtos.BookingQueryDTO;
import com.bus.booking_service.dtos.FrontendBookingDTO;
import com.bus.booking_service.dtos.bookings.BookingTicketResponseDTo;
import com.bus.booking_service.dtos.bookings.BookingsResponse;
import com.bus.booking_service.dtos.bus.NormalUserBusResponseDto;
import com.bus.booking_service.dtos.cancelTicketDTO;
import com.bus.booking_service.dtos.guestTicketResponseDTO;
import com.bus.booking_service.dtos.internal.BusInternalDTO;
import com.bus.booking_service.dtos.internal.StationInternalDTO;
import com.bus.booking_service.dtos.masterList.masterListResponseDTO;
import com.bus.booking_service.entities.*;
import com.bus.booking_service.enums.BookingStatus;
import com.bus.booking_service.enums.Role;
import com.bus.booking_service.enums.SeatStatus;
import com.bus.booking_service.exceptions.BadRequestException;
import com.bus.booking_service.exceptions.ResourceNotFoundException;
import com.bus.booking_service.exceptions.UnauthorizedException;
import com.bus.booking_service.internals.busApi;
import com.bus.booking_service.internals.userApi;
import com.bus.booking_service.repository.BookingRepository;
import com.bus.booking_service.repository.BookingSeatRepository;
import com.bus.booking_service.repository.WishlistRepository;
import java.time.LocalDateTime;
import java.util.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class BookingService {
    private final BookingRepository bookingRepository;
    private final BookingSeatRepository bookingSeatRepository;
    private final WishlistRepository wishlistRepository;
    private final busApi busApi;
    private final userApi userApi;
    private final WishlistService wishlistService;
    private final BookingCacheService bookingCacheService;

    public Bookings findById(Long bookingId) {
        return bookingRepository.findById(bookingId).orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " +
                bookingId));
    }

    /**
     * Use: Fetches bookings created by the regular passenger (user account) with pagination. App: Passenger / User Bus Booking Web App (My
     * Bookings / Booking History).
     */
    @Cacheable(value = "userBookings", key = "#user.id + '-' + #pageNo + '-' + #wishList")
    public BookingsResponse fetchBookingData(User user, int pageNo, boolean wishList) {
        log.info("Fetching passenger booking data for user: {}, pageNo: {}", user.getEmail(), pageNo);

        int zeroBasedPage = Math.max(0, pageNo > 0 ? pageNo - 1 : 0);
        Pageable pageable = PageRequest.of(zeroBasedPage, AppConstant.GET_BOOKING_PAGE_SIZE, Sort.by(Sort.Direction.DESC, "createdAt"));

        Page<Bookings> bookingsPage = wishList ? bookingRepository.findWishlistedBookingsByUserId(user.getId(), pageable)
                : bookingRepository.findByCreatedByOrderByCreatedAtDesc(user.getId(), pageable);

        return buildBookingsResponse(bookingsPage, user, wishList);
    }

    /**
     * Use: Fetches bookings made on buses owned by the bus owner (or all bookings for super admin). App: Bus Owner Portal & Super Admin
     * Dashboard (Fleet Bookings).
     */
    public BookingsResponse fetchOwnerBookingData(User user, int pageNo) {
        log.info("Fetching fleet bookings for bus owner: {}, role: {}, pageNo: {}", user.getEmail(), user.getRole(), pageNo);

        int zeroBasedPage = Math.max(0, pageNo > 0 ? pageNo - 1 : 0);
        Pageable pageable = PageRequest.of(zeroBasedPage, AppConstant.GET_BOOKING_PAGE_SIZE, Sort.by(Sort.Direction.DESC, "createdAt"));

        Page<Bookings> bookingsPage;
        if (user.getRole() == Role.SUPER_ADMIN) {
            bookingsPage = bookingRepository.findAllByOrderByCreatedAtDesc(pageable);
        } else {
            List<Long> busIds = busApi.getBusIdsByOwner(user.getId());
            if (busIds.isEmpty()) {
                return new BookingsResponse(List.of(), false, false, 0, 0);
            }
            bookingsPage = bookingRepository.findByBusIdInOrderByCreatedAtDesc(busIds, pageable);
        }

        return buildBookingsResponse(bookingsPage, user, false);
    }

    private BookingsResponse buildBookingsResponse(Page<Bookings> bookingsPage, User user, boolean wishList) {
        List<Bookings> bookingsData = bookingsPage.getContent();

        boolean hasNext = bookingsPage.hasNext();
        boolean hasPrevious = bookingsPage.hasPrevious();
        int totalPages = bookingsPage.getTotalPages();
        long totalElements = bookingsPage.getTotalElements();

        List<BookingTicketResponseDTo> finalBookings = new ArrayList<>();
        for (Bookings booking : bookingsData) {
            NormalUserBusResponseDto bus = busApi.getBusById(booking.getBusId());

            BookingTicketResponseDTo bookingTicketResponse = new BookingTicketResponseDTo(booking, bus);
            List<BookingSeats> bookingSeats = bookingSeatRepository.findSeatDetailsByBookingId(booking.getId());

            List<Long> masterListUserIds = bookingSeats.stream().map(BookingSeats::getPassengerId).toList();
            List<masterListResponseDTO> masterList = userApi.fetchMasterListUsers(masterListUserIds);

            bookingTicketResponse.setPassengerSeatMap(bookingSeats, masterList);
            finalBookings.add(bookingTicketResponse);
        }

        wishlistService.updateWishListForAll(bookingsData, finalBookings, user, wishList);
        return new BookingsResponse(finalBookings, hasNext, hasPrevious, totalPages, totalElements);
    }

    public BookingTicketResponseDTo fetchSeatByBookingId(String identifier, User user) {
        // Try finding by PNR number first
        Optional<Bookings> data = bookingRepository.findBookingWithSeatsByPnrNumberAndCreatedBy(identifier, user.getId());

        // If not found by PNR, try finding by numeric ID
        if (data.isEmpty()) {
            try {
                Long id = Long.parseLong(identifier);
                data = bookingRepository.findBookingWithSeatsByIdAndCreatedBy(id, user.getId());
            } catch (NumberFormatException ignored) {
            }
        }

        if (data.isEmpty()) {
            throw new ResourceNotFoundException("Booking not found");
        }
        Bookings booking = data.get();

        List<BookingSeats> Seats = booking.getSeats();

        NormalUserBusResponseDto bus = busApi.getBusById(booking.getBusId());

        List<Long> masterListUserIds = Seats.stream().map(BookingSeats::getPassengerId).toList();
        List<masterListResponseDTO> masterList = userApi.fetchMasterListUsers(masterListUserIds);

        BookingTicketResponseDTo bookingTicketResponse = new BookingTicketResponseDTo(booking, bus);
        bookingTicketResponse.setPassengerSeatMap(Seats, masterList);

        Wishlist wishlist = wishlistRepository.findByBookingAndUser(booking, user.getId());

        if (wishlist != null) {
            bookingTicketResponse.updateWishListedStatus(true);
        }

        return bookingTicketResponse;
    }

    public BookingTicketResponseDTo fetchSeatByBookingId(Long id, User user) {
        return fetchSeatByBookingId(String.valueOf(id), user);
    }

    @Transactional
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
                List<Long> busIds = busApi.getBusIdsByOwner(user.getId());
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
        Bookings booking = bookingRepository.findById(bookingId).orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new BadRequestException("Booking is already cancelled");
        }
        if (booking.getBookingDate().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Cannot cancel a booking for a past journey");
        }

        bookingSeatRepository.updateSeatStatus(body.getSeatTicket(), SeatStatus.CANCELLED);

        List<BookingSeats> allSeats = bookingSeatRepository.findSeatDetailsByBookingId(bookingId);
        boolean allCancelled = allSeats.stream().allMatch(seat -> body.getSeatTicket().contains(seat.getId()) || seat
                .getStatus() == SeatStatus.CANCELLED);
        if (allCancelled) {
            booking.setStatus(BookingStatus.CANCELLED);
            bookingRepository.save(booking);
        }

        // Evict cache only for the affected user(s)
        bookingCacheService.evictUserBookings(user.getId());
        if (booking.getCreatedBy() != null && !booking.getCreatedBy().equals(user.getId())) {
            bookingCacheService.evictUserBookings(booking.getCreatedBy());
        }

        return fetchSeatByBookingId(bookingId, user);
    }

    public guestTicketResponseDTO fetchBookingDataForGuest(Long bookingId) {
        Bookings booking = bookingRepository.findById(bookingId).orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        List<BookingSeats> bookingSeats = bookingSeatRepository.findSeatDetailsByBookingId(bookingId);
        guestTicketResponseDTO guestTicketResponse = new guestTicketResponseDTO(booking);
        guestTicketResponse.updateBookingSeat(bookingSeats);
        return guestTicketResponse;
    }

    public guestTicketResponseDTO fetchBookingDataForGuestByPnr(String pnrNumber) {
        Bookings booking = bookingRepository.findByPnrNumber(pnrNumber).orElseThrow(() -> new ResourceNotFoundException(
                "Booking not found with PNR: " + pnrNumber));
        List<BookingSeats> bookingSeats = bookingSeatRepository.findSeatDetailsByBookingId(booking.getId());
        guestTicketResponseDTO guestTicketResponse = new guestTicketResponseDTO(booking);
        guestTicketResponse.updateBookingSeat(bookingSeats);
        return guestTicketResponse;
    }

    public Map<String, Object> fetchBookingsPagination(BookingQueryDTO query, User user) {
        log.info("Fetching paginated bookings for user: {}, role: {}, query: {}", user.getEmail(), user.getRole(), query);
        List<Bookings> bookingsData = new ArrayList<>();
        if (user.getRole() == Role.SUPER_ADMIN) {
            bookingsData = bookingRepository.findAllByOrderByCreatedAtDesc();
        } else if (user.getRole() == Role.BUS_OWNER) {
            List<Long> busIds = busApi.getBusIdsByOwner(user.getId());
            if (busIds.isEmpty()) {
                bookingsData = List.of();
            } else {
                bookingsData = bookingRepository.findByBusIdInOrderByCreatedAtDesc(busIds);
            }
        }

        List<FrontendBookingDTO> filteredBookings = new ArrayList<>();
        for (Bookings booking : bookingsData) {
            List<BookingSeats> seats = bookingSeatRepository.findSeatDetailsByBookingId(booking.getId());
            BusInternalDTO busDetails = busApi.fetchBusDetailsInternal(booking.getBusId());
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
            // Filter by PNR
            if (query.getPnr() != null && !query.getPnr().isBlank()) {
                String searchPnr = query.getPnr().trim().toLowerCase();
                if (dto.getPnr_number() == null || !dto.getPnr_number().toLowerCase().contains(searchPnr)) {
                    continue;
                }
            }
            // Filter by Booking ID
            if (query.getBookingId() != null && !query.getBookingId().isBlank()) {
                String searchId = query.getBookingId().trim();
                if (dto.get_id() == null || !dto.get_id().equalsIgnoreCase(searchId)) {
                    continue;
                }
            }
            // Filter by general search term (PNR, Booking ID, or User Email)
            if (query.getSearch() != null && !query.getSearch().isBlank()) {
                String term = query.getSearch().trim().toLowerCase();
                boolean matchPnr = dto.getPnr_number() != null && dto.getPnr_number().toLowerCase().contains(term);
                boolean matchId = dto.get_id() != null && dto.get_id().equalsIgnoreCase(term);
                boolean matchEmail = dto.getUseremail() != null && dto.getUseremail().toLowerCase().contains(term);
                if (!matchPnr && !matchId && !matchEmail) {
                    continue;
                }
            }

            filteredBookings.add(dto);
        }

        int itemsPerPage = 10;
        int totalItems = filteredBookings.size();
        int totalPages = (int) Math.ceil((double) totalItems / itemsPerPage);
        if (totalPages == 0)
            totalPages = 1;

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

        BusInternalDTO busDetails = busApi.fetchBusDetailsInternal(busId);
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
