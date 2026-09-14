package com.leadsgen.quysangtao.service;

import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class LoginAttemptService {

    public static final int MAX_ATTEMPTS = 5;
    public static final int LOCK_TIME_MINUTES = 15;

    private final ConcurrentHashMap<String, AttemptInfo> attemptsCache = new ConcurrentHashMap<>();

    private static class AttemptInfo {
        int count;
        LocalDateTime lastAttempt;
        LocalDateTime lockTime;

        AttemptInfo(int count, LocalDateTime lastAttempt) {
            this.count = count;
            this.lastAttempt = lastAttempt;
        }
    }

    public void loginSucceeded(String key) {
        if (key != null) {
            attemptsCache.remove(key.toLowerCase().trim());
        }
    }

    public void loginFailed(String key) {
        if (key == null || key.isBlank()) return;
        String cleanKey = key.toLowerCase().trim();
        LocalDateTime now = LocalDateTime.now();

        attemptsCache.compute(cleanKey, (k, info) -> {
            if (info == null) {
                return new AttemptInfo(1, now);
            }
            // Reset if previous attempt was over 15 minutes ago
            if (info.lastAttempt.plusMinutes(LOCK_TIME_MINUTES).isBefore(now)) {
                info.count = 1;
                info.lockTime = null;
            } else {
                info.count++;
            }
            info.lastAttempt = now;

            if (info.count >= MAX_ATTEMPTS) {
                info.lockTime = now;
            }
            return info;
        });
    }

    public boolean isBlocked(String key) {
        if (key == null || key.isBlank()) return false;
        String cleanKey = key.toLowerCase().trim();
        AttemptInfo info = attemptsCache.get(cleanKey);
        if (info == null) {
            return false;
        }

        LocalDateTime now = LocalDateTime.now();

        if (info.count >= MAX_ATTEMPTS) {
            if (info.lockTime != null && info.lockTime.plusMinutes(LOCK_TIME_MINUTES).isAfter(now)) {
                return true;
            } else {
                attemptsCache.remove(cleanKey);
                return false;
            }
        }

        if (info.lastAttempt.plusMinutes(LOCK_TIME_MINUTES).isBefore(now)) {
            attemptsCache.remove(cleanKey);
            return false;
        }

        return false;
    }

    public int getRemainingAttempts(String key) {
        if (key == null || key.isBlank()) return MAX_ATTEMPTS;
        String cleanKey = key.toLowerCase().trim();
        AttemptInfo info = attemptsCache.get(cleanKey);
        if (info == null) return MAX_ATTEMPTS;

        if (info.lastAttempt.plusMinutes(LOCK_TIME_MINUTES).isBefore(LocalDateTime.now())) {
            return MAX_ATTEMPTS;
        }

        return Math.max(0, MAX_ATTEMPTS - info.count);
    }

    public long getRemainingLockSeconds(String key) {
        if (key == null || key.isBlank()) return 0;
        String cleanKey = key.toLowerCase().trim();
        AttemptInfo info = attemptsCache.get(cleanKey);
        if (info == null || info.lockTime == null) return 0;

        LocalDateTime expireTime = info.lockTime.plusMinutes(LOCK_TIME_MINUTES);
        LocalDateTime now = LocalDateTime.now();
        if (now.isAfter(expireTime)) return 0;

        return Duration.between(now, expireTime).getSeconds();
    }
}
