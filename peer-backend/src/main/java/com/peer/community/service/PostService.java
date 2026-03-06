package com.peer.community.service;

import com.peer.common.exception.CustomException;
import com.peer.common.exception.ErrorCode;
import com.peer.community.dto.PostRequest;
import com.peer.community.dto.PostResponse;
import com.peer.community.entity.Post;
import com.peer.community.entity.PostTag;
import com.peer.community.repository.PostRepository;
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
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;

    public Page<PostResponse> getPosts(PostTag tag, int page, int size) {
        PageRequest pageable = PageRequest.of(page, size);
        if (tag != null) {
            return postRepository.findByTagAndBlindedFalseOrderByCreatedAtDesc(tag, pageable)
                    .map(PostResponse::from);
        }
        return postRepository.findByBlindedFalseAndTagNotOrderByCreatedAtDesc(pageable, PostTag.INQUIRY)
                .map(PostResponse::from);
    }

    public Page<PostResponse> getMyInquiries(Long userId, int page, int size) {
        return postRepository.findByTagAndAuthorIdOrderByCreatedAtDesc(PostTag.INQUIRY, userId, PageRequest.of(page, size))
                .map(PostResponse::from);
    }

    @Transactional
    public PostResponse getPost(Long postId) {
        Post post = findPost(postId);
        if (post.isBlinded()) {
            throw new CustomException(ErrorCode.POST_BLINDED);
        }
        post.incrementViewCount();
        return PostResponse.from(post);
    }

    @Transactional
    public PostResponse createPost(PostRequest request, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        Post post = Post.builder()
                .author(user)
                .tag(request.getTag())
                .title(request.getTitle())
                .content(request.getContent())
                .build();

        return PostResponse.from(postRepository.save(post));
    }

    @Transactional
    public PostResponse updatePost(Long postId, PostRequest request, Long userId) {
        Post post = findPost(postId);
        if (!post.getAuthor().getId().equals(userId)) {
            throw new CustomException(ErrorCode.UNAUTHORIZED);
        }

        post.update(request.getTag(), request.getTitle(), request.getContent());
        return PostResponse.from(post);
    }

    @Transactional
    public void deletePost(Long postId, Long userId) {
        Post post = findPost(postId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        if (!post.getAuthor().getId().equals(userId)
                && user.getRole() != Role.ADMIN) {
            throw new CustomException(ErrorCode.UNAUTHORIZED);
        }
        postRepository.delete(post);
    }

    Post findPost(Long postId) {
        return postRepository.findById(postId)
                .orElseThrow(() -> new CustomException(ErrorCode.POST_NOT_FOUND));
    }
}
