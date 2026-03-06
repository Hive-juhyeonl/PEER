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
    private String authorProfileImageUrl;
    private PostTag tag;
    private String title;
    private String content;
    private int likeCount;
    private int viewCount;
    private int reportCount;
    private boolean blinded;
    private boolean resolved;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static PostResponse from(Post post) {
        return PostResponse.builder()
                .id(post.getId())
                .authorId(post.getAuthor().getId())
                .authorName(post.getAuthor().getName())
                .authorProfileImageUrl(post.getAuthor().getProfileImageUrl())
                .tag(post.getTag())
                .title(post.getTitle())
                .content(post.getContent())
                .likeCount(post.getLikeCount())
                .viewCount(post.getViewCount())
                .reportCount(post.getReportCount())
                .blinded(post.isBlinded())
                .resolved(post.isResolved())
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .build();
    }
}
