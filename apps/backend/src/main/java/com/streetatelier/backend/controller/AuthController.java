package com.streetatelier.backend.controller;

import com.streetatelier.backend.dto.AuthResponse;
import com.streetatelier.backend.dto.LoginRequest;
import com.streetatelier.backend.dto.RegisterRequest;
import com.streetatelier.backend.dto.UserResponse;
import com.streetatelier.backend.entity.User;
import com.streetatelier.backend.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public AuthResponse register(@Valid @RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @GetMapping("/me")
    public UserResponse me(Authentication authentication) {
        return authService.me((User) authentication.getPrincipal());
    }
}
