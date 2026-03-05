package com.peer.algobank.dto;

import com.peer.algobank.entity.Evaluation;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class EvaluationResponse {

    private Long id;
    private Long solutionId;
    private Long evaluatorId;
    private String evaluatorName;
    private int correctness;
    private int codeReadability;
    private int commentsClarity;
    private int conditionSatisfaction;
    private int averageScore;
    private String feedback;
    private LocalDateTime createdAt;

    public static EvaluationResponse from(Evaluation evaluation) {
        return EvaluationResponse.builder()
                .id(evaluation.getId())
                .solutionId(evaluation.getSolution().getId())
                .evaluatorId(evaluation.getEvaluator().getId())
                .evaluatorName(evaluation.getEvaluator().getName())
                .correctness(evaluation.getCorrectness())
                .codeReadability(evaluation.getCodeReadability())
                .commentsClarity(evaluation.getCommentsClarity())
                .conditionSatisfaction(evaluation.getConditionSatisfaction())
                .averageScore(evaluation.getAverageScore())
                .feedback(evaluation.getFeedback())
                .createdAt(evaluation.getCreatedAt())
                .build();
    }
}
