package com.dhara.dharaEccormmerce.controller;

import com.dhara.dharaEccormmerce.dto.OrderDTO;
import com.dhara.dharaEccormmerce.entity.Order;
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

    @PostMapping
    public ResponseEntity<OrderDTO> createOrder(@RequestBody OrderDTO orderDto) {
        OrderDTO savedOrder = orderService.createOrder(orderDto);
        return ResponseEntity.ok(savedOrder);
    }
    @GetMapping
    public  ResponseEntity<List<OrderDTO>> getAllOrder()
    {
        List<OrderDTO> AllOrders= orderService.getAllOrders();
        return ResponseEntity.ok(AllOrders);
    }
    @GetMapping("/{id}")
    public ResponseEntity<OrderDTO> getOrderById(@PathVariable String id)
    {
        OrderDTO order=orderService.getOrderById(id);
        return ResponseEntity.ok(order);
    }

    @GetMapping("product/{productId}")
    public ResponseEntity<OrderDTO> getProductOrderByProductId(@PathVariable String id){
        OrderDTO orderDTO=orderService.getProductOrderByProductId(id);
        return ResponseEntity.ok(orderDTO);
    }
}