package com.dhara.dharaEccormmerce.service;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.auth.credentials.DefaultCredentialsProvider;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class S3Service {

    private S3Client s3Client;

    @PostConstruct
    public void init() {
        s3Client = S3Client.builder()
                .region(Region.of("us-east-2"))  // or read from properties
                .credentialsProvider(DefaultCredentialsProvider.create())
                .build();
    }

    public String uploadFile(byte[] data, String originalFileName, String bucketName) throws IOException {
        String uniqueFileName = UUID.randomUUID() + "_" + sanitizeFileName(originalFileName);

        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(uniqueFileName)
                .contentType(detectContentType(originalFileName))
                .build();

        s3Client.putObject(putObjectRequest, RequestBody.fromBytes(data));

        return uniqueFileName;
    }



    private String sanitizeFileName(String fileName) {
        // Simple sanitation: remove spaces, etc.
        return fileName.replaceAll("\\s+", "_");
    }

    private String detectContentType(String fileName) {
        // Basic content type detection by extension (improve as needed)
        if (fileName.endsWith(".png")) return "image/png";
        if (fileName.endsWith(".jpg") || fileName.endsWith(".jpeg")) return "image/jpeg";
        if (fileName.endsWith(".gif")) return "image/gif";
        return "application/octet-stream";
    }
    public void deleteFile(String bucketName, String key) {
        s3Client.deleteObject(builder -> builder
                .bucket(bucketName)
                .key(key)
        );
    }
    public String generatePresignedUrl(String bucketName, String objectKey) {
        try (S3Presigner presigner = S3Presigner.create()) {
            GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                    .bucket(bucketName)
                    .key(objectKey)
                    .build();

            GetObjectPresignRequest presignRequest = GetObjectPresignRequest.builder()
                    .getObjectRequest(getObjectRequest)
                    .signatureDuration(Duration.ofMinutes(60))  // Valid for 60 minutes
                    .build();

            return presigner.presignGetObject(presignRequest).url().toString();
        }
    }
}
