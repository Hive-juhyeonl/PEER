package com.peer.algobank.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class SolutionRequest {

    @NotBlank
    private String code;

    @NotBlank
    @Size(max = 30)
    private String language;

    @Size(max = 50)
    private String timeComplexity;

    @Size(max = 50)
    private String spaceComplexity;

    private String explanation;

    @Size(max = 500)
    private String githubUrl;
}
