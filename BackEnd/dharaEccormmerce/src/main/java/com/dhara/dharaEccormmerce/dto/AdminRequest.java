package com.dhara.dharaEccormmerce.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AdminRequest {
    @NotBlank(message = "Username is mandatory")
    private String username;
    @NotBlank(message = "password is mandatory")
    private String password;
}
