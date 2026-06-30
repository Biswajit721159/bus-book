package com.booking.bus.services;

import com.booking.bus.dtos.Booking.BookingTicketResponseDTo;
import com.booking.bus.entities.Booking.Bookings;
import com.booking.bus.entities.Booking.Wishlist;
import com.booking.bus.entities.User;
import com.booking.bus.repository.Booking.BookingRepository;
import com.booking.bus.repository.Booking.WishlistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class WishlistService {

    @Autowired
    WishlistRepository wishlistRepository;
    @Autowired
    BookingRepository bookingRepository;

    public void create(Long bookingId, User user) {
        Bookings booking = bookingRepository.findByIdAndCreatedBy(bookingId, user.getId());
        if (booking == null) {
            throw new RuntimeException("Booking not found");
        }
        Wishlist wishlist = new Wishlist();
        wishlist.setBooking(booking);
        wishlist.setUser(user.getId());
        wishlistRepository.save(wishlist);
    }

    public void remove(Long bookingId, User user) {
        Bookings booking = bookingRepository.findByIdAndCreatedBy(bookingId, user.getId());
        if (booking == null) {
            throw new RuntimeException("Booking not found");
        }
        Wishlist wishlist = wishlistRepository.findByBookingAndUser(booking, user.getId());
        if (wishlist == null) {
            throw new RuntimeException("Wishlist not found");
        }
        wishlistRepository.delete(wishlist);
    }

    public void updateWishListForAll(List<Bookings> bookings, List<BookingTicketResponseDTo> finalBookings, User user) {
        List<Wishlist> wishlists = wishlistRepository.findAllByBookingIdAndCreatedBy(bookings, user.getId());
        Set<Long> wishlistIds = wishlists.stream()
                .map(wishlist -> wishlist.getBooking().getId())
                .collect(Collectors.toSet());
        for (BookingTicketResponseDTo finalBooking : finalBookings) {
            if (wishlistIds.contains(finalBooking.getId())) {
                finalBooking.updateWishListedStatus(true);
            }
        }
    }
}
