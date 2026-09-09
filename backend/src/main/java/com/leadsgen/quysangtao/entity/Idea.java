package com.leadsgen.quysangtao.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "ideas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Idea {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String problemDescription;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String proposedSolution;

    @Column(columnDefinition = "TEXT")
    private String expectedBenefit;

    private BigDecimal estimatedSavings; // Ước tính chi phí tiết kiệm (VND/năm)
    private BigDecimal requiredBudget;   // Chi phí đầu tư ban đầu đề xuất (VNĐ)

    private String scope;                // TEAMS, DEPARTMENT, COMPANY
    private String implementationEffort; // EASY, MEDIUM, HIGH, STRATEGIC
    private String estimatedTimeframe;   // 1-2 tuần, 1 tháng, 3-6 tháng, > 6 tháng
    private String requiredResources;    // Nhân sự, phần mềm, thiết bị

    @Column(columnDefinition = "TEXT")
    private String kpiImpactTags;        // Tối ưu quy trình, Tăng trải nghiệm KH, Giảm chi phí...

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private IdeaStatus status;

    @Enumerated(EnumType.STRING)
    private TagCategory tagCategory;     // Better Work / Better Workplace

    private Integer score;               // Chấm điểm từ 1-100 bởi Admin

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "author_id", nullable = true)
    private User author;

    private String submitterName;        // Tên người nộp công khai
    private String submitterEmail;       // Email người nộp công khai

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id")
    private Category category;

    private String department;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = IdeaStatus.RECEIVED;
        }
        if (this.author != null) {
            if (this.department == null) {
                this.department = this.author.getDepartment();
            }
            if (this.submitterName == null) {
                this.submitterName = this.author.getFullName();
            }
            if (this.submitterEmail == null) {
                this.submitterEmail = this.author.getEmail();
            }
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
