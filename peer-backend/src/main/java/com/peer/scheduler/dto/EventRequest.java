package com.peer.scheduler.dto;

import com.peer.scheduler.entity.RepeatRule;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
public class EventRequest {

    @NotBlank
    @Size(max = 200)
    private String title;

    private String description;

    @NotNull
    private LocalDateTime startTime;

    @NotNull
    private LocalDateTime endTime;

    private boolean allDay;

    @Size(max = 20)
    private String color;

    private RepeatRule repeatRule;
}
