package com.peer.community.dto;

import com.peer.community.entity.Comment;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class CommentResponse {

    private Long id;
    private Long authorId;
    private String authorName;
    private String authorProfileImageUrl;
    private String content;
    private Long parentId;
    private List<CommentResponse> replies;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static CommentResponse from(Comment comment) {
        return CommentResponse.builder()
                .id(comment.getId())
                .authorId(comment.getAuthor().getId())
                .authorName(comment.getAuthor().getName())
                .authorProfileImageUrl(comment.getAuthor().getProfileImageUrl())
                .content(comment.getContent())
                .parentId(comment.getParent() != null ? comment.getParent().getId() : null)
                .replies(comment.getReplies().stream()
                        .map(CommentResponse::from)
                        .toList())
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .build();
    }
}
