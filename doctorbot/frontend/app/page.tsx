"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import DoctorAvatar from "@/components/DoctorAvatar";

export default function Home() {
  return (
    <main className="min-h-screen relative z-20 flex items-center">
      {/* Decorative Gallifreyan rings - top right */}
      <div className="absolute top-12 right-12 w-64 h-64 opacity-[0.06] pointer-events-none hidden lg:block">
        <div
          className="absolute inset-0 rounded-full border border-[var(--amber)]"
          style={{ animation: "gallifrey-spin 60s linear infinite" }}
        />
        <div
          className="absolute inset-6 rounded-full border border-[var(--amber)] border-dashed"
          style={{ animation: "gallifrey-counter 45s linear infinite" }}
        />
        <div
          className="absolute inset-14 rounded-full border border-[var(--amber)]"
          style={{ animation: "gallifrey-spin 30s linear infinite" }}
        />
        <div className="absolute inset-20 rounded-full border border-[var(--amber)]" />
      </div>

      {/* Main content - left-aligned, asymmetric */}
      <div className="max-w-2xl ml-[8vw] md:ml-[12vw] px-6 py-16">
        {/* Tiny status line */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex items-center gap-3 mb-10"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-[var(--sonic-green)] shadow-[0_0_6px_var(--sonic-green)]" />
          <span className="font-display text-[0.6rem] tracking-[0.2em] uppercase text-[var(--text-muted)]">
            Temporal link established
          </span>
        </motion.div>

        {/* Avatar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
          className="mb-8"
        >
          <DoctorAvatar mood="playful" size="lg" />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7 }}
          className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-wide mb-4"
          style={{ color: "var(--amber)", animation: "flicker 8s infinite" }}
        >
          DoctorBot
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-lg md:text-xl text-[var(--text-muted)] mb-8 max-w-md leading-relaxed"
        >
          The Doctor Will See You Now
        </motion.p>

        {/* Quote */}
        <motion.blockquote
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="border-l-2 border-[var(--amber-dim)] pl-4 mb-12 max-w-sm"
        >
          <p className="text-sm italic text-[var(--text-muted)] leading-relaxed">
            &ldquo;We&rsquo;re all stories in the end. Just make it a good one, eh?&rdquo;
          </p>
          <cite className="text-xs text-[var(--amber-dim)] not-italic mt-1 block font-display tracking-wider">
            — The Eleventh Doctor
          </cite>
        </motion.blockquote>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.5 }}
        >
          <Link
            href="/chat"
            className="group inline-flex items-center gap-3 font-display text-sm tracking-[0.15em] uppercase border border-[var(--amber-dim)] text-[var(--amber)] px-8 py-3.5 hover:bg-[var(--amber)]/10 hover:border-[var(--amber)] hover:shadow-[0_0_20px_rgba(212,165,116,0.15)] transition-all duration-300"
          >
            <span>Enter the TARDIS</span>
            <svg
              className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </motion.div>

        {/* Bottom decorative line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1.6, duration: 1, ease: "easeOut" }}
          className="mt-16 h-px bg-gradient-to-r from-[var(--amber-dim)] via-transparent to-transparent max-w-xs origin-left"
        />
      </div>

      {/* Bottom-right coordinates */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="fixed bottom-6 right-8 text-[0.55rem] font-display tracking-[0.15em] text-[var(--text-muted)]/40 hidden md:block"
      >
        GALACTIC COORDINATES 10-0-11-00:02
      </motion.div>
    </main>
  );
}
