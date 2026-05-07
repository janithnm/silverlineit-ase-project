package com.silverlineit.coursecontentsystem.auth.dto;

import com.silverlineit.coursecontentsystem.auth.entity.User;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserDto {
    private Long id;
    private String username;
    private String email;
    private String role;
    private boolean emailVerified;

    public static UserDto from(User user) {
        return UserDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole().name())
                .emailVerified(user.isEmailVerified())
                .build();
    }
}