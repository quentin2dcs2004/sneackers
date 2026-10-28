package com.streetatelier.backend.repository;

import com.streetatelier.backend.entity.ShopOrder;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<ShopOrder, Long> {
}
