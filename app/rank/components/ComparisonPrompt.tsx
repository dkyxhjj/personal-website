"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { Album } from "../data/albums";

export type ComparisonSide = "left" | "right" | "too-close";

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

function AlbumOption({ album, onPick }: { album: Album; onPick: () => void }) {
  return (
    <button
      onClick={onPick}
      className="flex flex-col items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3 text-left transition-colors duration-150 active:border-[#d4af37]/60 active:bg-[#d4af37]/10 sm:p-4"
    >
      <CoverImage
        album={album}
        className="aspect-square w-32 rounded-lg shadow-xl shadow-black/50 ring-1 ring-white/10 sm:w-52"
      />
      <span className="max-w-[9rem] text-center text-sm font-medium leading-tight sm:max-w-[13rem] sm:text-base">
        {album.title}
      </span>
    </button>
  );
}

export default function ComparisonPrompt({
  left,
  right,
  remaining,
  onPick,
}: {
  left: Album;
  right: Album;
  remaining: number;
  onPick: (side: ComparisonSide) => void;
}) {
  return (
    <div className="relative flex h-dvh w-full flex-col items-center justify-center gap-6 overflow-y-auto bg-transparent px-4 text-white sm:gap-8 sm:px-6">
      <AnimatePresence mode="wait">
        <motion.div
          key={`${left.id}-${right.id}`}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.18 }}
          className="flex flex-col items-center gap-6 sm:gap-8"
        >
          <span className="font-[family-name:var(--font-mono)] text-xs tracking-widest text-white/35">
            Which is better?
          </span>

          <div className="flex items-start justify-center gap-4 sm:gap-8">
            <AlbumOption album={left} onPick={() => onPick("left")} />
            <AlbumOption album={right} onPick={() => onPick("right")} />
          </div>

          <div className="flex flex-col items-center gap-3">
            <button
              onClick={() => onPick("too-close")}
              className="rounded-full border border-white/15 px-4 py-1.5 text-xs text-white/50 transition-colors duration-150 active:border-white/30 active:text-white/80"
            >
              Too close
            </button>
            <span className="font-[family-name:var(--font-mono)] text-[11px] tracking-widest text-white/30">
              at most {remaining} more
            </span>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
