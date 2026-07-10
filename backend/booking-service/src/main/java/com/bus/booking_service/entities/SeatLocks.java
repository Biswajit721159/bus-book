package com.bus.booking_service.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "seat_locks", uniqueConstraints = {
        @UniqueConstraint(
                name = "uq_seat_lock",
                columnNames = {"bus_id", "booking_date", "seat_number"}
        )
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SeatLocks {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "created_by", nullable = false)
    private Long createdBy;

    @Column(name = "bus_id", nullable = false)
    private Long busId;

    @Column(name = "passenger_id", nullable = false)
    private Long passengerId;

    @Column(name = "source_station_id", nullable = false)
    private Long sourceStationId;

    @Column(name = "destination_station_id", nullable = false)
    private Long destinationStationId;

    @Column(name = "seat_number", nullable = false)
    private Integer seatNumber;

    @Column(name = "booking_date", nullable = false, updatable = false)
    private LocalDateTime bookingDate;

    @Column(name = "locked_at", nullable = false, updatable = false)
    private LocalDateTime lockedAt;

    @Column(name = "expires_at", nullable = false, updatable = false)
    private LocalDateTime expiresAt;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
