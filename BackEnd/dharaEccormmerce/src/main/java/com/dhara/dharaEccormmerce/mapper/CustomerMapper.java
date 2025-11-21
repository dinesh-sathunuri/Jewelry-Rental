package com.dhara.dharaEccormmerce.mapper;

import com.dhara.dharaEccormmerce.dto.CustomerDTO;
import com.dhara.dharaEccormmerce.entity.Customer;

import java.util.stream.Collectors;

public class CustomerMapper {

    public static CustomerDTO toDTO(Customer customer) {
        if (customer == null) return null;

        return CustomerDTO.builder()
                .id(customer.getId())
                .fullName(customer.getFullName())
                .email(customer.getEmail())
                .phoneNumber(customer.getPhoneNumber())
                .orders(null)
                .build();
    }

    public static Customer toEntity(CustomerDTO dto) {
        if (dto == null) return null;

        return Customer.builder()
                .id(dto.getId())
                .fullName(dto.getFullName())
                .email(dto.getEmail())
                .phoneNumber(dto.getPhoneNumber())
                .orders(dto.getOrders() == null ? null :
                        dto.getOrders().stream()
                                .map(OrderMapper::toEntity)
                                .collect(Collectors.toList()))
                .build();
    }
}
