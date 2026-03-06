package com.peer.user.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class UserProfileRequest {

    private String name;
    private String profileImageUrl;
}
