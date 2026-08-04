package com.example.emailcampaign.common.context;

import java.util.UUID;

public final class WorkspaceContext {
    private static final ThreadLocal<UUID> WORKSPACE_ID = new ThreadLocal<>();

    private WorkspaceContext() {
    }

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
