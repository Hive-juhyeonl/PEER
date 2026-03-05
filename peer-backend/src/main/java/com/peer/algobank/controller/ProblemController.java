package com.peer.algobank.controller;

import com.peer.algobank.dto.ProblemRequest;
import com.peer.algobank.dto.ProblemResponse;
import com.peer.algobank.service.ProblemService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/problems")
@RequiredArgsConstructor
public class ProblemController {

    private final ProblemService problemService;

    @GetMapping
    public ResponseEntity<Page<ProblemResponse>> getProblems(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(problemService.getProblems(page, size));
    }

    @GetMapping("/{problemId}")
    public ResponseEntity<ProblemResponse> getProblem(@PathVariable Long problemId) {
        return ResponseEntity.ok(problemService.getProblem(problemId));
    }

    @PostMapping
    public ResponseEntity<ProblemResponse> createProblem(
            Authentication authentication,
            @Valid @RequestBody ProblemRequest request) {
        Long userId = (Long) authentication.getPrincipal();
        return ResponseEntity.status(HttpStatus.CREATED).body(problemService.createProblem(request, userId));
    }

    @PutMapping("/{problemId}")
    public ResponseEntity<ProblemResponse> updateProblem(
            Authentication authentication,
            @PathVariable Long problemId,
            @Valid @RequestBody ProblemRequest request) {
        Long userId = (Long) authentication.getPrincipal();
        return ResponseEntity.ok(problemService.updateProblem(problemId, request, userId));
    }

    @DeleteMapping("/{problemId}")
    public ResponseEntity<Void> deleteProblem(
            Authentication authentication,
            @PathVariable Long problemId) {
        Long userId = (Long) authentication.getPrincipal();
        problemService.deleteProblem(problemId, userId);
        return ResponseEntity.noContent().build();
    }
}
