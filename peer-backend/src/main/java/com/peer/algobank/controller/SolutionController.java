package com.peer.algobank.controller;

import com.peer.algobank.dto.SolutionRequest;
import com.peer.algobank.dto.SolutionResponse;
import com.peer.algobank.service.SolutionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/problems/{problemId}/solutions")
@RequiredArgsConstructor
public class SolutionController {

    private final SolutionService solutionService;

    @GetMapping
    public ResponseEntity<List<SolutionResponse>> getSolutions(@PathVariable Long problemId) {
        return ResponseEntity.ok(solutionService.getSolutions(problemId));
    }

    @GetMapping("/{solutionId}")
    public ResponseEntity<SolutionResponse> getSolution(@PathVariable Long solutionId) {
        return ResponseEntity.ok(solutionService.getSolution(solutionId));
    }

    @PostMapping
    public ResponseEntity<SolutionResponse> createSolution(
            Authentication authentication,
            @PathVariable Long problemId,
            @Valid @RequestBody SolutionRequest request) {
        Long userId = (Long) authentication.getPrincipal();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(solutionService.createSolution(problemId, request, userId));
    }

    @PutMapping("/{solutionId}")
    public ResponseEntity<SolutionResponse> updateSolution(
            Authentication authentication,
            @PathVariable Long solutionId,
            @Valid @RequestBody SolutionRequest request) {
        Long userId = (Long) authentication.getPrincipal();
        return ResponseEntity.ok(solutionService.updateSolution(solutionId, request, userId));
    }

    @DeleteMapping("/{solutionId}")
    public ResponseEntity<Void> deleteSolution(
            Authentication authentication,
            @PathVariable Long solutionId) {
        Long userId = (Long) authentication.getPrincipal();
        solutionService.deleteSolution(solutionId, userId);
        return ResponseEntity.noContent().build();
    }
}
