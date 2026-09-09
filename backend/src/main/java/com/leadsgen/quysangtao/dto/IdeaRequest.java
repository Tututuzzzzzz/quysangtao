package com.leadsgen.quysangtao.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class IdeaRequest {
    @NotBlank
    private String title;

    @NotBlank
    private String problemDescription;

    @NotBlank
    private String proposedSolution;

    private String expectedBenefit;

    private BigDecimal estimatedSavings;
    private BigDecimal requiredBudget;

    private String scope;                // TEAMS, DEPARTMENT, COMPANY
    private String implementationEffort; // EASY, MEDIUM, HIGH, STRATEGIC
    private String estimatedTimeframe;   // 1-2 tuần, 1 tháng, 3-6 tháng
    private String requiredResources;    // Nguồn lực cần hỗ trợ
    private String kpiImpactTags;        // Chuỗi các tag phân loại KPI

    private Long categoryId;

    private String submitterName;
    private String submitterEmail;
    private String department;
}
