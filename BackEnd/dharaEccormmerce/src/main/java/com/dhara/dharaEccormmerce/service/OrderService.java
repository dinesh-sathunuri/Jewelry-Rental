package com.dhara.dharaEccormmerce.service;

import com.dhara.dharaEccormmerce.dto.CustomerDTO;
import com.dhara.dharaEccormmerce.dto.OrderDTO;
import com.dhara.dharaEccormmerce.entity.Customer;
import com.dhara.dharaEccormmerce.entity.Order;
import com.dhara.dharaEccormmerce.entity.Product;
import com.dhara.dharaEccormmerce.enums.OrderStatus;
import com.dhara.dharaEccormmerce.exceptions.ResourceNotFoundException;
import com.dhara.dharaEccormmerce.mapper.OrderMapper;
import com.dhara.dharaEccormmerce.repository.CustomerRepository;
import com.dhara.dharaEccormmerce.repository.OrderRepository;
import com.dhara.dharaEccormmerce.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final CustomerRepository customerRepository;
    @Transactional
    public OrderDTO createOrder(OrderDTO orderDto) {
        // 1. Handle Customer
        CustomerDTO custDto = orderDto.getCustomer();
        Customer customer = customerRepository.findByEmail(custDto.getEmail())
                .orElse(Customer.builder()
                        .fullName(custDto.getFullName())
                        .email(custDto.getEmail())
                        .phoneNumber(custDto.getPhoneNumber())
                        .build());

        // 2. Load Products and update status
        List<Product> products = productRepository.findAllById(orderDto.getProductIds());
        for (Product product : products) {
            product.setStatus(OrderStatus.RENTED);
        }

        // Save updated products
        productRepository.saveAll(products);
        System.out.println(orderDto);
        // 3. Create Order
        Order order = Order.builder()
                .customer(customer)
                .products(products)
                .totalPrice(orderDto.getTotalPrice())
                .startDate(orderDto.getStartDate())
                .endDate(orderDto.getEndDate())
                .paymentMethod(orderDto.getPaymentMethod())
                .build();

        // Persist customer (if new) and order
        customerRepository.save(customer);
        Order savedOrder=orderRepository.save(order);
        return OrderMapper.toDTO(savedOrder);
    }

    public List<OrderDTO> getAllOrders() {
        return orderRepository.findAll()
                .stream()
                .map(OrderMapper::toDTO)
                .collect(Collectors.toList());
    }

    public OrderDTO getOrderById(String id) {
        return orderRepository.findById(id).map(OrderMapper::toDTO)
                .orElseThrow(()-> new ResourceNotFoundException("Order","id",id));
    }

    public OrderDTO getProductOrderByProductId(String id) {
        Product product=productRepository.findById(id)
                .orElseThrow(()->new ResourceNotFoundException("Product","id",id));
        Order order= orderRepository.findByProductsContaining(product);
        return OrderMapper.toDTO(order);
    }
}