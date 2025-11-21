package com.dhara.dharaEccormmerce.entity;

import com.dhara.dharaEccormmerce.enums.OrderStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.GenericGenerator;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
@Data
@Entity
@Table(name = "product")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @Column(length = 20)
    private String id;
    private String title;
    @ElementCollection
    @CollectionTable(name = "product_tags", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "tag")
    private List<String> tag;
    private String length;
    private String material;
    @ElementCollection
    @CollectionTable(name = "product_designs", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "design")
    private List<String> design;
    @ElementCollection
    @CollectionTable(name = "product_colors", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "color")
    private List<String> color;

    @Enumerated(EnumType.STRING)
    private OrderStatus status;

    private Long pricePerDay;
    @ManyToMany(mappedBy = "products")
    private List<Order> orders = new ArrayList<>();
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "product_id")
    private List<ProductImage> productImages = new ArrayList<>();

    private String comments;

    @ManyToOne
    @JoinColumn(name = "last_modified_by_admin_id")
    private Admin lastModifiedBy;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }

}

