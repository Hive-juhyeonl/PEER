package com.peer.community.service;

import com.peer.common.exception.CustomException;
import com.peer.common.exception.ErrorCode;
import com.peer.community.dto.ReportRequest;
import com.peer.community.entity.Post;
import com.peer.community.entity.Report;
import com.peer.community.repository.ReportRepository;
import com.peer.user.entity.User;
import com.peer.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReportService {

    private final ReportRepository reportRepository;
    private final PostService postService;
    private final UserRepository userRepository;

    @Transactional
    public void report(Long postId, ReportRequest request, Long userId) {
        Post post = postService.findPost(postId);

        if (post.getAuthor().getId().equals(userId)) {
            throw new CustomException(ErrorCode.SELF_REPORT);
        }

        if (reportRepository.existsByReporterIdAndPostId(userId, postId)) {
            throw new CustomException(ErrorCode.DUPLICATE_REPORT);
        }

        User reporter = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        reportRepository.save(new Report(reporter, post, request.getReason()));
        post.incrementReportCount();

        // Auto-blind when reports exceed 10% of total users (minimum 3 reports)
        long totalUsers = userRepository.count();
        long threshold = Math.max(3, (long) Math.ceil(totalUsers * 0.1));
        if (post.getReportCount() >= threshold) {
            post.blind();
        }
    }
}
