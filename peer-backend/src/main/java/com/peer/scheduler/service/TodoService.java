package com.peer.scheduler.service;

import com.peer.common.exception.CustomException;
import com.peer.common.exception.ErrorCode;
import com.peer.scheduler.dto.TodoRequest;
import com.peer.scheduler.dto.TodoResponse;
import com.peer.scheduler.entity.Todo;
import com.peer.scheduler.repository.TodoRepository;
import com.peer.user.entity.User;
import com.peer.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TodoService {

    private final TodoRepository todoRepository;
    private final UserRepository userRepository;

    public List<TodoResponse> getTodos(Long userId) {
        return todoRepository.findByUserIdAndParentIsNullOrderBySortOrderAsc(userId)
                .stream()
                .map(TodoResponse::from)
                .toList();
    }

    public TodoResponse getTodo(Long todoId, Long userId) {
        Todo todo = todoRepository.findByIdAndUserId(todoId, userId)
                .orElseThrow(() -> new CustomException(ErrorCode.TODO_NOT_FOUND));
        return TodoResponse.from(todo);
    }

    @Transactional
    public TodoResponse createTodo(TodoRequest request, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        Todo parent = null;
        if (request.getParentId() != null) {
            parent = todoRepository.findByIdAndUserId(request.getParentId(), userId)
                    .orElseThrow(() -> new CustomException(ErrorCode.TODO_NOT_FOUND));
        }

        Todo todo = Todo.builder()
                .user(user)
                .parent(parent)
                .title(request.getTitle())
                .priority(request.getPriority())
                .dueDate(request.getDueDate())
                .sortOrder(request.getSortOrder())
                .build();

        return TodoResponse.from(todoRepository.save(todo));
    }

    @Transactional
    public TodoResponse updateTodo(Long todoId, TodoRequest request, Long userId) {
        Todo todo = todoRepository.findByIdAndUserId(todoId, userId)
                .orElseThrow(() -> new CustomException(ErrorCode.TODO_NOT_FOUND));

        todo.update(
                request.getTitle(),
                request.getPriority(),
                request.getDueDate(),
                request.getSortOrder()
        );

        return TodoResponse.from(todo);
    }

    @Transactional
    public TodoResponse toggleTodo(Long todoId, Long userId) {
        Todo todo = todoRepository.findByIdAndUserId(todoId, userId)
                .orElseThrow(() -> new CustomException(ErrorCode.TODO_NOT_FOUND));
        todo.toggleComplete();
        return TodoResponse.from(todo);
    }

    @Transactional
    public void deleteTodo(Long todoId, Long userId) {
        Todo todo = todoRepository.findByIdAndUserId(todoId, userId)
                .orElseThrow(() -> new CustomException(ErrorCode.TODO_NOT_FOUND));
        todoRepository.delete(todo);
    }
}
