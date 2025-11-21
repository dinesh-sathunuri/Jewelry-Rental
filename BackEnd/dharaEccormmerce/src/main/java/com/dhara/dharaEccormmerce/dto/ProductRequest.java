package com.dhara.dharaEccormmerce.dto;

import com.dhara.dharaEccormmerce.enums.OrderStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class ProductRequest {

    private String id;
    @NotNull
    private String length;
    private String title;
    @NotBlank
    private List<String> tag;
    @NotBlank
    private String material;

    @NotBlank
    private List<String> design;

    @NotBlank
    private List<String> color;

    @NotNull
    private OrderStatus status;

    @NotNull
    private Long pricePerDay;

    private String comments;

    // 👇 New: List of product images to attach/update
    private List<ProductImageDTO> productImages;
    private List<Integer> removedImageIds;

    // 👇 New: Admin ID who modifies the product
    @NotNull
    private Integer adminId;
}
