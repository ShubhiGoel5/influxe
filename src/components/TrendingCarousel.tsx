import type { UserProfileSummary } from "@/types";
import { VerifiedBadge } from "./VerifiedBadge";
import { formatFollowers } from "@/utils/formatters";
import { getInitials } from "@/utils/dataHelpers";
import { TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

interface TrendingCarouselProps {
  creators: UserProfileSummary[];
}

export function TrendingCarousel({ creators }: TrendingCarouselProps) {

  // Generate a gradient based on the creator index
  const gradients = [
    "from-purple-600 to-indigo-700",
    "from-rose-500 to-pink-600",
    "from-cyan-500 to-blue-600",
    "from-amber-500 to-orange-600",
    "from-emerald-500 to-teal-600",
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="mb-8"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-lg font-bold text-[var(--text-primary)]">
          Trending Creators This Week
        </h2>
        <span className="text-lg">🔥</span>
      </div>

      {/* Carousel */}
      <div className="overflow-hidden w-full pb-2">
        <div className="flex gap-4 animate-infinite-scroll">
          {[...creators, ...creators].map((creator, index) => {
            const i = index % creators.length;
            const engScore = creator.engagement_rate
              ? (creator.engagement_rate * 100).toFixed(1)
              : null;

            return (
              <div
                key={`${creator.user_id}-${index}`}
                className="flex-shrink-0 w-[220px]"
              >
              <div className="relative rounded-2xl overflow-hidden card-hover bg-white border border-[var(--border-default)] cursor-pointer group">
                {/* Cover */}
                <div className={`h-[140px] bg-gradient-to-br ${gradients[i % gradients.length]} relative`}>
                  {/* Engagement score badge */}
                  {engScore && (
                    <div className="absolute top-3 left-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 shadow-sm">
                      <TrendingUp className="w-3 h-3 text-[var(--success)]" />
                      <span className="text-xs font-bold text-[var(--success)]">
                        {engScore}
                      </span>
                    </div>
                  )}

                  {/* Decorative pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <svg className="w-full h-full" viewBox="0 0 220 140">
                      <circle cx="180" cy="30" r="40" fill="white" />
                      <circle cx="40" cy="120" r="30" fill="white" />
                    </svg>
                  </div>
                </div>

                {/* Profile picture overlapping */}
                <div className="absolute left-4 top-[116px]">
                  <TrendingAvatar picture={creator.picture} name={creator.fullname} />
                </div>

                {/* Info */}
                <div className="pt-8 pb-4 px-4">
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-bold text-[var(--text-primary)] truncate">
                      {creator.fullname}
                    </span>
                    <VerifiedBadge verified={creator.is_verified} size={14} />
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="text-xs text-[var(--text-muted)]">
                      {formatFollowers(creator.followers)} Followers
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        </div>
      </div>
    </motion.section>
  );
}

function TrendingAvatar({ picture, name }: { picture: string; name: string }) {
  return (
    <div className="w-12 h-12 rounded-full border-3 border-white overflow-hidden bg-[var(--purple-100)] flex items-center justify-center shadow-md">
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
            span.className = "text-[var(--accent)] font-bold text-sm";
            parent.appendChild(span);
          }
        }}
      />
    </div>
  );
}
