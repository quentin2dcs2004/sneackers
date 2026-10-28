package com.streetatelier.backend.controller;

import com.streetatelier.backend.dto.OrderRequest;
import com.streetatelier.backend.dto.OrderResponse;
import com.streetatelier.backend.entity.User;
import com.streetatelier.backend.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public OrderResponse create(Authentication authentication, @Valid @RequestBody OrderRequest request) {
        return orderService.create((User) authentication.getPrincipal(), request);
    }
}
