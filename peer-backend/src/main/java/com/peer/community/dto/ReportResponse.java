package com.peer.community.dto;

import com.peer.community.entity.Report;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class ReportResponse {

    private Long id;
    private String reporterName;
    private String reason;
    private LocalDateTime createdAt;

    public static ReportResponse from(Report report) {
        return ReportResponse.builder()
                .id(report.getId())
                .reporterName(report.getReporter().getName())
                .reason(report.getReason())
                .createdAt(report.getCreatedAt())
                .build();
    }
}
