package com.bus.booking_service.services;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.bus.booking_service.dtos.bookings.BookingTicketResponseDTo;
import com.bus.booking_service.entities.Bookings;
import com.bus.booking_service.entities.User;
import com.bus.booking_service.entities.Wishlist;
import com.bus.booking_service.enums.Role;
import com.bus.booking_service.exceptions.ResourceNotFoundException;
import com.bus.booking_service.repository.BookingRepository;
import com.bus.booking_service.repository.WishlistRepository;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class WishlistServiceTest {

    @Mock
    private WishlistRepository wishlistRepository;
    @Mock
    private BookingRepository bookingRepository;
    @Mock
    private BookingCacheService bookingCacheService;

    @InjectMocks
    private WishlistService wishlistService;

    @Test
    void createAddsWishlistWhenNotExisting() {
        User user = User.builder().id(10L).name("Test User").role(Role.NORMAL_USER).build();
        Bookings booking = Bookings.builder().id(50L).createdBy(10L).build();

        when(bookingRepository.findByIdAndCreatedBy(50L, 10L)).thenReturn(booking);
        when(wishlistRepository.findByBookingAndUser(booking, 10L)).thenReturn(null);

        wishlistService.create(50L, user);

        verify(wishlistRepository).save(any(Wishlist.class));
        verify(bookingCacheService).evictUserBookings(10L);
    }

    @Test
    void createDoesNotDuplicateWhenAlreadyExisting() {
        User user = User.builder().id(10L).name("Test User").role(Role.NORMAL_USER).build();
        Bookings booking = Bookings.builder().id(50L).createdBy(10L).build();
        Wishlist existing = Wishlist.builder().id(1L).booking(booking).user(10L).build();

        when(bookingRepository.findByIdAndCreatedBy(50L, 10L)).thenReturn(booking);
        when(wishlistRepository.findByBookingAndUser(booking, 10L)).thenReturn(existing);

        wishlistService.create(50L, user);

        verify(wishlistRepository, never()).save(any(Wishlist.class));
        verify(bookingCacheService).evictUserBookings(10L);
    }

    @Test
    void createThrowsWhenBookingNotFound() {
        User user = User.builder().id(10L).name("Test User").role(Role.NORMAL_USER).build();
        when(bookingRepository.findByIdAndCreatedBy(999L, 10L)).thenReturn(null);

        assertThatThrownBy(() -> wishlistService.create(999L, user)).isInstanceOf(ResourceNotFoundException.class).hasMessageContaining(
                "Booking not found with id: 999");

        verify(wishlistRepository, never()).save(any(Wishlist.class));
    }

    @Test
    void removeDeletesWishlistWhenPresent() {
        User user = User.builder().id(10L).name("Test User").role(Role.NORMAL_USER).build();
        Bookings booking = Bookings.builder().id(50L).createdBy(10L).build();
        Wishlist existing = Wishlist.builder().id(1L).booking(booking).user(10L).build();

        when(bookingRepository.findByIdAndCreatedBy(50L, 10L)).thenReturn(booking);
        when(wishlistRepository.findByBookingAndUser(booking, 10L)).thenReturn(existing);

        wishlistService.remove(50L, user);

        verify(wishlistRepository).delete(existing);
        verify(bookingCacheService).evictUserBookings(10L);
    }

    @Test
    void removeDoesNotThrowWhenWishlistAlreadyAbsent() {
        User user = User.builder().id(10L).name("Test User").role(Role.NORMAL_USER).build();
        Bookings booking = Bookings.builder().id(50L).createdBy(10L).build();

        when(bookingRepository.findByIdAndCreatedBy(50L, 10L)).thenReturn(booking);
        when(wishlistRepository.findByBookingAndUser(booking, 10L)).thenReturn(null);

        wishlistService.remove(50L, user);

        verify(wishlistRepository, never()).delete(any(Wishlist.class));
        verify(bookingCacheService).evictUserBookings(10L);
    }

    @Test
    void updateWishListForAllHandlesEmptyListsWithoutQueryingRepository() {
        User user = User.builder().id(10L).name("Test User").role(Role.NORMAL_USER).build();

        wishlistService.updateWishListForAll(List.of(), List.of(), user, false);

        verify(wishlistRepository, never()).findAllByBookingIdAndCreatedBy(anyList(), anyLong());
    }

    @Test
    void updateWishListForAllMarksAllTrueWhenWishListModeIsTrue() {
        User user = User.builder().id(10L).name("Test User").role(Role.NORMAL_USER).build();
        Bookings booking = Bookings.builder().id(50L).createdBy(10L).build();
        BookingTicketResponseDTo dto = new BookingTicketResponseDTo();
        dto.setId(50L);
        dto.setIsWishlisted(false);

        wishlistService.updateWishListForAll(List.of(booking), List.of(dto), user, true);

        assertThat(dto.getIsWishlisted()).isTrue();
        verify(wishlistRepository, never()).findAllByBookingIdAndCreatedBy(anyList(), anyLong());
    }

    @Test
    void updateWishListForAllMatchesWishlistedIdsWhenWishListModeIsFalse() {
        User user = User.builder().id(10L).name("Test User").role(Role.NORMAL_USER).build();
        Bookings booking1 = Bookings.builder().id(50L).createdBy(10L).build();
        Bookings booking2 = Bookings.builder().id(51L).createdBy(10L).build();

        BookingTicketResponseDTo dto1 = new BookingTicketResponseDTo();
        dto1.setId(50L);
        dto1.setIsWishlisted(false);

        BookingTicketResponseDTo dto2 = new BookingTicketResponseDTo();
        dto2.setId(51L);
        dto2.setIsWishlisted(false);

        Wishlist w1 = Wishlist.builder().id(1L).booking(booking1).user(10L).build();

        when(wishlistRepository.findAllByBookingIdAndCreatedBy(List.of(booking1, booking2), 10L)).thenReturn(List.of(w1));

        wishlistService.updateWishListForAll(List.of(booking1, booking2), List.of(dto1, dto2), user, false);

        assertThat(dto1.getIsWishlisted()).isTrue();
        assertThat(dto2.getIsWishlisted()).isFalse();
    }
}
