package com.peer.algobank.repository;

import com.peer.algobank.entity.Problem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProblemRepository extends JpaRepository<Problem, Long> {

    Page<Problem> findAllByOrderByCreatedAtDesc(Pageable pageable);
}
