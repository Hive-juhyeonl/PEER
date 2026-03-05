package com.peer.scheduler.entity;

import com.peer.common.entity.BaseTimeEntity;
import com.peer.user.entity.User;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "todos")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Todo extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private Todo parent;

    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Todo> subtasks = new ArrayList<>();

    @Column(nullable = false, length = 300)
    private String title;

    @Column(nullable = false)
    private boolean completed;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private Priority priority;

    private LocalDateTime dueDate;

    @Column(nullable = false)
    private int sortOrder;

    @Builder
    public Todo(User user, Todo parent, String title, Priority priority,
                LocalDateTime dueDate, int sortOrder) {
        this.user = user;
        this.parent = parent;
        this.title = title;
        this.completed = false;
        this.priority = priority != null ? priority : Priority.MEDIUM;
        this.dueDate = dueDate;
        this.sortOrder = sortOrder;
    }

    public void update(String title, Priority priority, LocalDateTime dueDate, int sortOrder) {
        this.title = title;
        this.priority = priority;
        this.dueDate = dueDate;
        this.sortOrder = sortOrder;
    }

    public void toggleComplete() {
        this.completed = !this.completed;
    }
}
