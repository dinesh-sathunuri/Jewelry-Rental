package com.dhara.dharaEccormmerce.controller;

import com.dhara.dharaEccormmerce.dto.ProductDTO;
import com.dhara.dharaEccormmerce.dto.ProductRequest;
import com.dhara.dharaEccormmerce.service.ProductService;
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
    public ResponseEntity<List<ProductDTO>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getProduct(@PathVariable String id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProductDTO> createProduct(
            @RequestPart("request") @Valid ProductRequest request,
            @RequestPart("images")  List<MultipartFile> imageFiles) throws IOException {
        return ResponseEntity.ok(productService.createProduct(request, imageFiles));
    }

    /**
     * Bug fix: original code ignored @PathVariable id and used whatever was
     * in the request body. Now the path variable is the authoritative ID.
     */
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProductDTO> updateProduct(
            @PathVariable String id,
            @RequestPart("request") @Valid ProductRequest request,
            @RequestPart(value = "images", required = false) List<MultipartFile> imageFiles)
            throws IOException {
        request.setId(id);   // path variable wins
        return ResponseEntity.ok(productService.updateProduct(request, imageFiles));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable String id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}