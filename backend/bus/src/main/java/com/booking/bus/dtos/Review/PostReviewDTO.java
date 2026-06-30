package com.booking.bus.dtos.Review;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class PostReviewDTO {

    @NotNull(message = "rating is required")
    @Min(value = 1, message = "rating must be greater than or equal to 1")
    @Max(value = 5, message = "rating must be less than or equal to 5")
    private Integer rating;

    @NotNull(message = "bookingId is required")
    private Long bookingId;

    @Size(min = 5, max = 300, message = "review message must be between 5 and 300 characters")
    private String message;

}
