package com.streetatelier.backend.config;

import com.streetatelier.backend.entity.Category;
import com.streetatelier.backend.entity.Product;
import com.streetatelier.backend.repository.CategoryRepository;
import com.streetatelier.backend.repository.ProductRepository;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    public DataSeeder(CategoryRepository categoryRepository, ProductRepository productRepository) {
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
    }

    @Override
    public void run(String... args) {
        if (productRepository.count() > 0) {
            return;
        }

        Category sneakers = categoryRepository.save(Category.builder().slug("sneakers").name("Sneakers").build());
        Category runners = categoryRepository.save(Category.builder().slug("runners").name("Runners").build());
        Category highs = categoryRepository.save(Category.builder().slug("high-tops").name("High Tops").build());

        List<Product> products = List.of(
                product("void-runner-01", "Void Runner 01", "ATELIER", "189.00", sneakers, true,
                        "Obsidian / Bone",
                        "Silhouette basse, mesh technique et semelle sculptee. Edition limitee atelier.",
                        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&q=80",
                        "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=1200&q=80"),
                product("neon-pulse", "Neon Pulse", "FLUX", "210.00", runners, true,
                        "Black / Volt",
                        "Amorti reactif, upper knit, accents neon. Concue pour la nuit urbaine.",
                        "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=1200&q=80",
                        "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=1200&q=80"),
                product("ghost-lace", "Ghost Lace", "NOIR", "175.00", sneakers, true,
                        "Ivory / Smoke",
                        "Cuir pleine fleur, lacets ton-sur-ton, profil fantome.",
                        "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=1200&q=80",
                        "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=1200&q=80"),
                product("carbon-drift", "Carbon Drift", "KINETIC", "245.00", runners, true,
                        "Carbon / Ice",
                        "Plaque carbone legere, grip trail-city hybride.",
                        "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=1200&q=80",
                        "https://images.unsplash.com/photo-1539185441755-769473a23570?w=1200&q=80"),
                product("slate-dunk", "Slate Dunk", "ATELIER", "160.00", sneakers, true,
                        "Slate / White",
                        "Classique revisite, semelle cupsole et panneau suede.",
                        "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=1200&q=80",
                        "https://images.unsplash.com/photo-1579338559193-77d2711c6c5e?w=1200&q=80"),
                product("mirror-high", "Mirror High", "FLUX", "198.00", highs, true,
                        "Chrome / Black",
                        "Montante miroir, col rembourre, languette signature.",
                        "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=1200&q=80",
                        "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=1200&q=80"),
                product("amber-court", "Amber Court", "NOIR", "168.00", sneakers, false,
                        "Amber / Clay",
                        "Cuir lisse, outsole gum, profil court heritage.",
                        "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=1200&q=80",
                        "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=1200&q=80"),
                product("fog-glide", "Fog Glide", "KINETIC", "220.00", runners, false,
                        "Fog / Silver",
                        "Mousse responsive, cage breathable, finition mist.",
                        "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=1200&q=80",
                        "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=1200&q=80"),
                product("onyx-boost", "Onyx Boost", "ATELIER", "205.00", runners, false,
                        "Onyx / White",
                        "Cushion boost, upper woven, lace lock system.",
                        "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=1200&q=80",
                        "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=1200&q=80"),
                product("rift-mid", "Rift Mid", "FLUX", "185.00", highs, false,
                        "Rift / Sand",
                        "Mi-montante urbaine, padded collar, gum foxing.",
                        "https://images.unsplash.com/photo-1579338559193-77d2711c6c5e?w=1200&q=80",
                        "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1200&q=80"),
                product("luna-low", "Luna Low", "NOIR", "155.00", sneakers, false,
                        "Luna / Pearl",
                        "Low clean, panneau nappa, semelle ivoire.",
                        "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=1200&q=80",
                        "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=1200&q=80"),
                product("volt-strike", "Volt Strike", "KINETIC", "230.00", runners, false,
                        "Volt / Black",
                        "Speed silhouette, plate midfoot, grip agressif.",
                        "https://images.unsplash.com/photo-1539185441755-769473a23570?w=1200&q=80",
                        "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=1200&q=80"));

        productRepository.saveAll(products);
    }

    private Product product(
            String slug,
            String name,
            String brand,
            String price,
            Category category,
            boolean featured,
            String colorway,
            String description,
            String imageUrl,
            String imageUrlAlt) {
        return Product.builder()
                .slug(slug)
                .name(name)
                .brand(brand)
                .price(new BigDecimal(price))
                .category(category)
                .featured(featured)
                .colorway(colorway)
                .description(description)
                .imageUrl(imageUrl)
                .imageUrlAlt(imageUrlAlt)
                .build();
    }
}
