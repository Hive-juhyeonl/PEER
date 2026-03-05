package com.peer.community.controller;

import com.peer.community.service.PostLikeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/posts/{postId}/likes")
@RequiredArgsConstructor
public class PostLikeController {

    private final PostLikeService postLikeService;

    @PostMapping
    public ResponseEntity<Void> like(
            Authentication authentication,
            @PathVariable Long postId) {
        Long userId = (Long) authentication.getPrincipal();
        postLikeService.like(postId, userId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping
    public ResponseEntity<Void> unlike(
            Authentication authentication,
            @PathVariable Long postId) {
        Long userId = (Long) authentication.getPrincipal();
        postLikeService.unlike(postId, userId);
        return ResponseEntity.noContent().build();
    }
}
