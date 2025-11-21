package com.dhara.dharaEccormmerce.entity;

import com.dhara.dharaEccormmerce.generator.AdminIdGenerator;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.GenericGenerator;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "admins")
public class Admin {

    @Id
    @GeneratedValue(generator = "AdminIdGenerator")
    @GenericGenerator(name = "AdminIdGenerator", type = AdminIdGenerator.class)
    private Integer id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;
}
