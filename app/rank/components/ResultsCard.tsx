"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { toPng } from "html-to-image";
import type { Album } from "../data/albums";
import type { Tier } from "./TierSort";
import { kendallTauB, verdict } from "../lib/correlation";

const POSTER_WIDTH = 1080;
const POSTER_HEIGHT = 1920;

// Must match the Tailwind utilities used below (mt-16, mt-6, mt-3, mt-1, gap-10) so the
// layout-effect math lines up with what actually renders.
const SECTION_GAP = 64; // mt-16, before the hero and before the grid
const TAU_GAP = 24; // mt-6, grid -> tau
const FOOTER_GAP = 24; // mt-6, tau -> footer
const HERO_TITLE_GAP = 24; // mt-6, hero cover -> title
const HERO_RATING_GAP = 4; // mt-1, hero title -> rating
const GRID_GAP = 40; // gap-10, both between the two grid rows and between the two columns
const GRID_COLS = 2; // ranks 2-5 as a 2x2 grid

// Target sizes from the brief. Used as a scale ratio (hero stays ~1.47x a grid cover)
// and as a hard cap - never rendered larger than this even if there's extra room.
const TARGET_HERO_SIZE = 560;
const TARGET_GRID_SIZE = 380;

const TIER_RANK_COLOR: Record<Tier, string> = {
  S: "text-[#d4af37]",
  A: "text-white",
  B: "text-zinc-500",
};

function CoverBlock({ album, sizePx }: { album: Album; sizePx?: number }) {
  const sizeStyle = sizePx !== undefined ? { width: sizePx, height: sizePx } : undefined;
  const sizeClass = sizePx !== undefined ? "shrink-0" : "aspect-square w-full";
  if (album.cover) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={album.cover}
        alt={album.title}
        style={sizeStyle}
        className={`rounded-2xl object-cover ${sizeClass}`}
      />
    );
  }
  return (
    <div
      style={sizeStyle}
      className={`flex items-center justify-center overflow-hidden rounded-2xl bg-zinc-800 p-4 text-center ${sizeClass}`}
    >
      <span className="line-clamp-5 text-sm font-semibold leading-snug text-zinc-300">
        {album.title}
      </span>
    </div>
  );
}

export default function ResultsCard({
  ranked,
  ratings,
  tiers,
}: {
  ranked: Album[];
  ratings: Record<string, number>;
  tiers?: Record<string, Tier>;
}) {
  const posterRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const heroTitleRef = useRef<HTMLParagraphElement>(null);
  const heroRatingRef = useRef<HTMLParagraphElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const firstCaptionRef = useRef<HTMLDivElement>(null);
  const tauRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const [scale, setScale] = useState(1);
  const [saving, setSaving] = useState(false);
  const [heroCoverSize, setHeroCoverSize] = useState<number | null>(null);
  const [gridCoverSize, setGridCoverSize] = useState<number | null>(null);

  const top = ranked[0];
  // Only ranks 2-5 are displayed. The tau line below still scores the full `ranked`
  // array (all 18), not this display-only slice.
  const gridAlbums = ranked.slice(1, 5);
  const gridRows = Math.ceil(gridAlbums.length / GRID_COLS);

  useEffect(() => {
    const updateScale = () => {
      const buttonHeight = buttonRef.current?.offsetHeight ?? 0;
      const availableWidth = window.innerWidth - 48;
      // py-10 (80px) on the outer wrapper + gap-6 (24px) before the button + the button itself.
      const availableHeight = window.innerHeight - 80 - 24 - buttonHeight;
      const next = Math.min(availableWidth / POSTER_WIDTH, availableHeight / POSTER_HEIGHT);
      setScale(Math.max(next, 0.15));
    };
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  // Compute hero and grid cover sizes from leftover vertical space so the poster always
  // fits the fixed 1920px canvas, instead of hardcoding sizes that can silently overflow.
  // Both sizes scale together off the target 560:380 ratio, capped at the target values.
  useLayoutEffect(() => {
    if (gridRows === 0) return;
    const poster = posterRef.current;
    const header = headerRef.current;
    const heroTitle = heroTitleRef.current;
    const heroRating = heroRatingRef.current;
    const grid = gridRef.current;
    const caption = firstCaptionRef.current;
    const tau = tauRef.current;
    const footer = footerRef.current;
    if (!poster || !header || !heroTitle || !heroRating || !grid || !caption || !tau || !footer) {
      return;
    }

    const posterStyle = getComputedStyle(poster);
    const paddingTop = parseFloat(posterStyle.paddingTop);
    const paddingBottom = parseFloat(posterStyle.paddingBottom);

    const heroTextHeight = HERO_TITLE_GAP + heroTitle.offsetHeight + HERO_RATING_GAP + heroRating.offsetHeight;

    const chromeFixed =
      paddingTop +
      header.offsetHeight +
      SECTION_GAP + // before hero
      heroTextHeight +
      SECTION_GAP + // before grid
      GRID_GAP * (gridRows - 1) +
      caption.offsetHeight * gridRows +
      TAU_GAP +
      tau.offsetHeight +
      FOOTER_GAP +
      footer.offsetHeight +
      paddingBottom;

    const availableForCovers = POSTER_HEIGHT - chromeFixed;
    const ratio = TARGET_HERO_SIZE / TARGET_GRID_SIZE;
    const naturalGridSize = availableForCovers / (ratio + gridRows);
    const naturalHeroSize = naturalGridSize * ratio;

    const columnWidth = Math.floor((grid.offsetWidth - GRID_GAP * (GRID_COLS - 1)) / GRID_COLS);
    const heroMaxWidth = heroRef.current?.offsetWidth ?? TARGET_HERO_SIZE;

    setGridCoverSize(
      Math.max(0, Math.floor(Math.min(naturalGridSize, TARGET_GRID_SIZE, columnWidth))),
    );
    setHeroCoverSize(
      Math.max(0, Math.floor(Math.min(naturalHeroSize, TARGET_HERO_SIZE, heroMaxWidth))),
    );
  }, [gridRows, ranked, ratings]);

  // Dev-only safety net: measure the real rendered content height (independent of the
  // math above) and warn loudly if it still doesn't fit the 1920px canvas.
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    const poster = posterRef.current;
    const content = contentRef.current;
    if (!poster || !content) return;
    const posterStyle = getComputedStyle(poster);
    const paddingTop = parseFloat(posterStyle.paddingTop);
    const paddingBottom = parseFloat(posterStyle.paddingBottom);
    const totalHeight = paddingTop + content.scrollHeight + paddingBottom;
    if (totalHeight > POSTER_HEIGHT) {
      console.warn(
        `[ResultsCard] poster content is ${Math.round(totalHeight)}px tall, ` +
          `exceeding the ${POSTER_HEIGHT}px canvas by ${Math.round(totalHeight - POSTER_HEIGHT)}px.`,
      );
    }
  }, [heroCoverSize, gridCoverSize, ranked, ratings]);

  const handleSave = async () => {
    if (!posterRef.current) return;
    setSaving(true);
    try {
      await document.fonts.ready;
      const dataUrl = await toPng(posterRef.current, {
        pixelRatio: 2,
        width: POSTER_WIDTH,
        height: POSTER_HEIGHT,
      });
      const link = document.createElement("a");
      link.download = "drake-albums-ranked.png";
      link.href = dataUrl;
      link.click();
    } finally {
      setSaving(false);
    }
  };

  const year = new Date().getFullYear();
  // Kendall's tau is computed on the full ranked list (all 18), never the top-5 slice
  // shown on the poster.
  const tau = kendallTauB(ranked);
  const verdictText = verdict(tau);

  return (
    <div className="flex min-h-screen w-full flex-col items-center gap-6 bg-transparent py-10 text-white">
      <div style={{ width: POSTER_WIDTH * scale, height: POSTER_HEIGHT * scale }}>
        <div
          style={{
            width: POSTER_WIDTH,
            height: POSTER_HEIGHT,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
          <div
            ref={posterRef}
            style={{ width: POSTER_WIDTH, height: POSTER_HEIGHT }}
            className="relative flex flex-col overflow-hidden bg-black px-16 py-20"
          >
            <div
              aria-hidden
              className="absolute inset-0 -z-10"
              style={{
                backgroundImage: "url(/background/toronto-bg.jpg)",
                backgroundSize: "cover",
                backgroundPosition: "center",
                filter: "blur(14px) saturate(0.7)",
                transform: "scale(1.08)",
              }}
            />
            <div aria-hidden className="absolute inset-0 -z-10 bg-black/75" />

            <div ref={contentRef}>
              <header ref={headerRef} className="text-center">
                <p className="text-[64px] font-black uppercase leading-[0.95] tracking-tight">
                  My Drake Albums
                </p>
                <p className="text-[64px] font-black uppercase leading-[0.95] tracking-tight text-white/40">
                  Ranked
                </p>
              </header>

              {top && (
                <div ref={heroRef} className="mt-16 flex flex-col items-center">
                  <div
                    className="relative"
                    style={heroCoverSize !== null ? { width: heroCoverSize } : undefined}
                  >
                    <CoverBlock album={top} sizePx={heroCoverSize ?? undefined} />
                    <div className="absolute -left-6 -top-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#d4af37] text-3xl font-black text-black">
                      01
                    </div>
                  </div>
                  <p
                    ref={heroTitleRef}
                    className="mt-6 max-w-[80%] text-center text-3xl font-bold"
                  >
                    {top.title}
                  </p>
                  <p ref={heroRatingRef} className="mt-1 text-center text-sm text-white/40">
                    {ratings[top.id]}/10
                  </p>
                </div>
              )}

              <div ref={gridRef} className="mt-16 grid grid-cols-2 gap-10">
                {gridAlbums.map((album, i) => {
                  const tier = tiers?.[album.id];
                  const numberColor = tier ? TIER_RANK_COLOR[tier] : "text-white/60";
                  return (
                    <div key={album.id} className="flex flex-col items-center">
                      <CoverBlock album={album} sizePx={gridCoverSize ?? undefined} />
                      <div ref={i === 0 ? firstCaptionRef : undefined}>
                        <p className={`mt-3 text-2xl font-bold ${numberColor}`}>
                          {i + 2}{" "}
                          <span className="text-sm font-normal text-white/40">
                            {ratings[album.id]}/10
                          </span>
                        </p>
                        <p className="mt-1 max-w-full truncate text-center text-xl font-medium">
                          {album.title}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div ref={tauRef} className="mt-6 flex flex-col items-center gap-2">
                <p className="text-xs text-white/30">ranked all {ranked.length}</p>
                <p className="text-sm text-white/40">
                  Kendall&rsquo;s τ vs critics: {tau.toFixed(2)}
                </p>
                <p className="text-2xl font-bold">{verdictText}</p>
              </div>

              <footer ref={footerRef} className="mt-6 text-center text-lg text-white/30">
                {year}
              </footer>
            </div>
          </div>
        </div>
      </div>

      <button
        ref={buttonRef}
        onClick={handleSave}
        disabled={saving}
        className="rounded-full bg-white px-8 py-3 text-sm font-semibold text-black transition-colors duration-150 hover:bg-white/85 disabled:opacity-50"
      >
        {saving ? "Saving…" : "Save as image"}
      </button>
    </div>
  );
}
