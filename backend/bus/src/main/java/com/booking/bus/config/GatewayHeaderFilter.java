package com.booking.bus.config;

import com.booking.bus.entities.User;
import com.booking.bus.enums.Role;
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
public class GatewayHeaderFilter extends OncePerRequestFilter {

    private static final String USER_ID_HEADER = "X-User-Id";
    private static final String USER_EMAIL_HEADER = "X-User-Email";
    private static final String USER_NAME_HEADER = "X-User-Name";
    private static final String USER_ROLE_HEADER = "X-User-Role";

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String userIdStr = request.getHeader(USER_ID_HEADER);
        String userEmail = request.getHeader(USER_EMAIL_HEADER);
        String userName = request.getHeader(USER_NAME_HEADER);
        String userRoleStr = request.getHeader(USER_ROLE_HEADER);

        if (userIdStr != null && userEmail != null && userRoleStr != null) {
            try {
                Long userId = Long.valueOf(userIdStr);
                Role role = Role.valueOf(userRoleStr);

                User user = User.builder()
                        .id(userId)
                        .email(userEmail)
                        .name(userName)
                        .role(role)
                        .build();

                List<SimpleGrantedAuthority> authorities = List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));

                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(user, null, authorities);
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);

            } catch (IllegalArgumentException e) {
                // If header values are invalid or corrupted
                SecurityContextHolder.clearContext();
                response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid gateway user header values");
                return;
            }
        }

        filterChain.doFilter(request, response);
    }
}
