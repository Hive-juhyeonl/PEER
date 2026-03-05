package com.peer.community.dto;

import com.peer.community.entity.PostTag;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class PostRequest {

    @NotNull
    private PostTag tag;

    @NotBlank
    @Size(max = 200)
    private String title;

    @NotBlank
    private String content;
}
