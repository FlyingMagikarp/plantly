package com.magikarp.plantly_backend.user.dto;

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
