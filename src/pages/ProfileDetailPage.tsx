import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import { PlatformIcon } from "@/components/PlatformIcon";
import type { FullUserProfile, Platform, ProfileDetailResponse } from "@/types";
import { formatEngagementRate } from "@/utils/formatters";
import { loadProfileByUsername } from "@/utils/profileLoader";
import { useListStore } from "@/store/useListStore";
import { getInitials } from "@/utils/dataHelpers";
import { ArrowLeft, ExternalLink, Check, Plus, Users, Heart, Eye, MessageCircle, FileText, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { AddToListModal } from "@/components/AddToListModal";

function formatNumber(count: number) {
  if (count >= 1000000) return (count / 1000000).toFixed(2) + "M";
  if (count >= 1000) return (count / 1000).toFixed(1) + "K";
  return String(count);
}

export function ProfileDetailPage() {
  const { username } = useParams<{ username: string }>();
  const [searchParams] = useSearchParams();
  const platform = (searchParams.get("platform") || "instagram") as Platform;
  const [profileData, setProfileData] = useState<ProfileDetailResponse | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!username) return;
    loadProfileByUsername(username).then((data) => {
      setProfileData(data);
      setLoaded(true);
    });
  }, [username]);

  if (!username) {
    return (
      <Layout>
        <div className="text-center py-20">
          <p className="text-[var(--text-muted)]">Invalid profile</p>
          <Link to="/" className="text-[var(--accent)] text-sm mt-2 inline-block">Back to Discover</Link>
        </div>
      </Layout>
    );
  }

  if (!loaded) {
    return (
      <Layout title={`@${username}`}>
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  if (!profileData) {
    return (
      <Layout title={`@${username}`}>
        <div className="text-center py-20">
          <div className="text-4xl mb-3">😕</div>
          <p className="text-[var(--text-secondary)] mb-2">
            Could not load profile for @{username}
          </p>
          <Link to="/" className="text-[var(--accent)] text-sm font-medium hover:underline">
            ← Back to Discover
          </Link>
        </div>
      </Layout>
    );
  }

  const user: FullUserProfile = profileData.data.user_profile;
  const isInAnyList = useListStore((s) => s.isInAnyList)(user.user_id);
  const getListsForProfile = useListStore((s) => s.getListsForProfile)(user.user_id);

  const stats = [
    { label: "Followers", value: formatNumber(user.followers), icon: Users },
    { label: "Engagement", value: formatEngagementRate(user.engagement_rate), icon: BarChart3 },
    user.posts_count !== undefined ? { label: "Posts", value: formatNumber(user.posts_count), icon: FileText } : null,
    user.avg_likes !== undefined ? { label: "Avg Likes", value: formatNumber(user.avg_likes), icon: Heart } : null,
    user.avg_comments !== undefined ? { label: "Avg Comments", value: formatNumber(user.avg_comments), icon: MessageCircle } : null,
    user.avg_views !== undefined && user.avg_views > 0 ? { label: "Avg Views", value: formatNumber(user.avg_views), icon: Eye } : null,
    user.engagements !== undefined ? { label: "Engagements", value: user.engagements.toLocaleString(), icon: Heart } : null,
  ].filter(Boolean) as { label: string; value: string; icon: any }[];

  return (
    <Layout title={user.fullname}>
      {/* Back */}
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors mb-6 no-underline"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Discover
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl"
      >
        {/* Profile header card */}
        <div className="bg-white border border-[var(--border-default)] rounded-2xl overflow-hidden shadow-sm">
          {/* Cover */}
          <div className="h-32 bg-gradient-to-r from-[var(--purple-500)] to-[var(--purple-700)] relative">
            <div className="absolute inset-0 opacity-10">
              <svg className="w-full h-full" viewBox="0 0 800 128">
                <circle cx="700" cy="40" r="80" fill="white" />
                <circle cx="100" cy="100" r="50" fill="white" />
              </svg>
            </div>
          </div>

          <div className="px-6 pb-6">
            {/* Avatar */}
            <div className="-mt-12 mb-4 flex items-end justify-between">
              <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden bg-[var(--purple-100)] flex items-center justify-center shadow-lg">
                {!imgError ? (
                  <img
                    src={user.picture}
                    alt={user.fullname}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <span className="text-[var(--accent)] font-bold text-2xl">
                    {getInitials(user.fullname)}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {user.url && (
                  <a
                    href={user.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[var(--border-default)] text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] transition-colors no-underline"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View Profile
                  </a>
                )}
                <button
                  onClick={() => setShowModal(true)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all",
                    isInAnyList
                      ? "bg-[var(--success-bg)] text-[var(--success)] border border-[var(--success-border)]"
                      : "bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] shadow-sm"
                  )}
                >
                  {isInAnyList ? (
                    <>
                      <Check className="w-4 h-4" />
                      In {getListsForProfile.length} List{getListsForProfile.length > 1 ? "s" : ""}
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Add to List
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Name */}
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">
                @{user.username}
              </h1>
              <VerifiedBadge verified={user.is_verified} size={20} />
            </div>
            <p className="text-sm text-[var(--text-secondary)] mb-1">{user.fullname}</p>
            <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
              <PlatformIcon platform={platform} size={14} />
              <span className="capitalize">{platform}</span>
            </div>

            {/* Description */}
            {user.description && (
              <p className="mt-4 text-sm text-[var(--text-secondary)] leading-relaxed max-w-lg">
                {user.description}
              </p>
            )}
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mt-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="bg-white border border-[var(--border-default)] rounded-xl p-4 text-center"
              >
                <Icon className="w-4 h-4 text-[var(--accent)] mx-auto mb-2 opacity-60" />
                <div className="text-lg font-bold text-[var(--text-primary)]">{stat.value}</div>
                <div className="text-xs text-[var(--text-muted)] mt-0.5">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Add to List Modal */}
      <AddToListModal
        profile={user}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </Layout>
  );
}
