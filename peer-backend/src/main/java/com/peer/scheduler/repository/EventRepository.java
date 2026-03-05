package com.peer.scheduler.repository;

import com.peer.scheduler.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface EventRepository extends JpaRepository<Event, Long> {

    List<Event> findByUserIdAndStartTimeBetweenOrderByStartTimeAsc(
            Long userId, LocalDateTime start, LocalDateTime end);

    Optional<Event> findByIdAndUserId(Long id, Long userId);
}
