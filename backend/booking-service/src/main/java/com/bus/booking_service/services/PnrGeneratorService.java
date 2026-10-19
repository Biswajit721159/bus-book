package com.bus.booking_service.services;

import com.bus.booking_service.exceptions.ConflictException;
import com.bus.booking_service.repository.BookingRepository;
import java.util.concurrent.ThreadLocalRandom;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class PnrGeneratorService {

    private static final int MAX_ATTEMPTS = 5;
    private static final long MIN_PNR = 100_000_000L; // 9-digit minimum (100,000,000)
    private static final long MAX_PNR = 1_000_000_000L; // 9-digit maximum exclusive (999,999,999)

    private final BookingRepository bookingRepository;

    /**
     * Generates a unique 9-digit random numeric PNR. Generates a random number in [100000000, 999999999], verifies against database
     * uniqueness. Retries up to MAX_ATTEMPTS if a collision occurs; throws ConflictException if unable to generate.
     */
    public String generateUniqueRandomPnr() {
        for (int attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
            long randomNum = ThreadLocalRandom.current().nextLong(MIN_PNR, MAX_PNR);
            String pnr = String.valueOf(randomNum);

            // Verify in database whether this PNR already exists
            if (!bookingRepository.existsByPnrNumber(pnr)) {
                log.debug("Generated unique PNR: {} on attempt {}", pnr, attempt);
                return pnr;
            }

            log.warn("PNR collision detected for {} (attempt {}/{}), retrying...", pnr, attempt, MAX_ATTEMPTS);
        }

        log.error("Failed to generate unique PNR after {} attempts", MAX_ATTEMPTS);
        throw new ConflictException("Unable to allocate a unique booking reference. Please try again.");
    }

    // Alias for backward compatibility if called
    public String generate7DigitPnr() {
        return generateUniqueRandomPnr();
    }
}
