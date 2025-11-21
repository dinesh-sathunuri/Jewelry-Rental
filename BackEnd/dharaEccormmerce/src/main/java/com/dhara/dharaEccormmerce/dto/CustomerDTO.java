package com.dhara.dharaEccormmerce.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CustomerDTO {
    private Integer id;
    private String fullName;
    private String email;
    private String phoneNumber;
    private List<OrderDTO> orders;
}
