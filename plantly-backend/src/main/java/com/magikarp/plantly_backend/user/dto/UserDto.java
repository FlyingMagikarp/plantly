package com.magikarp.plantly_backend.user.dto;

import com.magikarp.plantly_backend.auth.enums.UserRole;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserDto {
    private String id;
    private String username;
    private String email;
    private String role;
}
