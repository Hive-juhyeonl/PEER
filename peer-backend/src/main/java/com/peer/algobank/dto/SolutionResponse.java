package com.peer.algobank.dto;

import com.peer.algobank.entity.Solution;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class SolutionResponse {

    private Long id;
    private Long problemId;
    private Long authorId;
    private String authorName;
    private String code;
    private String language;
    private String timeComplexity;
    private String spaceComplexity;
    private String explanation;
    private String githubUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static SolutionResponse from(Solution solution) {
        return SolutionResponse.builder()
                .id(solution.getId())
                .problemId(solution.getProblem().getId())
                .authorId(solution.getAuthor().getId())
                .authorName(solution.getAuthor().getName())
                .code(solution.getCode())
                .language(solution.getLanguage())
                .timeComplexity(solution.getTimeComplexity())
                .spaceComplexity(solution.getSpaceComplexity())
                .explanation(solution.getExplanation())
                .githubUrl(solution.getGithubUrl())
                .createdAt(solution.getCreatedAt())
                .updatedAt(solution.getUpdatedAt())
                .build();
    }
}
