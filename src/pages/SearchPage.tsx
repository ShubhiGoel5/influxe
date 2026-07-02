import { useState, useMemo } from "react";
import type { Platform, FilterState } from "@/types";
import { Layout } from "@/components/Layout";
import { HeroSection } from "@/components/HeroSection";
import { PlatformFilter } from "@/components/PlatformFilter";
import { SearchBar } from "@/components/SearchBar";
import { FilterButton } from "@/components/FilterButton";
import { TrendingCarousel } from "@/components/TrendingCarousel";
import { ProfileList } from "@/components/ProfileList";
import { extractProfiles, filterProfiles, sortProfiles, getTrendingCreators } from "@/utils/dataHelpers";
import { useDebounce } from "@/hooks/useDebounce";

export function SearchPage() {
  const [platform, setPlatform] = useState<Platform>("instagram");
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [filters, setFilters] = useState<FilterState>({
    minFollowers: null,
    maxFollowers: null,
    verifiedOnly: false,
    sortBy: "followers",
  });

  const allProfiles = useMemo(() => extractProfiles(platform), [platform]);
  const trendingCreators = useMemo(() => getTrendingCreators(platform, 5), [platform]);

  const filteredProfiles = useMemo(() => {
    let result = filterProfiles(allProfiles, debouncedSearchQuery);

    // Apply filters
    if (filters.minFollowers !== null) {
      result = result.filter((p) => p.followers >= filters.minFollowers!);
    }
    if (filters.maxFollowers !== null) {
      result = result.filter((p) => p.followers <= filters.maxFollowers!);
    }
    if (filters.verifiedOnly) {
      result = result.filter((p) => p.is_verified);
    }

    // Sort
    result = sortProfiles(result, filters.sortBy);

    return result;
  }, [allProfiles, debouncedSearchQuery, filters]);

  return (
    <Layout
      title="Discover Influencers"
      hideHeaderSearch
    >
      {/* Hero */}
      <HeroSection />

      {/* Platform Tabs */}
      <PlatformFilter selected={platform} onChange={setPlatform} />

      {/* Search + Filter row */}
      <div className="flex items-center gap-3 mb-6">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
        <FilterButton filters={filters} onFiltersChange={setFilters} />
      </div>

      {/* Trending Carousel */}
      {!debouncedSearchQuery && (
        <TrendingCarousel creators={trendingCreators} />
      )}

      {/* All Influencers Grid */}
      <ProfileList
        profiles={filteredProfiles}
        platform={platform}
        totalCount={allProfiles.length}
        sortBy={filters.sortBy}
        onSortChange={(sortBy) => setFilters((f) => ({ ...f, sortBy }))}
      />
    </Layout>
  );
}
