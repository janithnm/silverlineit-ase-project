package com.silverlineit.coursecontentsystem.auth.controller;

import com.silverlineit.coursecontentsystem.auth.dto.*;
import com.silverlineit.coursecontentsystem.auth.service.AuthService;
import com.silverlineit.coursecontentsystem.common.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserDto>> register(
            @Valid @RequestBody RegisterRequest request) {
        UserDto user = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(
                        "Registration successful. Please check your email to verify your account.",
                        user));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Login successful", response));
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<AuthResponse>> refresh(
            @Valid @RequestBody RefreshTokenRequest request) {
        AuthResponse response = authService.refresh(request);
        return ResponseEntity.ok(ApiResponse.success("Token refreshed", response));
    }

    @GetMapping("/verify-email")
    public ResponseEntity<ApiResponse<Void>> verifyEmail(
            @RequestParam String token) {
        authService.verifyEmail(token);
        return ResponseEntity.ok(ApiResponse.success("Email verified successfully. You can now log in."));
    }

    @PostMapping("/resend-verification")
    public ResponseEntity<ApiResponse<Void>> resendVerification(
            @RequestParam String email) {
        authService.resendVerification(email);
        return ResponseEntity.ok(ApiResponse.success(
                "Verification email resent. Please check your inbox."));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(
            @Valid @RequestBody RefreshTokenRequest request) {
        authService.logout(request.getRefreshToken());
        return ResponseEntity.ok(ApiResponse.success("Logged out successfully"));
    }
}