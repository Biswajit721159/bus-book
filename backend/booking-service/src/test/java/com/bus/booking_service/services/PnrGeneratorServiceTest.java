package com.bus.booking_service.services;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

import com.bus.booking_service.exceptions.ConflictException;
import com.bus.booking_service.repository.BookingRepository;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class PnrGeneratorServiceTest {

    @Mock
    private BookingRepository bookingRepository;

    @InjectMocks
    private PnrGeneratorService pnrGeneratorService;

    @Test
    void generatesValid9DigitNumericPnr() {
        when(bookingRepository.existsByPnrNumber(anyString())).thenReturn(false);

        String pnr = pnrGeneratorService.generateUniqueRandomPnr();

        assertThat(pnr).isNotNull();
        assertThat(pnr).hasSize(9);
        assertThat(pnr).matches("\\d{9}");
        long pnrNum = Long.parseLong(pnr);
        assertThat(pnrNum).isBetween(100_000_000L, 999_999_999L);
    }

    @Test
    void generatesDistinctRandomPnrs() {
        when(bookingRepository.existsByPnrNumber(anyString())).thenReturn(false);

        Set<String> generated = new HashSet<>();
        for (int i = 0; i < 100; i++) {
            String pnr = pnrGeneratorService.generateUniqueRandomPnr();
            assertThat(pnr).hasSize(9);
            assertThat(generated.add(pnr)).as("PNR %s should be unique", pnr).isTrue();
        }
    }

    @Test
    void retriesOnCollisionAndSucceeds() {
        when(bookingRepository.existsByPnrNumber(anyString()))
                .thenReturn(true) // first attempt collides
                .thenReturn(false); // second attempt succeeds

        String pnr = pnrGeneratorService.generateUniqueRandomPnr();

        assertThat(pnr).isNotNull();
        assertThat(pnr).hasSize(9);
        verify(bookingRepository, times(2)).existsByPnrNumber(anyString());
    }

    @Test
    void throwsConflictExceptionWhenMaxAttemptsExhausted() {
        when(bookingRepository.existsByPnrNumber(anyString())).thenReturn(true); // all collide

        assertThatThrownBy(() -> pnrGeneratorService.generateUniqueRandomPnr())
                .isInstanceOf(ConflictException.class)
                .hasMessageContaining("Unable to allocate a unique booking reference");

        verify(bookingRepository, times(5)).existsByPnrNumber(anyString());
    }
}
