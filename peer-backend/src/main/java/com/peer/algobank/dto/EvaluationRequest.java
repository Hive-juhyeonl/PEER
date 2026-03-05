package com.peer.algobank.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class EvaluationRequest {

    @NotNull @Min(1) @Max(5)
    private Integer correctness;

    @NotNull @Min(1) @Max(5)
    private Integer codeReadability;

    @NotNull @Min(1) @Max(5)
    private Integer commentsClarity;

    @NotNull @Min(1) @Max(5)
    private Integer conditionSatisfaction;

    private String feedback;
}
