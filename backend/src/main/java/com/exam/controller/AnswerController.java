package com.exam.controller;

import com.exam.dto.AnswerDTO;
import com.exam.dto.ManualEvaluationDTO;
import com.exam.model.Answer;
import com.exam.service.EvaluationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/answers")
@RequiredArgsConstructor
public class AnswerController {

    private final EvaluationService evaluationService;

    @PostMapping("/submit")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<Answer> submit(@Valid @RequestBody AnswerDTO dto, Authentication authentication) {
        return ResponseEntity.ok(evaluationService.submitAnswer(dto, authentication.getName()));
    }

    @PostMapping("/evaluate")
    @PreAuthorize("hasRole('FACULTY')")
    public ResponseEntity<Answer> evaluate(@Valid @RequestBody ManualEvaluationDTO dto, Authentication authentication) {
        return ResponseEntity.ok(evaluationService.manualEvaluate(dto, authentication.getName()));
    }

    @GetMapping("/exam/{examId}/question/{questionId}")
    @PreAuthorize("hasRole('FACULTY')")
    public ResponseEntity<java.util.List<Answer>> getByExamAndQuestion(
            @PathVariable Long examId,
            @PathVariable Long questionId) {
        return ResponseEntity.ok(evaluationService.getAnswersByExamAndQuestion(examId, questionId));
    }
}
