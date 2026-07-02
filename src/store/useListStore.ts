import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CreatorList, UserProfileSummary } from "@/types";

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

interface ListState {
  lists: CreatorList[];
  /** Map of listId → array of profiles */
  assignments: Record<string, UserProfileSummary[]>;

  // List CRUD
  createList: (name: string, emoji: string) => string;
  deleteList: (listId: string) => void;
  renameList: (listId: string, name: string) => void;

  // Profile assignment
  addToList: (listId: string, profile: UserProfileSummary) => void;
  removeFromList: (listId: string, userId: string) => void;

  // Queries
  isInAnyList: (userId: string) => boolean;
  getListsForProfile: (userId: string) => CreatorList[];
  getProfilesInList: (listId: string) => UserProfileSummary[];
  getListCount: (listId: string) => number;
  getAllSavedProfiles: () => UserProfileSummary[];

  // Legacy compatibility
  selectedProfiles: UserProfileSummary[];
  addProfile: (profile: UserProfileSummary) => void;
  removeProfile: (userId: string) => void;
}

const DEFAULT_LIST: CreatorList = {
  id: "default",
  name: "My Favorites",
  emoji: "⭐",
  createdAt: 0,
};

export const useListStore = create<ListState>()(
  persist(
    (set, get) => ({
      lists: [DEFAULT_LIST],
      assignments: { default: [] },

      createList: (name, emoji) => {
        const id = generateId();
        const newList: CreatorList = {
          id,
          name,
          emoji,
          createdAt: Date.now(),
        };
        set((state) => ({
          lists: [...state.lists, newList],
          assignments: { ...state.assignments, [id]: [] },
        }));
        return id;
      },

      deleteList: (listId) => {
        set((state) => {
          const { [listId]: _, ...rest } = state.assignments;
          return {
            lists: state.lists.filter((l) => l.id !== listId),
            assignments: rest,
          };
        });
      },

      renameList: (listId, name) => {
        set((state) => ({
          lists: state.lists.map((l) =>
            l.id === listId ? { ...l, name } : l
          ),
        }));
      },

      addToList: (listId, profile) => {
        set((state) => {
          const current = state.assignments[listId] || [];
          if (current.some((p) => p.user_id === profile.user_id)) {
            return state;
          }
          return {
            assignments: {
              ...state.assignments,
              [listId]: [...current, profile],
            },
          };
        });
      },

      removeFromList: (listId, userId) => {
        set((state) => ({
          assignments: {
            ...state.assignments,
            [listId]: (state.assignments[listId] || []).filter(
              (p) => p.user_id !== userId
            ),
          },
        }));
      },

      isInAnyList: (userId) => {
        const { assignments } = get();
        return Object.values(assignments).some((profiles) =>
          profiles.some((p) => p.user_id === userId)
        );
      },

      getListsForProfile: (userId) => {
        const { lists, assignments } = get();
        return lists.filter((list) =>
          (assignments[list.id] || []).some((p) => p.user_id === userId)
        );
      },

      getProfilesInList: (listId) => {
        return get().assignments[listId] || [];
      },

      getListCount: (listId) => {
        return (get().assignments[listId] || []).length;
      },

      getAllSavedProfiles: () => {
        const { assignments } = get();
        const seen = new Set<string>();
        const result: UserProfileSummary[] = [];
        for (const profiles of Object.values(assignments)) {
          for (const p of profiles) {
            if (!seen.has(p.user_id)) {
              seen.add(p.user_id);
              result.push(p);
            }
          }
        }
        return result;
      },

      // Legacy compatibility — operates on default list
      get selectedProfiles() {
        return get().assignments["default"] || [];
      },

      addProfile: (profile) => {
        get().addToList("default", profile);
      },

      removeProfile: (userId) => {
        get().removeFromList("default", userId);
      },
    }),
    {
      name: "influencer-list-storage",
    }
  )
);
