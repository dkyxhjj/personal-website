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

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center gap-8 bg-transparent px-6 text-white">
      <span className="absolute top-6 right-6 text-xs uppercase tracking-widest text-white/40">
        {index + 1} of {ordered.length}
      </span>

      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="flex flex-col items-center gap-6"
        >
          <CoverImage album={current} className="aspect-square w-64 rounded-lg sm:w-72" />
          <h1 className="text-center text-xl font-semibold">{current.title}</h1>
          <div className="flex flex-wrap justify-center gap-2">
            {SCORES.map((score) => (
              <button
                key={score}
                onClick={() => handleRate(score)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-sm font-medium transition-colors duration-150 hover:bg-white/15"
              >
                {score}
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
