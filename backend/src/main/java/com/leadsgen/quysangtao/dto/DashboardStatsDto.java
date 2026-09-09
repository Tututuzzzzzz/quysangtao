package com.leadsgen.quysangtao.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Map;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DashboardStatsDto {
    private long totalIdeas;
    private long receivedCount;
    private long reviewCount;
    private long testingCount;
    private long implementedCount;
    private long rejectedCount;
    private BigDecimal totalImplementedSavings;
    private double conversionRate; // % implemented / total
    private Map<String, Long> departmentIdeaCounts;
    private Map<String, BigDecimal> departmentSavings;
}
