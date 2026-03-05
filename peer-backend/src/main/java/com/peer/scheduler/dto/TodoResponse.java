package com.peer.scheduler.dto;

import com.peer.scheduler.entity.Priority;
import com.peer.scheduler.entity.Todo;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class TodoResponse {

    private Long id;
    private String title;
    private boolean completed;
    private Priority priority;
    private LocalDateTime dueDate;
    private int sortOrder;
    private Long parentId;
    private List<TodoResponse> subtasks;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static TodoResponse from(Todo todo) {
        return TodoResponse.builder()
                .id(todo.getId())
                .title(todo.getTitle())
                .completed(todo.isCompleted())
                .priority(todo.getPriority())
                .dueDate(todo.getDueDate())
                .sortOrder(todo.getSortOrder())
                .parentId(todo.getParent() != null ? todo.getParent().getId() : null)
                .subtasks(todo.getSubtasks().stream()
                        .map(TodoResponse::from)
                        .toList())
                .createdAt(todo.getCreatedAt())
                .updatedAt(todo.getUpdatedAt())
                .build();
    }
}
