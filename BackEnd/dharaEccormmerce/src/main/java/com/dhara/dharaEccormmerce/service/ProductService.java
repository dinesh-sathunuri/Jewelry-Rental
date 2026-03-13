package com.dhara.dharaEccormmerce.service;

import com.dhara.dharaEccormmerce.dto.ProductDTO;
import com.dhara.dharaEccormmerce.dto.ProductRequest;
import com.dhara.dharaEccormmerce.entity.Admin;
import com.dhara.dharaEccormmerce.entity.Product;
import com.dhara.dharaEccormmerce.entity.ProductImage;
import com.dhara.dharaEccormmerce.exceptions.ResourceNotFoundException;
import com.dhara.dharaEccormmerce.mapper.ProductMapper;
import com.dhara.dharaEccormmerce.repository.AdminRepository;
import com.dhara.dharaEccormmerce.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final AdminRepository    adminRepository;
    private final S3Service          s3Service;
    private final ProductMapper      productMapper;

    @Value("${aws.s3.bucket}")
    private String s3Bucket;

    // ── Reads ────────────────────────────────────────────────────────────────

    /**
     * Caches the full product list under key "products::all".
     * TTL = 60 min (see RedisConfig).
     */
    @Cacheable(value = "products", key = "'all'")
    public List<ProductDTO> getAllProducts() {
        log.debug("Cache MISS — loading all products from DB");
        return productRepository.findAll()
                .stream()
                .map(productMapper::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Caches a single product under "product::<id>".
     */
    @Cacheable(value = "product", key = "#id")
    public ProductDTO getProductById(String id) {
        log.debug("Cache MISS — loading product {} from DB", id);
        return productRepository.findById(id)
                .map(productMapper::toDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));
    }

    // ── Writes ───────────────────────────────────────────────────────────────

    /**
     * Create: evict the full-list cache so the next getAllProducts() reloads.
     */
    @Transactional
    @CacheEvict(value = "products", key = "'all'")
    public ProductDTO createProduct(ProductRequest request, List<MultipartFile> imageFiles)
            throws IOException {

        Admin admin = findAdmin(request.getAdminId());
        Product product = productMapper.toEntity(request, admin);
        product.setProductImages(uploadImages(imageFiles));
        return productMapper.toDTO(productRepository.save(product));
    }

    /**
     * Update: refresh the single-product entry AND evict the list cache.
     */
    @Transactional
    @Caching(
            put   = { @CachePut(value = "product", key = "#request.id") },
            evict = { @CacheEvict(value = "products", key = "'all'") }
    )
    public ProductDTO updateProduct(ProductRequest request, List<MultipartFile> imageFiles)
            throws IOException {

        Product product = productRepository.findById(request.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", request.getId()));
        Admin admin = findAdmin(request.getAdminId());

        productMapper.updateEntity(product, request, admin);

        // Remove images that the client flagged for deletion
        if (request.getRemovedImageIds() != null && !request.getRemovedImageIds().isEmpty()) {
            List<ProductImage> toRemove = product.getProductImages().stream()
                    .filter(img -> request.getRemovedImageIds().contains(img.getId()))
                    .collect(Collectors.toList());
            for (ProductImage img : toRemove) {
                product.getProductImages().remove(img);
                s3Service.deleteFile(s3Bucket, productMapper.extractKeyFromUrl(img.getImageUrl()));
            }
        }

        // Upload any new images
        if (imageFiles != null && !imageFiles.isEmpty()) {
            product.getProductImages().addAll(uploadImages(imageFiles));
        }

        return productMapper.toDTO(productRepository.save(product));
    }

    /**
     * Delete: evict both cache entries.
     */
    @Transactional
    @Caching(evict = {
            @CacheEvict(value = "product",  key = "#productId"),
            @CacheEvict(value = "products", key = "'all'")
    })
    public void deleteProduct(String productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", productId));
        for (ProductImage img : product.getProductImages()) {
            s3Service.deleteFile(s3Bucket, productMapper.extractKeyFromUrl(img.getImageUrl()));
        }
        productRepository.delete(product);
    }

    // ── Helpers ──────────────────────────────────────────────────────────────

    private Admin findAdmin(Integer adminId) {
        return adminRepository.findById(adminId)
                .orElseThrow(() -> new ResourceNotFoundException("Admin", "id", adminId));
    }

    private List<ProductImage> uploadImages(List<MultipartFile> files) throws IOException {
        List<ProductImage> images = new ArrayList<>();
        for (MultipartFile file : files) {
            String s3Url = s3Service.uploadFile(file.getBytes(), file.getOriginalFilename(), s3Bucket);
            ProductImage img = new ProductImage();
            img.setImageUrl(s3Url);
            images.add(img);
        }
        return images;
    }
}