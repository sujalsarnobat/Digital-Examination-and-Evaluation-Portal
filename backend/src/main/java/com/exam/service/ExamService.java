package com.exam.service;

import com.exam.dto.ExamDTO;
import com.exam.exception.BadRequestException;
import com.exam.exception.ResourceNotFoundException;
import com.exam.model.Exam;
import com.exam.model.ExamStatus;
import com.exam.model.User;
import com.exam.repository.ExamRepository;
import com.exam.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ExamService {

    private final ExamRepository examRepository;
    private final UserRepository userRepository;

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
        LocalDateTime now = LocalDateTime.now();
        return examRepository.findByExamStatusAndStartTimeBeforeAndEndTimeAfter(ExamStatus.LIVE, now, now);
    }
}
