package com.leadsgen.quysangtao.controller;

import com.leadsgen.quysangtao.dto.DashboardStatsDto;
import com.leadsgen.quysangtao.dto.LeaderboardItemDto;
import com.leadsgen.quysangtao.service.AnalyticsService;
import com.leadsgen.quysangtao.service.LeaderboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;
    private final LeaderboardService leaderboardService;

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardStatsDto> getDashboardStats() {
        return ResponseEntity.ok(analyticsService.getDashboardStats());
    }

    @GetMapping("/leaderboard")
    public ResponseEntity<List<LeaderboardItemDto>> getLeaderboard() {
        return ResponseEntity.ok(leaderboardService.getUserLeaderboard());
    }
}
