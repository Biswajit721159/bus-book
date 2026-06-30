package com.booking.bus.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "stations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Station {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ================= RELATION =================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bus_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    @JsonIgnore
    @NotNull(message = "Bus is required")
    private Bus bus;

    // ================= BASIC INFO =================

    @NotBlank(message = "Station Name is required")
    @Size(min = 3, max = 50, message = "Station Name must be between 3 and 50 characters")
    @Column(nullable = false, length = 50)
    private String stationName;

    @NotNull(message = "Arrival time is required")
    @Column(nullable = false)
    private LocalTime arrivalTime;

    @PositiveOrZero(message = "Distance from last station cannot be negative")
    @Column(nullable = false)
    private int distanceFromLastStation;

    @Min(value = 1, message = "Station order must be at least 1")
    @Column(nullable = false)
    private int stationOrder;

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
