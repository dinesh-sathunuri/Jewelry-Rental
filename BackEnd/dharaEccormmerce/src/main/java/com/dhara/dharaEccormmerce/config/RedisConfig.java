package com.dhara.dharaEccormmerce.config;

import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.jsontype.impl.LaissezFaireSubTypeValidator;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

@Configuration
@EnableCaching
public class RedisConfig {

    /**
     * Jackson mapper used only for Redis serialisation.
     * - JavaTimeModule  → handles LocalDateTime / LocalDate
     * - DefaultTyping   → stores class name so deserialisation works
     */
    @Bean
    public ObjectMapper redisObjectMapper() {
        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        mapper.activateDefaultTyping(
                LaissezFaireSubTypeValidator.instance,
                ObjectMapper.DefaultTyping.NON_FINAL,
                JsonTypeInfo.As.PROPERTY);
        return mapper;
    }

    /**
     * General-purpose RedisTemplate<String, Object>.
     * Used wherever manual get/set is needed (rate-limiting, flags, etc.).
     */
    @Bean
    public RedisTemplate<String, Object> redisTemplate(
            RedisConnectionFactory factory, ObjectMapper redisObjectMapper) {

        RedisTemplate<String, Object> tpl = new RedisTemplate<>();
        tpl.setConnectionFactory(factory);

        StringRedisSerializer strSer = new StringRedisSerializer();
        GenericJackson2JsonRedisSerializer jsonSer =
                new GenericJackson2JsonRedisSerializer(redisObjectMapper);

        tpl.setKeySerializer(strSer);
        tpl.setHashKeySerializer(strSer);
        tpl.setValueSerializer(jsonSer);
        tpl.setHashValueSerializer(jsonSer);
        tpl.afterPropertiesSet();
        return tpl;
    }

    /**
     * CacheManager with per-cache TTLs:
     *
     *   products  → 60 min  (full list)
     *   product   → 60 min  (single item)
     *   orders    → 30 min  (admin order list + single orders)
     */
    @Bean
    public CacheManager cacheManager(
            RedisConnectionFactory factory, ObjectMapper redisObjectMapper) {

        GenericJackson2JsonRedisSerializer ser =
                new GenericJackson2JsonRedisSerializer(redisObjectMapper);

        RedisCacheConfiguration base = RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(Duration.ofMinutes(60))
                .serializeKeysWith(
                        RedisSerializationContext.SerializationPair.fromSerializer(new StringRedisSerializer()))
                .serializeValuesWith(
                        RedisSerializationContext.SerializationPair.fromSerializer(ser))
                .disableCachingNullValues();

        Map<String, RedisCacheConfiguration> configs = new HashMap<>();
        configs.put("products", base.entryTtl(Duration.ofMinutes(60)));
        configs.put("product",  base.entryTtl(Duration.ofMinutes(60)));
        configs.put("orders",   base.entryTtl(Duration.ofMinutes(30)));

        return RedisCacheManager.builder(factory)
                .cacheDefaults(base)
                .withInitialCacheConfigurations(configs)
                .build();
    }
}
