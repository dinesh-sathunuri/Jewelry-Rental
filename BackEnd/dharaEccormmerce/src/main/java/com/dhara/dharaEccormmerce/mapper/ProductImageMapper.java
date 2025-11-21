package com.dhara.dharaEccormmerce.mapper;

import com.dhara.dharaEccormmerce.dto.ProductImageDTO;
import com.dhara.dharaEccormmerce.entity.Product;
import com.dhara.dharaEccormmerce.entity.ProductImage;

public class ProductImageMapper {

    public static ProductImageDTO toDTO(ProductImage image) {
        if (image == null) return null;

        return ProductImageDTO.builder()
                .id(image.getId())
                .imageUrl(image.getImageUrl())
                .build();
    }

    public static ProductImage toEntity(ProductImageDTO dto) {
        if (dto == null) return null;

        return ProductImage.builder()
                .id(dto.getId())
                .imageUrl(dto.getImageUrl())
                .build();
    }
}
