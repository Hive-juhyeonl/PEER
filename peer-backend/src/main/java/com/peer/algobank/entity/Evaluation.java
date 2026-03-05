package com.peer.algobank.entity;

import com.peer.common.entity.BaseTimeEntity;
import com.peer.user.entity.User;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "evaluations", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"solution_id", "evaluator_id"})
})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Evaluation extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "solution_id", nullable = false)
    private Solution solution;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "evaluator_id", nullable = false)
    private User evaluator;

    @Column(nullable = false)
    private int correctness;

    @Column(nullable = false)
    private int codeReadability;

    @Column(nullable = false)
    private int commentsClarity;

    @Column(nullable = false)
    private int conditionSatisfaction;

    @Column(columnDefinition = "TEXT")
    private String feedback;

    @Builder
    public Evaluation(Solution solution, User evaluator,
                      int correctness, int codeReadability,
                      int commentsClarity, int conditionSatisfaction,
                      String feedback) {
        this.solution = solution;
        this.evaluator = evaluator;
        this.correctness = correctness;
        this.codeReadability = codeReadability;
        this.commentsClarity = commentsClarity;
        this.conditionSatisfaction = conditionSatisfaction;
        this.feedback = feedback;
    }

    public int getAverageScore() {
        return (correctness + codeReadability + commentsClarity + conditionSatisfaction) / 4;
    }
}
