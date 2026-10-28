package com.streetatelier.backend.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record OrderItemRequest(
        @NotNull Long productId,
        @NotBlank String size,
        @Min(1) int quantity) {
}
