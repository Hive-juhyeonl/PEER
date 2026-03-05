package com.peer.scheduler.entity;

import com.peer.common.entity.BaseTimeEntity;
import com.peer.user.entity.User;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "events")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Event extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private LocalDateTime startTime;

    @Column(nullable = false)
    private LocalDateTime endTime;

    @Column(nullable = false)
    private boolean allDay;

    @Column(nullable = false, length = 20)
    private String color;

    @Enumerated(EnumType.STRING)
    @Column(length = 50)
    private RepeatRule repeatRule;

    @Builder
    public Event(User user, String title, String description,
                 LocalDateTime startTime, LocalDateTime endTime,
                 boolean allDay, String color, RepeatRule repeatRule) {
        this.user = user;
        this.title = title;
        this.description = description;
        this.startTime = startTime;
        this.endTime = endTime;
        this.allDay = allDay;
        this.color = color != null ? color : "#3B82F6";
        this.repeatRule = repeatRule != null ? repeatRule : RepeatRule.NONE;
    }

    public void update(String title, String description,
                       LocalDateTime startTime, LocalDateTime endTime,
                       boolean allDay, String color, RepeatRule repeatRule) {
        this.title = title;
        this.description = description;
        this.startTime = startTime;
        this.endTime = endTime;
        this.allDay = allDay;
        this.color = color;
        this.repeatRule = repeatRule;
    }
}
