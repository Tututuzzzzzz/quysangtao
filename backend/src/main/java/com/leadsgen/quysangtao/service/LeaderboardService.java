package com.leadsgen.quysangtao.service;

import com.leadsgen.quysangtao.dto.LeaderboardItemDto;
import com.leadsgen.quysangtao.entity.Idea;
import com.leadsgen.quysangtao.entity.IdeaStatus;
import com.leadsgen.quysangtao.repository.IdeaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;

@Service
@RequiredArgsConstructor
public class LeaderboardService {

    private final IdeaRepository ideaRepository;

    public List<LeaderboardItemDto> getUserLeaderboard() {
        List<Idea> allIdeas = ideaRepository.findAllByOrderByCreatedAtDesc();

        Map<String, List<Idea>> groupedBySubmitter = new HashMap<>();

        for (Idea idea : allIdeas) {
            if (idea.getStatus() == IdeaStatus.REJECTED) {
                continue; // Skip rejected ideas
            }
            String name = (idea.getSubmitterName() != null && !idea.getSubmitterName().trim().isEmpty())
                    ? idea.getSubmitterName().trim()
                    : (idea.getAuthor() != null ? idea.getAuthor().getFullName() : "Thành viên LeadsGen");

            groupedBySubmitter.computeIfAbsent(name, k -> new ArrayList<>()).add(idea);
        }

        List<LeaderboardItemDto> leaderboard = new ArrayList<>();

        for (Map.Entry<String, List<Idea>> entry : groupedBySubmitter.entrySet()) {
            String name = entry.getKey();
            List<Idea> ideas = entry.getValue();

            long totalIdeas = ideas.size();
            long implementedIdeas = ideas.stream().filter(i -> i.getStatus() == IdeaStatus.IMPLEMENTED).count();
            long totalScore = ideas.stream().mapToLong(i -> i.getScore() != null ? i.getScore() : 0).sum();
            BigDecimal totalSavings = ideas.stream()
                    .map(i -> i.getEstimatedSavings() != null ? i.getEstimatedSavings() : BigDecimal.ZERO)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            String dept = ideas.stream()
                    .map(Idea::getDepartment)
                    .filter(d -> d != null && !d.trim().isEmpty())
                    .findFirst()
                    .orElse("Khối Công nghệ & Sản phẩm");

            String avatarUrl = ideas.stream()
                    .map(i -> i.getAuthor() != null ? i.getAuthor().getAvatarUrl() : null)
                    .filter(Objects::nonNull)
                    .findFirst()
                    .orElse("https://api.dicebear.com/7.x/avataaars/svg?seed=" + name);

            leaderboard.add(LeaderboardItemDto.builder()
                    .fullName(name)
                    .department(dept)
                    .avatarUrl(avatarUrl)
                    .totalIdeas(totalIdeas)
                    .implementedIdeas(implementedIdeas)
                    .totalScore(totalScore)
                    .totalSavings(totalSavings)
                    .build());
        }

        // Sort by implementedIdeas DESC, totalScore DESC, totalIdeas DESC
        leaderboard.sort((a, b) -> {
            int cmpImpl = Long.compare(b.getImplementedIdeas(), a.getImplementedIdeas());
            if (cmpImpl != 0) return cmpImpl;
            int cmpScore = Long.compare(b.getTotalScore(), a.getTotalScore());
            if (cmpScore != 0) return cmpScore;
            return Long.compare(b.getTotalIdeas(), a.getTotalIdeas());
        });

        // Assign ranks
        int rank = 1;
        for (LeaderboardItemDto item : leaderboard) {
            item.setRank(rank++);
        }

        return leaderboard;
    }
}
