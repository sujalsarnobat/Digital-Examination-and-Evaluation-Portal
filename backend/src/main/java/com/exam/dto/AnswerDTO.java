package com.exam.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AnswerDTO {

    @NotNull
    private Long examId;

    @NotNull
    private Long questionId;

    private String responseText;

    private String selectedOption;
}
