package com.dhara.dharaEccormmerce.dto;

import com.dhara.dharaEccormmerce.entity.Admin;
import com.dhara.dharaEccormmerce.enums.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductDTO {
    private String id;
    private String title;
    private List<String> tag;
    private String length;
    private String material;
    private List<String> design;
    private List<String> color;
    private OrderStatus status;
    private Long pricePerDay;
    private String comments;
    private List<ProductImageDTO> productImages;
    private AdminDTO lastModifiedBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
