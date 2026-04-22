package com.exam.service;

import com.exam.dto.ExamDTO;
import com.exam.exception.BadRequestException;
import com.exam.exception.ResourceNotFoundException;
import com.exam.model.Exam;
import com.exam.model.ExamStatus;
import com.exam.model.User;
import com.exam.repository.AnswerRepository;
import com.exam.repository.ExamRepository;
import com.exam.repository.QuestionRepository;
import com.exam.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExamService {

    private final ExamRepository examRepository;
    private final UserRepository userRepository;
    private final AnswerRepository answerRepository;
    private final QuestionRepository questionRepository;

    public Exam createExam(ExamDTO dto, String facultyEmail) {
        User faculty = userRepository.findByEmail(facultyEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Faculty not found"));

        if (!dto.getEndTime().isAfter(dto.getStartTime())) {
            throw new BadRequestException("End time must be after start time");
        }

        Exam exam = new Exam();
        exam.setCreatedBy(faculty);
        exam.setTitle(dto.getTitle());
        exam.setDescription(dto.getDescription());
        exam.setStartTime(dto.getStartTime());
        exam.setEndTime(dto.getEndTime());
        exam.setDurationMinutes(dto.getDurationMinutes());
        exam.setTotalMarks(dto.getTotalMarks());
        exam.setExamStatus(ExamStatus.DRAFT);

        return examRepository.save(exam);
    }

    public Exam updateStatus(Long examId, ExamStatus status) {
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new ResourceNotFoundException("Exam not found"));
        exam.setExamStatus(status);
        return examRepository.save(exam);
    }

    public List<Exam> getAll() {
        return examRepository.findAll();
    }

    public List<Exam> getLiveExams() {
        return examRepository.findByExamStatus(ExamStatus.LIVE);
    }

    public List<Exam> getAvailableLiveExamsForStudent(String studentEmail) {
        User student = userRepository.findByEmail(studentEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        return getLiveExams().stream()
                .filter(exam -> {
                    long totalQuestions = questionRepository.countByExamId(exam.getId());
                    if (totalQuestions == 0) {
                        return true;
                    }
                    long answeredDistinctQuestions = answerRepository.countDistinctQuestionIdByExamIdAndStudentId(exam.getId(), student.getId());
                    return answeredDistinctQuestions < totalQuestions;
                })
                .collect(Collectors.toList());
    }
}
