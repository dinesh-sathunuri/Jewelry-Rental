package com.dhara.dharaEccormmerce.service;

import com.dhara.dharaEccormmerce.dto.CustomerDTO;
import com.dhara.dharaEccormmerce.dto.OrderDTO;
import com.dhara.dharaEccormmerce.entity.Customer;
import com.dhara.dharaEccormmerce.entity.Order;
import com.dhara.dharaEccormmerce.entity.Product;
import com.dhara.dharaEccormmerce.enums.OrderStatus;
import com.dhara.dharaEccormmerce.exceptions.BadRequestException;
import com.dhara.dharaEccormmerce.exceptions.ResourceNotFoundException;
import com.dhara.dharaEccormmerce.mapper.OrderMapper;
import com.dhara.dharaEccormmerce.repository.CustomerRepository;
import com.dhara.dharaEccormmerce.repository.OrderRepository;
import com.dhara.dharaEccormmerce.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository    orderRepository;
    private final ProductRepository  productRepository;
    private final CustomerRepository customerRepository;

    // ── Create ───────────────────────────────────────────────────────────────

    @Transactional
    @Caching(evict = {
            @CacheEvict(value = "orders",   key = "'all'"),
            @CacheEvict(value = "products", key = "'all'")   // product statuses change
    })
    public OrderDTO createOrder(OrderDTO orderDto) {
        validateOrderRequest(orderDto);

        // Find or create customer by e-mail (idempotent)
        CustomerDTO custDto = orderDto.getCustomer();
        Customer customer = customerRepository.findByEmail(custDto.getEmail())
                .orElse(Customer.builder()
                        .fullName(custDto.getFullName())
                        .email(custDto.getEmail())
                        .phoneNumber(custDto.getPhoneNumber())
                        .build());

        // Validate products exist and are available
        List<Product> products = productRepository.findAllById(orderDto.getProductIds());
        if (products.size() != orderDto.getProductIds().size()) {
            throw new BadRequestException("One or more product IDs are invalid");
        }
        List<String> unavailable = products.stream()
                .filter(p -> p.getStatus() != OrderStatus.AVAILABLE)
                .map(Product::getId)
                .collect(Collectors.toList());
        if (!unavailable.isEmpty()) {
            throw new BadRequestException("Products not available for rent: " + unavailable);
        }

        // Mark products as rented
        products.forEach(p -> p.setStatus(OrderStatus.RENTED));
        productRepository.saveAll(products);

        customerRepository.save(customer);

        Order order = Order.builder()
                .customer(customer)
                .products(products)
                .totalPrice(orderDto.getTotalPrice())
                .startDate(orderDto.getStartDate())
                .endDate(orderDto.getEndDate())
                .paymentMethod(orderDto.getPaymentMethod())
                .build();

        return OrderMapper.toDTO(orderRepository.save(order));
    }

    // ── Reads ────────────────────────────────────────────────────────────────

    @Cacheable(value = "orders", key = "'all'")
    public List<OrderDTO> getAllOrders() {
        log.debug("Cache MISS — loading all orders from DB");
        return orderRepository.findAll()
                .stream()
                .map(OrderMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Cacheable(value = "orders", key = "#id")
    public OrderDTO getOrderById(String id) {
        log.debug("Cache MISS — loading order {} from DB", id);
        return orderRepository.findById(id)
                .map(OrderMapper::toDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", id));
    }

    public OrderDTO getProductOrderByProductId(String productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", productId));
        Order order = orderRepository.findByProductsContaining(product);
        if (order == null) {
            throw new ResourceNotFoundException("Order", "productId", productId);
        }
        return OrderMapper.toDTO(order);
    }

    // ── Validation ───────────────────────────────────────────────────────────

    private void validateOrderRequest(OrderDTO dto) {
        if (dto.getCustomer() == null) {
            throw new BadRequestException("Customer information is required");
        }
        if (dto.getCustomer().getEmail() == null || dto.getCustomer().getEmail().isBlank()) {
            throw new BadRequestException("Customer email is required");
        }
        if (dto.getProductIds() == null || dto.getProductIds().isEmpty()) {
            throw new BadRequestException("At least one product must be specified");
        }
        if (dto.getStartDate() == null || dto.getEndDate() == null) {
            throw new BadRequestException("Start date and end date are required");
        }
        if (dto.getEndDate().isBefore(dto.getStartDate())) {
            throw new BadRequestException("End date must be after start date");
        }
        if (dto.getTotalPrice() == null || dto.getTotalPrice().signum() <= 0) {
            throw new BadRequestException("Total price must be greater than zero");
        }
    }
}