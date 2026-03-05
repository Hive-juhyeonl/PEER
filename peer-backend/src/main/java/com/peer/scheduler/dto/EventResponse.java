package com.peer.scheduler.dto;

import com.peer.scheduler.entity.Event;
import com.peer.scheduler.entity.RepeatRule;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class EventResponse {

    private Long id;
    private String title;
    private String description;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private boolean allDay;
    private String color;
    private RepeatRule repeatRule;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static EventResponse from(Event event) {
        return EventResponse.builder()
                .id(event.getId())
                .title(event.getTitle())
                .description(event.getDescription())
                .startTime(event.getStartTime())
                .endTime(event.getEndTime())
                .allDay(event.isAllDay())
                .color(event.getColor())
                .repeatRule(event.getRepeatRule())
                .createdAt(event.getCreatedAt())
                .updatedAt(event.getUpdatedAt())
                .build();
    }
}
