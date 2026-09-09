package com.leadsgen.quysangtao.service;

import com.leadsgen.quysangtao.entity.Idea;
import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class EmailService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${app.leader.email:tuht@leadsgen.com}")
    private String leaderEmail;

    @Value("${app.leader.name:Anh Tú}")
    private String leaderName;

    @Value("${spring.mail.username:noreply@leadsgen.com}")
    private String fromEmail;

    public void sendNewIdeaNotification(Idea idea) {
        String submitterName = idea.getSubmitterName() != null ? idea.getSubmitterName() : "Khách đăng ký";
        String submitterEmail = idea.getSubmitterEmail() != null ? idea.getSubmitterEmail() : "Chưa cung cấp";
        String submitterPhone = idea.getSubmitterPhone() != null ? idea.getSubmitterPhone() : "Chưa cung cấp";
        String department = idea.getDepartment() != null ? idea.getDepartment() : "Khối Công Khai";
        String workingUnit = idea.getWorkingUnit() != null ? idea.getWorkingUnit() : "Tập đoàn LeadsGen";
        String ccEmails = idea.getCoauthorEmails() != null ? idea.getCoauthorEmails() : "";

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

        if (mailSender != null) {
            try {
                MimeMessage message = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
                helper.setFrom(fromEmail);
                helper.setTo(leaderEmail);

                if (ccEmails != null && !ccEmails.isBlank()) {
                    String[] ccArray = ccEmails.split(",");
                    for (int i = 0; i < ccArray.length; i++) {
                        ccArray[i] = ccArray[i].trim();
                    }
                    helper.setCc(ccArray);
                }

                helper.setSubject("[LeadsGen Innovation Hub] Đề xuất ý tưởng mới: " + idea.getTitle());

                String htmlContent = "<h2>ĐỀ XUẤT SÁNG KIẾN MỚI - QUỸ LEADSGEN</h2>"
                        + "<p><strong>Kính gửi Leader " + leaderName + ",</strong></p>"
                        + "<p>Hệ thống vừa ghi nhận một đề xuất sáng kiến mới được gửi trực tiếp tới Ban Quản trị Quỹ:</p>"
                        + "<hr/>"
                        + "<ul>"
                        + "<li><strong>Tên sáng kiến:</strong> " + idea.getTitle() + "</li>"
                        + "<li><strong>Họ tên người đăng ký:</strong> " + submitterName + "</li>"
                        + "<li><strong>Email liên hệ:</strong> " + submitterEmail + "</li>"
                        + "<li><strong>Số điện thoại:</strong> " + submitterPhone + "</li>"
                        + "<li><strong>Phòng ban / Đơn vị:</strong> " + department + " (" + workingUnit + ")</li>"
                        + "</ul>"
                        + "<hr/>"
                        + "<h4>Vấn đề giải quyết:</h4>"
                        + "<p>" + (idea.getProblemDescription() != null ? idea.getProblemDescription() : "N/A") + "</p>"
                        + "<h4>Phương án thực thi:</h4>"
                        + "<p>" + (idea.getProposedSolution() != null ? idea.getProposedSolution() : "N/A") + "</p>"
                        + "<hr/>"
                        + "<p><i>Trân trọng,<br/>Hệ thống Quỹ Đổi mới LeadsGen Corporation</i></p>";

                helper.setText(htmlContent, true);
                mailSender.send(message);
                log.info("✅ Gửi email SMTP thực tế thành công tới {}", leaderEmail);
            } catch (Exception e) {
                log.error("❌ Lỗi khi gửi email SMTP thực tế: {}", e.getMessage(), e);
            }
        } else {
            log.warn("⚠️ JavaMailSender chưa được cấu hình SMTP. Email được ghi nhận trong Log.");
        }
    }
}
