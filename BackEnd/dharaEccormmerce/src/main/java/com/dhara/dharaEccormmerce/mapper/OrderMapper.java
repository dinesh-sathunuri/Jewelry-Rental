package com.dhara.dharaEccormmerce.mapper;

import com.dhara.dharaEccormmerce.dto.OrderDTO;
import com.dhara.dharaEccormmerce.entity.Order;
import com.dhara.dharaEccormmerce.entity.Product;

import java.util.List;
import java.util.stream.Collectors;

public class OrderMapper {

    public static OrderDTO toDTO(Order order) {
        if (order == null) return null;

        return OrderDTO.builder()
                .id(order.getId())
                .totalPrice(order.getTotalPrice())
                .startDate(order.getStartDate())
                .endDate(order.getEndDate())
                .paymentMethod(order.getPaymentMethod())
                .customer(order.getCustomer() != null ? CustomerMapper.toDTO(order.getCustomer()) : null)
                .productIds(order.getProducts() == null ? null :
                        order.getProducts().stream()
                                .map(Product::getId)
                                .collect(Collectors.toList()))
                .createdAt(order.getCreatedAt())
                .build();
    }

    public static Order toEntity(OrderDTO dto) {
        if (dto == null) return null;
        return Order.builder()
                .id(dto.getId())
                .totalPrice(dto.getTotalPrice())
                .startDate(dto.getStartDate())
                .endDate(dto.getEndDate())
                .paymentMethod(dto.getPaymentMethod())
                .customer(CustomerMapper.toEntity(dto.getCustomer()))
                .createdAt(dto.getCreatedAt())
                .build();
    }
}
