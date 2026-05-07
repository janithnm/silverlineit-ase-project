package com.silverlineit.coursecontentsystem.common.service;

import com.silverlineit.coursecontentsystem.common.config.AppProperties;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;
    private final AppProperties appProperties;

    @Async
    public void sendVerificationEmail(String toEmail, String username, String token) {
        try {
            Context context = new Context();
            context.setVariable("username", username);
            context.setVariable("verificationUrl",
                    appProperties.getFrontendUrl() + "/verify-email?token=" + token);

            String html = templateEngine.process("email/welcome-verify", context);
            sendHtmlEmail(toEmail, "Verify your email — Silverline IT", html);
            log.info("Verification email sent to {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send verification email to {}: {}", toEmail, e.getMessage());
        }
    }

    private void sendHtmlEmail(String to, String subject, String html)
        throws MessagingException, java.io.UnsupportedEncodingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        helper.setFrom(
                appProperties.getMail().getFromAddress(),
                appProperties.getMail().getFromName()
        );
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(html, true);
        mailSender.send(message);
    }
}