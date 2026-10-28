package com.streetatelier.backend.controller;

import com.streetatelier.backend.dto.CategoryResponse;
import com.streetatelier.backend.dto.ProductResponse;
import com.streetatelier.backend.service.ProductService;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class ProductController {
    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping("/products")
    public List<ProductResponse> list(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) String q,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice) {
        return productService.search(category, brand, q, minPrice, maxPrice);
    }

    @GetMapping("/products/featured")
    public List<ProductResponse> featured() {
        return productService.featured();
    }

    @GetMapping("/products/{slug}")
    public ProductResponse bySlug(@PathVariable String slug) {
        return productService.getBySlug(slug);
    }

    @GetMapping("/categories")
    public List<CategoryResponse> categories() {
        return productService.categories();
    }
}
