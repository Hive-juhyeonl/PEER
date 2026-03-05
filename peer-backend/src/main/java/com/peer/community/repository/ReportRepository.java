package com.peer.community.repository;

import com.peer.community.entity.Report;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReportRepository extends JpaRepository<Report, Long> {

    boolean existsByReporterIdAndPostId(Long reporterId, Long postId);
}
