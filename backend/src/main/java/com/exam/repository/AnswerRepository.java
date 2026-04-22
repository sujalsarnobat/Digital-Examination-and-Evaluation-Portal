package com.exam.repository;

import com.exam.model.Answer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AnswerRepository extends JpaRepository<Answer, Long> {
    List<Answer> findByExamIdAndStudentId(Long examId, Long studentId);
    List<Answer> findByExamIdAndQuestionId(Long examId, Long questionId);
}
