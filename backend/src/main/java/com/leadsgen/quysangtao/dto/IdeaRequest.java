package com.leadsgen.quysangtao.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class IdeaRequest {
    @NotBlank(message = "Vui lòng nhập Tên ý tưởng!")
    private String title;

    @NotBlank(message = "Vui lòng nhập Vấn đề thực tế cần khắc phục!")
    private String problemDescription;

    @NotBlank(message = "Vui lòng nhập Phương án thực thi & Giải pháp đề xuất!")
    private String proposedSolution;

    private String expectedBenefit;

    private BigDecimal estimatedSavings;
    private BigDecimal requiredBudget;

    private String scope;                // TEAMS, DEPARTMENT, COMPANY
    private String implementationEffort; // EASY, MEDIUM, HIGH, STRATEGIC
    private String estimatedTimeframe;   // 1-2 tuần, 1 tháng, 3-6 tháng
    private String requiredResources;    // Nguồn lực cần hỗ trợ
    private String kpiImpactTags;        // Chuỗi các tag phân loại KPI

    private Long categoryId;

    @NotBlank(message = "Vui lòng nhập Họ tên người đăng ký!")
    private String submitterName;

    @NotBlank(message = "Vui lòng nhập Email liên hệ!")
    @Email(message = "Địa chỉ Email liên hệ không đúng định dạng (Ví dụ hợp lệ: name@leadsgen.com)!")
    private String submitterEmail;

    @Pattern(regexp = "^$|^(0|\\+84)[0-9]{9,10}$", message = "Số điện thoại không đúng định dạng Việt Nam (Ví dụ hợp lệ: 0912345678)!")
    private String submitterPhone;

    private String department;
    private String workingUnit;
    private String coauthorEmails;
    private String attachmentUrl;
    private String attachmentName;
}
