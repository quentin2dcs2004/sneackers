package com.streetatelier.backend.dto;

import java.math.BigDecimal;

public record ProductResponse(
        Long id,
        String slug,
        String name,
        String brand,
        BigDecimal price,
        String description,
        String imageUrl,
        String imageUrlAlt,
        String categorySlug,
        String categoryName,
        boolean featured,
        String colorway) {
}
