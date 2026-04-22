package com.exam.controller;

import com.exam.dto.ExamDTO;
import com.exam.model.Exam;
import com.exam.model.ExamStatus;
import com.exam.service.ExamService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/exams")
@RequiredArgsConstructor
public class ExamController {

    private final ExamService examService;

    @PostMapping
    @PreAuthorize("hasAnyRole('FACULTY','ADMIN')")
    public ResponseEntity<Exam> createExam(@Valid @RequestBody ExamDTO dto, Authentication authentication) {
        return ResponseEntity.ok(examService.createExam(dto, authentication.getName()));
    }

    @PatchMapping("/{examId}/status")
    @PreAuthorize("hasAnyRole('FACULTY','ADMIN')")
    public ResponseEntity<Exam> updateStatus(@PathVariable Long examId, @RequestParam ExamStatus status) {
        return ResponseEntity.ok(examService.updateStatus(examId, status));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('FACULTY','ADMIN','STUDENT')")
    public ResponseEntity<List<Exam>> getAll() {
        return ResponseEntity.ok(examService.getAll());
    }

    @GetMapping("/live")
    @PreAuthorize("hasAnyRole('FACULTY','ADMIN','STUDENT')")
    public ResponseEntity<List<Exam>> getLive() {
        return ResponseEntity.ok(examService.getLiveExams());
    }

    @GetMapping("/live/available")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<Exam>> getAvailableLiveForStudent(Authentication authentication) {
        return ResponseEntity.ok(examService.getAvailableLiveExamsForStudent(authentication.getName()));
    }
}
