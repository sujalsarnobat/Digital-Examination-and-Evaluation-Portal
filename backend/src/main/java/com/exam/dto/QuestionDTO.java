package com.exam.dto;

import com.exam.model.QuestionType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class QuestionDTO {

    @NotBlank
    private String questionText;

    @NotNull
    private QuestionType questionType;

    private String optionsData;

    private String answerKey;

    @NotNull
    @Min(1)
    private Integer marks;
}
