package com.peer.algobank.service;

import com.peer.algobank.dto.EvaluationRequest;
import com.peer.algobank.dto.EvaluationResponse;
import com.peer.algobank.entity.Evaluation;
import com.peer.algobank.entity.Solution;
import com.peer.algobank.repository.EvaluationRepository;
import com.peer.algobank.repository.SolutionRepository;
import com.peer.common.exception.CustomException;
import com.peer.common.exception.ErrorCode;
import com.peer.notification.entity.NotificationType;
import com.peer.notification.service.NotificationService;
import com.peer.user.entity.User;
import com.peer.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EvaluationService {

    private final EvaluationRepository evaluationRepository;
    private final SolutionRepository solutionRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public List<EvaluationResponse> getEvaluations(Long solutionId) {
        return evaluationRepository.findBySolutionIdOrderByCreatedAtDesc(solutionId)
                .stream()
                .map(EvaluationResponse::from)
                .toList();
    }

    @Transactional
    public EvaluationResponse createEvaluation(Long solutionId, EvaluationRequest request, Long userId) {
        Solution solution = solutionRepository.findById(solutionId)
                .orElseThrow(() -> new CustomException(ErrorCode.SOLUTION_NOT_FOUND));

        // Cannot evaluate own solution
        if (solution.getAuthor().getId().equals(userId)) {
            throw new CustomException(ErrorCode.SELF_EVALUATION);
        }

        // Cannot evaluate same solution twice
        if (evaluationRepository.existsBySolutionIdAndEvaluatorId(solutionId, userId)) {
            throw new CustomException(ErrorCode.DUPLICATE_EVALUATION);
        }

        User evaluator = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        Evaluation evaluation = Evaluation.builder()
                .solution(solution)
                .evaluator(evaluator)
                .correctness(request.getCorrectness())
                .codeReadability(request.getCodeReadability())
                .commentsClarity(request.getCommentsClarity())
                .conditionSatisfaction(request.getConditionSatisfaction())
                .feedback(request.getFeedback())
                .build();

        evaluationRepository.save(evaluation);

        // +2 XP for evaluator
        evaluator.addXp(2);

        // +averageScore XP for solution author (1~5)
        int avgScore = evaluation.getAverageScore();
        User solutionAuthor = solution.getAuthor();
        solutionAuthor.addXp(avgScore);

        // Notify solution author
        notificationService.send(
                solutionAuthor.getId(),
                NotificationType.XP_EARNED,
                "New evaluation received",
                evaluator.getName() + " evaluated your solution (+" + avgScore + " XP)",
                solutionId
        );

        return EvaluationResponse.from(evaluation);
    }
}
