package com.school.security;

import com.school.util.JwtUtil;
import io.jsonwebtoken.Claims; // Make sure Claims is imported
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority; // Import GrantedAuthority
import org.springframework.security.core.authority.SimpleGrantedAuthority; // Import SimpleGrantedAuthority
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List; // Import List

@Component
public class JwtRequestFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain chain)
            throws ServletException, IOException {

        final String authorizationHeader = request.getHeader("Authorization");

        String mobile = null;
        String jwt = null;
        String role = null;

        // 1. Check if the Authorization header exists and starts with "Bearer "
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            jwt = authorizationHeader.substring(7); // Extract the token
            try {
                // 2. Extract the username (mobile number) and role from the token
                mobile = jwtUtil.extractUsername(jwt);
                role = jwtUtil.extractClaim(jwt, claims -> claims.get("role", String.class));
            } catch (Exception e) {
                // Handle potential errors during token parsing (e.g., expired token)
                System.out.println("Could not extract username or role from token: " + e.getMessage());
            }
        }

        // 3. If we have a username and role, and the user is not already authenticated
        if (mobile != null && role != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            // 4. Validate the token (check expiration, signature)
            if (jwtUtil.validateToken(jwt)) {
                // 5. Create the list of authorities (roles) for Spring Security
                // Spring Security expects roles to be prefixed with "ROLE_"
                List<GrantedAuthority> authorities = new ArrayList<>();
                authorities.add(new SimpleGrantedAuthority("ROLE_" + role.toUpperCase()));

                // 6. Create the authentication token object
                UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(
                        mobile, null, authorities); // Pass the authorities list
                
                // 7. Set details for the authentication context
                usernamePasswordAuthenticationToken
                        .setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                
                // 8. Set the authentication in Spring Security's context
                // This is how the rest of the application knows the user is logged in and what their role is
                SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
            }
        }
        
        // 9. Continue the filter chain, allowing the request to proceed to the controller
        chain.doFilter(request, response);
    }
}

