package com.streetatelier.backend.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record OrderResponse(
        Long id,
        BigDecimal total,
        String status,
        Instant createdAt,
        List<OrderItemResponse> items) {
    public record OrderItemResponse(
            Long productId,
            String productName,
            String size,
            int quantity,
            BigDecimal unitPrice) {
    }
}
