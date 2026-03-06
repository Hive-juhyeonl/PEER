package com.peer.user.dto;

import com.peer.user.entity.User;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class UserResponse {

    private Long id;
    private String email;
    private String name;
    private String profileImageUrl;
    private String role;
    private Long totalXp;
    private Integer level;
    private LocalDateTime createdAt;

    public static UserResponse from(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .profileImageUrl(user.getProfileImageUrl())
                .role(user.getRole().name())
                .totalXp(user.getTotalXp())
                .level(user.getLevel())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
