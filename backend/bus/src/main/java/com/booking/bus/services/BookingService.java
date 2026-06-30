package com.booking.bus.services;

import com.booking.bus.dtos.Booking.BookingTicketResponseDTo;
import com.booking.bus.dtos.Booking.GuestTicketResponse.guestTicketResponseDTO;
import com.booking.bus.dtos.Booking.cancelTicket.cancelTicketDTO;
import com.booking.bus.entities.Booking.BookingSeats;
import com.booking.bus.entities.Booking.Bookings;
import com.booking.bus.entities.Booking.Wishlist;
import com.booking.bus.entities.User;
import com.booking.bus.enums.Booking.BookingStatus;
import com.booking.bus.enums.Booking.SeatStatus;
import com.booking.bus.exceptions.BadRequestException;
import com.booking.bus.exceptions.UnauthorizedException;
import com.booking.bus.repository.Booking.BookingRepository;
import com.booking.bus.repository.Booking.BookingSeatRepository;
import com.booking.bus.repository.Booking.WishlistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

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

    public List<BookingTicketResponseDTo> fetchBookingData(User user) {
        List<Bookings> bookingsData = bookingRepository.findByCreatedByOrderByCreatedAtDesc(user.getId());
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

    public List<BookingSeats> fetchSeatByBookingId(BookingTicketResponseDTo booking){
        return bookingSeatRepository.findSeatDetailsByBookingId(booking.getId());
    }

    public BookingTicketResponseDTo fetchSeatByBookingId(Long id, User user) {
        Bookings booking = bookingRepository.findByIdAndCreatedBy(id, user.getId());
        if (booking == null) {
            throw new RuntimeException("Booking not found");
        }
        List<BookingSeats> bookingSeats = bookingSeatRepository.getByBookingIdAndCreatedBy(booking, user.getId());
        BookingTicketResponseDTo bookingTicketResponse = new BookingTicketResponseDTo(booking);
        bookingTicketResponse.setPassengerSeatMap(bookingSeats);
        Wishlist wishlist = wishlistRepository.findByBookingAndUser(booking, user.getId());
        if (wishlist != null) {
            bookingTicketResponse.updateWishListedStatus(true);
        }
        return bookingTicketResponse;
    }

    public BookingTicketResponseDTo updateCancelTicket(cancelTicketDTO body, User user) {
        List<BookingSeats> bookingSeats = bookingSeatRepository.findAllByIdInAndCreatedBy(body.getSeatTicket(), user.getId());
        if (bookingSeats.isEmpty() || body.getSeatTicket().size() != bookingSeats.size()) {
            throw new UnauthorizedException("Unauthorized");
        }
        long bookingId = bookingSeats.getFirst().getBookingId().getId();
        Bookings booking = bookingRepository.findByIdAndCreatedBy(bookingId, user.getId());
        if (booking == null) {
            throw new RuntimeException("Booking not found");
        }

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new BadRequestException("Booking is already cancelled");
        }
        if (booking.getBookingDate().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Cannot cancel a booking for a past journey");
        }

        bookingSeatRepository.updateSeatStatus(body.getSeatTicket(), SeatStatus.CANCELLED);

        List<BookingSeats> allSeats = bookingSeatRepository.getByBookingIdAndCreatedBy(booking, user.getId());
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
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        List<BookingSeats> bookingSeats = bookingSeatRepository.findSeatDetailsByBookingId(bookingId);
        guestTicketResponseDTO guestTicketResponse = new guestTicketResponseDTO(booking);
        guestTicketResponse.updateBookingSeat(bookingSeats);
        return guestTicketResponse;
    }
}
