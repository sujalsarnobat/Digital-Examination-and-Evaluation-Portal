package com.exam.service;

import com.exam.exception.BadRequestException;
import com.exam.exception.ResourceNotFoundException;
import com.exam.model.Answer;
import com.exam.model.EvaluationStatus;
import com.exam.model.Result;
import com.exam.model.User;
import com.exam.repository.AnswerRepository;
import com.exam.repository.ResultRepository;
import com.exam.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ResultService {

    private final ResultRepository resultRepository;
    private final AnswerRepository answerRepository;
    private final UserRepository userRepository;

    public Result publishResult(Long examId, Long studentId) {
        List<Answer> answers = answerRepository.findByExamIdAndStudentId(examId, studentId);

        if (answers.isEmpty()) {
            throw new BadRequestException("No answers found for this student and exam");
        }

        boolean pending = answers.stream().anyMatch(a -> a.getEvaluationStatus() == EvaluationStatus.MANUAL_REVIEW_PENDING);
        if (pending) {
            throw new BadRequestException("Some descriptive answers are still pending evaluation");
        }

        int totalScore = answers.stream().mapToInt(a -> a.getAwardedMarks() == null ? 0 : a.getAwardedMarks()).sum();
        int totalMarks = answers.stream().mapToInt(a -> a.getQuestion().getMarks()).sum();
        double percentage = totalMarks == 0 ? 0 : (totalScore * 100.0) / totalMarks;

        Result result = resultRepository.findByExamIdAndStudentId(examId, studentId).orElseGet(Result::new);
        result.setExam(answers.get(0).getExam());
        result.setStudent(answers.get(0).getStudent());
        result.setTotalScore(totalScore);
        result.setPercentage(percentage);
        result.setGrade(getGrade(percentage));
        result.setPublishStatus("PUBLISHED");
        result.setPublishedAt(LocalDateTime.now());
        return resultRepository.save(result);
    }

    public List<Result> publishAllResultsForExam(Long examId) {
        List<User> studentsReady = getStudentsReadyForPublishing(examId);
        
        List<Result> publishedResults = new java.util.ArrayList<>();
        for (User student : studentsReady) {
            Result result = publishResult(examId, student.getId());
            publishedResults.add(result);
        }
        
        return publishedResults;
    }

    public List<Result> getStudentResults(String email) {
        User student = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
        return resultRepository.findByStudentId(student.getId());
    }

    public List<User> getStudentsReadyForPublishing(Long examId) {
        List<Answer> allAnswers = answerRepository.findByExamId(examId);
        
        return allAnswers.stream()
                .map(Answer::getStudent)
                .distinct()
                .filter(student -> {
                    List<Answer> studentAnswers = answerRepository.findByExamIdAndStudentId(examId, student.getId());
                    return !studentAnswers.stream().anyMatch(a -> a.getEvaluationStatus() == EvaluationStatus.MANUAL_REVIEW_PENDING);
                })
                .collect(Collectors.toList());
    }

    private String getGrade(double percentage) {
        if (percentage >= 90) return "A+";
        if (percentage >= 80) return "A";
        if (percentage >= 70) return "B";
        if (percentage >= 60) return "C";
        if (percentage >= 50) return "D";
        return "F";
    }
}

