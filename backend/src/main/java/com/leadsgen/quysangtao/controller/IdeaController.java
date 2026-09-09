package com.leadsgen.quysangtao.controller;

import com.leadsgen.quysangtao.dto.*;
import com.leadsgen.quysangtao.entity.Feedback;
import com.leadsgen.quysangtao.entity.IdeaHistory;
import com.leadsgen.quysangtao.entity.User;
import com.leadsgen.quysangtao.service.AuthService;
import com.leadsgen.quysangtao.service.FeedbackService;
import com.leadsgen.quysangtao.service.IdeaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ideas")
@RequiredArgsConstructor
public class IdeaController {

    private final IdeaService ideaService;
    private final AuthService authService;
    private final FeedbackService feedbackService;

    @PostMapping
    public ResponseEntity<IdeaResponse> createIdea(@Valid @RequestBody IdeaRequest request) {
        User currentUser = authService.getCurrentUserOrNull();
        return ResponseEntity.ok(ideaService.createIdea(request, currentUser));
    }

    @GetMapping("/my")
    public ResponseEntity<List<IdeaResponse>> getMyIdeas() {
        User currentUser = authService.getCurrentUser();
        return ResponseEntity.ok(ideaService.getMyIdeas(currentUser));
    }

    @GetMapping("/public")
    public ResponseEntity<List<IdeaResponse>> getPublicIdeas() {
        return ResponseEntity.ok(ideaService.getPublicIdeas());
    }

    @GetMapping
    public ResponseEntity<List<IdeaResponse>> getAllIdeas() {
        return ResponseEntity.ok(ideaService.getAllIdeas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<IdeaResponse> getIdeaById(@PathVariable Long id) {
        return ResponseEntity.ok(ideaService.getIdeaById(id));
    }

    @GetMapping("/{id}/history")
    public ResponseEntity<List<IdeaHistoryResponse>> getIdeaHistory(@PathVariable Long id) {
        return ResponseEntity.ok(ideaService.getIdeaHistories(id));
    }

    @GetMapping("/{id}/feedbacks")
    public ResponseEntity<List<Feedback>> getIdeaFeedbacks(@PathVariable Long id) {
        return ResponseEntity.ok(feedbackService.getFeedbacksForIdea(id));
    }

    @PostMapping("/{id}/feedbacks")
    public ResponseEntity<Feedback> addFeedback(@PathVariable Long id, @Valid @RequestBody FeedbackRequest request) {
        User currentUser = authService.getCurrentUser();
        return ResponseEntity.ok(feedbackService.addFeedback(id, currentUser, request));
    }
}
