package com.streetatelier.backend.dto;

public record AuthResponse(String accessToken, String tokenType, long expiresInMs, UserResponse user) {
}
