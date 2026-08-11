"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Album } from "../data/albums";

function CoverImage({ album, className }: { album: Album; className?: string }) {
  if (album.cover) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={album.cover}
        alt={album.title}
        width={288}
        height={288}
        className={`object-cover ${className}`}
      />
    );
  }
  return (
    <div
      className={`flex items-center justify-center overflow-hidden bg-zinc-800 p-3 text-center ${className}`}
    >
      <span className="line-clamp-4 text-sm font-medium leading-snug text-zinc-300">
        {album.title}
      </span>
    </div>
  );
}

const SCORES = Array.from({ length: 11 }, (_, i) => i);

export default function RatePhase({
  albums,
  onComplete,
}: {
  albums: Album[];
  onComplete: (ratings: Record<string, number>) => void;
}) {
  const [ordered] = useState(() => [...albums].sort((a, b) => b.year - a.year));
  const [index, setIndex] = useState(0);
  const [ratings, setRatings] = useState<Record<string, number>>({});

  useEffect(() => {
    for (const album of albums) {
      if (album.cover) {
        const img = new Image();
        img.src = album.cover;
      }
    }
  }, [albums]);

  const current = ordered[index];

  const handleRate = (score: number) => {
    if (!current) return;
    const next = { ...ratings, [current.id]: score };
    setRatings(next);
    if (index + 1 >= ordered.length) {
      onComplete(next);
    } else {
      setIndex(index + 1);
    }
  };

  // Re-subscribed every render (small, fixed-size list) so the handler
  // always closes over the current album/index instead of a stale one.
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "-") {
        handleRate(10);
      } else if (e.key >= "0" && e.key <= "9") {
        handleRate(Number(e.key));
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  });

  if (!current) return null;

  const progress = (index / ordered.length) * 100;

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center gap-10 bg-transparent px-6 text-white">
      <div className="fixed inset-x-0 top-0 h-[2px] bg-white/[0.06]">
        <div
          className="h-full bg-[#d4af37] transition-[width] duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="absolute top-6 right-6 font-[family-name:var(--font-mono)] text-xs tracking-widest text-white/35">
        {String(index + 1).padStart(2, "0")} / {String(ordered.length).padStart(2, "0")}
      </span>

      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col items-center gap-7"
        >
          <CoverImage
            album={current}
            className="aspect-square w-64 rounded-xl shadow-2xl shadow-black/60 ring-1 ring-white/10 sm:w-72"
          />
          <h1 className="max-w-md text-center font-[family-name:var(--font-display)] text-3xl leading-tight sm:text-4xl">
            {current.title}
          </h1>

          <div className="flex flex-col items-center gap-2.5">
            <div className="flex flex-wrap justify-center gap-2">
              {SCORES.map((score) => (
                <button
                  key={score}
                  onClick={() => handleRate(score)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] font-[family-name:var(--font-mono)] text-sm text-white/80 transition-all duration-150 hover:border-[#d4af37]/60 hover:bg-[#d4af37]/10 hover:text-[#d4af37] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37]"
                >
                  {score}
                </button>
              ))}
            </div>
            <span className="font-[family-name:var(--font-mono)] text-[11px] tracking-widest text-white/30">
              0 SKIP · 10 PERFECT
            </span>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
