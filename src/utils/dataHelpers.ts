import instagramData from "@/assets/data/search/instagram.json";
import youtubeData from "@/assets/data/search/youtube.json";
import tiktokData from "@/assets/data/search/tiktok.json";
import type { Platform, SearchData, UserProfileSummary, SortOption } from "@/types";

const platformData: Record<Platform, SearchData> = {
  instagram: instagramData as SearchData,
  youtube: youtubeData as SearchData,
  tiktok: tiktokData as SearchData,
};

export function getSearchData(platform: Platform): SearchData {
  return platformData[platform];
}

export function extractProfiles(platform: Platform): UserProfileSummary[] {
  const data = getSearchData(platform);
  return data.accounts.map((item) => {
    const profile = item.account.user_profile;
    // Some platforms (like YouTube) might use handle or custom_name instead of username
    const username = profile.username || (profile as any).handle || (profile as any).custom_name || "unknown";
    return {
      ...profile,
      username,
    };
  });
}

export function filterProfiles(
  profiles: UserProfileSummary[],
  query: string
): UserProfileSummary[] {
  if (!query) return profiles;
  const q = query.toLowerCase();
  return profiles.filter((p) => {
    const matchUsername = p.username.toLowerCase().includes(q);
    const matchFullname = p.fullname.toLowerCase().includes(q);
    const matchHandle = p.handle?.toLowerCase().includes(q);
    return matchUsername || matchFullname || matchHandle;
  });
}

export function sortProfiles(
  profiles: UserProfileSummary[],
  sortBy: SortOption
): UserProfileSummary[] {
  return [...profiles].sort((a, b) => {
    if (sortBy === "followers") {
      return b.followers - a.followers;
    }
    return (b.engagement_rate || 0) - (a.engagement_rate || 0);
  });
}

export function getTrendingCreators(
  platform: Platform,
  count: number = 5
): UserProfileSummary[] {
  const profiles = extractProfiles(platform);
  return [...profiles]
    .sort((a, b) => (b.engagement_rate || 0) - (a.engagement_rate || 0))
    .slice(0, count);
}

export function getTotalCount(platform: Platform): number {
  return getSearchData(platform).total;
}

export function formatTotalCount(total: number): string {
  if (total >= 1_000_000) return (total / 1_000_000).toFixed(0) + "M";
  if (total >= 1_000) return (total / 1_000).toFixed(0) + "K";
  return total.toString();
}

export const PLATFORMS: Platform[] = ["instagram", "youtube", "tiktok"];

export function getPlatformLabel(platform: Platform): string {
  if (platform === "instagram") return "Instagram";
  if (platform === "youtube") return "YouTube";
  return "TikTok";
}

export function getInitials(name: string): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}
