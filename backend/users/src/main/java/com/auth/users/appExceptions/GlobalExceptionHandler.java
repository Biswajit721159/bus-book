package com.auth.users.appExceptions;

import com.auth.users.dtos.common.ApiResponse;
import java.util.HashMap;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Handles 404 Not Found errors for missing users or master list entries.
     */
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleResourceNotFound(ResourceNotFoundException ex) {
        log.warn("Resource not found: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error(ex.getMessage(), HttpStatus.NOT_FOUND.value()));
    }

    /**
     * Handles 400 Bad Request errors (e.g. invalid OTP, incorrect credentials).
     */
    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<ApiResponse<Void>> handleBadRequest(BadRequestException ex) {
        log.warn("Bad request: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ApiResponse.error(ex.getMessage(), HttpStatus.BAD_REQUEST.value()));
    }

    /**
     * Handles 409 Conflict errors (e.g. email already registered).
     */
    @ExceptionHandler(ConflictException.class)
    public ResponseEntity<ApiResponse<Void>> handleConflict(ConflictException ex) {
        log.warn("Conflict error: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(ApiResponse.error(ex.getMessage(), HttpStatus.CONFLICT.value()));
    }

    /**
     * Handles 401 Unauthorized access errors.
     */
    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<ApiResponse<Void>> handleUnauthorized(UnauthorizedException ex) {
        log.warn("Unauthorized access: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error(ex.getMessage(), HttpStatus.UNAUTHORIZED.value()));
    }

    /**
     * Handles Spring Security AccessDeniedException (403 Forbidden).
     */
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiResponse<Void>> handleAccessDenied(AccessDeniedException ex) {
        log.warn("Access denied: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ApiResponse.error("Access denied: Insufficient permissions",
                HttpStatus.FORBIDDEN.value()));
    }

    /**
     * Handles Spring Security AuthenticationException (401 Unauthorized).
     */
    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ApiResponse<Void>> handleAuthenticationException(AuthenticationException ex) {
        log.warn("Authentication failure: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error("Authentication required", HttpStatus.UNAUTHORIZED
                .value()));
    }

    /**
     * Handles ResponseStatusException.
     */
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ApiResponse<Void>> handleResponseStatus(ResponseStatusException ex) {
        log.warn("Response status exception: {}", ex.getReason());
        return ResponseEntity.status(ex.getStatusCode()).body(ApiResponse.error(ex.getReason() != null ? ex.getReason() : ex.getMessage(),
                ex.getStatusCode().value()));
    }

    /**
     * Handles SQL / database constraint violation exceptions.
     */
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiResponse<Void>> handleDataIntegrityViolation(DataIntegrityViolationException ex) {
        log.error("Database integrity violation: ", ex);
        String message = "A database conflict occurred. The resource you are trying to create may already exist.";
        return ResponseEntity.status(HttpStatus.CONFLICT).body(ApiResponse.error(message, HttpStatus.CONFLICT.value()));
    }

    /**
     * Handles form and DTO validation errors.
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Map<String, String>>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        log.warn("Validation failed: {}", errors);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ApiResponse.<Map<String, String>>builder().success(false).message(
                "Validation failed").data(errors).status(HttpStatus.BAD_REQUEST.value()).build());
    }

    /**
     * Fallback handler for unhandled runtime exceptions. Avoids leaking internal exception details.
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleGenericException(Exception ex) {
        log.error("Unhandled exception: ", ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.error(
                "An unexpected internal error occurred. Please try again later.", HttpStatus.INTERNAL_SERVER_ERROR.value()));
    }
}
