package com.leadsgen.quysangtao.dto;

import com.leadsgen.quysangtao.entity.IdeaStatus;
import com.leadsgen.quysangtao.entity.TagCategory;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class IdeaResponse {
    private Long id;
    private String title;
    private String problemDescription;
    private String proposedSolution;
    private String expectedBenefit;
    private BigDecimal estimatedSavings;
    private BigDecimal requiredBudget;

    private String scope;
    private String implementationEffort;
    private String estimatedTimeframe;
    private String requiredResources;
    private String kpiImpactTags;

    private IdeaStatus status;
    private TagCategory tagCategory;
    private Integer score;
    
    private Long authorId;
    private String authorName;
    private String authorDepartment;
    private String authorAvatar;
    private String submitterPhone;
    private String workingUnit;
    private String coauthorEmails;

    private Long categoryId;
    private String categoryName;

    private String attachmentUrl;
    private String attachmentName;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
