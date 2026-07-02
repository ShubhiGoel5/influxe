interface VerifiedBadgeProps {
  verified: boolean;
  size?: number;
}

export function VerifiedBadge({ verified, size = 16 }: VerifiedBadgeProps) {
  if (!verified) return null;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className="inline-block ml-1 flex-shrink-0"
      aria-label="Verified"
    >
      <circle cx="12" cy="12" r="10" fill="#3b82f6" />
      <path
        d="M9 12l2 2 4-4"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
