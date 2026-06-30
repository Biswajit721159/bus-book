package com.booking.bus.entities;

import com.booking.bus.enums.BusStatus;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "bus")
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
    @Column(nullable = false, length = 50)
    private String busName;

    @Min(value = 1, message = "Total seat must be at least 1")
    @Max(value = 300, message = "Total seat cannot exceed 300")
    @Column(nullable = false)
    private int totalSeat;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BusStatus status = BusStatus.PENDING;

    // ================= STATUS =================

    @Builder.Default
    @Column(nullable = false)
    private boolean isActive = true;

    @OneToMany(mappedBy = "bus", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Station> stations = new ArrayList<>();

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
