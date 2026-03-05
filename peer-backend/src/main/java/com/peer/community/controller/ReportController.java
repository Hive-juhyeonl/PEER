package com.peer.community.controller;

import com.peer.community.dto.ReportRequest;
import com.peer.community.service.ReportService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/posts/{postId}/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @PostMapping
    public ResponseEntity<Void> report(
            Authentication authentication,
            @PathVariable Long postId,
            @Valid @RequestBody ReportRequest request) {
        Long userId = (Long) authentication.getPrincipal();
        reportService.report(postId, request, userId);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}
