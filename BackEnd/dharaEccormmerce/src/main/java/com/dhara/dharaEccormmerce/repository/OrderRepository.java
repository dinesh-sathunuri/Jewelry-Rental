package com.dhara.dharaEccormmerce.repository;

import com.dhara.dharaEccormmerce.dto.OrderDTO;
import com.dhara.dharaEccormmerce.entity.Order;
import com.dhara.dharaEccormmerce.entity.Product;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order,String> {

    Order findByProductsContaining(Product product);

    @EntityGraph(attributePaths = "products")
    Optional<Order> findById(String id);
}
