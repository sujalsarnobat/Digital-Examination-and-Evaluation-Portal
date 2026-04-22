package com.exam.repository;

import com.exam.model.Answer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

import java.util.List;

public interface AnswerRepository extends JpaRepository<Answer, Long> {
    List<Answer> findByExamIdAndStudentId(Long examId, Long studentId);
    List<Answer> findByExamIdAndQuestionId(Long examId, Long questionId);
    List<Answer> findByExamId(Long examId);
    Optional<Answer> findByExamIdAndQuestionIdAndStudentId(Long examId, Long questionId, Long studentId);

    @Query("SELECT COUNT(DISTINCT a.question.id) FROM Answer a WHERE a.exam.id = :examId AND a.student.id = :studentId")
    long countDistinctQuestionIdByExamIdAndStudentId(@Param("examId") Long examId, @Param("studentId") Long studentId);
}
