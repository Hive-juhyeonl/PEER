package com.peer.scheduler.dto;

import com.peer.scheduler.entity.Priority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
public class TodoRequest {

    @NotBlank
    @Size(max = 300)
    private String title;

    private Priority priority;

    private LocalDateTime dueDate;

    private int sortOrder;

    private Long parentId;
}
