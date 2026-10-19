package com.auth.users.controllers;

import com.auth.users.dtos.common.ApiResponse;
import com.auth.users.dtos.user.BusOwnerRegisterDTO;
import com.auth.users.dtos.user.ForgotPasswordDTO;
import com.auth.users.dtos.user.GoogleLoginDTO;
import com.auth.users.dtos.user.LoginDTO;
import com.auth.users.dtos.user.LoginResponseDTO;
import com.auth.users.dtos.user.OtpVerificationDTO;
import com.auth.users.dtos.user.RegisterVerifyDTO;
import com.auth.users.dtos.user.ResetPasswordDTO;
import com.auth.users.services.AuthService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * BusOwnerAuthController
 *
 * <p>
 * <strong>Use / Purpose:</strong><br>
 * Dedicated authentication and onboard controller for Bus Owners and Admins:
 *
 * <ul>
 * <li>Bus owner registration (includes company name, business details, email OTP verification)
 * <li>Bus owner/admin email OTP login & credentials login
 * <li>Bus owner Google OAuth2 login
 * <li>Password recovery and reset flows for fleet owners
 * </ul>
 *
 * <p>
 * <strong>Client Applications:</strong><br>
 *
 * <ul>
 * <li><strong>Bus Owner Portal & Super Admin Portal:</strong> Partner registration, owner login, password recovery.
 * </ul>
 */
@RestController
@RequestMapping("/api/bus-owner")
@Tag(name = "This end point is for bus owner login and register")
@RequiredArgsConstructor
public class BusOwnerAuthController {

    private final AuthService authService;

    /**
     * Use: Registers a new Bus Owner account with company name, business details, and sends verification OTP. App: Bus Owner Portal
     * (Partner / Owner Registration Page).
     */
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<Void>> register(@Valid @RequestBody BusOwnerRegisterDTO body) {
        authService.registerBusOwner(body);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(
                "Registration successful. OTP sent to email for verification", null, HttpStatus.CREATED.value()));
    }

    /**
     * Use: Initiates Bus Owner / Admin login, sending 2FA OTP to registered email. App: Bus Owner Portal & Super Admin Dashboard (Admin
     * Login Page).
     */
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<Void>> login(@Valid @RequestBody LoginDTO body) {
        String message = authService.adminLogin(body);
        return ResponseEntity.ok(ApiResponse.success(message, null, HttpStatus.OK.value()));
    }

    /**
     * Use: Verifies Bus Owner 2FA OTP code and returns JWT token with owner role permissions. App: Bus Owner Portal & Super Admin Dashboard
     * (Admin 2FA Verification Step).
     */
    @PostMapping("/login/verify-otp")
    public ResponseEntity<ApiResponse<LoginResponseDTO>> verifyLoginOtp(@Valid @RequestBody OtpVerificationDTO body) {
        LoginResponseDTO response = authService.verifyAdminLoginOtp(body);
        return ResponseEntity.ok(ApiResponse.success("Successfully login as admin", response, HttpStatus.OK.value()));
    }

    /**
     * Use: Authenticates Bus Owner via Google OAuth2 ID Token. App: Bus Owner Portal ("Sign in with Google" Button).
     */
    @PostMapping("/google-login")
    public ResponseEntity<ApiResponse<LoginResponseDTO>> googleLogin(@Valid @RequestBody GoogleLoginDTO body) {
        LoginResponseDTO response = authService.adminGoogleLogin(body);
        return ResponseEntity.ok(ApiResponse.success("Successfully logged in via Google", response, HttpStatus.OK.value()));
    }

    /**
     * Use: Verifies OTP code for Bus Owner partner registration activation. App: Bus Owner Portal (Owner Signup Email OTP Verification
     * Screen).
     */
    @PostMapping("/register/verify-otp")
    public ResponseEntity<ApiResponse<Void>> verifyRegisterOtp(@Valid @RequestBody RegisterVerifyDTO body) {
        authService.verifyRegisterEmail(body);
        return ResponseEntity.ok(ApiResponse.success("Registration verified successfully", null, HttpStatus.OK.value()));
    }

    /**
     * Use: Sends password reset OTP code to registered Bus Owner email. App: Bus Owner Portal (Forgot Password Form).
     */
    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<Void>> forgotPassword(@Valid @RequestBody ForgotPasswordDTO body) {
        authService.forgotPassword(body);
        return ResponseEntity.ok(ApiResponse.success("Password reset link/OTP sent to your email", null, HttpStatus.OK.value()));
    }

    /**
     * Use: Sets new password for Bus Owner after OTP verification. App: Bus Owner Portal (Reset Password Form).
     */
    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<Void>> resetPassword(@Valid @RequestBody ResetPasswordDTO body) {
        authService.resetPassword(body);
        return ResponseEntity.ok(ApiResponse.success("Password has been reset successfully", null, HttpStatus.OK.value()));
    }

    /**
     * Use: Resends OTP code to Bus Owner email for registration or password reset. App: Bus Owner Portal ("Resend OTP" link).
     */
    @PostMapping({"/resend-otp", "/resent-otp"})
    public ResponseEntity<ApiResponse<Void>> resendOtp(@Valid @RequestBody ForgotPasswordDTO body) {
        authService.resendOtp(body);
        return ResponseEntity.ok(ApiResponse.success("OTP has been resent to your email", null, HttpStatus.OK.value()));
    }
}
