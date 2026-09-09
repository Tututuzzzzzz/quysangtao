package com.leadsgen.quysangtao.service;

import com.leadsgen.quysangtao.dto.LeaderboardItemDto;
import com.leadsgen.quysangtao.entity.User;
import com.leadsgen.quysangtao.repository.IdeaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LeaderboardService {

    private final IdeaRepository ideaRepository;

    public List<LeaderboardItemDto> getUserLeaderboard() {
        List<Object[]> rows = ideaRepository.getUserLeaderboard();
        List<LeaderboardItemDto> result = new ArrayList<>();

        int rank = 1;
        for (Object[] row : rows) {
            User user = (User) row[0];
            Long totalIdeas = (Long) row[1];
            Long implementedIdeas = (Long) row[2];
            Long totalScore = (Long) row[3];
            BigDecimal totalSavings = (BigDecimal) row[4];

            result.add(LeaderboardItemDto.builder()
                    .rank(rank++)
                    .userId(user.getId())
                    .fullName(user.getFullName())
                    .department(user.getDepartment())
                    .avatarUrl(user.getAvatarUrl())
                    .totalIdeas(totalIdeas != null ? totalIdeas : 0)
                    .implementedIdeas(implementedIdeas != null ? implementedIdeas : 0)
                    .totalScore(totalScore != null ? totalScore : 0)
                    .totalSavings(totalSavings != null ? totalSavings : BigDecimal.ZERO)
                    .build());
        }

        return result;
    }
}
