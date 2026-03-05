package com.peer.algobank.service;

import com.peer.algobank.dto.ProblemRequest;
import com.peer.algobank.dto.ProblemResponse;
import com.peer.algobank.entity.Problem;
import com.peer.algobank.repository.ProblemRepository;
import com.peer.common.exception.CustomException;
import com.peer.common.exception.ErrorCode;
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
public class ProblemService {

    private final ProblemRepository problemRepository;
    private final UserRepository userRepository;

    public Page<ProblemResponse> getProblems(int page, int size) {
        return problemRepository.findAllByOrderByCreatedAtDesc(PageRequest.of(page, size))
                .map(ProblemResponse::from);
    }

    public ProblemResponse getProblem(Long problemId) {
        Problem problem = problemRepository.findById(problemId)
                .orElseThrow(() -> new CustomException(ErrorCode.PROBLEM_NOT_FOUND));
        return ProblemResponse.from(problem);
    }

    @Transactional
    public ProblemResponse createProblem(ProblemRequest request, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        Problem problem = Problem.builder()
                .author(user)
                .title(request.getTitle())
                .description(request.getDescription())
                .difficulty(request.getDifficulty())
                .tags(request.getTags())
                .build();

        return ProblemResponse.from(problemRepository.save(problem));
    }

    @Transactional
    public ProblemResponse updateProblem(Long problemId, ProblemRequest request, Long userId) {
        Problem problem = problemRepository.findById(problemId)
                .orElseThrow(() -> new CustomException(ErrorCode.PROBLEM_NOT_FOUND));

        if (!problem.getAuthor().getId().equals(userId)) {
            throw new CustomException(ErrorCode.UNAUTHORIZED);
        }

        problem.update(request.getTitle(), request.getDescription(),
                request.getDifficulty(), request.getTags());

        return ProblemResponse.from(problem);
    }

    @Transactional
    public void deleteProblem(Long problemId, Long userId) {
        Problem problem = problemRepository.findById(problemId)
                .orElseThrow(() -> new CustomException(ErrorCode.PROBLEM_NOT_FOUND));

        if (!problem.getAuthor().getId().equals(userId)) {
            throw new CustomException(ErrorCode.UNAUTHORIZED);
        }

        problemRepository.delete(problem);
    }
}
