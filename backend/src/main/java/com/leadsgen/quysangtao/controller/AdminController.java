package com.leadsgen.quysangtao.controller;

import com.leadsgen.quysangtao.dto.*;
import com.leadsgen.quysangtao.entity.User;
import com.leadsgen.quysangtao.service.AuthService;
import com.leadsgen.quysangtao.service.IdeaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final IdeaService ideaService;
    private final AuthService authService;

    @GetMapping("/ideas")
    public ResponseEntity<List<IdeaResponse>> getAllIdeasForAdmin() {
        return ResponseEntity.ok(ideaService.getAllIdeas());
    }

    @PutMapping("/ideas/{id}/status")
    public ResponseEntity<IdeaResponse> updateIdeaStatus(
            @PathVariable Long id,
            @Valid @RequestBody IdeaStatusUpdateRequest request) {
        User admin = authService.getCurrentUser();
        return ResponseEntity.ok(ideaService.updateStatus(id, request, admin));
    }

    @PutMapping("/ideas/{id}/evaluate")
    public ResponseEntity<IdeaResponse> evaluateIdea(
            @PathVariable Long id,
            @RequestBody IdeaEvaluationRequest request) {
        return ResponseEntity.ok(ideaService.evaluateIdea(id, request));
    }

    @DeleteMapping("/ideas/{id}")
    public ResponseEntity<?> deleteIdea(@PathVariable Long id) {
        ideaService.deleteIdea(id);
        java.util.Map<String, String> response = new java.util.HashMap<>();
        response.put("message", "Đã xóa thành công sáng kiến ID: " + id);
        return ResponseEntity.ok(response);
    }
}
