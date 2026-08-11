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
        width={32}
        height={32}
        className="h-8 w-8 shrink-0 rounded object-cover"
      />
    );
  }
  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded bg-zinc-800 text-center">
      <span className="line-clamp-2 text-[6px] font-medium leading-tight text-zinc-300">
        {album.title}
      </span>
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
    <div className="flex h-dvh w-full flex-col gap-2 overflow-hidden bg-transparent px-6 py-4 text-white">
      <h1 className="shrink-0 text-center text-lg font-semibold">Drag to break ties</h1>

      <div className="relative min-h-0 flex-1">
        <Reorder.Group
          as="div"
          axis="y"
          values={order}
          onReorder={handleReorder}
          ref={scrollRef}
          className="flex h-full flex-col overflow-y-auto"
        >
          {order.map((album, i) => {
            const rating = liveRatings[album.id];
            const prevRating = i > 0 ? liveRatings[order[i - 1].id] : undefined;
            const showDivider = i === 0 || rating !== prevRating;
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
                  <div className="mt-1 flex items-center gap-2 px-0.5 text-[9px] font-semibold uppercase tracking-widest text-white/30">
                    <span>{rating}</span>
                    <span className="h-px flex-1 bg-white/10" />
                  </div>
                )}
                <div className="mt-0.5 flex items-center gap-2 rounded-md bg-white/5 px-1.5 py-0.5">
                  <span className="w-4 shrink-0 text-right text-[10px] text-white/40">
                    {ranks.get(album.id)}
                  </span>
                  <CoverThumb album={album} />
                  <span className="truncate text-[11px]">{album.title}</span>
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
