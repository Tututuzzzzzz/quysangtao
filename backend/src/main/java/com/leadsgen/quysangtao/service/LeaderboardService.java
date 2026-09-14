package com.leadsgen.quysangtao.service;

import com.leadsgen.quysangtao.dto.LeaderboardItemDto;
import com.leadsgen.quysangtao.entity.Idea;
import com.leadsgen.quysangtao.entity.IdeaStatus;
import com.leadsgen.quysangtao.repository.IdeaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LeaderboardService {

    private final IdeaRepository ideaRepository;

    public List<LeaderboardItemDto> getUserLeaderboard() {
        List<Idea> allIdeas = ideaRepository.findAllByOrderByCreatedAtDesc();

        LocalDateTime now = LocalDateTime.now();
        int currentMonth = now.getMonthValue();
        int currentYear = now.getYear();

        // Lọc các sáng kiến thuộc tháng hiện tại
        List<Idea> monthIdeas = allIdeas.stream()
                .filter(i -> i.getCreatedAt() != null 
                        && i.getCreatedAt().getMonthValue() == currentMonth 
                        && i.getCreatedAt().getYear() == currentYear)
                .collect(Collectors.toList());

        // Nếu tháng hiện tại chưa có dữ liệu, dùng tất cả ý tưởng để tránh bảng bị rỗng khi test
        List<Idea> ideasToProcess = monthIdeas.isEmpty() ? allIdeas : monthIdeas;

        // Gom nhóm theo Mã nhân viên (hoặc Email/Name nếu không có mã NV)
        Map<String, List<Idea>> groupedByEmpCode = new LinkedHashMap<>();

        for (Idea idea : ideasToProcess) {
            if (idea.getStatus() == IdeaStatus.REJECTED) {
                continue; // Bỏ qua ý tưởng bị từ chối
            }
            String key = (idea.getEmployeeCode() != null && !idea.getEmployeeCode().trim().isEmpty())
                    ? idea.getEmployeeCode().trim().toUpperCase()
                    : ((idea.getSubmitterEmail() != null && !idea.getSubmitterEmail().trim().isEmpty())
                            ? idea.getSubmitterEmail().trim().toLowerCase()
                            : (idea.getSubmitterName() != null ? idea.getSubmitterName().trim() : "Thành viên LeadsGen"));

            groupedByEmpCode.computeIfAbsent(key, k -> new ArrayList<>()).add(idea);
        }

        List<LeaderboardItemDto> leaderboard = new ArrayList<>();

        for (Map.Entry<String, List<Idea>> entry : groupedByEmpCode.entrySet()) {
            List<Idea> ideas = entry.getValue();
            if (ideas.isEmpty()) continue;

            // Vì allIdeas đã được ORDER BY createdAt DESC nên phần tử đầu tiên luôn là sáng kiến mới nhất
            Idea latestIdea = ideas.get(0);

            String name = (latestIdea.getSubmitterName() != null && !latestIdea.getSubmitterName().trim().isEmpty())
                    ? latestIdea.getSubmitterName().trim()
                    : (latestIdea.getAuthor() != null ? latestIdea.getAuthor().getFullName() : "Thành viên LeadsGen");

            String dept = (latestIdea.getDepartment() != null && !latestIdea.getDepartment().trim().isEmpty())
                    ? latestIdea.getDepartment().trim()
                    : "Khối Công nghệ & Sản phẩm";

            String empCode = (latestIdea.getEmployeeCode() != null && !latestIdea.getEmployeeCode().trim().isEmpty())
                    ? latestIdea.getEmployeeCode().trim().toUpperCase()
                    : null;

            String avatarUrl = latestIdea.getAuthor() != null && latestIdea.getAuthor().getAvatarUrl() != null
                    ? latestIdea.getAuthor().getAvatarUrl()
                    : "https://api.dicebear.com/7.x/avataaars/svg?seed=" + name;

            long totalIdeas = ideas.size();
            long implementedIdeas = ideas.stream().filter(i -> i.getStatus() == IdeaStatus.IMPLEMENTED).count();
            long totalScore = ideas.stream().mapToLong(i -> i.getScore() != null ? i.getScore() : 0).sum();
            BigDecimal totalSavings = ideas.stream()
                    .map(i -> i.getEstimatedSavings() != null ? i.getEstimatedSavings() : BigDecimal.ZERO)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            leaderboard.add(LeaderboardItemDto.builder()
                    .employeeCode(empCode)
                    .fullName(name)
                    .department(dept)
                    .avatarUrl(avatarUrl)
                    .totalIdeas(totalIdeas)
                    .implementedIdeas(implementedIdeas)
                    .totalScore(totalScore)
                    .totalSavings(totalSavings)
                    .build());
        }

        // Sắp xếp theo: implementedIdeas DESC, totalScore DESC, totalIdeas DESC
        leaderboard.sort((a, b) -> {
            int cmpImpl = Long.compare(b.getImplementedIdeas(), a.getImplementedIdeas());
            if (cmpImpl != 0) return cmpImpl;
            int cmpScore = Long.compare(b.getTotalScore(), a.getTotalScore());
            if (cmpScore != 0) return cmpScore;
            return Long.compare(b.getTotalIdeas(), a.getTotalIdeas());
        });

        // Chỉ lấy Top 5 xuất sắc nhất
        List<LeaderboardItemDto> top5Leaderboard = leaderboard.stream()
                .limit(5)
                .collect(Collectors.toList());

        // Đánh số thứ tự Rank 1 -> 5
        int rank = 1;
        for (LeaderboardItemDto item : top5Leaderboard) {
            item.setRank(rank++);
        }

        return top5Leaderboard;
    }
}
