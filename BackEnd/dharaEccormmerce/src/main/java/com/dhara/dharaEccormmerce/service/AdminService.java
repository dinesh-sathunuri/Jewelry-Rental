package com.dhara.dharaEccormmerce.service;

import com.dhara.dharaEccormmerce.dto.AdminDTO;
import com.dhara.dharaEccormmerce.dto.AdminRequest;
import com.dhara.dharaEccormmerce.entity.Admin;
import com.dhara.dharaEccormmerce.exceptions.BadRequestException;
import com.dhara.dharaEccormmerce.exceptions.ResourceNotFoundException;
import com.dhara.dharaEccormmerce.mapper.AdminMapper;
import com.dhara.dharaEccormmerce.repository.AdminRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class AdminService {

    private final AdminRepository      adminRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public AdminDTO registerAdmin(AdminRequest request) {
        if (adminRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new BadRequestException("Username already taken");
        }
        Admin admin = Admin.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();
        return AdminMapper.toDTO(adminRepository.save(admin));
    }

    public AdminDTO loginAdmin(AdminRequest request) {
        Admin admin = adminRepository.findByUsername(request.getUsername())
                // Use a generic message — don't reveal whether the username exists
                .orElseThrow(() -> new BadRequestException("Invalid username or password"));

        if (!passwordEncoder.matches(request.getPassword(), admin.getPassword())) {
            throw new BadRequestException("Invalid username or password");
        }
        return AdminMapper.toDTO(admin);
    }
}