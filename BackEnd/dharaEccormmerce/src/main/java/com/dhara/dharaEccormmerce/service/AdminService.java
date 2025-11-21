package com.dhara.dharaEccormmerce.service;

import com.dhara.dharaEccormmerce.dto.AdminDTO;
import com.dhara.dharaEccormmerce.dto.AdminRequest;
import com.dhara.dharaEccormmerce.entity.Admin;
import com.dhara.dharaEccormmerce.exceptions.BadRequestException;
import com.dhara.dharaEccormmerce.exceptions.ResourceNotFoundException;
import com.dhara.dharaEccormmerce.mapper.AdminMapper;
import com.dhara.dharaEccormmerce.repository.AdminRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminService {
    private final AdminRepository adminRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    public AdminDTO registerAdmin(AdminRequest request)
    {
        if(adminRepository.findByUsername(request.getUsername()).isPresent())
        {
            throw new BadRequestException("Admin already Exists");
        }
        try {
            Admin admin = Admin.builder()
                    .username(request.getUsername())
                    .password(bCryptPasswordEncoder.encode(request.getPassword()))
                    .build();
            Admin saveAdmin = adminRepository.save(admin);
            return AdminMapper.toDTO(saveAdmin);
        }catch (Exception e)
        {
            e.printStackTrace();
            throw e;
        }
    }
    public AdminDTO loginAdmin(AdminRequest request)
    {
        Admin admin= adminRepository.findByUsername(request.getUsername())
                .orElseThrow(()->new ResourceNotFoundException("Admin","userName",request.getUsername()));

        if(!bCryptPasswordEncoder.matches(request.getPassword(), admin.getPassword()))
        {
            throw new BadRequestException("Invalid username or password");
        }
        return AdminMapper.toDTO(admin);
    }
}
