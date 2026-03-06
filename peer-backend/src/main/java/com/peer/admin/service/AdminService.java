package com.peer.admin.service;

import com.peer.common.exception.CustomException;
import com.peer.common.exception.ErrorCode;
import com.peer.community.dto.PostResponse;
import com.peer.community.dto.ReportResponse;
import com.peer.community.entity.Post;
import com.peer.community.entity.PostTag;
import com.peer.community.repository.PostRepository;
import com.peer.community.repository.ReportRepository;

import java.util.List;
import com.peer.user.dto.UserResponse;
import com.peer.user.entity.Role;
import com.peer.user.entity.User;
import com.peer.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminService {

    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final ReportRepository reportRepository;

    public Page<UserResponse> getUsers(int page, int size) {
        return userRepository.findAllByOrderByCreatedAtDesc(PageRequest.of(page, size))
                .map(UserResponse::from);
    }

    @Transactional
    public UserResponse promoteToAdmin(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        user.promoteToAdmin();
        return UserResponse.from(user);
    }

    @Transactional
    public UserResponse demoteToUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        user.demoteToUser();
        return UserResponse.from(user);
    }

    public Page<PostResponse> getReportedPosts(int page, int size) {
        return postRepository.findByReportCountGreaterThanOrderByReportCountDesc(0, PageRequest.of(page, size))
                .map(PostResponse::from);
    }

    public Page<PostResponse> getInquiries(int page, int size, Boolean resolved) {
        if (resolved != null) {
            return postRepository.findByTagAndResolvedOrderByCreatedAtDesc(PostTag.INQUIRY, resolved, PageRequest.of(page, size))
                    .map(PostResponse::from);
        }
        return postRepository.findByTagOrderByCreatedAtDesc(PostTag.INQUIRY, PageRequest.of(page, size))
                .map(PostResponse::from);
    }

    public Page<PostResponse> getBlindedPosts(int page, int size) {
        return postRepository.findByBlindedTrueOrderByCreatedAtDesc(PageRequest.of(page, size))
                .map(PostResponse::from);
    }

    @Transactional
    public PostResponse unblindPost(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new CustomException(ErrorCode.POST_NOT_FOUND));
        post.unblind();
        return PostResponse.from(post);
    }

    @Transactional
    public void deletePost(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new CustomException(ErrorCode.POST_NOT_FOUND));
        postRepository.delete(post);
    }

    @Transactional
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        userRepository.delete(user);
    }

    @Transactional
    public PostResponse resolveInquiry(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new CustomException(ErrorCode.POST_NOT_FOUND));
        post.resolve();
        return PostResponse.from(post);
    }

    @Transactional
    public PostResponse unresolveInquiry(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new CustomException(ErrorCode.POST_NOT_FOUND));
        post.unresolve();
        return PostResponse.from(post);
    }

    public List<ReportResponse> getReportsForPost(Long postId) {
        return reportRepository.findByPostIdOrderByCreatedAtDesc(postId).stream()
                .map(ReportResponse::from)
                .toList();
    }
}
