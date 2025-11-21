package com.dhara.dharaEccormmerce.controller;

import com.dhara.dharaEccormmerce.dto.AdminDTO;
import com.dhara.dharaEccormmerce.dto.ProductDTO;
import com.dhara.dharaEccormmerce.dto.ProductRequest;
import com.dhara.dharaEccormmerce.service.ProductService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {
    private final ProductService productService;

    @GetMapping("/all")
    public ResponseEntity<List<ProductDTO>> getAllProducts(){
        return ResponseEntity.ok(productService.getAllProducts());
    }
    @PostMapping(consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<ProductDTO> createProduct(
            @RequestPart("request") ProductRequest request,
            @RequestPart("images") List<MultipartFile> imageFiles) throws IOException {

        System.out.println("Parsed request: " + request);
        System.out.println("Images: " + imageFiles.size());

        return ResponseEntity.ok(productService.createProduct(request, imageFiles));
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProductDTO> updateProduct(
            @RequestPart("request") ProductRequest request,
            @RequestPart(value = "images", required = false) List<MultipartFile> imageFiles
    ) throws IOException {
        ProductDTO updatedProduct = productService.updateProduct(request, imageFiles);
        return ResponseEntity.ok(updatedProduct);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getProduct(@PathVariable String id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable String id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}
