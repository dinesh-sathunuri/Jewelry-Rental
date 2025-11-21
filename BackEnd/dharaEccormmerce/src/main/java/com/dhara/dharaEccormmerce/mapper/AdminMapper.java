package com.dhara.dharaEccormmerce.mapper;

import com.dhara.dharaEccormmerce.dto.AdminDTO;
import com.dhara.dharaEccormmerce.entity.Admin;

public class AdminMapper {
    public static AdminDTO toDTO(Admin admin){
        if(admin== null) {
        return null;
        }
            return AdminDTO.builder()
                    .id(admin.getId())
                    .username(admin.getUsername())
                    .build();
    }
    public static Admin toEntity(AdminDTO dto){
        if(dto==null)
            return null;
        return Admin.builder()
                .id(dto.getId())
                .username(dto.getUsername())
                .build();
    }
}
