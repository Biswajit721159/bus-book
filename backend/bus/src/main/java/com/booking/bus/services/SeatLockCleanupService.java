package com.booking.bus.services;

import com.booking.bus.repository.Booking.SeatLockRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class SeatLockCleanupService {

    @Autowired
    private SeatLockRepository seatLockRepository;

    @Scheduled(fixedRate = 60000) // Run every 60,000 milliseconds (1 minute)
    @Transactional
    public void cleanupExpiredLocks() {
        seatLockRepository.deleteExpiredLocks(LocalDateTime.now());
    }
}
