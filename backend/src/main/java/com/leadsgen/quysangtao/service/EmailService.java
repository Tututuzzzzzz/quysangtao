package com.leadsgen.quysangtao.service;

import com.leadsgen.quysangtao.entity.Idea;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    @Value("${app.leader.email:tuht@leadsgen.com}")
    private String leaderEmail;

    @Value("${app.leader.name:Anh Tú}")
    private String leaderName;

    public void sendNewIdeaNotification(Idea idea) {
        String submitterName = idea.getSubmitterName() != null ? idea.getSubmitterName() : "Khách đăng ký";
        String submitterEmail = idea.getSubmitterEmail() != null ? idea.getSubmitterEmail() : "Chưa cung cấp";
        String submitterPhone = idea.getSubmitterPhone() != null ? idea.getSubmitterPhone() : "Chưa cung cấp";
        String department = idea.getDepartment() != null ? idea.getDepartment() : "Khối Công Khai";
        String workingUnit = idea.getWorkingUnit() != null ? idea.getWorkingUnit() : "Tập đoàn LeadsGen";
        String ccEmails = idea.getCoauthorEmails() != null ? idea.getCoauthorEmails() : "Không có";

        log.info("==========================================================");
        log.info("📧 [DISPATCH EMAIL NOTIFICATION - SÁNG KIẾN MỚI]");
        log.info("🎯 Gửi tới (Leader): {} ({})", leaderName, leaderEmail);
        log.info("📋 CC (Thành viên tham gia): {}", ccEmails);
        log.info("📩 Xác nhận tới người đăng ký: {}", submitterEmail);
        log.info("----------------------------------------------------------");
        log.info("📌 Tên sáng kiến: {}", idea.getTitle());
        log.info("👤 Người đăng ký: {} | SĐT: {}", submitterName, submitterPhone);
        log.info("🏢 Phòng ban: {} | Đơn vị: {}", department, workingUnit);
        log.info("💡 Nội dung đề xuất: {}", idea.getProposedSolution());
        log.info("==========================================================");
    }
}
