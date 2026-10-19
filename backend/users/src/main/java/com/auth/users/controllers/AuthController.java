package com.auth.users.controllers;

import com.auth.users.dtos.common.ApiResponse;
import com.auth.users.dtos.user.*;
import com.auth.users.services.AuthService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * AuthController
 *
 * <p>
 * <strong>Use / Purpose:</strong><br>
 * Authentication and authorization controller for regular passengers/users:
 *
 * <ul>
 * <li>User registration with email OTP verification
 * <li>Two-factor/OTP email login and password login
 * <li>Google OAuth2 login integration
 * <li>Forgot password and password reset with email OTP
 * <li>Resending OTP codes
 * </ul>
 *
 * <p>
 * <strong>Client Applications:</strong><br>
 *
 * <ul>
 * <li><strong>Passenger / User Web App (Book Bus App):</strong> User signup, login, password recovery, and Google sign-in.
 * </ul>
 */
@RestController
@RequestMapping("/api/auth")
@Tag(name = "This end point is for login and register")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /**
     * Use: Registers a new passenger user account and sends verification OTP to email. App: Passenger / User Web App (Signup Page / Modal).
     */
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<Void>> register(@Valid @RequestBody RegisterDTO body) {
        authService.register(body);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(
                "Registration successful. OTP sent to email for verification", null, HttpStatus.CREATED.value()));
    }

    /**
     * Use: Verifies OTP code sent to user email to activate the account. App: Passenger / User Web App (Signup Email Verification Screen).
     */
    @PostMapping("/register/verify-otp")
    public ResponseEntity<ApiResponse<Void>> verifyEmail(@Valid @RequestBody RegisterVerifyDTO body) {
        authService.verifyRegisterEmail(body);
        return ResponseEntity.ok(ApiResponse.success("Email verified successfully", null, HttpStatus.OK.value()));
    }

    /**
     * Use: Initiates login with email and password, sending an OTP for two-factor authentication. App: Passenger / User Web App (Login Page
     * / Modal).
     */
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<Void>> login(@Valid @RequestBody LoginDTO body) {
        String message = authService.login(body);
        return ResponseEntity.ok(ApiResponse.success(message, null, HttpStatus.OK.value()));
    }

    /**
     * Use: Verifies 2FA login OTP and generates JWT access token for session authentication. App: Passenger / User Web App (Login OTP
     * Verification Step).
     */
    @PostMapping("/login/verify-otp")
    public ResponseEntity<ApiResponse<LoginResponseDTO>> verifyLoginOtp(@Valid @RequestBody OtpVerificationDTO body) {
        LoginResponseDTO response = authService.verifyLoginOtp(body);
        return ResponseEntity.ok(ApiResponse.success("Successfully login", response, HttpStatus.OK.value()));
    }

    /**
     * Use: Resends a new OTP code to the user's email if expired or not received. App: Passenger / User Web App ("Resend OTP" button).
     */
    @PostMapping({"/resend-otp", "/resent-otp"})
    public ResponseEntity<ApiResponse<Void>> resentOtp(@Valid @RequestBody ForgotPasswordDTO body) {
        authService.resendOtp(body);
        return ResponseEntity.ok(ApiResponse.success("OTP has been sent to your email successfully.", null, HttpStatus.OK.value()));
    }

    /**
     * Use: Requests password reset OTP code to be sent to user's registered email. App: Passenger / User Web App (Forgot Password Form).
     */
    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<Void>> forgotPassword(@Valid @RequestBody ForgotPasswordDTO body) {
        authService.forgotPassword(body);
        return ResponseEntity.ok(ApiResponse.success("Password reset OTP sent to email", null, HttpStatus.OK.value()));
    }

    /**
     * Use: Validates reset OTP and sets a new password for the account. App: Passenger / User Web App (Reset Password Screen).
     */
    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<Void>> resetPassword(@Valid @RequestBody ResetPasswordDTO body) {
        authService.resetPassword(body);
        return ResponseEntity.ok(ApiResponse.success("Password reset successfully", null, HttpStatus.OK.value()));
    }

    /**
     * Use: Authenticates or auto-registers user via Google OAuth2 ID Token. App: Passenger / User Web App ("Sign in with Google" Button).
     */
    @PostMapping("/google-login")
    public ResponseEntity<ApiResponse<LoginResponseDTO>> googleLogin(@Valid @RequestBody GoogleLoginDTO body) {
        LoginResponseDTO response = authService.googleLogin(body);
        return ResponseEntity.ok(ApiResponse.success("Successfully logged in with Google", response, HttpStatus.OK.value()));
    }
}
