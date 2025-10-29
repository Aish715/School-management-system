package com.school.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.spec.SecretKeySpec;
import java.security.Key;
import java.util.Date;
import java.util.function.Function;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    private Key getSigningKey() {
        // Creates a signing key based on the secret in application.properties
        return new SecretKeySpec(secret.getBytes(), SignatureAlgorithm.HS256.getJcaName());
    }

    /**
     * Extracts the username (subject) from the token.
     */
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    /**
     * Extracts the expiration date from the token.
     */
    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    /**
     * A generic function to extract a specific claim (like username, role, expiration) from the token.
     */
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    /**
     * Parses the token to extract all claims.
     */
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    /**
     * Checks if the token has expired.
     */
    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    /**
     * Generates a new JWT for a given user.
     * @param username The user's mobile number.
     * @param role The user's role ("student", "teacher", "admin").
     * @return The generated JWT string.
     */
    public String generateToken(String username, String role) {
        return Jwts.builder()
                .setSubject(username) // The main identifier (mobile number)
                .claim("role", role)  // Add the role as a custom claim
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10)) // Set expiration (e.g., 10 hours)
                .signWith(getSigningKey(), SignatureAlgorithm.HS256) // Sign with HS256 algorithm
                .compact();
    }

    /**
     * --- UPDATED METHOD ---
     * Validates the token by checking if it has expired.
     * The username check is now handled separately in the JwtRequestFilter.
     * @param token The JWT string.
     * @return True if the token is not expired, false otherwise.
     */
    public Boolean validateToken(String token) {
        // We only need to check if it's expired.
        // The signature is implicitly checked when parsing claims in extractUsername/extractClaim.
        try {
            return !isTokenExpired(token);
        } catch (Exception e) {
            // If any error occurs during parsing (e.g., expired, malformed), it's invalid.
            return false;
        }
    }
}

