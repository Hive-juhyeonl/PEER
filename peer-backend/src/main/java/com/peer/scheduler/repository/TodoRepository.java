package com.peer.scheduler.repository;

import com.peer.scheduler.entity.Todo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TodoRepository extends JpaRepository<Todo, Long> {

    List<Todo> findByUserIdAndParentIsNullOrderBySortOrderAsc(Long userId);

    Optional<Todo> findByIdAndUserId(Long id, Long userId);
}
