package com.streetatelier.backend.service;

import com.streetatelier.backend.dto.AuthResponse;
import com.streetatelier.backend.dto.LoginRequest;
import com.streetatelier.backend.dto.RegisterRequest;
import com.streetatelier.backend.dto.UserResponse;
import com.streetatelier.backend.entity.User;
import com.streetatelier.backend.repository.UserRepository;
import com.streetatelier.backend.security.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public AuthResponse register(RegisterRequest request) {
        String email = request.email().trim().toLowerCase();
        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Un compte existe déjà avec cet email");
        }
        User user = User.builder()
                .email(email)
                .fullName(request.fullName().trim())
                .passwordHash(passwordEncoder.encode(request.password()))
                .build();
        user = userRepository.save(user);
        return toAuth(user);
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmailIgnoreCase(request.email().trim())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Email ou mot de passe incorrect"));
        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Email ou mot de passe incorrect");
        }
        return toAuth(user);
    }

    public UserResponse me(User user) {
        return new UserResponse(user.getId(), user.getEmail(), user.getFullName());
    }

    private AuthResponse toAuth(User user) {
        String token = jwtService.generateToken(user.getId(), user.getEmail());
        return new AuthResponse(token, "Bearer", jwtService.getExpirationMs(), me(user));
    }
}
