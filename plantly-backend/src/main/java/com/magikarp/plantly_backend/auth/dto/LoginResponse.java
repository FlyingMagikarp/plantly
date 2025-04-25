package com.magikarp.plantly_backend.auth.dto;

import com.magikarp.plantly_backend.user.dto.UserDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class LoginResponse {
    private String token;
    private UserDto user;
}
