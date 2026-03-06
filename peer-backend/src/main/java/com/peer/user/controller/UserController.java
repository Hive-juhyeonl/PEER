package com.peer.user.controller;

import com.peer.user.dto.UserProfileRequest;
import com.peer.user.dto.UserResponse;
import com.peer.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    private static final Path UPLOAD_DIR = Paths.get("uploads/profiles").toAbsolutePath();

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getMe(Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        return ResponseEntity.ok(userService.getMe(userId));
    }

    @PutMapping("/me")
    public ResponseEntity<UserResponse> updateProfile(
            Authentication authentication,
            @RequestBody UserProfileRequest request) {
        Long userId = (Long) authentication.getPrincipal();
        return ResponseEntity.ok(userService.updateProfile(userId, request));
    }

    @PostMapping("/me/profile-image")
    public ResponseEntity<Map<String, String>> uploadProfileImage(
            Authentication authentication,
            @RequestParam("file") MultipartFile file) throws IOException {
        Long userId = (Long) authentication.getPrincipal();

        Files.createDirectories(UPLOAD_DIR);

        String originalName = file.getOriginalFilename();
        String ext = originalName != null && originalName.contains(".")
                ? originalName.substring(originalName.lastIndexOf("."))
                : ".jpg";
        String filename = userId + "-" + UUID.randomUUID().toString().substring(0, 8) + ext;

        Path filePath = UPLOAD_DIR.resolve(filename);
        file.transferTo(filePath.toFile());

        String imageUrl = "/uploads/profiles/" + filename;
        return ResponseEntity.ok(Map.of("url", imageUrl));
    }
}
