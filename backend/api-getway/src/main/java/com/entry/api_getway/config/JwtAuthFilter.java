package com.entry.api_getway.config;

import com.entry.api_getway.entities.User;
import com.entry.api_getway.services.JwtService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {
    private static final String AUTHORIZATION_HEADER = "Authorization";
    private static final String BEARER_PREFIX = "Bearer ";

    private final JwtService jwtService;

    public JwtAuthFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        String token = extractBearerToken(request);

        if (token == null) {
            filterChain.doFilter(request, response);
            return;
        }

        if (SecurityContextHolder.getContext().getAuthentication() != null) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            authenticateRequest(request, token);
        } catch (JwtException | IllegalArgumentException exception) {
            SecurityContextHolder.clearContext();
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid or expired JWT token");
            return;
        }

        filterChain.doFilter(request, response);
    }

    private String extractBearerToken(HttpServletRequest request) {
        String authHeader = request.getHeader(AUTHORIZATION_HEADER);

        if (authHeader == null || authHeader.isBlank()) {
            return null;
        }

        if (!authHeader.startsWith(BEARER_PREFIX)) {
            return null;
        }

        String token = authHeader.substring(BEARER_PREFIX.length()).trim();
        return token.isEmpty() ? null : token;
    }

    private void authenticateRequest(HttpServletRequest request, String token) {
        Claims claims = jwtService.extractAllClaims(token);

        String userEmail = claims.getSubject();
        Number idNum = claims.get("id", Number.class);
        Long userId = idNum != null ? idNum.longValue() : null;
        String userName = claims.get("name", String.class);
        String userRole = claims.get("role", String.class);

        if (userEmail == null || userId == null || userRole == null) {
            throw new JwtException("Required JWT claims (id, email, role) are missing");
        }

        com.entry.api_getway.enums.Role role;
        try {
            role = com.entry.api_getway.enums.Role.valueOf(userRole);
        } catch (IllegalArgumentException e) {
            throw new JwtException("Invalid user role: " + userRole);
        }

        User user = User.builder()
                .id(userId)
                .email(userEmail)
                .name(userName)
                .role(role)
                .build();

        if (!jwtService.validateToken(token, user)) {
            throw new JwtException("JWT validation failed");
        }

        List<SimpleGrantedAuthority> authorities = List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()));

        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(user, null, authorities);
        authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        SecurityContextHolder.getContext().setAuthentication(authToken);
    }
}
