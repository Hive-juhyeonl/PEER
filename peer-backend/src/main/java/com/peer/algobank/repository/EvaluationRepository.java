package com.peer.algobank.repository;

import com.peer.algobank.entity.Evaluation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface EvaluationRepository extends JpaRepository<Evaluation, Long> {

    List<Evaluation> findBySolutionIdOrderByCreatedAtDesc(Long solutionId);

    boolean existsBySolutionIdAndEvaluatorId(Long solutionId, Long evaluatorId);

    @Query("SELECT AVG((e.correctness + e.codeReadability + e.commentsClarity + e.conditionSatisfaction) / 4.0) " +
            "FROM Evaluation e WHERE e.solution.id = :solutionId")
    Double getAverageScore(Long solutionId);
}
