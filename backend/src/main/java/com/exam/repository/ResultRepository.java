package com.exam.repository;

import com.exam.model.Result;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ResultRepository extends JpaRepository<Result, Long> {
    Optional<Result> findByExamIdAndStudentId(Long examId, Long studentId);
    List<Result> findByStudentId(Long studentId);
    
    @Query("SELECT DISTINCT r.exam FROM Result r WHERE r.publishStatus = 'PUBLISHED'")
    List<Result> findPublishedResults();
}

