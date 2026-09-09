package com.leadsgen.quysangtao.controller;

import com.leadsgen.quysangtao.entity.Notification;
import com.leadsgen.quysangtao.entity.User;
import com.leadsgen.quysangtao.service.AuthService;
import com.leadsgen.quysangtao.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;
    private final AuthService authService;

    @GetMapping
    public ResponseEntity<List<Notification>> getMyNotifications() {
        User currentUser = authService.getCurrentUser();
        return ResponseEntity.ok(notificationService.getMyNotifications(currentUser));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Long>> getUnreadCount() {
        User currentUser = authService.getCurrentUser();
        return ResponseEntity.ok(Map.of("unreadCount", notificationService.countUnread(currentUser)));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok().build();
    }
}
