import { motion } from "framer-motion";
import heroImg from "@/assets/hero-illustration.png";

export function HeroSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-between gap-8 mb-8"
    >
      <div className="flex-1">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] leading-tight tracking-tight">
          Discover{" "}
          <span className="text-[var(--accent)]">Influencers</span>
        </h1>
        <p className="mt-2 text-base text-[var(--text-secondary)] max-w-md leading-relaxed">
          Find the perfect creators for your next campaign. Browse, compare, and save across platforms.
        </p>
      </div>
      <div className="hidden md:block flex-shrink-0 rounded-2xl overflow-hidden shadow-sm border border-[var(--border-light)] max-w-[30%]">
        <img
          src={heroImg}
          alt=""
          className="w-[240px] h-auto object-cover block"
          aria-hidden="true"
        />
      </div>
    </motion.section>
  );
}
