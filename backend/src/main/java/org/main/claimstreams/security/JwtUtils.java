package org.main.claimstreams.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.main.claimstreams.models.enums.UserRole;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.time.Instant;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtUtils {
    private final SecretKey key = Keys.hmacShaKeyFor("ClaimStreamSecretKeyForEnterpriseSecurityRbac2026!".getBytes());

    public String generateToken(String email, UserRole role, String policyNumber) {

        Map<String, String> claimsMap = new HashMap<>();
        claimsMap.put("role", role.name());
        claimsMap.put("policyNumber", policyNumber);

        long jwtExpirationMs = 8640000;
        return Jwts.builder()
                .subject(email)
                .claims(claimsMap)
                .issuedAt(new Date())
                .expiration(Date.from(Instant.now().plusMillis(jwtExpirationMs)))
                .signWith(key)
                .compact();

    }

    public String getEmailFromToken(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    public String getRoleFromToken(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .get("role", String.class);
    }

    public boolean validateJwtToken(String authToken) {
        try {
            Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(authToken);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            System.err.println("Invalid JWT token signature/expiration" + e.getMessage());
        }
        return false;
    }
}
