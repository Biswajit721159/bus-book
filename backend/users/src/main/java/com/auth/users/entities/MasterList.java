package com.auth.users.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "master_lists")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MasterList {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ================= RELATION =================

    @Column(name = "created_by", nullable = false)
    private Long createdBy;

    // ================= BASIC INFO =================

    @NotBlank(message = "Name is required")
    @Size(min = 3, max = 50, message = "Name must be between 3 and 50 characters")
    @Column(nullable = false, length = 50)
    private String name;

    // ================= STATUS =================

    @Builder.Default
    @Column(name = "is_active", nullable = false)
    private boolean active = true;

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
