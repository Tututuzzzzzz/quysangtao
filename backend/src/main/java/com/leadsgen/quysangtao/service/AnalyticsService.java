package com.leadsgen.quysangtao.service;

import com.leadsgen.quysangtao.dto.DashboardStatsDto;
import com.leadsgen.quysangtao.entity.IdeaStatus;
import com.leadsgen.quysangtao.repository.IdeaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final IdeaRepository ideaRepository;

    public DashboardStatsDto getDashboardStats() {
        long total = ideaRepository.count();
        long received = ideaRepository.countByStatus(IdeaStatus.RECEIVED);
        long review = ideaRepository.countByStatus(IdeaStatus.UNDER_REVIEW);
        long testing = ideaRepository.countByStatus(IdeaStatus.TESTING);
        long implemented = ideaRepository.countByStatus(IdeaStatus.IMPLEMENTED);
        long rejected = ideaRepository.countByStatus(IdeaStatus.REJECTED);

        BigDecimal totalSavings = ideaRepository.calculateTotalImplementedSavings();
        if (totalSavings == null) {
            totalSavings = BigDecimal.ZERO;
        }

        double conversionRate = total > 0 ? ((double) implemented / total) * 100 : 0.0;

        List<Object[]> deptStats = ideaRepository.getDepartmentStats();
        Map<String, Long> departmentCounts = new HashMap<>();
        Map<String, BigDecimal> departmentSavings = new HashMap<>();

        for (Object[] row : deptStats) {
            String dept = (String) row[0];
            Long count = (Long) row[1];
            BigDecimal savings = (BigDecimal) row[3];
            departmentCounts.put(dept != null ? dept : "Chưa phân loại", count);
            departmentSavings.put(dept != null ? dept : "Chưa phân loại", savings != null ? savings : BigDecimal.ZERO);
        }

        return DashboardStatsDto.builder()
                .totalIdeas(total)
                .receivedCount(received)
                .reviewCount(review)
                .testingCount(testing)
                .implementedCount(implemented)
                .rejectedCount(rejected)
                .totalImplementedSavings(totalSavings)
                .conversionRate(Math.round(conversionRate * 10.0) / 10.0)
                .departmentIdeaCounts(departmentCounts)
                .departmentSavings(departmentSavings)
                .build();
    }
}
