package com.entry.api_getway.controllers;

import com.entry.api_getway.entities.User;
import jakarta.servlet.http.HttpServletRequest;
import java.net.URI;
import java.util.Collections;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

/**
 * GatewayController
 *
 * <p>
 * <strong>Use / Purpose:</strong><br>
 * Central Reverse Proxy and API Routing Controller for the microservices architecture. Validates incoming JWT tokens, injects authenticated
 * user details (X-User-Id, X-User-Email, X-User-Role) into request headers, and proxies API calls to downstream microservices:
 *
 * <ul>
 * <li>/api/auth/**, /api/user/**, /api/bus-owner/**, /api/Adminpanel/**, /api/master-list/** &rarr; Users Service
 * <li>/api/buses/**, /api/stations/**, /api/review/**, /api/health/** &rarr; Bus Service
 * <li>/api/booking/**, /api/seat/**, /api/seatLock/**, /api/wishlist/** &rarr; Booking Service
 * <li>/api/payment/** &rarr; Payment Service
 * </ul>
 *
 * <p>
 * <strong>Client Applications:</strong><br>
 * Used as the primary gateway entry point by all client apps:
 *
 * <ol>
 * <li>Passenger / User Web App (React Frontend)
 * <li>Bus Owner Portal / Dashboard
 * <li>Super Admin Dashboard
 * </ol>
 */
@Slf4j
@RestController
public class GatewayController {

    private final RestClient restClient = RestClient.create();

    @Value("${services.users.url}")
    private String usersServiceUrl;

    @Value("${services.bus.url}")
    private String busServiceUrl;

    @Value("${services.booking.url}")
    private String bookingServiceUrl;

    @Value("${services.payment.url}")
    private String paymentServiceUrl;

    @Value("${gateway.internal.secret:bus-booking-internal-secret-token}")
    private String gatewaySecret;

    /**
     * Use: Proxies user authentication, master list, profile, and admin panel requests to the downstream Users Service. App: All Apps
     * (Passenger App, Bus Owner Portal, Super Admin Dashboard).
     */
    @RequestMapping(value = {"/api/auth", "/api/auth/**", "/api/master-list", "/api/master-list/**", "/api/bus-owner", "/api/bus-owner/**",
            "/api/Adminpanel", "/api/Adminpanel/**", "/api/user", "/api/user/**"})
    public ResponseEntity<byte[]> proxyToUsers(@RequestBody(required = false) byte[] body, HttpMethod method, HttpServletRequest request)
            throws Exception {
        return executeProxy(usersServiceUrl, request, method, body);
    }

    /**
     * Use: Proxies bus inventory, station list, reviews, and health check requests to the downstream Bus Service. App: Passenger Web App,
     * Bus Owner Portal, Super Admin Dashboard, and Health Monitors.
     */
    @RequestMapping(value = {"/api/buses", "/api/buses/**", "/api/health", "/api/health/**", "/api/review", "/api/review/**",
            "/api/stations", "/api/stations/**", "/messages", "/messages/**"})
    public ResponseEntity<byte[]> proxyToBus(@RequestBody(required = false) byte[] body, HttpMethod method, HttpServletRequest request)
            throws Exception {
        return executeProxy(busServiceUrl, request, method, body);
    }

    /**
     * Use: Proxies booking creation, seat availability, seat locking, and wishlist operations to the downstream Booking Service. App:
     * Passenger Web App, Bus Owner Portal, and Super Admin Dashboard.
     */
    @RequestMapping(value = {"/api/booking", "/api/booking/**", "/api/wishlist", "/api/wishlist/**", "/api/seatLock", "/api/seatLock/**",
            "/api/seat", "/api/seat/**"})
    public ResponseEntity<byte[]> proxyToBooking(@RequestBody(required = false) byte[] body, HttpMethod method, HttpServletRequest request)
            throws Exception {
        return executeProxy(bookingServiceUrl, request, method, body);
    }

    /**
     * Use: Proxies payment verification and transaction creation requests to the downstream Payment Service. App: Passenger Web App
     * (Checkout & Payment Step).
     */
    @RequestMapping(value = {"/api/payment", "/api/payment/**"})
    public ResponseEntity<byte[]> proxyToPayment(@RequestBody(required = false) byte[] body, HttpMethod method, HttpServletRequest request)
            throws Exception {
        return executeProxy(paymentServiceUrl, request, method, body);
    }

    private ResponseEntity<byte[]> executeProxy(String baseUrl, HttpServletRequest request, HttpMethod method, byte[] body) {
        String path = request.getRequestURI();
        String queryString = request.getQueryString();
        String targetUrl = baseUrl + path + (queryString != null ? "?" + queryString : "");
        log.info("Proxying request to targetUrl: {}", targetUrl);

        HttpHeaders headers = new HttpHeaders();
        Collections.list(request.getHeaderNames()).forEach(headerName -> {
            // Skip Host and Origin headers to avoid downstream CORS issues,
            // and strip internal/spoofable headers coming directly from the
            // external client
            if (!headerName.equalsIgnoreCase("host") && !headerName.equalsIgnoreCase("origin") && !headerName.equalsIgnoreCase(
                    "x-gateway-secret") && !headerName.equalsIgnoreCase("x-user-id") && !headerName.equalsIgnoreCase("x-user-email") &&
                    !headerName.equalsIgnoreCase("x-user-name") && !headerName.equalsIgnoreCase("x-user-role")) {
                Collections.list(request.getHeaders(headerName)).forEach(headerVal -> {
                    headers.add(headerName, headerVal);
                });
            }
        });

        // Attach internal gateway secret for downstream microservice verification
        headers.set("X-Gateway-Secret", gatewaySecret);

        // Propagate authenticated user context via X-User-* headers
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof User) {
            User user = (User) authentication.getPrincipal();
            log.debug("Propagating authenticated user context: {}", user);
            if (user.getId() != null) {
                headers.set("X-User-Id", String.valueOf(user.getId()));
            }
            if (user.getEmail() != null) {
                headers.set("X-User-Email", user.getEmail());
            }
            if (user.getName() != null) {
                headers.set("X-User-Name", user.getName());
            }
            if (user.getRole() != null) {
                headers.set("X-User-Role", user.getRole().name());
            }
        }

        try {
            RestClient.RequestBodySpec requestSpec = restClient.method(method).uri(URI.create(targetUrl)).headers(httpHeaders -> httpHeaders
                    .putAll(headers));

            RestClient.ResponseSpec responseSpec;
            if (body != null && body.length > 0) {
                responseSpec = requestSpec.body(body).retrieve();
            } else {
                responseSpec = requestSpec.retrieve();
            }

            ResponseEntity<byte[]> entity = responseSpec.toEntity(byte[].class);
            HttpHeaders cleanHeaders = new HttpHeaders();
            entity.getHeaders().forEach((name, values) -> {
                String lowerName = name.toLowerCase();
                if (!lowerName.startsWith("access-control-") && !lowerName.equals("transfer-encoding") && !lowerName.equals(
                        "content-length")) {
                    cleanHeaders.put(name, values);
                }
            });
            return new ResponseEntity<>(entity.getBody(), cleanHeaders, entity.getStatusCode());

        } catch (RestClientResponseException ex) {
            HttpHeaders responseHeaders = new HttpHeaders();
            if (ex.getResponseHeaders() != null) {
                ex.getResponseHeaders().forEach((name, values) -> {
                    String lowerName = name.toLowerCase();
                    if (!lowerName.startsWith("access-control-") && !lowerName.equals("transfer-encoding") && !lowerName.equals(
                            "content-length")) {
                        responseHeaders.put(name, values);
                    }
                });
            }
            return new ResponseEntity<>(ex.getResponseBodyAsByteArray(), responseHeaders, HttpStatusCode.valueOf(ex.getStatusCode()
                    .value()));
        } catch (Exception ex) {
            HttpHeaders responseHeaders = new HttpHeaders();
            responseHeaders.setContentType(MediaType.APPLICATION_JSON);
            String errorMsg = "{\"success\": false, \"message\": \"Gateway forwarding error: " + ex.getMessage() + "\"}";
            return new ResponseEntity<>(errorMsg.getBytes(), responseHeaders, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
