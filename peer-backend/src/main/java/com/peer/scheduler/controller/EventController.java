package com.peer.scheduler.controller;

import com.peer.scheduler.dto.EventRequest;
import com.peer.scheduler.dto.EventResponse;
import com.peer.scheduler.service.EventService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    @GetMapping
    public ResponseEntity<List<EventResponse>> getEvents(
            Authentication authentication,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        Long userId = (Long) authentication.getPrincipal();
        return ResponseEntity.ok(eventService.getEvents(userId, start, end));
    }

    @GetMapping("/{eventId}")
    public ResponseEntity<EventResponse> getEvent(
            Authentication authentication,
            @PathVariable Long eventId) {
        Long userId = (Long) authentication.getPrincipal();
        return ResponseEntity.ok(eventService.getEvent(eventId, userId));
    }

    @PostMapping
    public ResponseEntity<EventResponse> createEvent(
            Authentication authentication,
            @Valid @RequestBody EventRequest request) {
        Long userId = (Long) authentication.getPrincipal();
        return ResponseEntity.status(HttpStatus.CREATED).body(eventService.createEvent(request, userId));
    }

    @PutMapping("/{eventId}")
    public ResponseEntity<EventResponse> updateEvent(
            Authentication authentication,
            @PathVariable Long eventId,
            @Valid @RequestBody EventRequest request) {
        Long userId = (Long) authentication.getPrincipal();
        return ResponseEntity.ok(eventService.updateEvent(eventId, request, userId));
    }

    @DeleteMapping("/{eventId}")
    public ResponseEntity<Void> deleteEvent(
            Authentication authentication,
            @PathVariable Long eventId) {
        Long userId = (Long) authentication.getPrincipal();
        eventService.deleteEvent(eventId, userId);
        return ResponseEntity.noContent().build();
    }
}
