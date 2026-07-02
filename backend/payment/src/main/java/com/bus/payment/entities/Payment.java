package com.bus.payment.entities;

import com.bus.payment.enums.PaymentStatus;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ================= RELATION =================

    @Column(name = "created_by", nullable = false)
    private Long createdBy;

    @Column(name = "bus_id", nullable = false)
    private Long busId;

    @Column(name = "total_amount", precision = 10, scale = 2, nullable = false)
    private BigDecimal totalAmount;

    @Column(name = "card_number", length = 16, nullable = false)
    private String cardNumber;

    @Column(name = "card_holder_name", nullable = false)
    @Size(min = 2, max = 100, message = "Card holder name must be between 2 and 100 characters")
    private String cardHolderName;

    @Column(name = "card_expiry_date", nullable = false)
    @NotBlank(message = "Card expiry date is required")
    private String cardExpiryDate;

    @Column(name = "card_cvv", length = 4, nullable = false)
    @NotBlank(message = "CVV is required")
    private String cardCvv;


    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentStatus status = PaymentStatus.PENDING;


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
