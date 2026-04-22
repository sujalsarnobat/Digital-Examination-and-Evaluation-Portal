package com.exam.repository;

import com.exam.model.Exam;
import com.exam.model.ExamStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface ExamRepository extends JpaRepository<Exam, Long> {
    List<Exam> findByExamStatus(ExamStatus examStatus);
    List<Exam> findByExamStatusAndStartTimeBeforeAndEndTimeAfter(ExamStatus status, LocalDateTime startTime, LocalDateTime endTime);
}
