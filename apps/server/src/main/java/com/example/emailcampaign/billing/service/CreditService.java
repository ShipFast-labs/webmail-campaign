package com.example.emailcampaign.billing.service;

import com.example.emailcampaign.auth.repository.UserRepository;
import com.example.emailcampaign.common.exception.ApiException;
import com.example.emailcampaign.workspace.repository.WorkspaceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CreditService {

    private final WorkspaceRepository workspaceRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public long getBalance(UUID workspaceId) {
        Long credits = userRepository.findEmailCreditsById(ownerOf(workspaceId));
        return credits != null ? credits : 0L;
    }

    @Transactional(readOnly = true)
    public boolean hasSufficientCredits(UUID workspaceId, long amount) {
        return getBalance(workspaceId) >= amount;
    }

    @Transactional
    public void deductCredits(UUID workspaceId, long amount) {
        int updated = userRepository.deductCredits(ownerOf(workspaceId), amount);
        if (updated == 0) {
            throw ApiException.paymentRequired(
                    "INSUFFICIENT_CREDITS",
                    "Not enough email credits to complete this action"
            );
        }
    }

    @Transactional
    public void addCredits(UUID workspaceId, long amount) {
        userRepository.addCredits(ownerOf(workspaceId), amount);
    }

    @Transactional
    public void refundCredits(UUID workspaceId, long amount) {
        userRepository.addCredits(ownerOf(workspaceId), amount);
    }

    private UUID ownerOf(UUID workspaceId) {
        UUID ownerId = workspaceRepository.findOwnerIdById(workspaceId);
        if (ownerId == null) {
            throw ApiException.notFound("WORKSPACE_NOT_FOUND", "Workspace not found: " + workspaceId);
        }
        return ownerId;
    }
}
