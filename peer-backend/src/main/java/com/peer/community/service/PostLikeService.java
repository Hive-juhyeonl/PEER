package com.peer.community.service;

import com.peer.common.exception.CustomException;
import com.peer.common.exception.ErrorCode;
import com.peer.community.entity.Post;
import com.peer.community.entity.PostLike;
import com.peer.community.repository.PostLikeRepository;
import com.peer.user.entity.User;
import com.peer.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PostLikeService {

    private final PostLikeRepository postLikeRepository;
    private final PostService postService;
    private final UserRepository userRepository;

    @Transactional
    public void like(Long postId, Long userId) {
        if (postLikeRepository.existsByPostIdAndUserId(postId, userId)) {
            throw new CustomException(ErrorCode.ALREADY_LIKED);
        }

        Post post = postService.findPost(postId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        postLikeRepository.save(new PostLike(post, user));
        post.incrementLikeCount();
    }

    @Transactional
    public void unlike(Long postId, Long userId) {
        PostLike postLike = postLikeRepository.findByPostIdAndUserId(postId, userId)
                .orElseThrow(() -> new CustomException(ErrorCode.NOT_LIKED));

        postLikeRepository.delete(postLike);
        postService.findPost(postId).decrementLikeCount();
    }
}
