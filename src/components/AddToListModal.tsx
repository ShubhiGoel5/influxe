import { useState } from "react";
import { useListStore } from "@/store/useListStore";
import type { UserProfileSummary } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Check } from "lucide-react";

interface AddToListModalProps {
  profile: UserProfileSummary;
  isOpen: boolean;
  onClose: () => void;
}

export function AddToListModal({ profile, isOpen, onClose }: AddToListModalProps) {
  const { lists, assignments, addToList, removeFromList, createList } = useListStore();
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmoji, setNewEmoji] = useState("📋");

  const EMOJIS = ["⭐", "🔥", "💪", "🎯", "🚀", "💎", "🎬", "📋", "💜", "🌟"];

  const isInList = (listId: string) =>
    (assignments[listId] || []).some((p) => p.user_id === profile.user_id);

  const handleToggle = (listId: string) => {
    if (isInList(listId)) {
      removeFromList(listId, profile.user_id);
    } else {
      addToList(listId, profile);
    }
  };

  const handleCreate = () => {
    if (newName.trim()) {
      const id = createList(newName.trim(), newEmoji);
      addToList(id, profile);
      setNewName("");
      setShowCreate(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", bounce: 0.15, duration: 0.3 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[380px] max-h-[80vh] bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-[var(--border-light)] flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[var(--text-primary)]">Add to List</h3>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  @{profile.username}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg-hover)] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* List options */}
            <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
              {lists.map((list) => {
                const checked = isInList(list.id);
                return (
                  <button
                    key={list.id}
                    onClick={() => handleToggle(list.id)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--bg-hover)] transition-colors text-left"
                  >
                    <div
                      className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                        checked
                          ? "bg-[var(--accent)] border-[var(--accent)]"
                          : "border-[var(--border-default)]"
                      }`}
                    >
                      {checked && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <span className="text-base flex-shrink-0">{list.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-[var(--text-primary)] truncate">{list.name}</div>
                      <div className="text-xs text-[var(--text-muted)]">
                        {(assignments[list.id] || []).length} creators
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Create new list */}
            <div className="p-3 border-t border-[var(--border-light)]">
              {!showCreate ? (
                <button
                  onClick={() => setShowCreate(true)}
                  className="w-full flex items-center gap-2 p-3 rounded-xl text-sm font-medium text-[var(--accent)] hover:bg-[var(--accent-light)] transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Create New List
                </button>
              ) : (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <select
                      value={newEmoji}
                      onChange={(e) => setNewEmoji(e.target.value)}
                      className="appearance-none w-10 h-10 text-lg text-center bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                    >
                      {EMOJIS.map((e) => (
                        <option key={e} value={e}>{e}</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                      placeholder="List name..."
                      className="flex-1 px-3 py-2 border border-[var(--border-default)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                      autoFocus
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleCreate}
                      disabled={!newName.trim()}
                      className="flex-1 py-2 rounded-lg bg-[var(--accent)] text-white text-sm font-medium hover:bg-[var(--accent-hover)] disabled:opacity-50 transition-colors"
                    >
                      Create & Add
                    </button>
                    <button
                      onClick={() => { setShowCreate(false); setNewName(""); }}
                      className="px-3 py-2 rounded-lg border border-[var(--border-default)] text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
