package com.peer.community.entity;

import com.peer.user.entity.User;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "reports", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"reporter_id", "post_id"})
})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reporter_id", nullable = false)
    private User reporter;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    private Post post;

    @Column(nullable = false, length = 500)
    private String reason;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    public Report(User reporter, Post post, String reason) {
        this.reporter = reporter;
        this.post = post;
        this.reason = reason;
        this.createdAt = LocalDateTime.now();
    }
}
