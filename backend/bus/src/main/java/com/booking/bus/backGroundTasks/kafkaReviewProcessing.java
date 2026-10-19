package com.booking.bus.backGroundTasks;

import com.booking.bus.entities.CustomerReview;
import com.booking.bus.repository.CustomerReviewRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class kafkaReviewProcessing {
    private final CustomerReviewRepository reviewRepository;
    private final com.fasterxml.jackson.databind.ObjectMapper objectMapper = new com.fasterxml.jackson.databind.ObjectMapper().configure(
            com.fasterxml.jackson.databind.DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

    @KafkaListener(topics = "bus-reviews-topic", groupId = "bus-review-consumer-group", batch = "true" // Enables batch consumption
    )
    public void consumeReviewBatch(List<String> messages) {
        log.info("Received batch of {} review events from Kafka", messages.size());
        try {
            List<CustomerReview> reviews = messages.stream().map(msg -> {
                try {
                    CustomerReview e = objectMapper.readValue(msg, CustomerReview.class);
                    LocalDateTime now = LocalDateTime.now();
                    return CustomerReview.builder().user(e.getUser()).busId(e.getBusId()).bookingId(e.getBookingId()).rating(e.getRating())
                            .message(e.getMessage()).isProcessed(false).createdAt(e.getCreatedAt() != null ? e.getCreatedAt() : now)
                            .updatedAt(e.getUpdatedAt() != null ? e.getUpdatedAt() : now).build();
                } catch (Exception ex) {
                    log.error("Failed to parse review message from Kafka: {}", msg, ex);
                    return null;
                }
            }).filter(Objects::nonNull).toList();

            if (!reviews.isEmpty()) {
                reviewRepository.saveAll(reviews);
                log.info("Successfully persisted {} customer reviews to database", reviews.size());
            }
        } catch (Exception e) {
            log.error("Failed to process review events from Kafka: {}", messages, e);
        }
    }
}
