package org.main.claimstreams.configs;

import lombok.RequiredArgsConstructor;
import org.main.claimstreams.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity security) throws Exception {
        security
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/v1/auth/**", "/claimstream-websocket/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/v1/claims").hasAnyAuthority("ROLE_CUSTOMER", "ROLE_ADJUSTER", "ROLE_SENIOR_ADJUSTER")
                        .requestMatchers(HttpMethod.GET, "/api/v1/claims/my-claims").hasAnyAuthority("ROLE_CUSTOMER")
                        .requestMatchers("/api/v1/adjuster/**").hasAnyAuthority("ROLE_ADJUSTER")
                        .requestMatchers("/api/v1/senior-adjuster/**").hasAnyAuthority("ROLE_SENIOR_ADJUSTER")
                        .anyRequest().authenticated()
                );
        security.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return security.build();
    }
}
