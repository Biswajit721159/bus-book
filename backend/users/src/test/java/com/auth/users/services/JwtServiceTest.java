package com.auth.users.services;

import com.auth.users.entities.User;
import com.auth.users.enums.Role;
import io.jsonwebtoken.Claims;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;

class JwtServiceTest {

    private JwtService jwtService;
    private User testUser;
    private static final String TEST_SECRET = "super-secret-jwt-key-for-unit-testing-purposes-32-bytes-long";

    @BeforeEach
    void setUp() {
        jwtService = new JwtService();
        ReflectionTestUtils.setField(jwtService, "jwtSecret", TEST_SECRET);

        testUser = User.builder().id(42L).name("Alex Johnson").email("alex@example.com").role(Role.NORMAL_USER).build();
    }

    @Test
    @DisplayName("validateSecret should throw IllegalStateException when secret is null or blank")
    void validateSecret_ThrowsWhenSecretIsBlank() {
        ReflectionTestUtils.setField(jwtService, "jwtSecret", "");
        assertThrows(IllegalStateException.class, () -> jwtService.validateSecret());

        ReflectionTestUtils.setField(jwtService, "jwtSecret", "   ");
        assertThrows(IllegalStateException.class, () -> jwtService.validateSecret());

        ReflectionTestUtils.setField(jwtService, "jwtSecret", null);
        assertThrows(IllegalStateException.class, () -> jwtService.validateSecret());
    }

    @Test
    @DisplayName("validateSecret should succeed when secret is valid")
    void validateSecret_Success() {
        assertDoesNotThrow(() -> jwtService.validateSecret());
    }

    @Test
    @DisplayName("generateToken and extractUsername should work for valid user")
    void generateToken_AndExtractUsername_Success() {
        String token = jwtService.generateToken(testUser);
        assertNotNull(token);
        assertFalse(token.isBlank());

        String extractedUsername = jwtService.extractUsername(token);
        assertEquals("alex@example.com", extractedUsername);
    }

    @Test
    @DisplayName("extractAllClaims should extract custom user claims correctly")
    void extractAllClaims_Success() {
        String token = jwtService.generateToken(testUser);
        Claims claims = jwtService.extractAllClaims(token);

        assertEquals("alex@example.com", claims.getSubject());
        assertEquals(42, claims.get("id", Number.class).longValue());
        assertEquals("Alex Johnson", claims.get("name", String.class));
        assertEquals(Role.NORMAL_USER.name(), claims.get("role", String.class));
    }

    @Test
    @DisplayName("extractExpiration should return a date ~10 days in the future")
    void extractExpiration_Success() {
        String token = jwtService.generateToken(testUser);
        Date expiration = jwtService.extractExpiration(token);

        assertNotNull(expiration);
        assertTrue(expiration.after(new Date()));
        // Expiration should be within 11 days from now
        long diffDays = (expiration.getTime() - System.currentTimeMillis()) / (1000 * 60 * 60 * 24);
        assertTrue(diffDays >= 9 && diffDays <= 10);
    }

    @Test
    @DisplayName("validateToken should return true for matching user")
    void validateToken_ValidTokenAndUser() {
        String token = jwtService.generateToken(testUser);
        assertTrue(jwtService.validateToken(token, testUser));
    }

    @Test
    @DisplayName("validateToken should return false for mismatched user email")
    void validateToken_MismatchedUser() {
        String token = jwtService.generateToken(testUser);

        User anotherUser = User.builder().id(99L).email("other@example.com").role(Role.NORMAL_USER).build();

        assertFalse(jwtService.validateToken(token, anotherUser));
    }

    @Test
    @DisplayName("validateToken should return false for null, empty or invalid token")
    void validateToken_InvalidToken() {
        assertFalse(jwtService.validateToken(null, testUser));
        assertFalse(jwtService.validateToken("", testUser));
        assertFalse(jwtService.validateToken("   ", testUser));
        assertFalse(jwtService.validateToken("not-a-valid-jwt-token", testUser));
        assertFalse(jwtService.validateToken(jwtService.generateToken(testUser), null));
    }
}
