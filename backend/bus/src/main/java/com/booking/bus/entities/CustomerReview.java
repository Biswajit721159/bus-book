package com.booking.bus.entities;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;
import lombok.*;

@Entity
@Table(name = "customer_review", indexes = {@Index(name = "idx_review_bus_id", columnList = "bus_id, id"),
        @Index(name = "idx_review_processed_id", columnList = "is_processed, id"),
        @Index(name = "idx_review_booking_id", columnList = "booking_id")}, uniqueConstraints = {
                @UniqueConstraint(name = "uk_customer_rating_user_booking", columnNames = {"created_by", "booking_id"})})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class CustomerReview {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ================= RELATION =================

    @Column(name = "created_by", nullable = false)
    @JsonProperty("user")
    @JsonAlias({"user", "userId", "created_by", "createdBy"})
    private Long user;

    @Column(name = "booking_id", nullable = false)
    @JsonProperty("bookingId")
    @JsonAlias({"bookingId", "booking_id"})
    private Long bookingId;

    // ================= BASIC INFO =================

    @Column(name = "rating", nullable = false)
    @Min(1)
    @Max(5)
    private int rating;

    @Column(name = "message")
    @Size(min = 5, max = 500)
    private String message;

    @Column(name = "bus_id", nullable = false)
    @JsonProperty("busId")
    @JsonAlias({"busId", "bus_id"})
    private Long busId;

    @Column(name = "is_processed", nullable = false)
    @Builder.Default
    @JsonProperty("isProcessed")
    @JsonAlias({"processed", "isProcessed", "is_processed"})
    private boolean isProcessed = false;

    // ================= TIMESTAMPS =================

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false, updatable = true)
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
