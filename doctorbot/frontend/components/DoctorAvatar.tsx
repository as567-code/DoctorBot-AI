"use client";

import { motion } from "framer-motion";

const MOOD_COLORS: Record<string, { primary: string; glow: string }> = {
  excited: { primary: "#e8c49a", glow: "rgba(232, 196, 154, 0.5)" },
  serious: { primary: "#5a7ab5", glow: "rgba(90, 122, 181, 0.4)" },
  playful: { primary: "#d4a574", glow: "rgba(212, 165, 116, 0.4)" },
  concerned: { primary: "#c47a5a", glow: "rgba(196, 122, 90, 0.4)" },
  manic: { primary: "#39d98a", glow: "rgba(57, 217, 138, 0.4)" },
};

interface Props {
  mood: string;
  size?: "sm" | "lg";
}

export default function DoctorAvatar({ mood, size = "lg" }: Props) {
  const colors = MOOD_COLORS[mood] || MOOD_COLORS.playful;
  const dim = size === "lg" ? 80 : 36;

  return (
    <motion.div
      className="relative"
      style={{ width: dim, height: dim }}
      animate={{
        filter: [
          `drop-shadow(0 0 4px ${colors.glow})`,
          `drop-shadow(0 0 12px ${colors.glow})`,
          `drop-shadow(0 0 4px ${colors.glow})`,
        ],
      }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Outer ring - slow spin */}
        <motion.circle
          cx="50" cy="50" r="46"
          fill="none"
          stroke={colors.primary}
          strokeWidth="0.8"
          strokeDasharray="8 4 2 4"
          opacity="0.5"
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "50px 50px" }}
        />

        {/* Middle ring - counter spin */}
        <motion.circle
          cx="50" cy="50" r="38"
          fill="none"
          stroke={colors.primary}
          strokeWidth="0.6"
          strokeDasharray="3 6"
          opacity="0.3"
          animate={{ rotate: -360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "50px 50px" }}
        />

        {/* Inner circle - the "eye" */}
        <circle
          cx="50" cy="50" r="28"
          fill="none"
          stroke={colors.primary}
          strokeWidth="1"
          opacity="0.6"
        />

        {/* Core glow */}
        <circle
          cx="50" cy="50" r="16"
          fill={`url(#coreGlow-${mood})`}
          opacity="0.8"
        />

        {/* Gallifreyan accent marks */}
        <circle cx="50" cy="18" r="2.5" fill={colors.primary} opacity="0.4" />
        <circle cx="82" cy="50" r="2" fill={colors.primary} opacity="0.3" />
        <circle cx="50" cy="82" r="2.5" fill={colors.primary} opacity="0.4" />
        <circle cx="18" cy="50" r="2" fill={colors.primary} opacity="0.3" />

        {/* Connecting arcs */}
        <path
          d="M 30 20 A 35 35 0 0 1 70 20"
          fill="none"
          stroke={colors.primary}
          strokeWidth="0.5"
          opacity="0.2"
        />
        <path
          d="M 80 30 A 35 35 0 0 1 80 70"
          fill="none"
          stroke={colors.primary}
          strokeWidth="0.5"
          opacity="0.2"
        />

        <defs>
          <radialGradient id={`coreGlow-${mood}`}>
            <stop offset="0%" stopColor={colors.primary} stopOpacity="0.6" />
            <stop offset="60%" stopColor={colors.primary} stopOpacity="0.15" />
            <stop offset="100%" stopColor={colors.primary} stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>
    </motion.div>
  );
}
