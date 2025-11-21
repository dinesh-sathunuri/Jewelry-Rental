package com.dhara.dharaEccormmerce.mapper;

import com.dhara.dharaEccormmerce.dto.ProductDTO;
import com.dhara.dharaEccormmerce.dto.ProductImageDTO;
import com.dhara.dharaEccormmerce.dto.ProductRequest;
import com.dhara.dharaEccormmerce.entity.Admin;
import com.dhara.dharaEccormmerce.entity.Product;
import com.dhara.dharaEccormmerce.entity.ProductImage;
import com.dhara.dharaEccormmerce.service.S3Service;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
@Component
@RequiredArgsConstructor
public class ProductMapper {

    private final S3Service s3Service;
    @Value("${aws.s3.bucket}")
    private String s3Bucket;
    public ProductDTO toDTO(Product product) {
        if (product == null) return null;

        ProductDTO dto = new ProductDTO();
        dto.setId(product.getId());
        dto.setTitle(product.getTitle());
        dto.setTag(product.getTag());
        dto.setLength(product.getLength());
        dto.setMaterial(product.getMaterial());
        dto.setDesign(product.getDesign());
        dto.setColor(product.getColor());
        dto.setStatus(product.getStatus());
        dto.setPricePerDay(product.getPricePerDay());
        dto.setComments(product.getComments());
        dto.setCreatedAt(product.getCreatedAt());
        dto.setUpdatedAt(product.getUpdatedAt());

        List<ProductImageDTO> imageDTOs = product.getProductImages().stream()
                .map(this::toImageDTOWithPresignedUrl)
                .collect(Collectors.toList());
            dto.setProductImages(imageDTOs);

        if (product.getLastModifiedBy() != null) {
            // map admin without mapping products inside admin to avoid cycle
            dto.setLastModifiedBy(AdminMapper.toDTO(product.getLastModifiedBy()));
        }

        return dto;
    }

    public Product toEntity(ProductRequest request, Admin admin) {
        if (request == null) return null;

        Product product = Product.builder()
                .id(request.getId())
                .title(request.getTitle())
                .tag(request.getTag())
                .length(request.getLength())
                .material(request.getMaterial())
                .design(request.getDesign())
                .color(request.getColor())
                .status(request.getStatus())
                .pricePerDay(request.getPricePerDay())
                .comments(request.getComments())
                .lastModifiedBy(admin)
                .productImages(new ArrayList<>())
                .build();

        return product;
    }
    public void updateEntity(Product product, ProductRequest request, Admin admin) {
        if (product == null || request == null) return;
        product.setId(request.getId());
        product.setTitle(request.getTitle());
        product.setTag(request.getTag());
        product.setLength(request.getLength());
        product.setMaterial(request.getMaterial());
        product.setDesign(request.getDesign());
        product.setColor(request.getColor());
        product.setStatus(request.getStatus());
        product.setPricePerDay(request.getPricePerDay());
        product.setComments(request.getComments());
        product.setLastModifiedBy(admin);

        // Update images only if non-null AND not empty
        if (request.getProductImages() != null && !request.getProductImages().isEmpty()) {
            product.getProductImages().clear();

            for (ProductImageDTO dto : request.getProductImages()) {
                ProductImage image = ProductImageMapper.toEntity(dto);
                product.getProductImages().add(image);
            }
        }
    }
    private ProductImageDTO toImageDTOWithPresignedUrl(ProductImage image) {
        ProductImageDTO imageDTO = new ProductImageDTO();
        imageDTO.setId(image.getId());

        // Extract key from imageUrl
        String key = extractKeyFromUrl(image.getImageUrl());

        // Generate pre-signed URL
        String presignedUrl = s3Service.generatePresignedUrl(s3Bucket, key);

        imageDTO.setImageUrl(presignedUrl);

        return imageDTO;
    }
    public String extractKeyFromUrl(String url) {
        // Assuming your url is like https://bucket-name.s3.amazonaws.com/key
        String prefix = "https://" + s3Bucket + ".s3.amazonaws.com/";
        if (url.startsWith(prefix)) {
            return url.substring(prefix.length());
        }
        return url; // fallback
    }

}
