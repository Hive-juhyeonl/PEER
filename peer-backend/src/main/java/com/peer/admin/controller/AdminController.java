package com.peer.admin.controller;

import com.peer.admin.service.AdminService;
import com.peer.community.dto.PostResponse;
import com.peer.community.dto.ReportResponse;
import com.peer.user.dto.UserResponse;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    // --- User Management ---

    @GetMapping("/users")
    public ResponseEntity<Page<UserResponse>> getUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(adminService.getUsers(page, size));
    }

    @PatchMapping("/users/{userId}/promote")
    public ResponseEntity<UserResponse> promoteToAdmin(@PathVariable Long userId) {
        return ResponseEntity.ok(adminService.promoteToAdmin(userId));
    }

    @PatchMapping("/users/{userId}/demote")
    public ResponseEntity<UserResponse> demoteToUser(@PathVariable Long userId) {
        return ResponseEntity.ok(adminService.demoteToUser(userId));
    }

    @DeleteMapping("/users/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long userId) {
        adminService.deleteUser(userId);
        return ResponseEntity.noContent().build();
    }

    // --- Post Management ---

    @GetMapping("/posts/inquiries")
    public ResponseEntity<Page<PostResponse>> getInquiries(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) Boolean resolved) {
        return ResponseEntity.ok(adminService.getInquiries(page, size, resolved));
    }

    @PatchMapping("/posts/{postId}/resolve")
    public ResponseEntity<PostResponse> resolveInquiry(@PathVariable Long postId) {
        return ResponseEntity.ok(adminService.resolveInquiry(postId));
    }

    @PatchMapping("/posts/{postId}/unresolve")
    public ResponseEntity<PostResponse> unresolveInquiry(@PathVariable Long postId) {
        return ResponseEntity.ok(adminService.unresolveInquiry(postId));
    }

    @GetMapping("/posts/reported")
    public ResponseEntity<Page<PostResponse>> getReportedPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(adminService.getReportedPosts(page, size));
    }

    @GetMapping("/posts/blinded")
    public ResponseEntity<Page<PostResponse>> getBlindedPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(adminService.getBlindedPosts(page, size));
    }

    @PatchMapping("/posts/{postId}/unblind")
    public ResponseEntity<PostResponse> unblindPost(@PathVariable Long postId) {
        return ResponseEntity.ok(adminService.unblindPost(postId));
    }

    @DeleteMapping("/posts/{postId}")
    public ResponseEntity<Void> deletePost(@PathVariable Long postId) {
        adminService.deletePost(postId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/posts/{postId}/reports")
    public ResponseEntity<List<ReportResponse>> getReportsForPost(@PathVariable Long postId) {
        return ResponseEntity.ok(adminService.getReportsForPost(postId));
    }
}
