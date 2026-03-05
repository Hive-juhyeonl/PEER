package com.peer.community.controller;

import com.peer.community.dto.CommentRequest;
import com.peer.community.dto.CommentResponse;
import com.peer.community.service.CommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts/{postId}/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @GetMapping
    public ResponseEntity<List<CommentResponse>> getComments(@PathVariable Long postId) {
        return ResponseEntity.ok(commentService.getComments(postId));
    }

    @PostMapping
    public ResponseEntity<CommentResponse> createComment(
            Authentication authentication,
            @PathVariable Long postId,
            @Valid @RequestBody CommentRequest request) {
        Long userId = (Long) authentication.getPrincipal();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(commentService.createComment(postId, request, userId));
    }

    @PutMapping("/{commentId}")
    public ResponseEntity<CommentResponse> updateComment(
            Authentication authentication,
            @PathVariable Long commentId,
            @Valid @RequestBody CommentRequest request) {
        Long userId = (Long) authentication.getPrincipal();
        return ResponseEntity.ok(commentService.updateComment(commentId, request, userId));
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> deleteComment(
            Authentication authentication,
            @PathVariable Long commentId) {
        Long userId = (Long) authentication.getPrincipal();
        commentService.deleteComment(commentId, userId);
        return ResponseEntity.noContent().build();
    }
}
