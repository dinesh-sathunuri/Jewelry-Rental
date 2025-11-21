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
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final AdminRepository adminRepository;
    private final S3Service s3Service;
    private final ProductMapper productMapper;
    @Value("${aws.s3.bucket}")
    private String s3Bucket;
//    private static final String UPLOAD_DIR = "uploads/";
    private static final Path UPLOAD_DIR_PATH = Paths.get("uploads").toAbsolutePath().normalize();
    public List<ProductDTO> getAllProducts() {
        return productRepository.findAll()
                .stream()
                .map(productMapper::toDTO)
                .collect(Collectors.toList());
    }

    public ProductDTO getProductById(String id) {
        return productRepository.findById(id)
                .map(productMapper::toDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));
    }

    public ProductDTO createProduct(ProductRequest request, List<MultipartFile> imageFiles) throws IOException {
        Admin admin = adminRepository.findById(request.getAdminId())
                .orElseThrow(() -> new ResourceNotFoundException("Admin", "id", request.getAdminId()));
        System.out.println(request+" "+imageFiles.size());
        try {
            Product product = productMapper.toEntity(request, admin);

            // Save images locally and attach to product
            List<ProductImage> savedImages = saveImagesToS3(imageFiles);
            product.setProductImages(savedImages);

            Product saved = productRepository.save(product);
            return productMapper.toDTO(saved);
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }

    public ProductDTO updateProduct(ProductRequest request, List<MultipartFile> imageFiles) throws IOException {
        Product product = productRepository.findById(request.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", request.getId()));

        Admin admin = adminRepository.findById(request.getAdminId())
                .orElseThrow(() -> new ResourceNotFoundException("Admin", "id", request.getAdminId()));

        // Update product fields
        productMapper.updateEntity(product, request, admin);

        // Remove deleted images if any
        if (request.getRemovedImageIds() != null && !request.getRemovedImageIds().isEmpty()) {
            List<ProductImage> imagesToRemove = product.getProductImages()
                    .stream()
                    .filter(img -> request.getRemovedImageIds().contains(img.getId()))
                    .collect(Collectors.toList());

            for (ProductImage img : imagesToRemove) {
                // Remove image from product
                product.getProductImages().remove(img);

                String key = productMapper.extractKeyFromUrl(img.getImageUrl());
                s3Service.deleteFile(s3Bucket, key);
            }
        }

        // Add new uploaded images
        if (imageFiles != null && !imageFiles.isEmpty()) {
            List<ProductImage> newImages = saveImagesToS3(imageFiles);
            product.getProductImages().addAll(newImages);
        }

        Product savedProduct = productRepository.save(product);
        return productMapper.toDTO(savedProduct);
    }


    public void deleteProduct(String productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", productId));
        for (ProductImage image : product.getProductImages()) {
            String s3Key = productMapper.extractKeyFromUrl(image.getImageUrl());
            s3Service.deleteFile(s3Bucket, s3Key);
        }
        productRepository.delete(product);
    }
    private List<ProductImage> saveImagesToS3(List<MultipartFile> imageFiles) throws IOException {
        List<ProductImage> images = new ArrayList<>();

        for (MultipartFile file : imageFiles) {
            String s3Url = s3Service.uploadFile(file.getBytes(), file.getOriginalFilename(), s3Bucket);

            ProductImage image = new ProductImage();
            image.setImageUrl(s3Url);

            images.add(image);
        }
        return images;
    }

    // 🔽 helper to save images locally
//    private List<ProductImage> saveImagesLocally(List<MultipartFile> imageFiles) throws IOException {
//        List<ProductImage> images = new ArrayList<>();
//        Files.createDirectories(Paths.get(UPLOAD_DIR));
//
//        for (MultipartFile file : imageFiles) {
//            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
//            Path path = Paths.get(UPLOAD_DIR + fileName);
//            Files.write(path, file.getBytes());
//
//            ProductImage image = new ProductImage();
//            image.setImageUrl("/" + UPLOAD_DIR + fileName); // for URL access
//
//            images.add(image);
//        }
//
//        return images;
//    }

    // Helper method to delete image file by path
//    private void deleteImageFile(String imageUrl) {
//        if (imageUrl == null || imageUrl.isBlank()) return;
//
//        try {
//            // Extract file name from imageUrl
//            String fileName = Paths.get(imageUrl).getFileName().toString();
//            Path filePath = UPLOAD_DIR_PATH.resolve(fileName);
//
//            System.out.println("Attempting to delete file: " + filePath);
//            if (Files.exists(filePath)) {
//                Files.delete(filePath);
//                System.out.println("File deleted successfully.");
//            } else {
//                System.out.println("File not found: " + filePath);
//            }
//        } catch (IOException e) {
//            e.printStackTrace();
//        }
//    }

}
