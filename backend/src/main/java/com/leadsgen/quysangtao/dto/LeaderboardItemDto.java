package com.leadsgen.quysangtao.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LeaderboardItemDto {
    private int rank;
    private Long userId;
    private String fullName;
    private String department;
    private String avatarUrl;
    private long totalIdeas;
    private long implementedIdeas;
    private long totalScore;
    private BigDecimal totalSavings;
}
