package com.peer.algobank.repository;

import com.peer.algobank.entity.Solution;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SolutionRepository extends JpaRepository<Solution, Long> {

    List<Solution> findByProblemIdOrderByCreatedAtDesc(Long problemId);

    Optional<Solution> findByIdAndAuthorId(Long id, Long authorId);

    boolean existsByProblemIdAndAuthorId(Long problemId, Long authorId);
}
