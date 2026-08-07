package com.example.emailcampaign.common.context;

import lombok.NoArgsConstructor;

import java.util.UUID;

@NoArgsConstructor
public final class WorkspaceContext {
    private static final ThreadLocal<UUID> WORKSPACE_ID = new ThreadLocal<>();

    

    public static UUID getCurrentWorkspaceId() {
        return WORKSPACE_ID.get();
    }

    public static void setCurrentWorkspaceId(UUID workspaceId) {
        WORKSPACE_ID.set(workspaceId);
    }

    public static void clear() {
        WORKSPACE_ID.remove();
    }
}
