package com.peer.common.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {

    // Auth
    INVALID_REFRESH_TOKEN(HttpStatus.UNAUTHORIZED, "Invalid or expired refresh token"),
    UNAUTHORIZED(HttpStatus.UNAUTHORIZED, "Authentication required"),

    // User
    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "User not found"),

    // Event
    EVENT_NOT_FOUND(HttpStatus.NOT_FOUND, "Event not found"),
    INVALID_EVENT_TIME(HttpStatus.BAD_REQUEST, "End time must be after start time"),

    // Todo
    TODO_NOT_FOUND(HttpStatus.NOT_FOUND, "Todo not found"),

    // Notification
    NOTIFICATION_NOT_FOUND(HttpStatus.NOT_FOUND, "Notification not found"),

    // AlgoBank
    PROBLEM_NOT_FOUND(HttpStatus.NOT_FOUND, "Problem not found"),
    SOLUTION_NOT_FOUND(HttpStatus.NOT_FOUND, "Solution not found"),
    DUPLICATE_SOLUTION(HttpStatus.CONFLICT, "You have already submitted a solution for this problem"),
    SELF_EVALUATION(HttpStatus.BAD_REQUEST, "You cannot evaluate your own solution"),
    DUPLICATE_EVALUATION(HttpStatus.CONFLICT, "You have already evaluated this solution"),

    // Community
    POST_NOT_FOUND(HttpStatus.NOT_FOUND, "Post not found"),
    POST_BLINDED(HttpStatus.FORBIDDEN, "This post has been blinded due to reports"),
    COMMENT_NOT_FOUND(HttpStatus.NOT_FOUND, "Comment not found"),
    ALREADY_LIKED(HttpStatus.CONFLICT, "You have already liked this post"),
    NOT_LIKED(HttpStatus.BAD_REQUEST, "You have not liked this post"),
    SELF_REPORT(HttpStatus.BAD_REQUEST, "You cannot report your own post"),
    DUPLICATE_REPORT(HttpStatus.CONFLICT, "You have already reported this post"),
    INVALID_REPLY_DEPTH(HttpStatus.BAD_REQUEST, "Replies to replies are not allowed"),

    // Common
    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "Internal server error");

    private final HttpStatus status;
    private final String message;
}
