package com.peer.algobank.service;

import com.peer.algobank.dto.SolutionRequest;
import com.peer.algobank.dto.SolutionResponse;
import com.peer.algobank.entity.Problem;
import com.peer.algobank.entity.Solution;
import com.peer.algobank.repository.ProblemRepository;
import com.peer.algobank.repository.SolutionRepository;
import com.peer.common.exception.CustomException;
import com.peer.common.exception.ErrorCode;
import com.peer.user.entity.User;
import com.peer.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SolutionService {

    private final SolutionRepository solutionRepository;
    private final ProblemRepository problemRepository;
    private final UserRepository userRepository;

    public List<SolutionResponse> getSolutions(Long problemId) {
        return solutionRepository.findByProblemIdOrderByCreatedAtDesc(problemId)
                .stream()
                .map(SolutionResponse::from)
                .toList();
    }

    public SolutionResponse getSolution(Long solutionId) {
        Solution solution = solutionRepository.findById(solutionId)
                .orElseThrow(() -> new CustomException(ErrorCode.SOLUTION_NOT_FOUND));
        return SolutionResponse.from(solution);
    }

    @Transactional
    public SolutionResponse createSolution(Long problemId, SolutionRequest request, Long userId) {
        if (solutionRepository.existsByProblemIdAndAuthorId(problemId, userId)) {
            throw new CustomException(ErrorCode.DUPLICATE_SOLUTION);
        }

        Problem problem = problemRepository.findById(problemId)
                .orElseThrow(() -> new CustomException(ErrorCode.PROBLEM_NOT_FOUND));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        Solution solution = Solution.builder()
                .problem(problem)
                .author(user)
                .code(request.getCode())
                .language(request.getLanguage())
                .timeComplexity(request.getTimeComplexity())
                .spaceComplexity(request.getSpaceComplexity())
                .explanation(request.getExplanation())
                .githubUrl(request.getGithubUrl())
                .build();

        // +1 XP for submitting a solution
        user.addXp(1);

        return SolutionResponse.from(solutionRepository.save(solution));
    }

    @Transactional
    public SolutionResponse updateSolution(Long solutionId, SolutionRequest request, Long userId) {
        Solution solution = solutionRepository.findByIdAndAuthorId(solutionId, userId)
                .orElseThrow(() -> new CustomException(ErrorCode.SOLUTION_NOT_FOUND));

        solution.update(
                request.getCode(),
                request.getLanguage(),
                request.getTimeComplexity(),
                request.getSpaceComplexity(),
                request.getExplanation(),
                request.getGithubUrl()
        );

        return SolutionResponse.from(solution);
    }

    @Transactional
    public void deleteSolution(Long solutionId, Long userId) {
        Solution solution = solutionRepository.findByIdAndAuthorId(solutionId, userId)
                .orElseThrow(() -> new CustomException(ErrorCode.SOLUTION_NOT_FOUND));
        solutionRepository.delete(solution);
    }
}
