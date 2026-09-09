package com.leadsgen.quysangtao.dto;

import com.leadsgen.quysangtao.entity.TagCategory;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class IdeaEvaluationRequest {
    private TagCategory tagCategory;
    private Integer score; // 1 - 100
    private BigDecimal estimatedSavings;
    private BigDecimal requiredBudget;
}
