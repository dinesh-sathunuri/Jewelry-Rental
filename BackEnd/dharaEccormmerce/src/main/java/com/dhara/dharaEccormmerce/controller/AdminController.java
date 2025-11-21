package com.dhara.dharaEccormmerce.controller;

import com.dhara.dharaEccormmerce.dto.AdminDTO;
import com.dhara.dharaEccormmerce.dto.AdminRequest;
import com.dhara.dharaEccormmerce.service.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {
    private final AdminService adminService;

    @PostMapping("/register")
    public ResponseEntity<AdminDTO> register(@Valid @RequestBody AdminRequest request)
    {
        return ResponseEntity.ok(adminService.registerAdmin(request));
    }
    @PostMapping("/login")
    public ResponseEntity<AdminDTO> login(@Valid @RequestBody AdminRequest request) {
        return ResponseEntity.ok(adminService.loginAdmin(request));
    }
}
