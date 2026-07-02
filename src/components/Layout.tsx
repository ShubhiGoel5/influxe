import { useEffect } from "react";
import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Compass, Heart, Megaphone, Search, Bell, ChevronLeft, ChevronRight } from "lucide-react";
import { useUIStore } from "@/store/useUIStore";
import { useListStore } from "@/store/useListStore";
import { cn } from "@/lib/utils";
import { MyListsPanel } from "./MyListsPanel";

interface LayoutProps {
  children: ReactNode;
  title?: string;
  /** If true, hides the global search bar in the header (for pages with their own search) */
  hideHeaderSearch?: boolean;
  headerSearchValue?: string;
  onHeaderSearchChange?: (val: string) => void;
}

const NAV_ITEMS = [
  { path: "/", label: "Discover", icon: Compass },
  { path: "/lists", label: "My Lists", icon: Heart },
  { path: "/campaigns", label: "Campaigns", icon: Megaphone },
];

export function Layout({
  children,
  title,
  hideHeaderSearch = false,
  headerSearchValue = "",
  onHeaderSearchChange,
}: LayoutProps) {
  const location = useLocation();
  const { isSidebarCollapsed, toggleSidebar, toggleMyListsPanel, isMyListsPanelOpen } = useUIStore();
  const assignments = useListStore((s) => s.assignments);
  const savedCount = new Set(
    Object.values(assignments).flatMap((profiles) => profiles.map((p) => p.user_id))
  ).size;

  useEffect(() => {
    if (title) {
      document.title = `${title} | Influex`;
    } else {
      document.title = "Influex | Creator Discovery Platform";
    }
  }, [title]);

  return (
    <div className="flex w-full h-screen overflow-hidden bg-[var(--bg-secondary)] text-[var(--text-primary)]">
      {/* Sidebar */}
      <aside
        className={cn(
          "flex-shrink-0 h-full bg-white border-r border-[var(--border-default)] transition-all duration-300 z-30 flex flex-col relative",
          isSidebarCollapsed ? "w-[68px]" : "w-[220px]"
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-5 border-b border-[var(--border-light)]">
          <Link to="/" className="flex items-center gap-2.5 no-underline">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent)] flex items-center justify-center flex-shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5z" fill="white" opacity="0.9" />
                <path d="M2 17l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            {!isSidebarCollapsed && (
              <span className="text-lg font-bold text-[var(--text-primary)] tracking-tight">
                Influex
              </span>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 flex flex-col gap-1 overflow-y-auto hide-scrollbar">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center px-3 py-2.5 rounded-lg text-sm font-medium no-underline transition-all group",
                  isActive
                    ? "bg-[var(--accent-light)] text-[var(--accent)] shadow-sm"
                    : "text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]"
                )}
                title={isSidebarCollapsed ? item.label : undefined}
              >
                <Icon
                  className={cn(
                    "flex-shrink-0 transition-colors",
                    isSidebarCollapsed ? "w-5 h-5 mx-auto" : "w-5 h-5 mr-3",
                    isActive ? "text-[var(--accent)]" : "text-[var(--text-muted)] group-hover:text-[var(--text-secondary)]"
                  )}
                />
                {!isSidebarCollapsed && <span>{item.label}</span>}
                {!isSidebarCollapsed && item.label === "My Lists" && savedCount > 0 && (
                  <span className="ml-auto bg-[var(--accent)] text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                    {savedCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Collapse toggle */}
        <div className="p-3 border-t border-[var(--border-light)]">
          <button
            onClick={toggleSidebar}
            className="w-full flex items-center justify-center p-2 rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-secondary)] transition-colors"
            aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isSidebarCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col h-full min-w-0 transition-all duration-300 relative">
        {/* Top Header */}
        <header className="flex-shrink-0 h-16 flex items-center gap-4 px-6 bg-white border-b border-[var(--border-default)] z-20">
          {/* Search in header */}
          {!hideHeaderSearch && (
            <div className="flex-1 max-w-xl relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-[var(--text-muted)]" />
              </div>
              <input
                type="text"
                value={headerSearchValue}
                onChange={(e) => onHeaderSearchChange?.(e.target.value)}
                placeholder="Search influencers by username, name or keyword..."
                className="w-full bg-[var(--bg-secondary)] border border-[var(--border-default)] pl-10 pr-4 py-2 rounded-lg text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded bg-[var(--bg-secondary)] border border-[var(--border-default)] text-[10px] text-[var(--text-muted)] font-medium">
                  ⌘K
                </kbd>
              </div>
            </div>
          )}
          {hideHeaderSearch && <div className="flex-1" />}

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <button
              className="relative p-2 rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-secondary)] transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            <button
              onClick={toggleMyListsPanel}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isMyListsPanelOpen
                  ? "bg-[var(--accent-light)] text-[var(--accent)]"
                  : "text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"
              )}
            >
              <Heart className="w-4 h-4" />
              <span className="hidden sm:inline">My Lists</span>
              {savedCount > 0 && (
                <span className="bg-[var(--accent)] text-white text-xs font-semibold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                  {savedCount}
                </span>
              )}
            </button>

            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--purple-400)] to-[var(--purple-600)] flex items-center justify-center text-white text-xs font-semibold ml-1 cursor-pointer">
              U
            </div>
          </div>
        </header>

        {/* Content + Right Panel */}
        <div className="flex flex-1 overflow-hidden min-w-0">
          {/* Main Content */}
          <main className="flex-1 overflow-y-auto min-w-0 w-full">
            <div className="p-4 sm:p-6 max-w-[1200px] mx-auto w-full">
              {children}
            </div>
          </main>

          {/* My Lists Right Sidebar */}
          <MyListsPanel />
        </div>
      </div>
    </div>
  );
}
