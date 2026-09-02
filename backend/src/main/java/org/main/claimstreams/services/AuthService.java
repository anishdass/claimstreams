package org.main.claimstreams.services;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.main.claimstreams.dtos.*;
import org.main.claimstreams.exception.UserNotFoundException;
import org.main.claimstreams.models.User;
import org.main.claimstreams.repositories.UserRepository;
import org.main.claimstreams.security.JwtUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder encoder;
    private final JwtUtils jwtUtils;
    private final PasswordEncoder passwordEncoder;

    @Value("${DEFAULT_PASSWORD}")
    private String defaultPassword;

    public ResponseEntity<?> login(LoginRequestDto request) {
        User user = userRepository.findByEmail(request.email()).orElseThrow(() ->
                new UserNotFoundException("User with email " + request.email() + " not found")
        );

        if (!encoder.matches(request.password(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                    "status", "FAILED",
                    "message", "Invalid credentials"
            ));
        }

        String token = jwtUtils.generateToken(user.getEmail(), user.getRole());
        boolean isDefaultPassword = encoder.matches(defaultPassword, user.getPassword());

        UserResponseDto userResponseDto = new UserResponseDto(
                user.getRole(),
                user.getEmail(),
                user.getFullName(),
                isDefaultPassword,
                user.getPolicies(),
                user.getClaims()
        );

        AuthResponseDto response = new AuthResponseDto(
                token,
                userResponseDto);


        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    public ResponseEntity<Map<String, String>> register(RegisterRequestDto request) {
        if (userRepository.existsByEmail(request.email())) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Email already registered"));
        }

        String passwordPattern = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!]).*$";

        if (request.password() == null || request.password().isBlank() ||
                request.password().length() < 8 || request.password().length() > 32 ||
                !request.password().matches(passwordPattern)) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of(
                            "status", "failed",
                            "error", "Password must be 8-16 characters and contain at least one uppercase letter, one lowercase letter, one digit, and one special character."
                    ));
        }

        String encodedPassword = passwordEncoder.encode(request.password());

        User newUser = new User(request.email(), encodedPassword, request.fullName(), request.role());
        userRepository.save(newUser);

        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "message", "User " + newUser.getFullName() + " created with role: " + newUser.getRole().name()
        ));
    }

    @Transactional
    public ResponseEntity<Map<String, String>> changePassword(Authentication auth, ChangePasswordRequestDto request) {

        if (request.newPassword().equals("Defaultpassword1!")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                    "status", "FAILED",
                    "message", "The password cannot be " + request.newPassword()
            ));
        }

        String passwordPattern = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!]).*$";

        if (request.newPassword().isBlank() ||
                request.newPassword().length() < 8 || request.newPassword().length() > 32 ||
                !request.newPassword().matches(passwordPattern)) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of(
                            "status", "failed",
                            "error", "Password must be 8-16 characters and contain at least one uppercase letter, one lowercase letter, one digit, and one special character."
                    ));
        }

        String email = auth.getName();

        User user = userRepository.findByEmail(email).orElseThrow(() ->
                new UserNotFoundException("User with email " + email + " not found")
        );

        if (!encoder.matches(request.oldPassword(), user.getPassword())) {
            ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                            "status", "FAILED",
                            "message", "Old password is incorrect"
                    ));
        }

        String newPassword = encoder.encode(request.newPassword());
        user.setPassword(newPassword);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(Map.of(
                        "status", "SUCCESS",
                        "message", "Password changed"
                ));
    }
}
