"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useAnimation, useReducedMotion } from "framer-motion";
import type { Album } from "../data/albums";
import type { MouseEvent as ReactMouseEvent } from "react";

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

function bandColorClass(score: number) {
  if (score >= 8) return "text-[#d4af37]";
  if (score >= 5) return "text-white";
  return "text-white/35";
}

function ScoreButton({
  score,
  onRate,
}: {
  score: number;
  onRate: (score: number, rect: DOMRect) => void;
}) {
  const controls = useAnimation();

  const handleClick = (e: ReactMouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    // Tactile confirmation: quick scale + ring, independent of the flying number.
    controls.start({
      scale: [1, 1.15, 1],
      boxShadow: [
        "0 0 0 0px rgba(212,175,55,0)",
        "0 0 0 5px rgba(212,175,55,0.35)",
        "0 0 0 0px rgba(212,175,55,0)",
      ],
      transition: { duration: 0.15, ease: "easeOut" },
    });
    onRate(score, rect);
  };

  return (
    <motion.button
      animate={controls}
      onClick={handleClick}
      className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] font-[family-name:var(--font-mono)] text-[10px] text-white/80 transition-colors duration-150 hover:border-[#d4af37]/60 hover:bg-[#d4af37]/10 hover:text-[#d4af37] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37] sm:h-10 sm:w-10 sm:text-sm"
    >
      {score}
    </motion.button>
  );
}

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

  // Fly-out overlays: keyed by id so multiple can coexist (rapid taps), each removes
  // itself from state via onAnimationComplete once its own flight finishes.
  const [flyingNumbers, setFlyingNumbers] = useState<
    { id: number; score: number; x: number; y: number }[]
  >([]);
  const flyingIdRef = useRef(0);
  const prefersReducedMotion = useReducedMotion();

  const removeFlyingNumber = (id: number) => {
    setFlyingNumbers((list) => list.filter((f) => f.id !== id));
  };

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

  // Purely presentational: spawns the fly-out overlay and haptic, then defers to the
  // unchanged handleRate above. Never awaits anything, so the next album's entrance is
  // not delayed by the confirmation animation.
  const handleScoreTap = (score: number, rect: DOMRect) => {
    if (!prefersReducedMotion) {
      setFlyingNumbers((list) => [
        ...list,
        { id: flyingIdRef.current++, score, x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 },
      ]);
    }
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(10);
    }
    handleRate(score);
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
    // 67px = mobile .rail height (46px btn + 2*0.6rem padding + 1px border, app/globals.css);
    // the rail is a fixed bottom bar below the 899px breakpoint and overlays the viewport.
    <div className="relative flex h-dvh w-full flex-col items-center justify-center gap-6 overflow-y-auto bg-transparent px-4 text-white max-[899px]:h-[calc(100dvh_-_67px_-_env(safe-area-inset-bottom))] sm:gap-10 sm:px-6">
      <div className="fixed inset-x-0 top-0 h-[2px] bg-white/[0.06]">
        <div
          className="h-full bg-[#d4af37] transition-[width] duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="absolute top-6 right-6 font-[family-name:var(--font-mono)] text-xs tracking-widest text-white/35">
        {String(index + 1).padStart(2, "0")} / {String(ordered.length).padStart(2, "0")}
      </span>

      {/* Fixed + pointer-events-none: purely decorative, never intercepts the next tap. */}
      <AnimatePresence>
        {flyingNumbers.map((f) => (
          <motion.div
            key={f.id}
            className="pointer-events-none fixed z-[60]"
            style={{ left: f.x, top: f.y, x: "-50%", y: "-50%" }}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.span
              initial={{ opacity: 1, scale: 1, y: 0 }}
              animate={{ opacity: 0, scale: 4, y: -80 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              onAnimationComplete={() => removeFlyingNumber(f.id)}
              className={`block font-[family-name:var(--font-mono)] text-2xl font-bold ${bandColorClass(f.score)}`}
            >
              {f.score}
            </motion.span>
          </motion.div>
        ))}
      </AnimatePresence>

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
            className="aspect-square w-40 rounded-xl shadow-2xl shadow-black/60 ring-1 ring-white/10 sm:w-72"
          />
          <h1 className="max-w-md text-center font-[family-name:var(--font-display)] text-xl leading-tight sm:text-4xl">
            {current.title}
          </h1>

          <div className="flex flex-col items-center gap-2.5">
            <div className="flex flex-nowrap justify-center gap-0.5 sm:flex-wrap sm:gap-2">
              {SCORES.map((score) => (
                <ScoreButton key={score} score={score} onRate={handleScoreTap} />
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
