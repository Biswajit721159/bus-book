package com.auth.users.entities;

import com.auth.users.enums.Role;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "users",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = "email")
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ================= BASIC INFO =================

    @NotBlank(message = "Name is required")
    @Size(min = 3, max = 50, message = "Name must be between 3 and 50 characters")
    @Column(nullable = false, length = 50)
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    @Column(nullable = false)
    private String password;

    @Column(length = 100)
    private String companyName;

    @Column(length = 20)
    private String phoneNumber;

    // ================= ROLE =================

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role = Role.NORMAL_USER;

    // ================= ACCOUNT STATUS =================

    @Builder.Default
    @Column(nullable = false)
    private boolean isBlocked = false;

    @Builder.Default
    @Column(nullable = false)
    private boolean isEmailVerified = false;

    // ================= OTP =================

    @Column(length = 500)
    private String otp;

    private LocalDateTime otpGenerateTime;

    @Column(name = "otp_counter", updatable = true, columnDefinition = "INT DEFAULT 0")
    private Integer otpCounter;

    @Column(name = "otp_counter_reset_time")
    private LocalDateTime otpCounterResetTime;

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