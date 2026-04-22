package com.exam.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ManualEvaluationDTO {

    @NotNull
    private Long answerId;

    @NotNull
    private Integer awardedMarks;
}
