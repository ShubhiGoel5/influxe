import { useState, memo } from "react";
import { useNavigate } from "react-router-dom";
import type { Platform, UserProfileSummary } from "@/types";
import { VerifiedBadge } from "./VerifiedBadge";
import { PlatformIcon } from "./PlatformIcon";
import { useListStore } from "@/store/useListStore";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { formatFollowers, formatEngagementRate } from "@/utils/formatters";
import { getInitials } from "@/utils/dataHelpers";
import { Check, Plus } from "lucide-react";
import { AddToListModal } from "./AddToListModal";

interface ProfileCardProps {
  profile: UserProfileSummary;
  platform: Platform;
  index?: number;
}

export const ProfileCard = memo(function ProfileCard({
  profile,
  platform,
  index = 0,
}: ProfileCardProps) {
  const navigate = useNavigate();
  const isInAnyList = useListStore((s) => s.isInAnyList);
  const getListsForProfile = useListStore((s) => s.getListsForProfile);
  const [showModal, setShowModal] = useState(false);
  const [imgError, setImgError] = useState(false);

  const isAdded = isInAnyList(profile.user_id);
  const listsIn = getListsForProfile(profile.user_id);

  const handleCardClick = () => {
    navigate(`/profile/${profile.username}?platform=${platform}`);
  };

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowModal(true);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        onClick={handleCardClick}
        className="bg-white border border-[var(--border-default)] rounded-2xl p-4 cursor-pointer card-hover group"
      >
        {/* Top: Avatar + platform icon */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="w-12 h-12 rounded-full overflow-hidden bg-[var(--purple-100)] flex items-center justify-center flex-shrink-0">
              {!imgError ? (
                <img
                  src={profile.picture}
                  alt={profile.fullname}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                  onError={() => setImgError(true)}
                />
              ) : (
                <span className="text-[var(--accent)] font-bold text-sm">
                  {getInitials(profile.fullname)}
                </span>
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <span className="text-sm font-bold text-[var(--text-primary)] truncate">
                  @{profile.username}
                </span>
                <VerifiedBadge verified={profile.is_verified} size={14} />
              </div>
              <p className="text-xs text-[var(--text-muted)] truncate mt-0.5">
                {profile.fullname}
              </p>
            </div>
          </div>
          <PlatformIcon platform={platform} size={16} className="flex-shrink-0 mt-1 opacity-60" />
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 mb-4">
          <div>
            <div className="text-base font-bold text-[var(--text-primary)]">
              {formatFollowers(profile.followers)}
            </div>
            <div className="text-[11px] text-[var(--text-muted)]">Followers</div>
          </div>
          <div>
            <div className="text-base font-bold text-[var(--text-primary)]">
              {formatEngagementRate(profile.engagement_rate)}
            </div>
            <div className="text-[11px] text-[var(--text-muted)]">Eng. Rate</div>
          </div>
        </div>

        {/* Add to List button */}
        <button
          onClick={handleAddClick}
          className={cn(
            "w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all",
            isAdded
              ? "bg-[var(--success-bg)] text-[var(--success)] border border-[var(--success-border)]"
              : "bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] shadow-sm"
          )}
        >
          {isAdded ? (
            <>
              <Check className="w-4 h-4" />
              Added
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              Add to List
            </>
          )}
        </button>

        {/* Lists info */}
        {isAdded && listsIn.length > 0 && (
          <div className="mt-2 text-center">
            <span className="text-[11px] text-[var(--text-muted)]">
              In {listsIn.length} list{listsIn.length > 1 ? "s" : ""}
            </span>
          </div>
        )}
      </motion.div>

      {/* Add to List Modal */}
      <AddToListModal
        profile={profile}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
});
