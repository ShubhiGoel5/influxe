import type { Platform, UserProfileSummary, SortOption } from "@/types";
import { ProfileCard } from "./ProfileCard";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutGrid, List } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface ProfileListProps {
  profiles: UserProfileSummary[];
  platform: Platform;
  totalCount: number;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export function ProfileList({
  profiles,
  platform,
  totalCount,
  sortBy,
  onSortChange,
}: ProfileListProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-[var(--text-primary)]">All Influencers</h2>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Showing {profiles.length} of {totalCount} results
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Sort */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[var(--text-muted)]">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="text-sm font-medium text-[var(--text-primary)] bg-transparent border-none cursor-pointer focus:outline-none"
            >
              <option value="followers">Followers</option>
              <option value="engagement">Engagement</option>
            </select>
          </div>

          {/* View toggle */}
          <div className="flex items-center bg-[var(--bg-secondary)] rounded-lg p-0.5 border border-[var(--border-default)]">
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "p-1.5 rounded-md transition-colors",
                viewMode === "grid"
                  ? "bg-white text-[var(--accent)] shadow-sm"
                  : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
              )}
              aria-label="Grid view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "p-1.5 rounded-md transition-colors",
                viewMode === "list"
                  ? "bg-white text-[var(--accent)] shadow-sm"
                  : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
              )}
              aria-label="List view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid/List */}
      <AnimatePresence mode="wait">
        <motion.div
          key={platform}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className={cn(
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
              : "flex flex-col gap-3"
          )}
        >
          {profiles.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="text-3xl mb-2">🔍</div>
              <p className="text-sm text-[var(--text-muted)]">No influencers found</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">Try adjusting your search or filters</p>
            </div>
          ) : (
            profiles.map((profile, i) => (
              <ProfileCard
                key={profile.user_id}
                profile={profile}
                platform={platform}
                index={i}
              />
            ))
          )}
        </motion.div>
      </AnimatePresence>
    </motion.section>
  );
}
