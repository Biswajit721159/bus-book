package com.auth.users.services;

import com.auth.users.appExceptions.BadRequestException;
import com.auth.users.appExceptions.ConflictException;
import com.auth.users.appExceptions.ResourceNotFoundException;
import com.auth.users.appExceptions.UnauthorizedException;
import com.auth.users.dtos.user.*;
import com.auth.users.entities.User;
import com.auth.users.enums.Role;
import com.auth.users.repository.UserRepository;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import jakarta.transaction.Transactional;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Optional;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    @Value("${google.client.id}")
    private String googleClientId;

    private static final int OTP_VALID_MINUTES = 10;
    private static final int MAX_OTP_LIMIT = 5;
    private static final int OTP_BLOCK_DURATION_MINUTES = 60;
    private static final SecureRandom secureRandom = new SecureRandom();
    private static final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    private final UserRepository userRepository;
    private final NotificationClientService notificationClientService;
    private final JwtService jwtUtil;
    private GoogleIdTokenVerifier googleTokenVerifier;

    @jakarta.annotation.PostConstruct
    public void initGoogleVerifier() {
        if (googleClientId != null && !googleClientId.isBlank()) {
            this.googleTokenVerifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), GsonFactory.getDefaultInstance())
                    .setAudience(Collections.singletonList(googleClientId)).build();
        }
    }

    @Transactional
    public void register(RegisterDTO body) {
        log.info("Processing registration for email: {}", body.getEmail());
        Optional<User> existedUser = userRepository.findByEmail(body.getEmail().trim().toLowerCase());
        User user;

        if (existedUser.isPresent()) {
            User existing = existedUser.get();
            if (existing.isEmailVerified()) {
                throw new ConflictException("Email already exists");
            }
            if (existing.getOtpGenerateTime() != null && existing.getOtpGenerateTime().plusMinutes(15).isAfter(LocalDateTime.now())) {
                throw new ConflictException(
                        "Registration is already pending verification for this email. Please check your inbox or request a new OTP.");
            }
            user = existing;
            user.setName(body.getName().trim());
            user.setPassword(passwordEncoder.encode(body.getPassword()));
        } else {
            user = new User();
            user.setName(body.getName().trim());
            user.setEmail(body.getEmail().trim().toLowerCase());
            user.setPassword(passwordEncoder.encode(body.getPassword()));
            user.setEmailVerified(false);
        }
        String otp = generateOtp();
        setOtpAndExpiryTime(user, otp);
        userRepository.saveAndFlush(user);

        notificationClientService.sendEmailOtpRequest(user.getEmail(), "Verify your BusBooking account", otp,
                "Confirm your registration with BusBooking", user);
    }

    @Transactional
    public void registerBusOwner(BusOwnerRegisterDTO body) {
        log.info("Processing bus owner registration for email: {}", body.getEmail());
        Optional<User> existedUser = userRepository.findByEmail(body.getEmail().trim().toLowerCase());
        User user;

        if (existedUser.isPresent()) {
            User existing = existedUser.get();
            if (existing.isEmailVerified()) {
                throw new ConflictException("Email already exists");
            }
            if (existing.getOtpGenerateTime() != null && existing.getOtpGenerateTime().plusMinutes(15).isAfter(LocalDateTime.now())) {
                throw new ConflictException(
                        "Registration is already pending verification for this email. Please check your inbox or request a new OTP.");
            }
            user = existing;
            user.setName(body.getFullName().trim());
            user.setPassword(passwordEncoder.encode(body.getPassword()));
            user.setCompanyName(body.getCompanyName());
            user.setPhoneNumber(body.getPhoneNumber());
            user.setRole(Role.BUS_OWNER);
        } else {
            user = new User();
            user.setName(body.getFullName().trim());
            user.setEmail(body.getEmail().trim().toLowerCase());
            user.setPassword(passwordEncoder.encode(body.getPassword()));
            user.setCompanyName(body.getCompanyName());
            user.setPhoneNumber(body.getPhoneNumber());
            user.setRole(Role.BUS_OWNER);
            user.setEmailVerified(false);
        }
        String otp = generateOtp();
        setOtpAndExpiryTime(user, otp);
        userRepository.saveAndFlush(user);

        notificationClientService.sendEmailOtpRequest(user.getEmail(), "Verify your Bus Owner account", otp,
                "Confirm your registration with BusBooking", user);
    }

    @Transactional
    public void verifyRegisterEmail(RegisterVerifyDTO body) {
        log.info("Verifying registration OTP for email: {}", body.getEmail());
        User user = userRepository.findByEmail(body.getEmail()).orElseThrow(() -> new ResourceNotFoundException("User not found"));

        boolean isPasswordCorrect = passwordEncoder.matches(body.getPassword(), user.getPassword());
        if (!isPasswordCorrect) {
            throw new UnauthorizedException("Invalid email or password");
        }

        if (user.isEmailVerified()) {
            return; // Already verified, no action needed
        }

        if (isOtpInvalid(user.getOtp(), user.getOtpGenerateTime(), body.getOtp())) {
            throw new UnauthorizedException("Invalid or expired OTP");
        }

        user.setEmailVerified(true);
        clearOtpAndExpiryTime(user);
        userRepository.save(user);

        notificationClientService.sendWelcomeEmailRequest(user.getEmail(), "Welcome to BusBooking", "Welcome to BusBooking", user);
    }

    @Transactional
    public String login(LoginDTO body) {
        log.info("Processing login request for email: {}", body.getEmail());
        User user = userRepository.findByEmail(body.getEmail()).orElseThrow(() -> new UnauthorizedException("Invalid email or password"));

        if (isOtpLimitExceeded(user.getOtpCounter(), user.getOtpCounterResetTime())) {
            throw new UnauthorizedException("Otp limit reached. Please try again after 1 hour");
        }

        if (user.isBlocked()) {
            throw new UnauthorizedException("Your account is blocked");
        }

        boolean isPasswordCorrect = passwordEncoder.matches(body.getPassword(), user.getPassword());
        if (!isPasswordCorrect) {
            throw new UnauthorizedException("Invalid email or password");
        }

        String otp = generateOtp();
        setOtpAndExpiryTime(user, otp);
        userRepository.save(user);

        String subject = user.isEmailVerified() ? "Your BusBooking login OTP" : "Verify your BusBooking account";
        String purpose = user.isEmailVerified() ? "Verify your identity to log in to BusBooking"
                : "Confirm your registration with BusBooking";

        notificationClientService.sendEmailOtpRequest(user.getEmail(), subject, otp, purpose, user);

        return user.isEmailVerified() ? "OTP sent to email. Verify OTP to complete login"
                : "Email is not verified. OTP sent to email for verification";
    }

    @Transactional
    public LoginResponseDTO verifyLoginOtp(OtpVerificationDTO body) {
        log.info("Verifying login OTP for email: {}", body.getEmail());
        User user = userRepository.findByEmail(body.getEmail()).orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.isBlocked()) {
            throw new UnauthorizedException("Your account is blocked");
        }

        if (!user.isEmailVerified()) {
            throw new BadRequestException("Please verify your email before login");
        }

        boolean isPasswordCorrect = passwordEncoder.matches(body.getPassword(), user.getPassword());
        if (!isPasswordCorrect) {
            throw new UnauthorizedException("Invalid email or password");
        }

        if (isOtpInvalid(user.getOtp(), user.getOtpGenerateTime(), body.getOtp())) {
            throw new UnauthorizedException("Invalid or expired OTP");
        }

        clearOtpAndExpiryTime(user);
        userRepository.save(user);

        return LoginResponseDTO.builder().token(jwtUtil.generateToken(user)).email(user.getEmail()).name(user.getName()).role(user
                .getRole() != null ? user.getRole().name() : null).companyName(user.getCompanyName()).phoneNumber(user.getPhoneNumber())
                .build();
    }

    @Transactional
    public String adminLogin(LoginDTO body) {
        log.info("Processing admin login request for email: {}", body.getEmail());
        User user = userRepository.findByEmail(body.getEmail()).orElseThrow(() -> new UnauthorizedException("Invalid email or password"));

        if (user.getRole() == Role.NORMAL_USER) {
            throw new UnauthorizedException("Access denied. Admin privileges required.");
        }

        return login(body);
    }

    @Transactional
    public LoginResponseDTO verifyAdminLoginOtp(OtpVerificationDTO body) {
        log.info("Verifying admin login OTP for email: {}", body.getEmail());
        User user = userRepository.findByEmail(body.getEmail()).orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.getRole() == Role.NORMAL_USER) {
            throw new UnauthorizedException("Access denied. Admin privileges required.");
        }

        return verifyLoginOtp(body);
    }

    @Transactional
    public void resendOtp(ForgotPasswordDTO body) {
        log.info("Resending OTP for email: {}", body.getEmail());
        User user = userRepository.findByEmail(body.getEmail()).orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.isBlocked()) {
            throw new UnauthorizedException("Your account is blocked");
        }
        if (isOtpLimitExceeded(user.getOtpCounter(), user.getOtpCounterResetTime())) {
            throw new UnauthorizedException("Otp limit reached. Please try again after 1 hour");
        }

        String otp = generateOtp();
        setOtpAndExpiryTime(user, otp);
        userRepository.save(user);

        String subject = user.isEmailVerified() ? "Your BusBooking login OTP" : "Verify your BusBooking account";
        String purpose = user.isEmailVerified() ? "Verify your identity to log in to BusBooking"
                : "Confirm your registration with BusBooking";

        notificationClientService.sendEmailOtpRequest(user.getEmail(), subject, otp, purpose, user);
    }

    @Transactional
    public void forgotPassword(ForgotPasswordDTO body) {
        log.info("Processing forgot password request for email: {}", body.getEmail());
        User user = userRepository.findByEmail(body.getEmail()).orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (isOtpLimitExceeded(user.getOtpCounter(), user.getOtpCounterResetTime())) {
            throw new UnauthorizedException("Otp limit reached. Please try again after 1 hour");
        }

        String otp = generateOtp();
        setOtpAndExpiryTime(user, otp);
        userRepository.save(user);

        notificationClientService.sendEmailOtpRequest(user.getEmail(), "Reset your BusBooking password", otp,
                "Reset your BusBooking account password", user);
    }

    @Transactional
    public void resetPassword(ResetPasswordDTO body) {
        log.info("Processing reset password request for email: {}", body.getEmail());
        User user = userRepository.findByEmail(body.getEmail()).orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (isOtpInvalid(user.getOtp(), user.getOtpGenerateTime(), body.getOtp())) {
            throw new UnauthorizedException("Invalid or expired reset OTP");
        }

        user.setPassword(passwordEncoder.encode(body.getPassword()));
        clearOtpAndExpiryTime(user);
        userRepository.save(user);
    }

    @Transactional
    public LoginResponseDTO googleLogin(GoogleLoginDTO body) {
        log.info("Processing Google login request");
        try {
            GoogleIdTokenVerifier verifier = this.googleTokenVerifier;
            if (verifier == null) {
                verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), GsonFactory.getDefaultInstance()).setAudience(
                        Collections.singletonList(googleClientId)).build();
            }

            GoogleIdToken idToken = verifier.verify(body.getToken());
            if (idToken == null) {
                throw new UnauthorizedException("Invalid Google ID token");
            }

            GoogleIdToken.Payload payload = idToken.getPayload();
            String email = payload.getEmail();
            String name = (String) payload.get("name");

            if (email == null) {
                throw new BadRequestException("Google ID token does not contain email address");
            }

            Optional<User> userOpt = userRepository.findByEmail(email);
            User user;

            if (userOpt.isPresent()) {
                user = userOpt.get();
                if (user.isBlocked()) {
                    throw new UnauthorizedException("Your account is blocked");
                }
                if (!user.isEmailVerified()) {
                    user.setEmailVerified(true);
                    userRepository.save(user);
                }
            } else {
                user = new User();
                user.setName(name != null ? name : "Google User");
                user.setEmail(email);
                user.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
                user.setEmailVerified(true);
                user.setRole(Role.NORMAL_USER);
                userRepository.saveAndFlush(user);
            }

            return LoginResponseDTO.builder().token(jwtUtil.generateToken(user)).email(user.getEmail()).name(user.getName()).role(user
                    .getRole() != null ? user.getRole().name() : null).companyName(user.getCompanyName()).phoneNumber(user.getPhoneNumber())
                    .build();

        } catch (Exception e) {
            log.error("Google authentication failed", e);
            if (e instanceof UnauthorizedException || e instanceof BadRequestException) {
                throw (RuntimeException) e;
            }
            throw new UnauthorizedException("Google authentication failed: " + e.getMessage());
        }
    }

    @Transactional
    public LoginResponseDTO adminGoogleLogin(GoogleLoginDTO body) {
        log.info("Processing Admin Google login request");
        try {
            GoogleIdTokenVerifier verifier = this.googleTokenVerifier;
            if (verifier == null) {
                verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), GsonFactory.getDefaultInstance()).setAudience(
                        Collections.singletonList(googleClientId)).build();
            }

            GoogleIdToken idToken = verifier.verify(body.getToken());
            if (idToken == null) {
                throw new UnauthorizedException("Invalid Google ID token");
            }

            GoogleIdToken.Payload payload = idToken.getPayload();
            String email = payload.getEmail();

            if (email == null) {
                throw new BadRequestException("Google ID token does not contain email address");
            }

            Optional<User> userOpt = userRepository.findByEmail(email);
            if (userOpt.isEmpty()) {
                throw new UnauthorizedException("Access denied. Admin privileges required. Please register first.");
            }

            User user = userOpt.get();
            if (user.getRole() == Role.NORMAL_USER) {
                throw new UnauthorizedException("Access denied. Admin privileges required.");
            }
            if (user.isBlocked()) {
                throw new UnauthorizedException("Your account is blocked");
            }
            if (!user.isEmailVerified()) {
                user.setEmailVerified(true);
                userRepository.save(user);
            }

            return LoginResponseDTO.builder().token(jwtUtil.generateToken(user)).email(user.getEmail()).name(user.getName()).role(user
                    .getRole() != null ? user.getRole().name() : null).companyName(user.getCompanyName()).phoneNumber(user.getPhoneNumber())
                    .build();

        } catch (Exception e) {
            log.error("Admin Google authentication failed", e);
            if (e instanceof UnauthorizedException || e instanceof BadRequestException) {
                throw (RuntimeException) e;
            }
            throw new UnauthorizedException("Admin Google authentication failed: " + e.getMessage());
        }
    }

    private void setOtpAndExpiryTime(User user, String otp) {
        if (isLimitTimeFinished(user.getOtpCounterResetTime())) {
            user.setOtpCounter(1);
            user.setOtpCounterResetTime(LocalDateTime.now());
        } else {
            Integer currentCounter = user.getOtpCounter();
            user.setOtpCounter(currentCounter == null ? 1 : currentCounter + 1);
        }
        user.setOtp(passwordEncoder.encode(otp));
        user.setOtpGenerateTime(LocalDateTime.now());
    }

    private void clearOtpAndExpiryTime(User user) {
        user.setOtp(null);
        user.setOtpGenerateTime(null);
    }

    private boolean isOtpLimitExceeded(Integer otpCounter, LocalDateTime limitStartTime) {
        if (otpCounter == null) {
            return false;
        }
        if (isLimitTimeFinished(limitStartTime)) {
            return false;
        }
        return otpCounter >= MAX_OTP_LIMIT;
    }

    private boolean isLimitTimeFinished(LocalDateTime limitStartTime) {
        if (limitStartTime == null) {
            return true;
        }
        long minutes = Duration.between(limitStartTime, LocalDateTime.now()).toMinutes();
        return minutes >= OTP_BLOCK_DURATION_MINUTES;
    }

    private String generateOtp() {
        return String.valueOf(100000 + secureRandom.nextInt(900000));
    }

    private boolean isOtpInvalid(String encodedOtp, LocalDateTime generatedAt, String rawOtp) {
        if (encodedOtp == null || generatedAt == null || rawOtp == null || rawOtp.isBlank()) {
            return true;
        }
        boolean isExpired = generatedAt.plusMinutes(AuthService.OTP_VALID_MINUTES).isBefore(LocalDateTime.now());
        return isExpired || !passwordEncoder.matches(rawOtp, encodedOtp);
    }
}
