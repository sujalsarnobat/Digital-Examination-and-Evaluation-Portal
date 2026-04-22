package com.exam.repository;

import com.exam.model.Result;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ResultRepository extends JpaRepository<Result, Long> {
    Optional<Result> findByExamIdAndStudentId(Long examId, Long studentId);
    List<Result> findByStudentId(Long studentId);
}
