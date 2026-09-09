package com.leadsgen.quysangtao.service;

import com.leadsgen.quysangtao.dto.FeedbackRequest;
import com.leadsgen.quysangtao.entity.Feedback;
import com.leadsgen.quysangtao.entity.Idea;
import com.leadsgen.quysangtao.entity.User;
import com.leadsgen.quysangtao.repository.FeedbackRepository;
import com.leadsgen.quysangtao.repository.IdeaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final IdeaRepository ideaRepository;
    private final NotificationService notificationService;

    @Transactional
    public Feedback addFeedback(Long ideaId, User author, FeedbackRequest request) {
        Idea idea = ideaRepository.findById(ideaId)
                .orElseThrow(() -> new RuntimeException("Idea not found: " + ideaId));

        Feedback feedback = Feedback.builder()
                .idea(idea)
                .author(author)
                .content(request.getContent())
                .type(request.getType() != null ? request.getType() : "GENERAL")
                .build();

        Feedback saved = feedbackRepository.save(feedback);

        // Notify idea author if feedback is from another user
        if (!idea.getAuthor().getId().equals(author.getId())) {
            notificationService.createNotification(
                    idea.getAuthor(),
                    "Phản hồi mới cho ý tưởng của bạn",
                    author.getFullName() + " đã để lại ý kiến: " + request.getContent(),
                    idea.getId()
            );
        }

        return saved;
    }

    public List<Feedback> getFeedbacksForIdea(Long ideaId) {
        return feedbackRepository.findByIdeaIdOrderByCreatedAtAsc(ideaId);
    }
}
