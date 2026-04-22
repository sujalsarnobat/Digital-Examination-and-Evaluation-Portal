package com.exam.service;

import com.exam.dto.QuestionDTO;
import com.exam.exception.BadRequestException;
import com.exam.exception.ResourceNotFoundException;
import com.exam.model.Exam;
import com.exam.model.ExamStatus;
import com.exam.model.Question;
import com.exam.repository.ExamRepository;
import com.exam.repository.QuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class QuestionService {

    private final QuestionRepository questionRepository;
    private final ExamRepository examRepository;

    public Question addQuestion(Long examId, QuestionDTO dto) {
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new ResourceNotFoundException("Exam not found"));

        if (exam.getExamStatus() == ExamStatus.COMPLETED) {
            throw new BadRequestException("Cannot add questions to completed exam");
        }

        Question question = new Question();
        question.setExam(exam);
        question.setQuestionText(dto.getQuestionText());
        question.setQuestionType(dto.getQuestionType());
        question.setOptionsData(dto.getOptionsData());
        question.setAnswerKey(dto.getAnswerKey());
        question.setMarks(dto.getMarks());

        return questionRepository.save(question);
    }

    public List<Question> getByExam(Long examId) {
        return questionRepository.findByExamId(examId);
    }
}
