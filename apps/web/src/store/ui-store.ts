import { create } from "zustand";

interface Notification {
  id: string;
  type: "success" | "error" | "info" | "warning";
  title: string;
  message?: string;
}

interface UiState {
  mobileSidebarOpen: boolean;
  sidebarCollapsed: boolean;
  notifications: Notification[];

  setMobileSidebarOpen: (open: boolean) => void;
  toggleSidebarCollapsed: () => void;

  addNotification: (n: Omit<Notification, "id">) => void;
  removeNotification: (id: string) => void;
}

export const useUiStore = create<UiState>()((set) => ({
  mobileSidebarOpen: false,
  sidebarCollapsed: false,
  notifications: [],

  setMobileSidebarOpen: (open) => set({ mobileSidebarOpen: open }),
  toggleSidebarCollapsed: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),

  addNotification: (n) =>
    set((s) => ({
      notifications: [...s.notifications, { ...n, id: crypto.randomUUID() }],
    })),

  removeNotification: (id) =>
    set((s) => ({ notifications: s.notifications.filter((n) => n.id !== id) })),
}));
