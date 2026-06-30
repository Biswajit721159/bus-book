package com.booking.bus.entities;

import com.booking.bus.entities.Booking.Bookings;
import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "customer_review", uniqueConstraints = {
        @UniqueConstraint(name = "uk_customer_rating_user_booking", columnNames = {"created_by", "booking_id"})
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CustomerReview {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ================= RELATION =================

    @Column(name = "created_by", nullable = false)
    private Long user;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="booking_id", nullable = false)
    private Bookings booking;

    // ================= BASIC INFO =================

    @Column(name = "rating", nullable = false)
    @Min(1)
    @Max(5)
    private int rating;

    @Column(name = "message")
    @Size(min = 5, max = 500)
    private String message;

    // ================= TIMESTAMPS =================

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false, updatable = true)
    private LocalDateTime updatedAt;

    // ================= AUTO TIMESTAMP =================

    @PrePersist
    public void OnCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void OnUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
