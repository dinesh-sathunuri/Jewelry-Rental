package com.dhara.dharaEccormmerce.controller;

import com.dhara.dharaEccormmerce.dto.OrderDTO;
import com.dhara.dharaEccormmerce.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    /** Public — customers place orders without logging in. */
    @PostMapping
    public ResponseEntity<OrderDTO> createOrder(@RequestBody OrderDTO orderDto) {
        return ResponseEntity.ok(orderService.createOrder(orderDto));
    }

    @GetMapping
    public ResponseEntity<List<OrderDTO>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderDTO> getOrderById(@PathVariable String id) {
        return ResponseEntity.ok(orderService.getOrderById(id));
    }

    /**
     * Bug fix: original had @PathVariable String id on a route with {productId},
     * so the variable was never bound and always null.
     */
    @GetMapping("/product/{productId}")
    public ResponseEntity<OrderDTO> getOrderByProductId(@PathVariable String productId) {
        return ResponseEntity.ok(orderService.getProductOrderByProductId(productId));
    }
}