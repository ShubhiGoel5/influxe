import { useState, useRef, useEffect } from "react";
import { SlidersHorizontal } from "lucide-react";
import type { FilterState } from "@/types";
import { cn } from "@/lib/utils";

interface FilterButtonProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

export function FilterButton({ filters, onFiltersChange }: FilterButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const activeCount = [
    filters.minFollowers !== null,
    filters.maxFollowers !== null,
    filters.verifiedOnly,
  ].filter(Boolean).length;

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all",
          isOpen || activeCount > 0
            ? "bg-[var(--accent-light)] border-[var(--accent)] text-[var(--accent)]"
            : "bg-white border-[var(--border-default)] text-[var(--text-secondary)] hover:border-[var(--slate-300)]"
        )}
      >
        <SlidersHorizontal className="w-4 h-4" />
        Filters
        {activeCount > 0 && (
          <span className="bg-[var(--accent)] text-white text-xs font-semibold w-5 h-5 rounded-full flex items-center justify-center">
            {activeCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 z-30 w-72 bg-white border border-[var(--border-default)] rounded-xl shadow-lg p-4 animate-scale-in">
          <div className="space-y-4">
            {/* Followers range */}
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-2 uppercase tracking-wider">
                Followers
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minFollowers ?? ""}
                  onChange={(e) =>
                    onFiltersChange({
                      ...filters,
                      minFollowers: e.target.value ? Number(e.target.value) : null,
                    })
                  }
                  className="flex-1 px-3 py-2 border border-[var(--border-default)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                />
                <span className="text-[var(--text-muted)] text-xs">to</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxFollowers ?? ""}
                  onChange={(e) =>
                    onFiltersChange({
                      ...filters,
                      maxFollowers: e.target.value ? Number(e.target.value) : null,
                    })
                  }
                  className="flex-1 px-3 py-2 border border-[var(--border-default)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                />
              </div>
            </div>

            {/* Verified Only */}
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-[var(--text-primary)]">
                Verified only
              </label>
              <button
                onClick={() =>
                  onFiltersChange({ ...filters, verifiedOnly: !filters.verifiedOnly })
                }
                className={cn(
                  "w-10 h-6 rounded-full transition-colors relative",
                  filters.verifiedOnly ? "bg-[var(--accent)]" : "bg-[var(--slate-300)]"
                )}
                role="switch"
                aria-checked={filters.verifiedOnly}
              >
                <span
                  className={cn(
                    "absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform",
                    filters.verifiedOnly ? "translate-x-[18px]" : "translate-x-0.5"
                  )}
                />
              </button>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-2 uppercase tracking-wider">
                Sort by
              </label>
              <div className="flex gap-2">
                {(["followers", "engagement"] as const).map((opt) => (
                  <button
                    key={opt}
                    onClick={() => onFiltersChange({ ...filters, sortBy: opt })}
                    className={cn(
                      "flex-1 py-2 rounded-lg text-sm font-medium border transition-colors",
                      filters.sortBy === opt
                        ? "bg-[var(--accent)] text-white border-[var(--accent)]"
                        : "bg-white text-[var(--text-secondary)] border-[var(--border-default)] hover:border-[var(--slate-300)]"
                    )}
                  >
                    {opt === "followers" ? "Followers" : "Engagement"}
                  </button>
                ))}
              </div>
            </div>

            {/* Clear */}
            {activeCount > 0 && (
              <button
                onClick={() =>
                  onFiltersChange({
                    minFollowers: null,
                    maxFollowers: null,
                    verifiedOnly: false,
                    sortBy: filters.sortBy,
                  })
                }
                className="w-full py-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
