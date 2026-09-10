package com.leadsgen.quysangtao.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Slf4j
@Service
public class S3StorageService {

    @Value("${aws.s3.access-key:}")
    private String accessKey;

    @Value("${aws.s3.secret-key:}")
    private String secretKey;

    @Value("${aws.s3.bucket:30usdv2-cdn}")
    private String bucketName;

    @Value("${aws.s3.region:ap-southeast-1}")
    private String region;

    @Value("${aws.s3.cloudfront-host:https://dg86kmop4ajn0.cloudfront.net}")
    private String cloudfrontHost;

    private static final String LOCAL_UPLOAD_DIR = "uploads";

    public String uploadFile(MultipartFile file) {
        String originalFilename = file.getOriginalFilename();
        String cleanFilename = originalFilename != null ? originalFilename.replaceAll("[^a-zA-Z0-9._-]", "_") : "file";
        String s3Key = "uploads/" + System.currentTimeMillis() + "_" + UUID.randomUUID().toString().substring(0, 6) + "_" + cleanFilename;

        try {
            if (accessKey == null || accessKey.trim().isEmpty() || secretKey == null || secretKey.trim().isEmpty()) {
                log.warn("AWS S3 credentials (access-key / secret-key) không được cấu hình. Chuyển sang lưu trữ cục bộ.");
                return saveLocalFallback(file, cleanFilename);
            }

            log.info("Uploading file to AWS S3 bucket: {} with key: {}", bucketName, s3Key);

            AwsBasicCredentials credentials = AwsBasicCredentials.create(accessKey.trim(), secretKey.trim());
            S3Client s3Client = S3Client.builder()
                    .region(Region.of(region))
                    .credentialsProvider(StaticCredentialsProvider.create(credentials))
                    .build();

            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(s3Key)
                    .contentType(file.getContentType() != null ? file.getContentType() : "application/octet-stream")
                    .build();

            s3Client.putObject(putObjectRequest, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));

            String baseUrl = cloudfrontHost.endsWith("/") ? cloudfrontHost.substring(0, cloudfrontHost.length() - 1) : cloudfrontHost;
            String fullCloudFrontUrl = baseUrl + "/" + s3Key;
            log.info("Successfully uploaded to AWS S3 / CloudFront URL: {}", fullCloudFrontUrl);
            return fullCloudFrontUrl;
        } catch (Exception e) {
            log.error("AWS S3 Upload failed, switching to local storage fallback: {}", e.getMessage());
            return saveLocalFallback(file, cleanFilename);
        }
    }

    private String saveLocalFallback(MultipartFile file, String cleanFilename) {
        try {
            File dir = new File(LOCAL_UPLOAD_DIR);
            if (!dir.exists()) {
                dir.mkdirs();
            }
            String savedFilename = System.currentTimeMillis() + "_" + UUID.randomUUID().toString().substring(0, 6) + "_" + cleanFilename;
            Path path = Paths.get(LOCAL_UPLOAD_DIR, savedFilename);
            Files.write(path, file.getBytes());
            return "/uploads/" + savedFilename;
        } catch (IOException ex) {
            log.error("Local storage fallback error: {}", ex.getMessage());
            throw new RuntimeException("Không thể lưu file: " + ex.getMessage());
        }
    }
}
