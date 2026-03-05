package com.peer.community.service;

import com.peer.common.exception.CustomException;
import com.peer.common.exception.ErrorCode;
import com.peer.community.dto.CommentRequest;
import com.peer.community.dto.CommentResponse;
import com.peer.community.entity.Comment;
import com.peer.community.entity.Post;
import com.peer.community.repository.CommentRepository;
import com.peer.user.entity.User;
import com.peer.notification.entity.NotificationType;
import com.peer.notification.service.NotificationService;
import com.peer.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostService postService;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public List<CommentResponse> getComments(Long postId) {
        return commentRepository.findByPostIdAndParentIsNullOrderByCreatedAtAsc(postId)
                .stream()
                .map(CommentResponse::from)
                .toList();
    }

    @Transactional
    public CommentResponse createComment(Long postId, CommentRequest request, Long userId) {
        Post post = postService.findPost(postId);
        if (post.isBlinded()) {
            throw new CustomException(ErrorCode.POST_BLINDED);
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        Comment parent = null;
        if (request.getParentId() != null) {
            parent = commentRepository.findById(request.getParentId())
                    .orElseThrow(() -> new CustomException(ErrorCode.COMMENT_NOT_FOUND));
            // 2-level threading: if replying to a reply, attach to the root parent instead
            if (parent.getParent() != null) {
                parent = parent.getParent();
            }
        }

        Comment comment = Comment.builder()
                .post(post)
                .author(user)
                .parent(parent)
                .content(request.getContent())
                .build();

        Comment saved = commentRepository.save(comment);

        // Notify post author about new comment (unless commenting on own post)
        Long postAuthorId = post.getAuthor().getId();
        if (!postAuthorId.equals(userId)) {
            notificationService.send(postAuthorId, NotificationType.COMMENT,
                    "New comment on your post",
                    user.getName() + " commented on \"" + post.getTitle() + "\"",
                    post.getId());
        }

        return CommentResponse.from(saved);
    }

    @Transactional
    public CommentResponse updateComment(Long commentId, CommentRequest request, Long userId) {
        Comment comment = commentRepository.findByIdAndAuthorId(commentId, userId)
                .orElseThrow(() -> new CustomException(ErrorCode.COMMENT_NOT_FOUND));
        comment.update(request.getContent());
        return CommentResponse.from(comment);
    }

    @Transactional
    public void deleteComment(Long commentId, Long userId) {
        Comment comment = commentRepository.findByIdAndAuthorId(commentId, userId)
                .orElseThrow(() -> new CustomException(ErrorCode.COMMENT_NOT_FOUND));
        commentRepository.delete(comment);
    }
}
