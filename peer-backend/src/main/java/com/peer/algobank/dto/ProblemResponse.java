package com.peer.algobank.dto;

import com.peer.algobank.entity.Difficulty;
import com.peer.algobank.entity.Problem;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class ProblemResponse {

    private Long id;
    private Long authorId;
    private String authorName;
    private String title;
    private String description;
    private Difficulty difficulty;
    private String tags;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static ProblemResponse from(Problem problem) {
        return ProblemResponse.builder()
                .id(problem.getId())
                .authorId(problem.getAuthor().getId())
                .authorName(problem.getAuthor().getName())
                .title(problem.getTitle())
                .description(problem.getDescription())
                .difficulty(problem.getDifficulty())
                .tags(problem.getTags())
                .createdAt(problem.getCreatedAt())
                .updatedAt(problem.getUpdatedAt())
                .build();
    }
}
