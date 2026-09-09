package com.leadsgen.quysangtao.messaging;

import com.leadsgen.quysangtao.config.RabbitMQConfig;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.AmqpException;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class RabbitMQProducer {

    private final RabbitTemplate rabbitTemplate;

    public void sendStatusNotification(String message) {
        try {
            log.info("Sending async notification to RabbitMQ: {}", message);
            rabbitTemplate.convertAndSend(
                    RabbitMQConfig.EXCHANGE_NAME,
                    "idea.notification.status",
                    message
            );
        } catch (AmqpException e) {
            log.warn("RabbitMQ server is currently unreachable. Gracefully proceeding without blocking: {}", e.getMessage());
        }
    }
}
