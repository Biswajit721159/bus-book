package com.booking.bus.entities;

import com.booking.bus.enums.BusStatus;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Objects;
import lombok.*;

@Entity
@Table(name = "stations", indexes = {@Index(name = "idx_station_name_bus", columnList = "station_name, bus_id"),
        @Index(name = "idx_station_bus_order", columnList = "bus_id, station_order")}, uniqueConstraints = {
                @UniqueConstraint(name = "uk_station_bus_order", columnNames = {"bus_id", "station_order"})})
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
    @Column(name = "station_name", nullable = false, length = 50)
    private String stationName;

    @NotNull(message = "Arrival time is required")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm[:ss]")
    @Column(name = "arrival_time", nullable = false)
    private LocalTime arrivalTime;

    @PositiveOrZero(message = "Distance from last station cannot be negative")
    @Column(name = "distance_from_last_station", nullable = false)
    private int distanceFromLastStation;

    @Min(value = 1, message = "Station order must be at least 1")
    @Column(name = "station_order", nullable = false)
    private int stationOrder;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private BusStatus status = BusStatus.PENDING;

    // ================= TIMESTAMPS =================

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    @Column(name = "updated_at")
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

    // ================= EQUALS & HASHCODE =================

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        Station station = (Station) o;
        return id != null && Objects.equals(id, station.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
