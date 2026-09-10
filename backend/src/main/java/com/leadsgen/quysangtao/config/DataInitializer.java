package com.leadsgen.quysangtao.config;

import com.leadsgen.quysangtao.entity.*;
import com.leadsgen.quysangtao.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (categoryRepository.count() == 0) {
            log.info("Khởi tạo danh mục ban đầu cho Cổng LeadsGen...");
            categoryRepository.save(Category.builder()
                    .name("Tối ưu Quy trình Work")
                    .description("Các ý tưởng cải tiến năng suất, tự động hóa quy trình làm việc")
                    .defaultTag(TagCategory.BETTER_WORK)
                    .build());

            categoryRepository.save(Category.builder()
                    .name("Cải thiện Môi trường Workplace")
                    .description("Các sáng kiến nâng cao chất lượng không gian làm việc, tiện ích văn phòng")
                    .defaultTag(TagCategory.BETTER_WORKPLACE)
                    .build());

            categoryRepository.save(Category.builder()
                    .name("Đổi mới Công nghệ & AI")
                    .description("Ứng dụng AI, phần mềm và giải pháp công nghệ mới")
                    .defaultTag(TagCategory.BETTER_WORK)
                    .build());
        }

        // Always ensure default admin user exists
        if (!userRepository.existsByUsername("admin")) {
            log.info("Khởi tạo tài khoản Admin ban đầu cho Cổng LeadsGen...");
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

        log.info("Khởi tạo hệ thống thành công. Sẵn sàng tiếp nhận sáng kiến công khai.");
    }
}
