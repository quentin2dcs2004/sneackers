package com.streetatelier.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 140)
    private String slug;

    @Column(nullable = false, length = 180)
    private String name;

    @Column(nullable = false, length = 80)
    private String brand;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(nullable = false, length = 2000)
    private String description;

    @Column(nullable = false, length = 500)
    private String imageUrl;

    @Column(length = 500)
    private String imageUrlAlt;

    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private Category category;

    @Column(nullable = false)
    private boolean featured;

    @Column(nullable = false, length = 80)
    private String colorway;

    @Column(nullable = false)
    private Instant createdAt;

    @PrePersist
    void onCreate() {
        if (createdAt == null) {
            createdAt = Instant.now();
        }
    }
}
