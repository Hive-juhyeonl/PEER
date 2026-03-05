package com.peer.algobank.entity;

import com.peer.common.entity.BaseTimeEntity;
import com.peer.user.entity.User;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "solutions", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"problem_id", "author_id"})
})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Solution extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "problem_id", nullable = false)
    private Problem problem;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id", nullable = false)
    private User author;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String code;

    @Column(nullable = false, length = 30)
    private String language;

    @Column(length = 50)
    private String timeComplexity;

    @Column(length = 50)
    private String spaceComplexity;

    @Column(columnDefinition = "TEXT")
    private String explanation;

    @Column(length = 500)
    private String githubUrl;

    @Builder
    public Solution(Problem problem, User author, String code, String language,
                    String timeComplexity, String spaceComplexity,
                    String explanation, String githubUrl) {
        this.problem = problem;
        this.author = author;
        this.code = code;
        this.language = language;
        this.timeComplexity = timeComplexity;
        this.spaceComplexity = spaceComplexity;
        this.explanation = explanation;
        this.githubUrl = githubUrl;
    }

    public void update(String code, String language, String timeComplexity,
                       String spaceComplexity, String explanation, String githubUrl) {
        this.code = code;
        this.language = language;
        this.timeComplexity = timeComplexity;
        this.spaceComplexity = spaceComplexity;
        this.explanation = explanation;
        this.githubUrl = githubUrl;
    }
}
