# Street Atelier

Concept store e-commerce **sneakers uniquement** — expérience visuelle premium (menu fullscreen, slider 3D, micro-interactions), API Spring Boot.

Marque originale. Projet indépendant.

## Stack

| App | Techno |
|-----|--------|
| `apps/frontend` | Angular 22 · SCSS · Three.js · GSAP |
| `apps/backend` | Spring Boot 4.1 · Java 21 · JPA · JWT · H2 |

## Démarrage

```bash
# API
cd apps/backend
mvn spring-boot:run
# http://localhost:8080  ·  Swagger: /swagger-ui.html

# Front
cd apps/frontend
npm install
npm start
# http://localhost:4200
```

Viewport recommandé : **1280 × 800**.

## API `/api`

- `GET /products` — filtres `category`, `brand`, `q`, `minPrice`, `maxPrice`
- `GET /products/featured`
- `GET /products/{slug}`
- `GET /categories`
- `POST /auth/register` · `POST /auth/login` · `GET /auth/me`
- `POST /orders` (JWT)
