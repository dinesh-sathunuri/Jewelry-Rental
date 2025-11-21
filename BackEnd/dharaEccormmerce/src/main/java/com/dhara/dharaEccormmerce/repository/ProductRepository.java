package com.dhara.dharaEccormmerce.repository;

import com.dhara.dharaEccormmerce.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product,String> {
}
