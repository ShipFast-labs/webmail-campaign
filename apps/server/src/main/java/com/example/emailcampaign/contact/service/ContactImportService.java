package com.example.emailcampaign.contact.service;

import com.example.emailcampaign.common.service.S3Service;
import com.example.emailcampaign.contact.domain.Contact;
import com.example.emailcampaign.contact.domain.ImportJob;
import com.example.emailcampaign.contact.domain.ImportJobStatus;
import com.example.emailcampaign.contact.repository.ContactRepository;
import com.example.emailcampaign.contact.repository.ImportJobRepository;
import com.example.emailcampaign.workspace.domain.Workspace;
import com.example.emailcampaign.workspace.repository.WorkspaceRepository;
import com.opencsv.CSVReader;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.InputStreamReader;
import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ContactImportService {

    private static final int CHUNK_SIZE = 500;
    private static final String REDIS_KEY_PREFIX = "import:";
    private static final long REDIS_TTL_HOURS = 24;

    private final ContactRepository contactRepository;
    private final ImportJobRepository importJobRepository;
    private final WorkspaceRepository workspaceRepository;
    private final S3Service s3Service;
    private final StringRedisTemplate redisTemplate;

    public void processImport(UUID workspaceId, UUID jobId) {
        ImportJob job = importJobRepository.findById(jobId)
                .orElseThrow(() -> new IllegalStateException("Import job not found: " + jobId));

        String s3Key = s3Service.buildImportKey(workspaceId, jobId);

        job.setStatus(ImportJobStatus.IN_PROGRESS);
        importJobRepository.save(job);
        pushToRedis(jobId, job);

        byte[] csvBytes = s3Service.downloadImportFile(s3Key);

        try (CSVReader reader = new CSVReader(new InputStreamReader(new ByteArrayInputStream(csvBytes)))) {
            String[] headers = reader.readNext();
            if (headers == null) {
                throw new IllegalArgumentException("CSV file is empty");
            }
            normalizeHeaders(headers);

            List<String[]> allRows = reader.readAll();
            job.setTotalRows(allRows.size());
            importJobRepository.save(job);
            pushToRedis(jobId, job);

            int processedRows = 0;
            int successCount = 0;
            int errorCount = 0;
            List<String> errors = new ArrayList<>();

            for (int i = 0; i < allRows.size(); i += CHUNK_SIZE) {
                List<String[]> chunk = allRows.subList(i, Math.min(i + CHUNK_SIZE, allRows.size()));
                ChunkResult result = processChunk(workspaceId, headers, chunk, errors);

                processedRows += chunk.size();
                successCount += result.successCount();
                errorCount += result.errorCount();

                job.setProcessedRows(processedRows);
                job.setSuccessCount(successCount);
                job.setErrorCount(errorCount);
                importJobRepository.save(job);
                pushToRedis(jobId, job);
            }

            job.setStatus(ImportJobStatus.COMPLETED);
            if (!errors.isEmpty()) {
                job.setErrorDetails(errors.stream().limit(50).collect(Collectors.joining("\n")));
            }
            importJobRepository.save(job);
            pushToRedis(jobId, job);

           
            s3Service.deleteImportFile(s3Key);

        } catch (Exception e) {
           
            log.warn("Import job {} failed (will retry if attempts remain): {}", jobId, e.getMessage());
            throw new RuntimeException("Import processing failed for job: " + jobId, e);
        }
    }

    
    public void markJobFailed(UUID jobId, String reason) {
        importJobRepository.findById(jobId).ifPresent(job -> {
            failJob(job, jobId, reason);
            log.error("Import job {} permanently failed after all retries: {}", jobId, reason);
        });
    }

    private ChunkResult processChunk(UUID workspaceId, String[] headers, List<String[]> rows, List<String> errors) {
        List<String> chunkEmails = new ArrayList<>();
        for (String[] row : rows) {
            String email = extractField(headers, row, "email");
            if (email != null && !email.isBlank()) {
                chunkEmails.add(email.toLowerCase().trim());
            }
        }

        Map<String, Contact> existingByEmail = contactRepository
                .findByWorkspace_IdAndEmailIn(workspaceId, chunkEmails)
                .stream()
                .collect(Collectors.toMap(c -> c.getEmail().toLowerCase(), c -> c));

        Workspace workspace = workspaceRepository.getReferenceById(workspaceId);
        List<Contact> toSave = new ArrayList<>();
        int successCount = 0;
        int errorCount = 0;

        for (String[] row : rows) {
            try {
                String email = extractField(headers, row, "email");
                if (email == null || email.isBlank()) {
                    errors.add("Row skipped: missing email");
                    errorCount++;
                    continue;
                }

                email = email.toLowerCase().trim();
                Contact contact = existingByEmail.getOrDefault(
                        email,
                        Contact.builder().workspace(workspace).email(email).build()
                );

                String firstName = extractField(headers, row, "first_name");
                String lastName  = extractField(headers, row, "last_name");
                String tagsRaw   = extractField(headers, row, "tags");

                if (firstName != null) contact.setFirstName(firstName.trim());
                if (lastName != null)  contact.setLastName(lastName.trim());
                if (tagsRaw != null && !tagsRaw.isBlank()) {
                    contact.setTags(Arrays.stream(tagsRaw.split(","))
                            .map(String::trim)
                            .filter(t -> !t.isEmpty())
                            .toArray(String[]::new));
                }

                toSave.add(contact);
                successCount++;
            } catch (Exception e) {
                errors.add("Row error: " + e.getMessage());
                errorCount++;
            }
        }

        contactRepository.saveAll(toSave);
        return new ChunkResult(successCount, errorCount);
    }

    private void pushToRedis(UUID jobId, ImportJob job) {
        String key = REDIS_KEY_PREFIX + jobId + ":progress";
        Map<String, String> progress = new HashMap<>();
        progress.put("status", job.getStatus().name());
        progress.put("totalRows", String.valueOf(job.getTotalRows()));
        progress.put("processedRows", String.valueOf(job.getProcessedRows()));
        progress.put("successCount", String.valueOf(job.getSuccessCount()));
        progress.put("errorCount", String.valueOf(job.getErrorCount()));
        redisTemplate.opsForHash().putAll(key, progress);
        redisTemplate.expire(key, REDIS_TTL_HOURS, TimeUnit.HOURS);
    }

    private void failJob(ImportJob job, UUID jobId, String reason) {
        job.setStatus(ImportJobStatus.FAILED);
        job.setErrorDetails(reason);
        importJobRepository.save(job);
        pushToRedis(jobId, job);
    }

    private void normalizeHeaders(String[] headers) {
        for (int i = 0; i < headers.length; i++) {
            headers[i] = headers[i].trim().toLowerCase();
        }
    }

    private String extractField(String[] headers, String[] row, String fieldName) {
        for (int i = 0; i < headers.length; i++) {
            if (headers[i].equals(fieldName) && i < row.length) {
                return row[i];
            }
        }
        return null;
    }

    private record ChunkResult(int successCount, int errorCount) {}
}
