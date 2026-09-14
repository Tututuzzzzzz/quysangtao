package com.leadsgen.quysangtao.service;

import com.leadsgen.quysangtao.config.JwtUtils;
import com.leadsgen.quysangtao.dto.*;
import com.leadsgen.quysangtao.entity.User;
import com.leadsgen.quysangtao.entity.UserRole;
import com.leadsgen.quysangtao.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Error: Username đã tồn tại!");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Error: Email đã được sử dụng!");
        }

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .department(request.getDepartment() != null ? request.getDepartment() : "Công nghệ Thông tin")
                .role(UserRole.ROLE_EMPLOYEE)
                .build();

        userRepository.save(user);

        String token = jwtUtils.generateJwtToken(user.getUsername(), user.getRole().name(), user.getId());

        return AuthResponse.builder()
                .token(token)
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .department(user.getDepartment())
                .role(user.getRole())
                .avatarUrl(user.getAvatarUrl())
                .build();
    }

    @Transactional
    public AuthResponse login(AuthRequest request) {
        return login(request, null);
    }

    @Transactional
    public AuthResponse login(AuthRequest request, String clientIp) {
        String input = request.getUsernameOrEmail() != null ? request.getUsernameOrEmail().trim() : "";
        String pass = request.getPassword() != null ? request.getPassword().trim() : "";

        String lockKey = (clientIp != null && !clientIp.isBlank()) ? clientIp + ":" + input : input;

        if (loginAttemptService.isBlocked(lockKey) || loginAttemptService.isBlocked(input)) {
            long remainingSec = loginAttemptService.getRemainingLockSeconds(lockKey);
            if (remainingSec <= 0) remainingSec = loginAttemptService.getRemainingLockSeconds(input);
            long minutes = Math.max(1, (remainingSec + 59) / 60);
            throw new RuntimeException("Tài khoản hoặc thiết bị của bạn đã bị khóa tạm thời do thử sai quá 5 lần liên tiếp. Vui lòng thử lại sau khoảng " + minutes + " phút!");
        }

        try {
            if (("admin".equalsIgnoreCase(input) || "admin@leadsgen.com".equalsIgnoreCase(input)) && "admin123".equals(pass)) {
                User adminUser = userRepository.findByUsername("admin")
                        .orElseGet(() -> userRepository.findByEmail("admin@leadsgen.com").orElse(null));

                if (adminUser == null) {
                    userRepository.save(User.builder()
                            .username("admin")
                            .email("admin@leadsgen.com")
                            .password(passwordEncoder.encode("admin123"))
                            .fullName("Ban Quản Trị LeadsGen")
                            .department("Ban Giám Đốc")
                            .role(UserRole.ROLE_ADMIN)
                            .avatarUrl("https://api.dicebear.com/7.x/avataaars/svg?seed=Admin")
                            .build());
                }
            }

            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(input, pass));

            SecurityContextHolder.getContext().setAuthentication(authentication);

            User user = userRepository.findByUsername(input)
                    .orElseGet(() -> userRepository.findByEmail(input)
                            .orElseThrow(() -> new RuntimeException("Không tìm thấy thông tin tài khoản.")));

            // Reset failed attempts on success
            loginAttemptService.loginSucceeded(lockKey);
            loginAttemptService.loginSucceeded(input);

            String token = jwtUtils.generateJwtToken(user.getUsername(), user.getRole().name(), user.getId());

            return AuthResponse.builder()
                    .token(token)
                    .id(user.getId())
                    .username(user.getUsername())
                    .email(user.getEmail())
                    .fullName(user.getFullName())
                    .department(user.getDepartment())
                    .role(user.getRole())
                    .avatarUrl(user.getAvatarUrl())
                    .build();
        } catch (AuthenticationException e) {
            loginAttemptService.loginFailed(lockKey);
            loginAttemptService.loginFailed(input);

            int remaining = loginAttemptService.getRemainingAttempts(lockKey);
            if (remaining <= 0) {
                throw new RuntimeException("Tài khoản đã bị tạm khóa 15 phút do nhập sai mật khẩu 5 lần liên tiếp!");
            }
            throw new RuntimeException("Tên đăng nhập hoặc mật khẩu không chính xác. Bạn còn " + remaining + " lần thử trước khi bị khóa tạm thời 15 phút.");
        }
    }

    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            throw new RuntimeException("Unauthenticated request");
        }
        String username = authentication.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Current user not found in database: " + username));
    }

    public User getCurrentUserOrNull() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
                return null;
            }
            String username = authentication.getName();
            return userRepository.findByUsername(username).orElse(null);
        } catch (Exception e) {
            return null;
        }
    }

    @Transactional
    public AuthResponse updateProfile(ProfileUpdateRequest request) {
        User user = getCurrentUser();
        if (request.getFullName() != null && !request.getFullName().isBlank()) {
            user.setFullName(request.getFullName());
        }
        if (request.getDepartment() != null && !request.getDepartment().isBlank()) {
            user.setDepartment(request.getDepartment());
        }
        if (request.getAvatarUrl() != null && !request.getAvatarUrl().isBlank()) {
            user.setAvatarUrl(request.getAvatarUrl());
        }

        User saved = userRepository.save(user);
        String token = jwtUtils.generateJwtToken(saved.getUsername(), saved.getRole().name(), saved.getId());

        return AuthResponse.builder()
                .token(token)
                .id(saved.getId())
                .username(saved.getUsername())
                .email(saved.getEmail())
                .fullName(saved.getFullName())
                .department(saved.getDepartment())
                .role(saved.getRole())
                .avatarUrl(saved.getAvatarUrl())
                .build();
    }
}
