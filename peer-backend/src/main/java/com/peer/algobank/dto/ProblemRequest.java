package com.peer.algobank.dto;

import com.peer.algobank.entity.Difficulty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ProblemRequest {

    @NotBlank
    @Size(max = 200)
    private String title;

    @NotBlank
    private String description;

    private Difficulty difficulty;

    @Size(max = 500)
    private String tags;
}
