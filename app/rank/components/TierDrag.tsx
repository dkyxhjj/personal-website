"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Reorder } from "framer-motion";
import type { Album } from "../data/albums";

const AUTOSCROLL_EDGE_PX = 60;
const AUTOSCROLL_MAX_SPEED = 14;

function CoverThumb({ album }: { album: Album }) {
  if (album.cover) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={album.cover}
        alt={album.title}
        width={36}
        height={36}
        className="h-7 w-7 shrink-0 rounded-md object-cover sm:h-9 sm:w-9"
      />
    );
  }
  return (
    <div className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-md bg-zinc-800 text-center sm:h-9 sm:w-9">
      <span className="line-clamp-2 text-[7px] font-medium leading-tight text-zinc-300">
        {album.title}
      </span>
    </div>
  );
}

function GripDots() {
  return (
    <div className="grid shrink-0 grid-cols-2 gap-[3px] px-0.5">
      {Array.from({ length: 6 }).map((_, i) => (
        <span key={i} className="h-[3px] w-[3px] rounded-full bg-white/20" />
      ))}
    </div>
  );
}

function seedOrder(albums: Album[], ratings: Record<string, number>): Album[] {
  return [...albums].sort((a, b) => {
    const ratingDiff = (ratings[b.id] ?? 0) - (ratings[a.id] ?? 0);
    if (ratingDiff !== 0) return ratingDiff;
    return a.year - b.year;
  });
}

export default function TierDrag({
  albums,
  ratings,
  onConfirm,
}: {
  albums: Album[];
  ratings: Record<string, number>;
  onConfirm: (final: Album[]) => void;
}) {
  const [order, setOrder] = useState<Album[]>(() => seedOrder(albums, ratings));
  const [liveRatings, setLiveRatings] = useState<Record<string, number>>(ratings);
  const orderRef = useRef(order);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const pointerYRef = useRef<number | null>(null);
  const autoScrollFrameRef = useRef<number | null>(null);

  const handleReorder = (items: Album[]) => {
    orderRef.current = items;
    setOrder(items);
  };

  const stopAutoScroll = useCallback(() => {
    if (autoScrollFrameRef.current !== null) {
      cancelAnimationFrame(autoScrollFrameRef.current);
      autoScrollFrameRef.current = null;
    }
    pointerYRef.current = null;
  }, []);

  const startAutoScroll = useCallback(() => {
    if (autoScrollFrameRef.current !== null) return;
    const tick = () => {
      const container = scrollRef.current;
      const y = pointerYRef.current;
      if (!container || y === null) {
        autoScrollFrameRef.current = null;
        return;
      }
      const rect = container.getBoundingClientRect();
      let delta = 0;
      if (y < rect.top + AUTOSCROLL_EDGE_PX) {
        const intensity = Math.min(1, (rect.top + AUTOSCROLL_EDGE_PX - y) / AUTOSCROLL_EDGE_PX);
        delta = -AUTOSCROLL_MAX_SPEED * intensity;
      } else if (y > rect.bottom - AUTOSCROLL_EDGE_PX) {
        const intensity = Math.min(1, (y - (rect.bottom - AUTOSCROLL_EDGE_PX)) / AUTOSCROLL_EDGE_PX);
        delta = AUTOSCROLL_MAX_SPEED * intensity;
      }
      if (delta !== 0) {
        container.scrollTop += delta;
      }
      autoScrollFrameRef.current = requestAnimationFrame(tick);
    };
    autoScrollFrameRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => stopAutoScroll, [stopAutoScroll]);

  const handleDragStart = (_: unknown, info: { point: { y: number } }) => {
    pointerYRef.current = info.point.y;
    startAutoScroll();
  };

  const handleDrag = (_: unknown, info: { point: { y: number } }) => {
    pointerYRef.current = info.point.y;
  };

  const handleDragEnd = (id: string) => {
    stopAutoScroll();
    const current = orderRef.current;
    const idx = current.findIndex((a) => a.id === id);
    const prev = current[idx - 1];
    const next = current[idx + 1];
    const landingRating = prev
      ? liveRatings[prev.id]
      : next
        ? liveRatings[next.id]
        : undefined;
    if (landingRating !== undefined && landingRating !== liveRatings[id]) {
      setLiveRatings((r) => ({ ...r, [id]: landingRating }));
    }
  };

  const ranks = new Map<string, number>();
  order.forEach((album, i) => ranks.set(album.id, i + 1));

  return (
    // 67px = mobile .rail height (46px btn + 2*0.6rem padding + 1px border, app/globals.css);
    // the rail is a fixed bottom bar below the 899px breakpoint and overlays the viewport.
    <div className="flex h-dvh w-full flex-col gap-3 overflow-hidden bg-transparent px-6 py-5 text-white max-[899px]:h-[calc(100dvh_-_67px_-_env(safe-area-inset-bottom))]">
      <div className="shrink-0 text-center">
        <h1 className="font-[family-name:var(--font-display)] text-xl sm:text-2xl">Drag to break ties</h1>
        <p className="mt-1 hidden font-[family-name:var(--font-mono)] text-[11px] tracking-widest text-white/30 sm:block">
          REORDER WITHIN EACH RATING BAND
        </p>
      </div>

      <div className="relative min-h-0 flex-1">
        <Reorder.Group
          as="div"
          axis="y"
          values={order}
          onReorder={handleReorder}
          ref={scrollRef}
          className="flex h-full flex-col gap-1 overflow-y-auto py-1"
        >
          {order.map((album, i) => {
            const rating = liveRatings[album.id];
            const prevRating = i > 0 ? liveRatings[order[i - 1].id] : undefined;
            const showDivider = i === 0 || rating !== prevRating;
            const rank = ranks.get(album.id) ?? 0;
            return (
              <Reorder.Item
                key={album.id}
                as="div"
                value={album}
                style={{ touchAction: "none" }}
                onDragStart={handleDragStart}
                onDrag={handleDrag}
                onDragEnd={() => handleDragEnd(album.id)}
                whileDrag={{ scale: 1.03, boxShadow: "0 8px 24px rgba(0,0,0,0.5)" }}
                transition={{ duration: 0.18 }}
              >
                {showDivider && (
                  <div className="mt-2 mb-1 flex items-center gap-2 px-1 font-[family-name:var(--font-mono)] text-[10px] tracking-widest text-[#d4af37]/70">
                    <span>{rating}/10</span>
                    <span className="h-px flex-1 bg-white/10" />
                  </div>
                )}
                <div className="flex items-center gap-2.5 rounded-lg border border-white/5 bg-white/[0.04] px-2 py-1 transition-colors duration-150 hover:bg-white/[0.07] sm:px-2.5 sm:py-1.5">
                  <GripDots />
                  <span
                    className={`w-5 shrink-0 text-right font-[family-name:var(--font-mono)] text-xs ${
                      rank <= 3 ? "text-[#d4af37]" : "text-white/40"
                    }`}
                  >
                    {rank}
                  </span>
                  <CoverThumb album={album} />
                  <span className="min-w-0 flex-1 truncate text-sm">{album.title}</span>
                </div>
              </Reorder.Item>
            );
          })}
        </Reorder.Group>
        <div className="pointer-events-none absolute inset-x-0 top-0 h-6 bg-gradient-to-b from-black to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-black to-transparent" />
      </div>

      <button
        onClick={() => onConfirm(order)}
        className="shrink-0 self-center rounded-full bg-white px-8 py-3 text-sm font-semibold text-black transition-colors duration-150 hover:bg-white/85"
      >
        Done
      </button>
    </div>
  );
}
