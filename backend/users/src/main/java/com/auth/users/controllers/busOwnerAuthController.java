package com.auth.users.controllers;

import com.auth.users.dtos.common.ApiResponse;
import com.auth.users.dtos.user.BusOwnerRegisterDTO;
import com.auth.users.dtos.user.LoginDTO;
import com.auth.users.dtos.user.LoginResponseDTO;
import com.auth.users.dtos.user.OtpVerificationDTO;
import com.auth.users.dtos.user.GoogleLoginDTO;
import com.auth.users.dtos.user.RegisterVerifyDTO;
import com.auth.users.dtos.user.ForgotPasswordDTO;
import com.auth.users.dtos.user.ResetPasswordDTO;
import com.auth.users.services.AuthService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bus-owner")
@Tag(name="This end point is for bus owner login and register")
public class busOwnerAuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<Void>> register(@Valid @RequestBody BusOwnerRegisterDTO body){
        authService.registerBusOwner(body);
        return ResponseEntity.ok(ApiResponse.success("Registration successful. OTP sent to email for verification", null, HttpStatus.OK.value()));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<Void>> login(@Valid @RequestBody LoginDTO body){
        String message = authService.adminLogin(body);
        return ResponseEntity.ok(ApiResponse.success(message, null, HttpStatus.OK.value()));
    }

    @PostMapping("/login/verify-otp")
    public ResponseEntity<ApiResponse<LoginResponseDTO>> verifyLoginOtp(@Valid @RequestBody OtpVerificationDTO body) {
        LoginResponseDTO response = authService.verifyAdminLoginOtp(body);
        return ResponseEntity.ok(ApiResponse.success("Successfully login as admin", response, HttpStatus.OK.value()));
    }

    @PostMapping("/google-login")
    public ResponseEntity<ApiResponse<LoginResponseDTO>> googleLogin(@Valid @RequestBody GoogleLoginDTO body) {
        LoginResponseDTO response = authService.adminGoogleLogin(body);
        return ResponseEntity.ok(ApiResponse.success("Successfully logged in via Google", response, HttpStatus.OK.value()));
    }

    @PostMapping("/register/verify-otp")
    public ResponseEntity<ApiResponse<Void>> verifyRegisterOtp(@Valid @RequestBody RegisterVerifyDTO body) {
        authService.verifyRegisterEmail(body);
        return ResponseEntity.ok(ApiResponse.success("Registration verified successfully", null, HttpStatus.OK.value()));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<Void>> forgotPassword(@Valid @RequestBody ForgotPasswordDTO body) {
        authService.forgotPassword(body);
        return ResponseEntity.ok(ApiResponse.success("Password reset link/OTP sent to your email", null, HttpStatus.OK.value()));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<Void>> resetPassword(@Valid @RequestBody ResetPasswordDTO body) {
        authService.resetPassword(body);
        return ResponseEntity.ok(ApiResponse.success("Password has been reset successfully", null, HttpStatus.OK.value()));
    }

    @PostMapping("/resent-otp")
    public ResponseEntity<ApiResponse<Void>> resendOtp(@Valid @RequestBody ForgotPasswordDTO body) {
        authService.resendOtp(body);
        return ResponseEntity.ok(ApiResponse.success("OTP has been resent to your email", null, HttpStatus.OK.value()));
    }
}
