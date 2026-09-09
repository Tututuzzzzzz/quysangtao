package com.leadsgen.quysangtao.config;

import org.springframework.amqp.core.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String EXCHANGE_NAME = "leadsgen.idea.exchange";
    public static final String NOTIFICATION_QUEUE = "idea.status.notifications";
    public static final String NOTIFICATION_ROUTING_KEY = "idea.notification.#";

    @Bean
    public TopicExchange ideaExchange() {
        return new TopicExchange(EXCHANGE_NAME);
    }

    @Bean
    public Queue notificationQueue() {
        return new Queue(NOTIFICATION_QUEUE, true);
    }

    @Bean
    public Binding notificationBinding(Queue notificationQueue, TopicExchange ideaExchange) {
        return BindingBuilder.bind(notificationQueue).to(ideaExchange).with(NOTIFICATION_ROUTING_KEY);
    }
}
