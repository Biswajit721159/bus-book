package com.entry.api_getway.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
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
    
    @Value("${cors.allowed.origins:http://localhost:3000,http://localhost:5173}")
    private String allowedOrigins;

    @Autowired
    private JwtAuthFilter authFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        // Public endpoints (no token required)
                        .requestMatchers(
                                "/api/auth/login",
                                "/api/auth/register",
                                "/api/auth/verify-registration",
                                "/api/auth/google-login",
                                "/api/auth/otp-request",
                                "/api/auth/verify-otp-request",
                                "/api/bus-owner/login",
                                "/api/bus-owner/register",
                                "/api/bus-owner/google-login",
                                "/api/bus-owner/login/verify-otp",
                                "/api/bus-owner/register/verify-otp",
                                "/api/bus-owner/forgot-password",
                                "/api/bus-owner/reset-password",
                                "/api/bus-owner/resent-otp",
                                "/api/stations/get-all",
                                "/api/buses/search",
                                "/api/buses/{id}",
                                "/api/seat/count",
                                "/api/health",
                                "/api/health/",
                                "/error",
                                "/v3/api-docs",
                                "/v3/api-docs/**",
                                "/swagger-ui/**",
                                "/swagger-ui.html"
                        ).permitAll()
                        // All other endpoints require authentication
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
