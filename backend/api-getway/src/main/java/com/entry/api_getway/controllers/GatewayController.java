package com.entry.api_getway.controllers;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.Authentication;
import com.entry.api_getway.entities.User;

import java.net.URI;
import java.util.Collections;

@RestController
public class GatewayController {

    private final RestClient restClient = RestClient.create();

    @Value("${services.users.url}")
    private String usersServiceUrl;

    @Value("${services.bus.url}")
    private String busServiceUrl;

    @RequestMapping(value = {
            "/api/auth",
            "/api/auth/**",
            "/api/master-list",
            "/api/master-list/**"
    })
    public ResponseEntity<byte[]> proxyToUsers(
            @RequestBody(required = false) byte[] body,
            HttpMethod method,
            HttpServletRequest request) throws Exception {
        return executeProxy(usersServiceUrl, request, method, body);
    }

    @RequestMapping(value = {
            "/api/buses",
            "/api/buses/**",
            "/api/seat",
            "/api/seat/**",
            "/api/wishlist",
            "/api/wishlist/**",
            "/api/booking",
            "/api/booking/**",
            "/api/payment",
            "/api/payment/**",
            "/api/seatLock",
            "/api/seatLock/**",
            "/api/health",
            "/api/health/**",
            "/api/review",
            "/api/review/**",
            "/api/stations",
            "/api/stations/**",
            "/messages",
            "/messages/**"
    })
    public ResponseEntity<byte[]> proxyToBus(
            @RequestBody(required = false) byte[] body,
            HttpMethod method,
            HttpServletRequest request) throws Exception {
        return executeProxy(busServiceUrl, request, method, body);
    }

    private ResponseEntity<byte[]> executeProxy(String baseUrl, HttpServletRequest request, HttpMethod method, byte[] body) {
        String path = request.getRequestURI();
        String queryString = request.getQueryString();
        String targetUrl = baseUrl + path + (queryString != null ? "?" + queryString : "");
        System.out.println("targetUrl: " + targetUrl);

        HttpHeaders headers = new HttpHeaders();
        Collections.list(request.getHeaderNames()).forEach(headerName -> {
            // Skip the Host header to let RestClient calculate the correct target host header.
            if (!headerName.equalsIgnoreCase("host")) {
                Collections.list(request.getHeaders(headerName)).forEach(headerVal -> {
                    headers.add(headerName, headerVal);
                });
            }
        });

        // Propagate authenticated user context via X-User-* headers
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof User) {
            User user = (User) authentication.getPrincipal();
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
            RestClient.RequestBodySpec requestSpec = restClient.method(method)
                    .uri(URI.create(targetUrl))
                    .headers(httpHeaders -> httpHeaders.putAll(headers));

            RestClient.ResponseSpec responseSpec;
            if (body != null && body.length > 0) {
                responseSpec = requestSpec.body(body).retrieve();
            } else {
                responseSpec = requestSpec.retrieve();
            }

            ResponseEntity<byte[]> entity = responseSpec.toEntity(byte[].class);
            HttpHeaders cleanHeaders = new HttpHeaders();
            entity.getHeaders().forEach((name, values) -> {
                if (!name.toLowerCase().startsWith("access-control-")) {
                    cleanHeaders.put(name, values);
                }
            });
            return new ResponseEntity<>(entity.getBody(), cleanHeaders, entity.getStatusCode());

        } catch (RestClientResponseException ex) {
            HttpHeaders responseHeaders = new HttpHeaders();
            if (ex.getResponseHeaders() != null) {
                ex.getResponseHeaders().forEach((name, values) -> {
                    if (!name.toLowerCase().startsWith("access-control-")) {
                        responseHeaders.put(name, values);
                    }
                });
            }
            return new ResponseEntity<>(ex.getResponseBodyAsByteArray(), responseHeaders, HttpStatusCode.valueOf(ex.getStatusCode().value()));
        } catch (Exception ex) {
            HttpHeaders responseHeaders = new HttpHeaders();
            responseHeaders.setContentType(MediaType.APPLICATION_JSON);
            String errorMsg = "{\"success\": false, \"message\": \"Gateway forwarding error: " + ex.getMessage() + "\"}";
            return new ResponseEntity<>(errorMsg.getBytes(), responseHeaders, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
