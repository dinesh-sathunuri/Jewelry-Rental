package com.dhara.dharaEccormmerce.service;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.auth.credentials.DefaultCredentialsProvider;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;

import java.io.IOException;
import java.time.Duration;
import java.util.UUID;

@Slf4j
@Service
public class S3Service {

    @Value("${aws.region}")
    private String awsRegion;

    private S3Client s3Client;

    @PostConstruct
    public void init() {
        s3Client = S3Client.builder()
                .region(Region.of(awsRegion))
                .credentialsProvider(DefaultCredentialsProvider.create())
                .build();
        log.info("S3Client initialised for region {}", awsRegion);
    }

    /**
     * Uploads bytes to S3 and returns the object key (not a full URL).
     * The key is stored in the DB; pre-signed URLs are generated on read.
     */
    public String uploadFile(byte[] data, String originalFileName, String bucketName)
            throws IOException {
        String key = UUID.randomUUID() + "_" + sanitize(originalFileName);

        s3Client.putObject(
                PutObjectRequest.builder()
                        .bucket(bucketName)
                        .key(key)
                        .contentType(detectContentType(originalFileName))
                        .contentLength((long) data.length)
                        .build(),
                RequestBody.fromBytes(data));

        log.debug("Uploaded {} → s3://{}/{}", originalFileName, bucketName, key);
        return key;
    }

    /** Deletes an object by key. Safe to call even if the key does not exist. */
    public void deleteFile(String bucketName, String key) {
        s3Client.deleteObject(DeleteObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .build());
        log.debug("Deleted s3://{}/{}", bucketName, key);
    }

    /**
     * Generates a pre-signed GET URL valid for 60 minutes.
     * A new S3Presigner is created per call (as recommended by AWS SDK docs —
     * presigners are lightweight and should not be shared across threads).
     */
    public String generatePresignedUrl(String bucketName, String objectKey) {
        try (S3Presigner presigner = S3Presigner.builder()
                .region(Region.of(awsRegion))
                .credentialsProvider(DefaultCredentialsProvider.create())
                .build()) {

            return presigner.presignGetObject(
                    GetObjectPresignRequest.builder()
                            .getObjectRequest(GetObjectRequest.builder()
                                    .bucket(bucketName)
                                    .key(objectKey)
                                    .build())
                            .signatureDuration(Duration.ofMinutes(60))
                            .build()
            ).url().toString();
        }
    }

    // ── Helpers ──────────────────────────────────────────────────────────────

    private String sanitize(String fileName) {
        if (fileName == null || fileName.isBlank()) return "file";
        // Keep letters, digits, dots, hyphens; replace everything else with _
        return fileName.replaceAll("[^a-zA-Z0-9._-]", "_");
    }

    private String detectContentType(String fileName) {
        if (fileName == null) return "application/octet-stream";
        String f = fileName.toLowerCase();
        if (f.endsWith(".png"))              return "image/png";
        if (f.endsWith(".jpg") || f.endsWith(".jpeg")) return "image/jpeg";
        if (f.endsWith(".gif"))              return "image/gif";
        if (f.endsWith(".webp"))             return "image/webp";
        return "application/octet-stream";
    }
}