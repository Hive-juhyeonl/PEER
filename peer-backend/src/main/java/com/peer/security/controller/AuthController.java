package com.peer.security.controller;

import com.peer.security.dto.RefreshTokenRequest;
import com.peer.security.dto.TokenResponse;
import com.peer.security.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/refresh")
    public ResponseEntity<TokenResponse> refresh(@Valid @RequestBody RefreshTokenRequest request) {
        TokenResponse tokenResponse = authService.refresh(request.getRefreshToken());
        return ResponseEntity.ok(tokenResponse);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@RequestHeader("Authorization") String bearerToken,
                                       Authentication authentication) {
        String accessToken = bearerToken.substring(7);
        Long userId = (Long) authentication.getPrincipal();
        authService.logout(accessToken, userId);
        return ResponseEntity.ok().build();
    }
}
