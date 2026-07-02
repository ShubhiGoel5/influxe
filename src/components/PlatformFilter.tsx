import type { Platform } from "@/types";
import { cn } from "@/lib/utils";
import { PlatformIcon } from "./PlatformIcon";
import { getTotalCount, formatTotalCount, getPlatformLabel, PLATFORMS } from "@/utils/dataHelpers";
import { motion } from "framer-motion";

interface PlatformFilterProps {
  selected: Platform;
  onChange: (p: Platform) => void;
}

export function PlatformFilter({ selected, onChange }: PlatformFilterProps) {
  return (
    <div className="flex items-center gap-3 mb-6">
      {PLATFORMS.map((p) => {
        const isActive = selected === p;
        const total = getTotalCount(p);
        const label = getPlatformLabel(p);
        return (
          <button
            key={p}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(p)}
            className={cn(
              "relative flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all border",
              isActive
                ? "bg-white border-[var(--accent)] text-[var(--accent)] shadow-sm"
                : "bg-white border-[var(--border-default)] text-[var(--text-secondary)] hover:border-[var(--slate-300)] hover:text-[var(--text-primary)]"
            )}
          >
            <PlatformIcon platform={p} size={18} />
            <span className="font-semibold">{label}</span>
            <span
              className={cn(
                "text-xs px-2 py-0.5 rounded-full font-medium",
                isActive
                  ? "bg-[var(--accent-light)] text-[var(--accent)]"
                  : "bg-[var(--bg-secondary)] text-[var(--text-muted)]"
              )}
            >
              {formatTotalCount(total)}
            </span>
            {isActive && (
              <motion.div
                layoutId="platform-indicator"
                className="absolute inset-0 rounded-xl border-2 border-[var(--accent)]"
                transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
                style={{ pointerEvents: "none" }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
