package com.silverlineit.coursecontentsystem.auth.service;

import com.silverlineit.coursecontentsystem.auth.dto.*;
import com.silverlineit.coursecontentsystem.auth.entity.RefreshToken;
import com.silverlineit.coursecontentsystem.auth.entity.User;
import com.silverlineit.coursecontentsystem.auth.repository.RefreshTokenRepository;
import com.silverlineit.coursecontentsystem.auth.repository.UserRepository;
import com.silverlineit.coursecontentsystem.common.config.AppProperties;
import com.silverlineit.coursecontentsystem.common.exception.*;
import com.silverlineit.coursecontentsystem.common.security.JwtService;
import com.silverlineit.coursecontentsystem.common.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;
    private final AppProperties appProperties;

    @Transactional
    public UserDto register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException(request.getEmail());
        }
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new AppException("Username '" + request.getUsername() + "' is already taken",
                    org.springframework.http.HttpStatus.CONFLICT);
        }

        String verificationToken = UUID.randomUUID().toString();

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(User.Role.ROLE_INSTRUCTOR)
                .emailVerified(false)
                .verificationToken(verificationToken)
                .verificationTokenExpiry(LocalDateTime.now().plusHours(24))
                .build();

        User saved = userRepository.save(user);
        emailService.sendVerificationEmail(saved.getEmail(), saved.getUsername(), verificationToken);

        return UserDto.from(saved);
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!user.isEmailVerified()) {
            throw new EmailNotVerifiedException();
        }

        // Revoke old refresh tokens
        refreshTokenRepository.revokeAllUserTokens(user);

        String accessToken = jwtService.generateAccessToken(user.getEmail());
        String refreshTokenValue = UUID.randomUUID().toString();

        RefreshToken refreshToken = RefreshToken.builder()
                .user(user)
                .token(refreshTokenValue)
                .expiryDate(LocalDateTime.now().plusSeconds(
                        appProperties.getJwt().getRefreshTokenExpiryMs() / 1000))
                .build();

        refreshTokenRepository.save(refreshToken);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshTokenValue)
                .user(UserDto.from(user))
                .build();
    }

    @Transactional
    public AuthResponse refresh(RefreshTokenRequest request) {
        RefreshToken token = refreshTokenRepository.findByToken(request.getRefreshToken())
                .orElseThrow(() -> new InvalidTokenException("Invalid refresh token"));

        if (token.isRevoked()) {
            throw new InvalidTokenException("Refresh token has been revoked");
        }

        if (token.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new InvalidTokenException("Refresh token has expired");
        }

        String newAccessToken = jwtService.generateAccessToken(token.getUser().getEmail());

        return AuthResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(token.getToken())
                .user(UserDto.from(token.getUser()))
                .build();
    }

    @Transactional
    public void verifyEmail(String token) {
        User user = userRepository.findByVerificationToken(token)
                .orElseThrow(() -> new InvalidTokenException("Invalid verification token"));

        if (user.getVerificationTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new InvalidTokenException("Verification token has expired. Please request a new one.");
        }

        user.setEmailVerified(true);
        user.setVerificationToken(null);
        user.setVerificationTokenExpiry(null);
        userRepository.save(user);
    }

    @Transactional
    public void resendVerification(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        if (user.isEmailVerified()) {
            throw new AppException("Email is already verified",
                    org.springframework.http.HttpStatus.BAD_REQUEST);
        }

        String newToken = UUID.randomUUID().toString();
        user.setVerificationToken(newToken);
        user.setVerificationTokenExpiry(LocalDateTime.now().plusHours(24));
        userRepository.save(user);

        emailService.sendVerificationEmail(user.getEmail(), user.getUsername(), newToken);
    }

    @Transactional
    public void logout(String refreshTokenValue) {
        refreshTokenRepository.findByToken(refreshTokenValue)
                .ifPresent(token -> {
                    token.setRevoked(true);
                    refreshTokenRepository.save(token);
                });
    }
}