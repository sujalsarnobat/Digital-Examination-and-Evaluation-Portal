package com.exam.controller;

import com.exam.dto.QuestionDTO;
import com.exam.model.Question;
import com.exam.service.QuestionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/questions")
@RequiredArgsConstructor
public class QuestionController {

    private final QuestionService questionService;

    @PostMapping("/exam/{examId}")
    @PreAuthorize("hasRole('FACULTY')")
    public ResponseEntity<Question> addQuestion(@PathVariable Long examId, @Valid @RequestBody QuestionDTO dto) {
        return ResponseEntity.ok(questionService.addQuestion(examId, dto));
    }

    @GetMapping("/exam/{examId}")
    @PreAuthorize("hasAnyRole('FACULTY','ADMIN','STUDENT')")
    public ResponseEntity<List<Question>> getQuestions(@PathVariable Long examId) {
        return ResponseEntity.ok(questionService.getByExam(examId));
    }
}
