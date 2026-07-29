"use client";

import { useEffect, useRef, type CSSProperties } from "react";

const GRAIN =
  "url(\"data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.280'/></svg>\")";

const SEED = 174074637;
const SPEED = 1.0;
const MOTION_AMOUNT = 0.4;
const MOTION_REVERSE = false;
const WAVE = 14;

type Variant = "page" | "spec";

interface Blob {
  hex: string;
  x: number;
  y: number;
  r: number;
  peak: number;
}

interface Palette {
  backdrop: string;
  blobs: Blob[];
}

const PALETTES: Record<Variant, Palette> = {
  spec: {
    backdrop: "#D7D5D5",
    blobs: [
      { hex: "215, 213, 213", x: 66.94, y: 46.43, r: 76.1, peak: 1 },
      { hex: "49, 5, 39", x: 34.69, y: 66.31, r: 50.9, peak: 1 },
      { hex: "57, 5, 31", x: 48.93, y: 19.32, r: 67.0, peak: 1 },
      { hex: "255, 255, 255", x: 80.23, y: 87.54, r: 41.1, peak: 1 },
    ],
  },
  page: {
    backdrop: "#0B0A0A",
    blobs: [
      { hex: "215, 213, 213", x: 66.94, y: 46.43, r: 76.1, peak: 0.14 },
      { hex: "49, 5, 39", x: 34.69, y: 66.31, r: 50.9, peak: 0.95 },
      { hex: "57, 5, 31", x: 48.93, y: 19.32, r: 67.0, peak: 0.95 },
      { hex: "255, 255, 255", x: 80.23, y: 87.54, r: 41.1, peak: 0.08 },
    ],
  },
};

function hash(n: number): number {
  const s = Math.sin(n) * 43758.5453123;
  return s - Math.floor(s);
}

function phases(count: number): { p: number; p2: number }[] {
  const out: { p: number; p2: number }[] = [];
  for (let i = 0; i < count; i++) {
    out.push({
      p: hash(SEED * 0.0001 + i * 12.9898) * Math.PI * 2,
      p2: hash(SEED * 0.0001 + i * 78.233 + 4.0) * Math.PI * 2,
    });
  }
  return out;
}

function buildLayers(blobs: Blob[], ph: number, amt: number): string {
  const ps = phases(blobs.length);
  const layers = [GRAIN];

  for (let i = 0; i < blobs.length; i++) {
    const b = blobs[i];
    const { p, p2 } = ps[i];

    const dx = (Math.sin(ph * 0.55 + p) - Math.sin(p)) * WAVE * amt;
    const dy = (Math.sin(ph * 0.43 + p2) - Math.sin(p2)) * WAVE * amt;

    const cx = b.x + dx;
    const cy = b.y + dy;
    const a = b.peak;

    layers.push(
      `radial-gradient(circle at ${cx}% ${cy}%, ` +
        `rgba(${b.hex}, ${a}) 0%, ` +
        `rgba(${b.hex}, ${a * 0.844}) ${b.r * 0.25}%, ` +
        `rgba(${b.hex}, ${a * 0.5}) ${b.r * 0.5}%, ` +
        `rgba(${b.hex}, ${a * 0.156}) ${b.r * 0.75}%, ` +
        `rgba(${b.hex}, 0) ${b.r}%)`
    );
  }

  return layers.join(", ");
}

interface MeshGradientProps {
  variant?: Variant;
  className?: string;
  style?: CSSProperties;
}

export default function MeshGradient({
  variant = "page",
  className,
  style,
}: MeshGradientProps) {
  const ref = useRef<HTMLDivElement>(null);
  const raf = useRef<number>(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const { blobs } = PALETTES[variant] ?? PALETTES.page;
    const dir = MOTION_REVERSE ? -1 : 1;

    el.style.backgroundImage = buildLayers(blobs, 0, MOTION_AMOUNT);

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) return;

    let start: number | null = null;

    const frame = (now: number) => {
      if (start === null) start = now;

      if (!document.hidden) {
        const t = (now - start) / 1000;
        const ph = t * SPEED * dir;
        el.style.backgroundImage = buildLayers(blobs, ph, MOTION_AMOUNT);
      }

      raf.current = requestAnimationFrame(frame);
    };

    raf.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf.current);
  }, [variant]);

  const palette = PALETTES[variant] ?? PALETTES.page;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={className}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        pointerEvents: "none",
        backgroundColor: palette.backdrop,
        backgroundSize: "120px 120px, auto, auto, auto, auto",
        backgroundBlendMode: "overlay, normal, normal, normal, normal",
        ...style,
      }}
    />
  );
}
