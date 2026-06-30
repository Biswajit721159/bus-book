package com.booking.bus.repository.Booking;

import com.booking.bus.entities.Booking.Bookings;
import com.booking.bus.entities.Booking.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WishlistRepository extends JpaRepository<Wishlist, Long> {
    Wishlist findByBookingAndUser(Bookings bookings, Long user);

    @Query("SELECT wl from Wishlist wl where wl.booking IN :bookings and wl.user =:user")
    List<Wishlist> findAllByBookingIdAndCreatedBy(@Param("bookings") List<Bookings> bookings, @Param("user") Long user);
}
