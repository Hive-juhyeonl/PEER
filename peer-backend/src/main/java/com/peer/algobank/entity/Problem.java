package com.peer.algobank.entity;

import com.peer.common.entity.BaseTimeEntity;
import com.peer.user.entity.User;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "problems")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Problem extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id", nullable = false)
    private User author;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private Difficulty difficulty;

    @Column(length = 500)
    private String tags;

    @Builder
    public Problem(User author, String title, String description,
                   Difficulty difficulty, String tags) {
        this.author = author;
        this.title = title;
        this.description = description;
        this.difficulty = difficulty != null ? difficulty : Difficulty.MEDIUM;
        this.tags = tags;
    }

    public void update(String title, String description, Difficulty difficulty, String tags) {
        this.title = title;
        this.description = description;
        this.difficulty = difficulty;
        this.tags = tags;
    }
}
