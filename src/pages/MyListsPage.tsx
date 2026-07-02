import { useState } from "react";
import { Layout } from "@/components/Layout";
import { useListStore } from "@/store/useListStore";
import { Plus, Trash2, Edit3, X, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { getInitials } from "@/utils/dataHelpers";

export function MyListsPage() {
  const { lists, assignments, createList, deleteList, renameList, removeFromList } = useListStore();
  const [expandedListId, setExpandedListId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmoji, setNewEmoji] = useState("📋");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const EMOJIS = ["⭐", "🔥", "💪", "🎯", "🚀", "💎", "🎬", "📋", "💜", "🌟"];

  const handleCreate = () => {
    if (newName.trim()) {
      createList(newName.trim(), newEmoji);
      setNewName("");
      setNewEmoji("📋");
      setShowCreate(false);
    }
  };

  return (
    <Layout title="My Lists">
      <div className="max-w-3xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">My Lists</h1>
            <p className="text-sm text-[var(--text-muted)] mt-1">
              Organize your creators into lists for campaigns
            </p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--accent)] text-white text-sm font-semibold hover:bg-[var(--accent-hover)] transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            New List
          </button>
        </div>

        {/* Create input */}
        <AnimatePresence>
          {showCreate && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-4"
            >
              <div className="p-4 bg-white border border-[var(--border-default)] rounded-xl space-y-3">
                <div className="flex gap-2">
                  <select
                    value={newEmoji}
                    onChange={(e) => setNewEmoji(e.target.value)}
                    className="appearance-none w-12 h-12 text-xl text-center bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
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
                    placeholder="Enter list name..."
                    className="flex-1 px-4 py-3 border border-[var(--border-default)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                    autoFocus
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => { setShowCreate(false); setNewName(""); }}
                    className="px-4 py-2 rounded-lg border border-[var(--border-default)] text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreate}
                    disabled={!newName.trim()}
                    className="px-4 py-2 rounded-lg bg-[var(--accent)] text-white text-sm font-medium hover:bg-[var(--accent-hover)] disabled:opacity-50 transition-colors"
                  >
                    Create List
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Lists */}
        <div className="space-y-3">
          {lists.map((list) => {
            const profiles = assignments[list.id] || [];
            const isExpanded = expandedListId === list.id;
            const isEditing = editingId === list.id;

            return (
              <motion.div
                key={list.id}
                layout
                className="bg-white border border-[var(--border-default)] rounded-xl overflow-hidden"
              >
                {/* List header */}
                <div
                  className="flex items-center gap-3 p-4 cursor-pointer hover:bg-[var(--bg-hover)] transition-colors"
                  onClick={() => setExpandedListId(isExpanded ? null : list.id)}
                >
                  <span className="text-xl flex-shrink-0">{list.emoji}</span>
                  <div className="flex-1 min-w-0">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            renameList(list.id, editName.trim() || list.name);
                            setEditingId(null);
                          }
                          if (e.key === "Escape") setEditingId(null);
                        }}
                        onBlur={() => {
                          renameList(list.id, editName.trim() || list.name);
                          setEditingId(null);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="px-2 py-1 border border-[var(--accent)] rounded-lg text-sm w-full focus:outline-none"
                        autoFocus
                      />
                    ) : (
                      <>
                        <div className="text-sm font-bold text-[var(--text-primary)]">{list.name}</div>
                        <div className="text-xs text-[var(--text-muted)]">{profiles.length} creators</div>
                      </>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => {
                        setEditingId(list.id);
                        setEditName(list.name);
                      }}
                      className="p-2 rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg-secondary)] transition-colors"
                      aria-label="Rename list"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    {list.id !== "default" && (
                      <button
                        onClick={() => deleteList(list.id)}
                        className="p-2 rounded-lg text-[var(--text-muted)] hover:text-red-500 hover:bg-red-50 transition-colors"
                        aria-label="Delete list"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <ChevronRight
                    className={cn(
                      "w-4 h-4 text-[var(--text-muted)] transition-transform",
                      isExpanded && "rotate-90"
                    )}
                  />
                </div>

                {/* Expanded profiles */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{ height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-[var(--border-light)] p-3 space-y-1">
                        {profiles.length === 0 ? (
                          <p className="text-xs text-[var(--text-muted)] text-center py-4">
                            No creators in this list yet
                          </p>
                        ) : (
                          profiles.map((p) => (
                            <div
                              key={p.user_id}
                              className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--bg-hover)] transition-colors"
                            >
                              <div className="w-8 h-8 rounded-full overflow-hidden bg-[var(--purple-100)] flex items-center justify-center flex-shrink-0">
                                <img
                                  src={p.picture}
                                  alt={p.fullname}
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = "none";
                                    const parent = target.parentElement;
                                    if (parent && !parent.querySelector("span")) {
                                      const span = document.createElement("span");
                                      span.textContent = getInitials(p.fullname);
                                      span.className = "text-[var(--accent)] font-semibold text-xs";
                                      parent.appendChild(span);
                                    }
                                  }}
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-[var(--text-primary)] truncate">
                                  @{p.username}
                                </div>
                              </div>
                              <button
                                onClick={() => removeFromList(list.id, p.user_id)}
                                className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-red-500 hover:bg-red-50 transition-colors"
                                aria-label={`Remove @${p.username}`}
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
