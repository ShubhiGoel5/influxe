import { useState } from "react";
import { useListStore } from "@/store/useListStore";
import { useUIStore } from "@/store/useUIStore";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, MoreHorizontal, Trash2, Edit3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { getInitials } from "@/utils/dataHelpers";

export function MyListsPanel() {
  const { isMyListsPanelOpen, setMyListsPanelOpen, activeListTab, setActiveListTab } = useUIStore();
  const { lists, assignments, deleteList, renameList, getAllSavedProfiles, removeFromList } = useListStore();
  const [showCreateInput, setShowCreateInput] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [newListEmoji, setNewListEmoji] = useState("📋");
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const createList = useListStore((s) => s.createList);
  const allSaved = getAllSavedProfiles();

  const EMOJIS = ["⭐", "🔥", "💪", "🎯", "🚀", "💎", "🎬", "📋", "💜", "🌟"];

  const handleCreateList = () => {
    if (newListName.trim()) {
      createList(newListName.trim(), newListEmoji);
      setNewListName("");
      setNewListEmoji("📋");
      setShowCreateInput(false);
    }
  };

  const handleRename = (listId: string) => {
    if (editName.trim()) {
      renameList(listId, editName.trim());
      setEditingId(null);
    }
  };

  return (
    <AnimatePresence>
      {isMyListsPanelOpen && (
        <motion.aside
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 320, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ type: "spring", bounce: 0.1, duration: 0.4 }}
          className="border-l border-[var(--border-default)] bg-white flex-shrink-0 overflow-hidden"
        >
          <div className="w-[320px] h-full flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-[var(--border-light)] flex items-center justify-between">
              <h2 className="text-lg font-bold text-[var(--text-primary)]">My Lists</h2>
              <button
                onClick={() => setMyListsPanelOpen(false)}
                className="p-1.5 rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-secondary)] transition-colors"
                aria-label="Close panel"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-[var(--border-light)]">
              <button
                onClick={() => setActiveListTab("lists")}
                className={cn(
                  "flex-1 py-3 text-sm font-medium transition-colors relative",
                  activeListTab === "lists"
                    ? "text-[var(--accent)]"
                    : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                )}
              >
                Lists ({lists.length})
                {activeListTab === "lists" && (
                  <motion.div layoutId="list-tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--accent)]" />
                )}
              </button>
              <button
                onClick={() => setActiveListTab("saved")}
                className={cn(
                  "flex-1 py-3 text-sm font-medium transition-colors relative",
                  activeListTab === "saved"
                    ? "text-[var(--accent)]"
                    : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                )}
              >
                Saved Creators
                {activeListTab === "saved" && (
                  <motion.div layoutId="list-tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--accent)]" />
                )}
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {activeListTab === "lists" ? (
                <div className="flex flex-col gap-3">
                  {/* Create New List Button */}
                  <button
                    onClick={() => setShowCreateInput(true)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--accent)] text-white text-sm font-semibold hover:bg-[var(--accent-hover)] transition-colors shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Create New List
                  </button>

                  {/* Create Input */}
                  <AnimatePresence>
                    {showCreateInput && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-3 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-default)] space-y-2">
                          <div className="flex gap-2">
                            <div className="relative">
                              <select
                                value={newListEmoji}
                                onChange={(e) => setNewListEmoji(e.target.value)}
                                className="appearance-none w-10 h-10 text-lg text-center bg-white border border-[var(--border-default)] rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                              >
                                {EMOJIS.map((e) => (
                                  <option key={e} value={e}>{e}</option>
                                ))}
                              </select>
                            </div>
                            <input
                              type="text"
                              value={newListName}
                              onChange={(e) => setNewListName(e.target.value)}
                              onKeyDown={(e) => e.key === "Enter" && handleCreateList()}
                              placeholder="List name..."
                              className="flex-1 px-3 py-2 bg-white border border-[var(--border-default)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                              autoFocus
                            />
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={handleCreateList}
                              disabled={!newListName.trim()}
                              className="flex-1 py-2 rounded-lg bg-[var(--accent)] text-white text-sm font-medium hover:bg-[var(--accent-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              Create
                            </button>
                            <button
                              onClick={() => { setShowCreateInput(false); setNewListName(""); }}
                              className="px-4 py-2 rounded-lg border border-[var(--border-default)] text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* List Items */}
                  {lists.map((list) => {
                    const profiles = assignments[list.id] || [];
                    const isMenuOpen = menuOpenId === list.id;
                    const isEditing = editingId === list.id;

                    return (
                      <motion.div
                        key={list.id}
                        layout
                        className="p-3 bg-white border border-[var(--border-default)] rounded-xl hover:shadow-sm transition-shadow"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <span className="text-lg flex-shrink-0">{list.emoji}</span>
                            {isEditing ? (
                              <input
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") handleRename(list.id);
                                  if (e.key === "Escape") setEditingId(null);
                                }}
                                onBlur={() => handleRename(list.id)}
                                className="flex-1 px-2 py-0.5 border border-[var(--accent)] rounded text-sm focus:outline-none"
                                autoFocus
                              />
                            ) : (
                              <div className="min-w-0">
                                <div className="text-sm font-semibold text-[var(--text-primary)] truncate">{list.name}</div>
                                <div className="text-xs text-[var(--text-muted)]">{profiles.length} Creators</div>
                              </div>
                            )}
                          </div>

                          {/* Menu */}
                          <div className="relative">
                            <button
                              onClick={() => setMenuOpenId(isMenuOpen ? null : list.id)}
                              className="p-1 rounded text-[var(--text-muted)] hover:bg-[var(--bg-hover)] transition-colors"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                            {isMenuOpen && (
                              <>
                                <div className="fixed inset-0 z-10" onClick={() => setMenuOpenId(null)} />
                                <div className="absolute right-0 top-full mt-1 z-20 w-36 bg-white border border-[var(--border-default)] rounded-lg shadow-lg py-1 animate-scale-in">
                                  <button
                                    onClick={() => {
                                      setEditingId(list.id);
                                      setEditName(list.name);
                                      setMenuOpenId(null);
                                    }}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                    Rename
                                  </button>
                                  {list.id !== "default" && (
                                    <button
                                      onClick={() => {
                                        deleteList(list.id);
                                        setMenuOpenId(null);
                                      }}
                                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                      Delete
                                    </button>
                                  )}
                                </div>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Profile stack */}
                        {profiles.length > 0 && (
                          <div className="flex items-center mt-2 pl-7">
                            <div className="flex -space-x-2">
                              {profiles.slice(0, 4).map((p) => (
                                <ProfileAvatar key={p.user_id} picture={p.picture} name={p.fullname} size={28} />
                              ))}
                            </div>
                            {profiles.length > 4 && (
                              <span className="ml-2 text-xs text-[var(--text-muted)] font-medium">
                                +{profiles.length - 4}
                              </span>
                            )}
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                /* Saved Creators Tab */
                <div className="flex flex-col gap-2">
                  {allSaved.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-3xl mb-2">💜</div>
                      <p className="text-sm text-[var(--text-muted)]">No saved creators yet</p>
                      <p className="text-xs text-[var(--text-muted)] mt-1">
                        Add creators from the Discover page
                      </p>
                    </div>
                  ) : (
                    allSaved.map((profile) => (
                      <div
                        key={profile.user_id}
                        className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-[var(--bg-hover)] transition-colors"
                      >
                        <ProfileAvatar picture={profile.picture} name={profile.fullname} size={36} />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-[var(--text-primary)] truncate">
                            @{profile.username}
                          </div>
                          <div className="text-xs text-[var(--text-muted)] truncate">{profile.fullname}</div>
                        </div>
                        <button
                          onClick={() => {
                            // Remove from all lists
                            for (const list of lists) {
                              removeFromList(list.id, profile.user_id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-red-500 hover:bg-red-50 transition-colors"
                          aria-label={`Remove @${profile.username}`}
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

/** Small avatar with initials fallback */
function ProfileAvatar({ picture, name, size }: { picture: string; name: string; size: number }) {
  return (
    <div
      className="rounded-full border-2 border-white overflow-hidden bg-[var(--purple-100)] flex items-center justify-center flex-shrink-0"
      style={{ width: size, height: size }}
    >
      <img
        src={picture}
        alt={name}
        referrerPolicy="no-referrer"
        className="w-full h-full object-cover"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.style.display = "none";
          const parent = target.parentElement;
          if (parent && !parent.querySelector("span")) {
            const span = document.createElement("span");
            span.textContent = getInitials(name);
            span.className = "text-[var(--accent)] font-semibold";
            span.style.fontSize = `${Math.round(size * 0.4)}px`;
            parent.appendChild(span);
          }
        }}
      />
    </div>
  );
}
