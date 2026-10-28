package com.streetatelier.backend.service;

import com.streetatelier.backend.dto.OrderRequest;
import com.streetatelier.backend.dto.OrderResponse;
import com.streetatelier.backend.entity.OrderItem;
import com.streetatelier.backend.entity.Product;
import com.streetatelier.backend.entity.ShopOrder;
import com.streetatelier.backend.entity.User;
import com.streetatelier.backend.exception.ResourceNotFoundException;
import com.streetatelier.backend.repository.OrderRepository;
import com.streetatelier.backend.repository.ProductRepository;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OrderService {
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    public OrderService(OrderRepository orderRepository, ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
    }

    @Transactional
    public OrderResponse create(User user, OrderRequest request) {
        ShopOrder order = ShopOrder.builder()
                .user(user)
                .total(BigDecimal.ZERO)
                .status("PENDING")
                .items(new ArrayList<>())
                .build();

        BigDecimal total = BigDecimal.ZERO;
        for (var line : request.items()) {
            Product product = productRepository.findById(line.productId())
                    .orElseThrow(() -> new ResourceNotFoundException("Produit #" + line.productId() + " introuvable"));
            OrderItem item = OrderItem.builder()
                    .order(order)
                    .product(product)
                    .size(line.size().trim())
                    .quantity(line.quantity())
                    .unitPrice(product.getPrice())
                    .build();
            order.getItems().add(item);
            total = total.add(product.getPrice().multiply(BigDecimal.valueOf(line.quantity())));
        }
        order.setTotal(total);
        order = orderRepository.save(order);
        return toResponse(order);
    }

    private OrderResponse toResponse(ShopOrder order) {
        List<OrderResponse.OrderItemResponse> items = order.getItems().stream()
                .map(i -> new OrderResponse.OrderItemResponse(
                        i.getProduct().getId(),
                        i.getProduct().getName(),
                        i.getSize(),
                        i.getQuantity(),
                        i.getUnitPrice()))
                .toList();
        return new OrderResponse(order.getId(), order.getTotal(), order.getStatus(), order.getCreatedAt(), items);
    }
}
