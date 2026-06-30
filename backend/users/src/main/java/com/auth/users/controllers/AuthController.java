package com.auth.users.controllers;

import com.auth.users.dtos.common.ApiResponse;
import com.auth.users.dtos.user.*;
import com.auth.users.services.AuthService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@Tag(name="This end point is for login and register")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<Void>> register(@Valid @RequestBody RegisterDTO body){
        authService.register(body);
        return ResponseEntity.ok(ApiResponse.success("Registration successful. OTP sent to email for verification", null, HttpStatus.OK.value()));
    }

    @PostMapping("/register/verify-otp")
    public ResponseEntity<ApiResponse<Void>> verifyEmail(@Valid @RequestBody RegisterVerifyDTO body) {
        authService.verifyRegisterEmail(body);
        return ResponseEntity.ok(ApiResponse.success("Email verified successfully", null, HttpStatus.OK.value()));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<Void>> login(@Valid @RequestBody LoginDTO body){
        String message = authService.login(body);
        return ResponseEntity.ok(ApiResponse.success(message, null, HttpStatus.OK.value()));
    }

    @PostMapping("/login/verify-otp")
    public ResponseEntity<ApiResponse<LoginResponseDTO>> verifyLoginOtp(@Valid @RequestBody OtpVerificationDTO body) {
        LoginResponseDTO response = authService.verifyLoginOtp(body);
        return ResponseEntity.ok(ApiResponse.success("Successfully login", response, HttpStatus.OK.value()));
    }

    @PostMapping("/resent-otp")
    public ResponseEntity<ApiResponse<Void>> resentOtp(@Valid @RequestBody ForgotPasswordDTO body){
        authService.resendOtp(body);
        return ResponseEntity.ok(ApiResponse.success("OTP has been sent to your email successfully.", null, HttpStatus.OK.value()));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<Void>> forgotPassword(@Valid @RequestBody ForgotPasswordDTO body) {
        authService.forgotPassword(body);
        return ResponseEntity.ok(ApiResponse.success("Password reset OTP sent to email", null, HttpStatus.OK.value()));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<Void>> resetPassword(@Valid @RequestBody ResetPasswordDTO body) {
        authService.resetPassword(body);
        return ResponseEntity.ok(ApiResponse.success("Password reset successfully", null, HttpStatus.OK.value()));
    }

    @PostMapping("/google-login")
    public ResponseEntity<ApiResponse<LoginResponseDTO>> googleLogin(@Valid @RequestBody GoogleLoginDTO body) {
        LoginResponseDTO response = authService.googleLogin(body);
        return ResponseEntity.ok(ApiResponse.success("Successfully logged in with Google", response, HttpStatus.OK.value()));
    }
}
