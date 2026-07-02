import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative flex-1">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-[var(--text-muted)]" />
      </div>
      <input
        type="text"
        aria-label="Search influencers"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search influencers..."
        className="w-full bg-white border border-[var(--border-default)] pl-11 pr-4 py-2.5 rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent shadow-sm transition-all"
      />
    </div>
  );
}
