package com.exam.controller;

import com.exam.model.Result;
import com.exam.model.User;
import com.exam.service.ResultService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/results")
@RequiredArgsConstructor
public class ResultController {

    private final ResultService resultService;

    @PostMapping("/publish")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Result> publish(@RequestParam Long examId, @RequestParam Long studentId) {
        return ResponseEntity.ok(resultService.publishResult(examId, studentId));
    }

    @PostMapping("/publish-all/{examId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Result>> publishAllForExam(@PathVariable Long examId) {
        return ResponseEntity.ok(resultService.publishAllResultsForExam(examId));
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<Result>> myResults(Authentication authentication) {
        return ResponseEntity.ok(resultService.getStudentResults(authentication.getName()));
    }

    @GetMapping("/exam/{examId}/students-ready")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getStudentsReadyForPublishing(@PathVariable Long examId) {
        return ResponseEntity.ok(resultService.getStudentsReadyForPublishing(examId));
    }
}
