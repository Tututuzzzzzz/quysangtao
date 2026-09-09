package com.leadsgen.quysangtao.service;

import com.leadsgen.quysangtao.dto.*;
import com.leadsgen.quysangtao.entity.*;
import com.leadsgen.quysangtao.messaging.RabbitMQProducer;
import com.leadsgen.quysangtao.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class IdeaService {

    private final IdeaRepository ideaRepository;
    private final CategoryRepository categoryRepository;
    private final IdeaHistoryRepository ideaHistoryRepository;
    private final NotificationService notificationService;
    private final RabbitMQProducer rabbitMQProducer;
    private final EmailService emailService;

    @Transactional
    public IdeaResponse createIdea(IdeaRequest request, User author) {
        Category category = null;
        if (request.getCategoryId() != null) {
            category = categoryRepository.findById(request.getCategoryId()).orElse(null);
        }

        TagCategory autoTag = suggestTagCategory(request.getProblemDescription() + " " + request.getProposedSolution());
        if (autoTag == null && category != null) {
            autoTag = category.getDefaultTag();
        }
        if (autoTag == null) {
            autoTag = TagCategory.BETTER_WORK;
        }

        String dept = author != null ? author.getDepartment() : (request.getDepartment() != null ? request.getDepartment() : "Khối Công Khai");
        String submitterName = author != null ? author.getFullName() : (request.getSubmitterName() != null ? request.getSubmitterName() : "Thành viên LeadsGen");
        String submitterEmail = author != null ? author.getEmail() : request.getSubmitterEmail();
        String submitterPhone = request.getSubmitterPhone();
        String workingUnit = request.getWorkingUnit() != null ? request.getWorkingUnit() : "Tập đoàn LeadsGen";
        String coauthorEmails = request.getCoauthorEmails();

        Idea idea = Idea.builder()
                .title(request.getTitle())
                .problemDescription(request.getProblemDescription())
                .proposedSolution(request.getProposedSolution())
                .expectedBenefit(request.getExpectedBenefit())
                .estimatedSavings(request.getEstimatedSavings())
                .requiredBudget(request.getRequiredBudget())
                .scope(request.getScope() != null ? request.getScope() : "DEPARTMENT")
                .implementationEffort(request.getImplementationEffort() != null ? request.getImplementationEffort() : "MEDIUM")
                .estimatedTimeframe(request.getEstimatedTimeframe() != null ? request.getEstimatedTimeframe() : "1 tháng")
                .requiredResources(request.getRequiredResources())
                .kpiImpactTags(request.getKpiImpactTags())
                .status(IdeaStatus.RECEIVED)
                .tagCategory(autoTag)
                .author(author)
                .submitterName(submitterName)
                .submitterEmail(submitterEmail)
                .submitterPhone(submitterPhone)
                .workingUnit(workingUnit)
                .coauthorEmails(coauthorEmails)
                .department(dept)
                .category(category)
                .build();

        Idea saved = ideaRepository.save(idea);

        // Record initial history
        IdeaHistory history = IdeaHistory.builder()
                .idea(saved)
                .oldStatus(null)
                .newStatus(IdeaStatus.RECEIVED)
                .changedBy(author)
                .note("Khởi tạo ý tưởng mới từ Cổng Landing Page")
                .build();
        ideaHistoryRepository.save(history);

        // Dispatch Email Notification to Ban Quản trị Quỹ & CC Participants
        emailService.sendNewIdeaNotification(saved);

        // RabbitMQ message
        rabbitMQProducer.sendStatusNotification("Ý tưởng mới '" + saved.getTitle() + "' đã được nộp bởi " + submitterName);

        return mapToResponse(saved);
    }

    public List<IdeaResponse> getMyIdeas(User author) {
        return ideaRepository.findByAuthorOrderByCreatedAtDesc(author)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<IdeaResponse> getAllIdeas() {
        return ideaRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<IdeaResponse> getPublicIdeas() {
        return ideaRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .limit(20)
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public IdeaResponse getIdeaById(Long id) {
        Idea idea = ideaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Idea not found with id: " + id));
        return mapToResponse(idea);
    }

    public List<IdeaHistoryResponse> getIdeaHistories(Long ideaId) {
        return ideaHistoryRepository.findByIdeaIdOrderByCreatedAtAsc(ideaId)
                .stream()
                .map(h -> IdeaHistoryResponse.builder()
                        .id(h.getId())
                        .ideaId(h.getIdea().getId())
                        .oldStatus(h.getOldStatus())
                        .newStatus(h.getNewStatus())
                        .note(h.getNote())
                        .changedById(h.getChangedBy() != null ? h.getChangedBy().getId() : null)
                        .changedByName(h.getChangedBy() != null ? h.getChangedBy().getFullName() : "Hệ thống")
                        .changedByAvatar(h.getChangedBy() != null ? h.getChangedBy().getAvatarUrl() : null)
                        .createdAt(h.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional
    public IdeaResponse updateStatus(Long ideaId, IdeaStatusUpdateRequest request, User admin) {
        Idea idea = ideaRepository.findById(ideaId)
                .orElseThrow(() -> new RuntimeException("Idea not found with id: " + ideaId));

        IdeaStatus oldStatus = idea.getStatus();
        if (oldStatus == request.getNewStatus()) {
            return mapToResponse(idea);
        }

        idea.setStatus(request.getNewStatus());
        Idea updated = ideaRepository.save(idea);

        // Record history
        IdeaHistory history = IdeaHistory.builder()
                .idea(updated)
                .oldStatus(oldStatus)
                .newStatus(request.getNewStatus())
                .changedBy(admin)
                .note(request.getNote() != null ? request.getNote() : "Chuyển trạng thái sang " + request.getNewStatus())
                .build();
        ideaHistoryRepository.save(history);

        // Notification to user
        String message = String.format("Ý tưởng '%s' đã chuyển trạng thái từ [%s] sang [%s].",
                idea.getTitle(), getStatusLabel(oldStatus), getStatusLabel(request.getNewStatus()));
        if (idea.getAuthor() != null) {
            notificationService.createNotification(idea.getAuthor(), "Cập nhật tiến trình ý tưởng", message, idea.getId());
        }

        // RabbitMQ Producer
        rabbitMQProducer.sendStatusNotification(message);

        return mapToResponse(updated);
    }

    @Transactional
    public IdeaResponse evaluateIdea(Long ideaId, IdeaEvaluationRequest request) {
        Idea idea = ideaRepository.findById(ideaId)
                .orElseThrow(() -> new RuntimeException("Idea not found with id: " + ideaId));

        if (request.getTagCategory() != null) {
            idea.setTagCategory(request.getTagCategory());
        }
        if (request.getScore() != null) {
            idea.setScore(request.getScore());
        }
        if (request.getEstimatedSavings() != null) {
            idea.setEstimatedSavings(request.getEstimatedSavings());
        }
        if (request.getRequiredBudget() != null) {
            idea.setRequiredBudget(request.getRequiredBudget());
        }

        Idea saved = ideaRepository.save(idea);
        return mapToResponse(saved);
    }

    private TagCategory suggestTagCategory(String text) {
        if (text == null) return TagCategory.BETTER_WORK;
        String lower = text.toLowerCase();
        if (lower.contains("văn phòng") || lower.contains("môi trường") || lower.contains("tiện ích") || lower.contains("phòng họp") || lower.contains("trang thiết bị") || lower.contains("đời sống")) {
            return TagCategory.BETTER_WORKPLACE;
        }
        return TagCategory.BETTER_WORK;
    }

    private String getStatusLabel(IdeaStatus status) {
        if (status == null) return "";
        return switch (status) {
            case RECEIVED -> "Đã tiếp nhận";
            case UNDER_REVIEW -> "Đang đánh giá";
            case TESTING -> "Thử nghiệm";
            case IMPLEMENTED -> "Áp dụng";
            case REJECTED -> "Từ chối";
        };
    }

    public IdeaResponse mapToResponse(Idea idea) {
        Long authorId = idea.getAuthor() != null ? idea.getAuthor().getId() : null;
        String authorName = idea.getAuthor() != null ? idea.getAuthor().getFullName() : (idea.getSubmitterName() != null ? idea.getSubmitterName() : "Thành viên LeadsGen");
        String authorDepartment = idea.getAuthor() != null ? idea.getAuthor().getDepartment() : (idea.getDepartment() != null ? idea.getDepartment() : "Khối Công Khai");
        String authorAvatar = idea.getAuthor() != null ? idea.getAuthor().getAvatarUrl() : null;

        return IdeaResponse.builder()
                .id(idea.getId())
                .title(idea.getTitle())
                .problemDescription(idea.getProblemDescription())
                .proposedSolution(idea.getProposedSolution())
                .expectedBenefit(idea.getExpectedBenefit())
                .estimatedSavings(idea.getEstimatedSavings())
                .requiredBudget(idea.getRequiredBudget())
                .scope(idea.getScope())
                .implementationEffort(idea.getImplementationEffort())
                .estimatedTimeframe(idea.getEstimatedTimeframe())
                .requiredResources(idea.getRequiredResources())
                .kpiImpactTags(idea.getKpiImpactTags())
                .status(idea.getStatus())
                .tagCategory(idea.getTagCategory())
                .score(idea.getScore())
                .authorId(authorId)
                .authorName(authorName)
                .authorDepartment(authorDepartment)
                .authorAvatar(authorAvatar)
                .submitterPhone(idea.getSubmitterPhone())
                .workingUnit(idea.getWorkingUnit())
                .coauthorEmails(idea.getCoauthorEmails())
                .categoryId(idea.getCategory() != null ? idea.getCategory().getId() : null)
                .categoryName(idea.getCategory() != null ? idea.getCategory().getName() : "Khác")
                .createdAt(idea.getCreatedAt())
                .updatedAt(idea.getUpdatedAt())
                .build();
    }
}
