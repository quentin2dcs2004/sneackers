package com.streetatelier.backend.service;

import com.streetatelier.backend.dto.CategoryResponse;
import com.streetatelier.backend.dto.ProductResponse;
import com.streetatelier.backend.entity.Product;
import com.streetatelier.backend.exception.ResourceNotFoundException;
import com.streetatelier.backend.repository.CategoryRepository;
import com.streetatelier.backend.repository.ProductRepository;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class ProductService {
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public ProductService(ProductRepository productRepository, CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    public List<ProductResponse> search(String category, String brand, String q, BigDecimal minPrice, BigDecimal maxPrice) {
        return productRepository.search(emptyToNull(category), emptyToNull(brand), emptyToNull(q), minPrice, maxPrice)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public ProductResponse getBySlug(String slug) {
        return productRepository.findBySlug(slug)
                .map(this::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Produit introuvable"));
    }

    public List<ProductResponse> featured() {
        return productRepository.findByFeaturedTrueOrderByCreatedAtDesc().stream().map(this::toResponse).toList();
    }

    public List<CategoryResponse> categories() {
        return categoryRepository.findAll().stream()
                .map(c -> new CategoryResponse(c.getId(), c.getSlug(), c.getName()))
                .toList();
    }

    public ProductResponse toResponse(Product p) {
        return new ProductResponse(
                p.getId(),
                p.getSlug(),
                p.getName(),
                p.getBrand(),
                p.getPrice(),
                p.getDescription(),
                p.getImageUrl(),
                p.getImageUrlAlt(),
                p.getCategory().getSlug(),
                p.getCategory().getName(),
                p.isFeatured(),
                p.getColorway());
    }

    private static String emptyToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
