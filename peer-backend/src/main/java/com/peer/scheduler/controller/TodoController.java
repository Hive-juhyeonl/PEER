package com.peer.scheduler.controller;

import com.peer.scheduler.dto.TodoRequest;
import com.peer.scheduler.dto.TodoResponse;
import com.peer.scheduler.service.TodoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/todos")
@RequiredArgsConstructor
public class TodoController {

    private final TodoService todoService;

    @GetMapping
    public ResponseEntity<List<TodoResponse>> getTodos(Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        return ResponseEntity.ok(todoService.getTodos(userId));
    }

    @GetMapping("/{todoId}")
    public ResponseEntity<TodoResponse> getTodo(
            Authentication authentication,
            @PathVariable Long todoId) {
        Long userId = (Long) authentication.getPrincipal();
        return ResponseEntity.ok(todoService.getTodo(todoId, userId));
    }

    @PostMapping
    public ResponseEntity<TodoResponse> createTodo(
            Authentication authentication,
            @Valid @RequestBody TodoRequest request) {
        Long userId = (Long) authentication.getPrincipal();
        return ResponseEntity.status(HttpStatus.CREATED).body(todoService.createTodo(request, userId));
    }

    @PutMapping("/{todoId}")
    public ResponseEntity<TodoResponse> updateTodo(
            Authentication authentication,
            @PathVariable Long todoId,
            @Valid @RequestBody TodoRequest request) {
        Long userId = (Long) authentication.getPrincipal();
        return ResponseEntity.ok(todoService.updateTodo(todoId, request, userId));
    }

    @PatchMapping("/{todoId}/toggle")
    public ResponseEntity<TodoResponse> toggleTodo(
            Authentication authentication,
            @PathVariable Long todoId) {
        Long userId = (Long) authentication.getPrincipal();
        return ResponseEntity.ok(todoService.toggleTodo(todoId, userId));
    }

    @DeleteMapping("/{todoId}")
    public ResponseEntity<Void> deleteTodo(
            Authentication authentication,
            @PathVariable Long todoId) {
        Long userId = (Long) authentication.getPrincipal();
        todoService.deleteTodo(todoId, userId);
        return ResponseEntity.noContent().build();
    }
}
