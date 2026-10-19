package com.bus.booking_service.services;

import com.bus.booking_service.dtos.bookings.BookingTicketResponseDTo;
import com.bus.booking_service.entities.Bookings;
import com.bus.booking_service.entities.User;
import com.bus.booking_service.entities.Wishlist;
import com.bus.booking_service.exceptions.ResourceNotFoundException;
import com.bus.booking_service.repository.BookingRepository;
import com.bus.booking_service.repository.WishlistRepository;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final BookingRepository bookingRepository;
    private final BookingCacheService bookingCacheService;

    @Transactional
    public void create(Long bookingId, User user) {
        Bookings booking = bookingRepository.findByIdAndCreatedBy(bookingId, user.getId());
        if (booking == null) {
            throw new ResourceNotFoundException("Booking not found with id: " + bookingId);
        }
        Wishlist existing = wishlistRepository.findByBookingAndUser(booking, user.getId());
        if (existing == null) {
            Wishlist wishlist = new Wishlist();
            wishlist.setBooking(booking);
            wishlist.setUser(user.getId());
            wishlistRepository.save(wishlist);
        }

        // Evict cache only for this user
        bookingCacheService.evictUserBookings(user.getId());
    }

    @Transactional
    public void remove(Long bookingId, User user) {
        Bookings booking = bookingRepository.findByIdAndCreatedBy(bookingId, user.getId());
        if (booking == null) {
            throw new ResourceNotFoundException("Booking not found with id: " + bookingId);
        }
        Wishlist wishlist = wishlistRepository.findByBookingAndUser(booking, user.getId());
        if (wishlist != null) {
            wishlistRepository.delete(wishlist);
        }

        // Evict cache only for this user
        bookingCacheService.evictUserBookings(user.getId());
    }

    public void updateWishListForAll(List<Bookings> bookings, List<BookingTicketResponseDTo> finalBookings, User user, boolean wishList) {
        if (bookings == null || bookings.isEmpty() || finalBookings == null || finalBookings.isEmpty()) {
            return;
        }

        if (wishList) {
            for (BookingTicketResponseDTo finalBooking : finalBookings) {
                finalBooking.updateWishListedStatus(true);
            }
            return;
        }

        List<Wishlist> wishlists = wishlistRepository.findAllByBookingIdAndCreatedBy(bookings, user.getId());
        if (wishlists != null && !wishlists.isEmpty()) {
            Set<Long> wishlistIds = wishlists.stream().filter(w -> w != null && w.getBooking() != null).map(wishlist -> wishlist
                    .getBooking().getId()).collect(Collectors.toSet());
            for (BookingTicketResponseDTo finalBooking : finalBookings) {
                if (wishlistIds.contains(finalBooking.getId())) {
                    finalBooking.updateWishListedStatus(true);
                }
            }
        }
    }
}
