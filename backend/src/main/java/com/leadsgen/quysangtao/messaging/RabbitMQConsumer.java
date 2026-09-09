package com.leadsgen.quysangtao.messaging;

import com.leadsgen.quysangtao.config.RabbitMQConfig;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class RabbitMQConsumer {

    @RabbitListener(queues = RabbitMQConfig.NOTIFICATION_QUEUE)
    public void consumeNotification(String message) {
        log.info("[RabbitMQ Notification Worker] Received message: {}", message);
        // Ở đây có thể tích hợp gửi Email SMTP thực tế hoặc Push Notification
    }
}
