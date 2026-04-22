package com.exam.service;

import com.exam.dto.AnswerDTO;
import com.exam.dto.ManualEvaluationDTO;
import com.exam.exception.BadRequestException;
import com.exam.exception.ResourceNotFoundException;
import com.exam.model.Answer;
import com.exam.model.EvaluationStatus;
import com.exam.model.Exam;
import com.exam.model.ExamStatus;
import com.exam.model.Question;
import com.exam.model.QuestionType;
import com.exam.model.User;
import com.exam.repository.AnswerRepository;
import com.exam.repository.ExamRepository;
import com.exam.repository.QuestionRepository;
import com.exam.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EvaluationService {

    private final AnswerRepository answerRepository;
    private final UserRepository userRepository;
    private final ExamRepository examRepository;
    private final QuestionRepository questionRepository;

    public Answer submitAnswer(AnswerDTO dto, String studentEmail) {
        User student = userRepository.findByEmail(studentEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        Exam exam = examRepository.findById(dto.getExamId())
                .orElseThrow(() -> new ResourceNotFoundException("Exam not found"));

        if (exam.getExamStatus() != ExamStatus.LIVE) {
            throw new BadRequestException("Exam is not live");
        }

        Question question = questionRepository.findById(dto.getQuestionId())
                .orElseThrow(() -> new ResourceNotFoundException("Question not found"));

        if (!question.getExam().getId().equals(exam.getId())) {
            throw new BadRequestException("Question does not belong to selected exam");
        }

        Answer answer = new Answer();
        answer.setExam(exam);
        answer.setQuestion(question);
        answer.setStudent(student);
        answer.setResponseText(dto.getResponseText());
        answer.setSelectedOption(dto.getSelectedOption());

        if (question.getQuestionType() == QuestionType.MCQ) {
            answer.setEvaluationStatus(EvaluationStatus.AUTO_EVALUATED);
            int marks = question.getAnswerKey() != null && question.getAnswerKey().equalsIgnoreCase(dto.getSelectedOption())
                    ? question.getMarks() : 0;
            answer.setAwardedMarks(marks);
        } else {
            answer.setEvaluationStatus(EvaluationStatus.MANUAL_REVIEW_PENDING);
            answer.setAwardedMarks(0);
        }

        return answerRepository.save(answer);
    }

    public Answer manualEvaluate(ManualEvaluationDTO dto, String facultyEmail) {
        User faculty = userRepository.findByEmail(facultyEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Faculty not found"));

        Answer answer = answerRepository.findById(dto.getAnswerId())
                .orElseThrow(() -> new ResourceNotFoundException("Answer not found"));

        if (dto.getAwardedMarks() < 0 || dto.getAwardedMarks() > answer.getQuestion().getMarks()) {
            throw new BadRequestException("Awarded marks out of range");
        }

        answer.setAwardedMarks(dto.getAwardedMarks());
        answer.setEvaluationStatus(EvaluationStatus.FINALIZED);
        answer.setEvaluatedBy(faculty);
        return answerRepository.save(answer);
    }

    public List<Answer> getAnswersByExamAndQuestion(Long examId, Long questionId) {
        return answerRepository.findByExamIdAndQuestionId(examId, questionId);
    }
}
