package com.booking.bus.entities;

import com.booking.bus.enums.Booking.BookingStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import lombok.*;

@Entity
@Table(name = "bookings", indexes = {@Index(name = "idx_booking_search", columnList = "bus_id, booking_date, status")})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Bookings {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ================= RELATION =================

    @Column(name = "created_by", nullable = false)
    private Long createdBy;

    @Column(name = "bus_id", nullable = false)
    @NotNull(message = "Bus ID is required")
    private Long busId;

    @Column(name = "source_station_id", nullable = false)
    private Long sourceStationId;

    @Column(name = "destination_station_id", nullable = false)
    private Long destinationStationId;

    @Column(name = "payment_id")
    private Long paymentId;

    // ================= BOOKING DATA =================

    @Column(name = "booking_date", nullable = false)
    private LocalDateTime bookingDate;

    @Column(name = "total_amount", precision = 10, scale = 2, nullable = false)
    private BigDecimal totalAmount;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookingStatus status = BookingStatus.PENDING_PAYMENT;

    @Builder.Default
    @Column(nullable = false)
    private boolean isActive = true;

    // ================= TIMESTAMPS =================

    @Column(updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    // ================= AUTO TIMESTAMP =================

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
