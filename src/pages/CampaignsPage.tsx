import { Layout } from "@/components/Layout";
import { Megaphone } from "lucide-react";
import { motion } from "framer-motion";

export function CampaignsPage() {
  return (
    <Layout title="Campaigns">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-24 text-center"
      >
        <div className="w-20 h-20 rounded-2xl bg-[var(--accent-light)] flex items-center justify-center mb-6">
          <Megaphone className="w-10 h-10 text-[var(--accent)]" />
        </div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
          Campaigns
        </h1>
        <p className="text-sm text-[var(--text-muted)] max-w-md leading-relaxed mb-6">
          Manage your influencer campaigns, track outreach, and measure performance — all in one place.
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--accent-light)] text-[var(--accent)] text-sm font-medium">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent)]" />
          </span>
          Coming Soon
        </div>
      </motion.div>
    </Layout>
  );
}
