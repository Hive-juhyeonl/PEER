package com.peer.community.dto;

import com.peer.community.entity.Post;
import com.peer.community.entity.PostTag;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class PostResponse {

    private Long id;
    private Long authorId;
    private String authorName;
    private PostTag tag;
    private String title;
    private String content;
    private int likeCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static PostResponse from(Post post) {
        return PostResponse.builder()
                .id(post.getId())
                .authorId(post.getAuthor().getId())
                .authorName(post.getAuthor().getName())
                .tag(post.getTag())
                .title(post.getTitle())
                .content(post.getContent())
                .likeCount(post.getLikeCount())
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .build();
    }
}
