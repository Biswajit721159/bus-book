package com.auth.users.services;

import com.auth.users.appExceptions.ConflictException;
import com.auth.users.appExceptions.UnauthorizedException;
import com.auth.users.dtos.user.BusOwnerRegisterDTO;
import com.auth.users.dtos.user.ForgotPasswordDTO;
import com.auth.users.dtos.user.LoginDTO;
import com.auth.users.dtos.user.RegisterDTO;
import com.auth.users.dtos.user.RegisterVerifyDTO;
import com.auth.users.entities.User;
import com.auth.users.enums.Role;
import com.auth.users.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private NotificationClientService notificationClientService;

    @Mock
    private JwtService jwtUtil;

    @InjectMocks
    private AuthService authService;

    private static final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private User verifiedUser;
    private User unverifiedUser;

    @BeforeEach
    void setUp() {
        verifiedUser = User.builder().id(1L).name("Verified User").email("verified@example.com").password(passwordEncoder.encode(
                "Password@123")).isEmailVerified(true).role(Role.NORMAL_USER).isBlocked(false).build();

        unverifiedUser = User.builder().id(2L).name("Unverified User").email("unverified@example.com").password(passwordEncoder.encode(
                "Password@123")).isEmailVerified(false).role(Role.NORMAL_USER).otp(passwordEncoder.encode("123456")).otpGenerateTime(
                        LocalDateTime.now()).isBlocked(false).build();
    }

    @Test
    @DisplayName("register should succeed for a new email and dispatch OTP email")
    void register_NewUser_Success() {
        RegisterDTO dto = new RegisterDTO();
        dto.setEmail("newuser@example.com");
        dto.setName("New User");
        dto.setPassword("Secret@123");

        when(userRepository.findByEmail("newuser@example.com")).thenReturn(Optional.empty());

        authService.register(dto);

        verify(userRepository, times(1)).saveAndFlush(argThat(user -> user.getEmail().equals("newuser@example.com") && user.getName()
                .equals("New User") && !user.isEmailVerified() && user.getOtp() != null && !user.getOtp().isBlank()));

        verify(notificationClientService, times(1)).sendEmailOtpRequest(eq("newuser@example.com"), eq("Verify your BusBooking account"),
                anyString(), anyString(), any(User.class));
    }

    @Test
    @DisplayName("register should throw ConflictException if email is already verified")
    void register_VerifiedUserExists_ThrowsConflict() {
        RegisterDTO dto = new RegisterDTO();
        dto.setEmail("verified@example.com");
        dto.setName("Verified User");
        dto.setPassword("Secret@123");

        when(userRepository.findByEmail("verified@example.com")).thenReturn(Optional.of(verifiedUser));

        ConflictException ex = assertThrows(ConflictException.class, () -> authService.register(dto));
        assertEquals("Email already exists", ex.getMessage());
        verify(userRepository, never()).saveAndFlush(any());
    }

    @Test
    @DisplayName("register should throw ConflictException if registration is still pending verification cooldown (< 15 mins)")
    void register_PendingCooldown_ThrowsConflict() {
        RegisterDTO dto = new RegisterDTO();
        dto.setEmail("unverified@example.com");
        dto.setName("Unverified User");
        dto.setPassword("Secret@123");

        unverifiedUser.setOtpGenerateTime(LocalDateTime.now().minusMinutes(5));
        when(userRepository.findByEmail("unverified@example.com")).thenReturn(Optional.of(unverifiedUser));

        ConflictException ex = assertThrows(ConflictException.class, () -> authService.register(dto));
        assertTrue(ex.getMessage().contains("Registration is already pending verification"));
        verify(userRepository, never()).saveAndFlush(any());
    }

    @Test
    @DisplayName("register should allow retrying registration if previous unverified attempt timed out (> 15 mins)")
    void register_ExpiredPendingRegistration_AllowsReRegistration() {
        RegisterDTO dto = new RegisterDTO();
        dto.setEmail("unverified@example.com");
        dto.setName("Unverified User");
        dto.setPassword("Secret@123");

        unverifiedUser.setOtpGenerateTime(LocalDateTime.now().minusMinutes(20));
        when(userRepository.findByEmail("unverified@example.com")).thenReturn(Optional.of(unverifiedUser));

        authService.register(dto);

        verify(userRepository, times(1)).saveAndFlush(unverifiedUser);
        verify(notificationClientService, times(1)).sendEmailOtpRequest(anyString(), anyString(), anyString(), anyString(), any());
    }

    @Test
    @DisplayName("registerBusOwner should save BUS_OWNER role with company details")
    void registerBusOwner_Success() {
        BusOwnerRegisterDTO dto = new BusOwnerRegisterDTO();
        dto.setEmail("owner@example.com");
        dto.setFullName("Bus Operator");
        dto.setPassword("Owner@123");
        dto.setCompanyName("Express Travels");
        dto.setPhoneNumber("9876543210");

        when(userRepository.findByEmail("owner@example.com")).thenReturn(Optional.empty());

        authService.registerBusOwner(dto);

        verify(userRepository, times(1)).saveAndFlush(argThat(user -> user.getEmail().equals("owner@example.com") && user
                .getRole() == Role.BUS_OWNER && "Express Travels".equals(user.getCompanyName()) && "9876543210".equals(user
                        .getPhoneNumber())));
    }

    @Test
    @DisplayName("verifyRegisterEmail should verify user when password and OTP match")
    void verifyRegisterEmail_Success() {
        RegisterVerifyDTO dto = new RegisterVerifyDTO();
        dto.setEmail("unverified@example.com");
        dto.setPassword("Password@123");
        dto.setOtp("123456");

        when(userRepository.findByEmail("unverified@example.com")).thenReturn(Optional.of(unverifiedUser));

        authService.verifyRegisterEmail(dto);

        assertTrue(unverifiedUser.isEmailVerified());
        assertNull(unverifiedUser.getOtp());
        verify(userRepository, times(1)).save(unverifiedUser);
        verify(notificationClientService, times(1)).sendWelcomeEmailRequest(eq("unverified@example.com"), anyString(), anyString(), any());
    }

    @Test
    @DisplayName("verifyRegisterEmail should throw UnauthorizedException on wrong password")
    void verifyRegisterEmail_WrongPassword_ThrowsUnauthorized() {
        RegisterVerifyDTO dto = new RegisterVerifyDTO();
        dto.setEmail("unverified@example.com");
        dto.setPassword("WrongPassword");
        dto.setOtp("123456");

        when(userRepository.findByEmail("unverified@example.com")).thenReturn(Optional.of(unverifiedUser));

        assertThrows(UnauthorizedException.class, () -> authService.verifyRegisterEmail(dto));
        assertFalse(unverifiedUser.isEmailVerified());
        verify(userRepository, never()).save(any());
    }

    @Test
    @DisplayName("verifyRegisterEmail should throw UnauthorizedException on wrong OTP")
    void verifyRegisterEmail_WrongOtp_ThrowsUnauthorized() {
        RegisterVerifyDTO dto = new RegisterVerifyDTO();
        dto.setEmail("unverified@example.com");
        dto.setPassword("Password@123");
        dto.setOtp("999999");

        when(userRepository.findByEmail("unverified@example.com")).thenReturn(Optional.of(unverifiedUser));

        assertThrows(UnauthorizedException.class, () -> authService.verifyRegisterEmail(dto));
        assertFalse(unverifiedUser.isEmailVerified());
        verify(userRepository, never()).save(any());
    }

    @Test
    @DisplayName("adminLogin should block NORMAL_USER with 403 / Unauthorized")
    void adminLogin_BlocksNormalUser() {
        LoginDTO dto = new LoginDTO();
        dto.setEmail("verified@example.com");
        dto.setPassword("Password@123");

        when(userRepository.findByEmail("verified@example.com")).thenReturn(Optional.of(verifiedUser));

        UnauthorizedException ex = assertThrows(UnauthorizedException.class, () -> authService.adminLogin(dto));
        assertTrue(ex.getMessage().contains("Access denied. Admin privileges required."));
    }

    @Test
    @DisplayName("adminLogin should allow BUS_OWNER")
    void adminLogin_AllowsBusOwner() {
        LoginDTO dto = new LoginDTO();
        dto.setEmail("owner@example.com");
        dto.setPassword("Password@123");

        User owner = User.builder().id(5L).email("owner@example.com").password(passwordEncoder.encode("Password@123")).isEmailVerified(true)
                .role(Role.BUS_OWNER).isBlocked(false).build();

        when(userRepository.findByEmail("owner@example.com")).thenReturn(Optional.of(owner));

        String result = authService.adminLogin(dto);
        assertNotNull(result);
        verify(notificationClientService, times(1)).sendEmailOtpRequest(eq("owner@example.com"), anyString(), anyString(), anyString(),
                any());
    }

    @Test
    @DisplayName("resendOtp should generate and send new OTP")
    void resendOtp_Success() {
        ForgotPasswordDTO dto = new ForgotPasswordDTO();
        dto.setEmail("verified@example.com");

        when(userRepository.findByEmail("verified@example.com")).thenReturn(Optional.of(verifiedUser));

        authService.resendOtp(dto);

        verify(userRepository, times(1)).save(verifiedUser);
        verify(notificationClientService, times(1)).sendEmailOtpRequest(eq("verified@example.com"), anyString(), anyString(), anyString(),
                any());
    }
}
