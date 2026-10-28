package com.streetatelier.backend.repository;

import com.streetatelier.backend.entity.Product;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProductRepository extends JpaRepository<Product, Long> {
    Optional<Product> findBySlug(String slug);

    List<Product> findByFeaturedTrueOrderByCreatedAtDesc();

    @Query("""
        SELECT p FROM Product p
        WHERE (:category IS NULL OR p.category.slug = :category)
          AND (:brand IS NULL OR LOWER(p.brand) = LOWER(:brand))
          AND (:q IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :q, '%'))
               OR LOWER(p.brand) LIKE LOWER(CONCAT('%', :q, '%'))
               OR LOWER(p.colorway) LIKE LOWER(CONCAT('%', :q, '%')))
          AND (:minPrice IS NULL OR p.price >= :minPrice)
          AND (:maxPrice IS NULL OR p.price <= :maxPrice)
        ORDER BY p.createdAt DESC
        """)
    List<Product> search(
            @Param("category") String category,
            @Param("brand") String brand,
            @Param("q") String q,
            @Param("minPrice") java.math.BigDecimal minPrice,
            @Param("maxPrice") java.math.BigDecimal maxPrice);
}
