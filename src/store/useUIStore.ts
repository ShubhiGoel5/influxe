import { create } from "zustand";

interface UIState {
  isSidebarCollapsed: boolean;
  isMyListsPanelOpen: boolean;
  activeListTab: "lists" | "saved";

  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleMyListsPanel: () => void;
  setMyListsPanelOpen: (open: boolean) => void;
  setActiveListTab: (tab: "lists" | "saved") => void;

  // Legacy compat
  isListDrawerOpen: boolean;
  toggleListDrawer: () => void;
  setListDrawerOpen: (isOpen: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarCollapsed: false,
  isMyListsPanelOpen: false,
  activeListTab: "lists",

  toggleSidebar: () =>
    set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ isSidebarCollapsed: collapsed }),

  toggleMyListsPanel: () =>
    set((state) => ({ isMyListsPanelOpen: !state.isMyListsPanelOpen })),
  setMyListsPanelOpen: (open) => set({ isMyListsPanelOpen: open }),

  setActiveListTab: (tab) => set({ activeListTab: tab }),

  // Legacy compat — maps to new panel
  get isListDrawerOpen() {
    return false;
  },
  toggleListDrawer: () =>
    set((state) => ({ isMyListsPanelOpen: !state.isMyListsPanelOpen })),
  setListDrawerOpen: (isOpen) => set({ isMyListsPanelOpen: isOpen }),
}));
