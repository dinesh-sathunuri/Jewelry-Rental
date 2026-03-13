package com.dhara.dharaEccormmerce.dto;

import com.dhara.dharaEccormmerce.enums.OrderStatus;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.util.List;

@Data
public class ProductRequest {

    // Only present on update — not required on create
    private String id;

    @NotBlank(message = "Length is required")
    private String length;

    @NotBlank(message = "Title is required")
    private String title;

    @NotNull(message = "At least one tag is required")
    @Size(min = 1, message = "At least one tag is required")
    private List<String> tag;

    @NotBlank(message = "Material is required")
    private String material;

    @NotNull(message = "At least one design is required")
    @Size(min = 1, message = "At least one design is required")
    private List<String> design;

    @NotNull(message = "At least one colour is required")
    @Size(min = 1, message = "At least one colour is required")
    private List<String> color;

    @NotNull(message = "Status is required")
    private OrderStatus status;

    @NotNull(message = "Price per day is required")
    @Positive(message = "Price per day must be greater than zero")
    private Long pricePerDay;

    private String comments;

    // Existing images to keep (used on update)
    private List<ProductImageDTO> productImages;

    // IDs of images to delete from S3 (used on update)
    private List<Integer> removedImageIds;

    @NotNull(message = "Admin ID is required")
    private Integer adminId;
}