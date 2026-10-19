package com.booking.bus.backGroundTasks;

import com.booking.bus.entities.CustomerReview;
import java.util.Random;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/benchmark")
@Service
@Slf4j
public class BulkInsert {
    private final KafkaTemplate<String, String> kafkaTemplate;

    public BulkInsert(KafkaTemplate<String, String> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    private final com.fasterxml.jackson.databind.ObjectMapper objectMapper = new com.fasterxml.jackson.databind.ObjectMapper();

    @org.springframework.security.access.prepost.PreAuthorize("hasRole('SUPER_ADMIN')")
    @PostMapping("/inject-reviews")
    public String injectReviews(@RequestParam(defaultValue = "500") int totalMessages, @RequestParam(defaultValue = "10") int totalBuses)
            throws InterruptedException {
        return bulkInsertReview(totalMessages, totalBuses);
    }

    public String bulkInsertReview(int totalMessages, int totalBuses) {
        ExecutorService executor = Executors.newFixedThreadPool(16);
        AtomicInteger sentCount = new AtomicInteger(0);
        Random random = new Random();
        long startTime = System.currentTimeMillis();
        log.info("Starting load test: Injecting {} dummy reviews into Kafka...", totalMessages);
        CountDownLatch latch = new CountDownLatch(totalMessages);

        for (int i = 1; i <= totalMessages; i++) {
            final long bookingId = 1_000_000L + i;
            final long userId = 10_000L + (i % 2000);
            final long busId = 1 + random.nextInt(Math.max(1, totalBuses));
            final int rating = 1 + random.nextInt(5);

            executor.submit(() -> {
                try {
                    CustomerReview customerReview = new CustomerReview();
                    customerReview.setUser(userId);
                    customerReview.setBookingId(bookingId);
                    customerReview.setRating(rating);
                    customerReview.setMessage("Benchmark automated test review for bus #" + busId);
                    customerReview.setBusId(busId);

                    String jsonReview = objectMapper.writeValueAsString(customerReview);
                    kafkaTemplate.send("bus-reviews-topic", String.valueOf(bookingId), jsonReview);
                    sentCount.incrementAndGet();
                } catch (Exception e) {
                    log.error("Failed to send review", e);
                } finally {
                    latch.countDown();
                }
            });
        }

        try {
            latch.await(60, TimeUnit.SECONDS);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        executor.shutdown();

        long timeTakenMs = System.currentTimeMillis() - startTime;
        double throughput = (sentCount.get() / (double) Math.max(1, timeTakenMs)) * 1000.0;
        String result = String.format("✅ Load Test Completed! Sent: %d events | Time Taken: %d ms | Throughput:" + " %.2f msgs/sec",
                sentCount.get(), timeTakenMs, throughput);
        log.info(result);
        return result;
    }
}
