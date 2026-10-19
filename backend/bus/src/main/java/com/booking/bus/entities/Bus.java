package com.booking.bus.entities;

import com.booking.bus.enums.BusStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import lombok.*;

@Entity
@Table(name = "bus", indexes = {@Index(name = "idx_bus_name", columnList = "bus_name"),
        @Index(name = "idx_bus_created_by_active", columnList = "created_by, is_active"),
        @Index(name = "idx_bus_status_active", columnList = "status, is_active"),
        @Index(name = "idx_bus_rating", columnList = "is_active, average_rating, total_reviews_count")}, uniqueConstraints = {
                @UniqueConstraint(name = "uk_bus_owner_name", columnNames = {"created_by", "bus_name"})})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Bus {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ================= RELATION =================

    @Column(name = "created_by", nullable = false)
    private Long createdBy;

    // ================= BASIC INFO =================

    @NotBlank(message = "Bus Name is required")
    @Size(min = 3, max = 50, message = "Bus Name must be between 3 and 50 characters")
    @Column(name = "bus_name", nullable = false, length = 50)
    private String busName;

    @Min(value = 1, message = "Total seat must be at least 1")
    @Max(value = 300, message = "Total seat cannot exceed 300")
    @Column(name = "total_seat", nullable = false)
    private int totalSeat;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private BusStatus status = BusStatus.PENDING;

    @Builder.Default
    @Column(name = "total_rating_sum", nullable = false)
    private long totalRatingSum = 0L;

    @Builder.Default
    @Column(name = "total_reviews_count", nullable = false)
    private long totalReviewsCount = 0L;

    @Builder.Default
    @Column(name = "average_rating", nullable = false)
    private double averageRating = 0.0;

    // ================= STATUS =================

    @Builder.Default
    @Column(name = "is_active", nullable = false)
    private boolean isActive = true;

    @OneToMany(mappedBy = "bus", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("stationOrder ASC")
    @Builder.Default
    private List<Station> stations = new ArrayList<>();

    // ================= TIMESTAMPS =================

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // ================= HELPER METHODS =================

    public void addStation(Station station) {
        stations.add(station);
        station.setBus(this);
    }

    public void removeStation(Station station) {
        stations.remove(station);
        station.setBus(null);
    }

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
        Bus bus = (Bus) o;
        return id != null && Objects.equals(id, bus.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
