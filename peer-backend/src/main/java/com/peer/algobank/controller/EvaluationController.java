package com.peer.algobank.controller;

import com.peer.algobank.dto.EvaluationRequest;
import com.peer.algobank.dto.EvaluationResponse;
import com.peer.algobank.service.EvaluationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/solutions/{solutionId}/evaluations")
@RequiredArgsConstructor
public class EvaluationController {

    private final EvaluationService evaluationService;

    @GetMapping
    public ResponseEntity<List<EvaluationResponse>> getEvaluations(@PathVariable Long solutionId) {
        return ResponseEntity.ok(evaluationService.getEvaluations(solutionId));
    }

    @PostMapping
    public ResponseEntity<EvaluationResponse> createEvaluation(
            Authentication authentication,
            @PathVariable Long solutionId,
            @Valid @RequestBody EvaluationRequest request) {
        Long userId = (Long) authentication.getPrincipal();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(evaluationService.createEvaluation(solutionId, request, userId));
    }
}
