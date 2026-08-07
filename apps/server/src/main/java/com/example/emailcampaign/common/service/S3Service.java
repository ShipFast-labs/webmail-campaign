package com.example.emailcampaign.common.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.core.ResponseBytes;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectResponse;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class S3Service {

    private static final String IMPORT_PREFIX = "imports/%s/%s.csv";

    private final S3Client s3Client;

    @Value("${app.aws.s3.bucket-name}")
    private String bucketName;

    public String uploadImportFile(UUID workspaceId, UUID jobId, byte[] bytes) {
        String key = buildImportKey(workspaceId, jobId);
        s3Client.putObject(
                PutObjectRequest.builder()
                        .bucket(bucketName)
                        .key(key)
                        .contentType("text/csv")
                        .build(),
                RequestBody.fromBytes(bytes)
        );
        log.info("Uploaded import file to S3: {}", key);
        return key;
    }

    public byte[] downloadImportFile(String key) {
        ResponseBytes<GetObjectResponse> response = s3Client.getObjectAsBytes(
                GetObjectRequest.builder()
                        .bucket(bucketName)
                        .key(key)
                        .build()
        );
        return response.asByteArray();
    }

    public void deleteImportFile(String key) {
        s3Client.deleteObject(
                DeleteObjectRequest.builder()
                        .bucket(bucketName)
                        .key(key)
                        .build()
        );
        log.info("Deleted import file from S3: {}", key);
    }

    public String buildImportKey(UUID workspaceId, UUID jobId) {
        return String.format(IMPORT_PREFIX, workspaceId, jobId);
    }
}
