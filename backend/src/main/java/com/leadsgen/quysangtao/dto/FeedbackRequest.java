package com.leadsgen.quysangtao.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class FeedbackRequest {
    @NotBlank
    private String content;

    private String type; // REJECTION_REASON, APPROVAL_NOTE, CLARIFICATION_REQUEST, GENERAL
}
