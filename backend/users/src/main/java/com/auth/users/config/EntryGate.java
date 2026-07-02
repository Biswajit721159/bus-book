package com.auth.users.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class EntryGate {
    @Value("${cors.allowed.origins}")
    private String allowedOrigins;

    @Autowired
    private GatewayHeaderFilter authFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(Customizer.withDefaults())
                .csrf(csrf -> csrf.disable()) // Disable CSRF for API endpoints if necessary
                .authorizeHttpRequests(auth -> auth
                        // Allow unauthenticated access to auth endpoints (login/register/verify)
                        .requestMatchers(
                                "/api/health",
                                "/api/health/",
                                "/error",
                                "/api/auth/login",
                                "/api/auth/login/verify-otp",
                                "/api/auth/register",
                                "/api/auth/register/verify-otp",
                                "/api/auth/verify-email",
                                "/api/auth/resent-otp",
                                "/api/auth/forgot-password",
                                "/api/auth/reset-password",
                                "/api/auth/google-login",
                                "/api/bus-owner/login",
                                "/api/bus-owner/register",
                                "/api/bus-owner/google-login",
                                "/api/bus-owner/login/verify-otp",
                                "/api/bus-owner/register/verify-otp",
                                "/api/bus-owner/forgot-password",
                                "/api/bus-owner/reset-password",
                                "/api/bus-owner/resent-otp",
                                "/v3/api-docs",
                                "/v3/api-docs/**",
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                "/messages"
                        ).permitAll()
                        // All other endpoints require authentication (including /api/auth/users)
                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(authFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        java.util.List<String> origins = new java.util.ArrayList<>();
        if (allowedOrigins != null && !allowedOrigins.isBlank()) {
            origins.addAll(Arrays.asList(allowedOrigins.split(",")));
        } else {
            origins.addAll(Arrays.asList("http://localhost:3000", "http://localhost:5173"));
        }
        if (!origins.contains("http://localhost:3001")) {
            origins.add("http://localhost:3001");
        }
        configuration.setAllowedOrigins(origins);
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        configuration.setExposedHeaders(Arrays.asList("Authorization"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
