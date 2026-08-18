"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

// Richard's current city — swap this single constant when moving between
// Toronto and LA rather than adding a picker.
const CLOCK_ZONE = "America/Toronto";
const CLOCK_LABEL = "Eastern Time";

function formatClock(date: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: CLOCK_ZONE,
    timeZoneName: "short",
  }).formatToParts(date);

  const hour = parts.find((p) => p.type === "hour")?.value ?? "";
  const minute = parts.find((p) => p.type === "minute")?.value ?? "";
  const dayPeriod = parts.find((p) => p.type === "dayPeriod")?.value ?? "";
  const zoneName = parts.find((p) => p.type === "timeZoneName")?.value ?? "";

  return `${hour}:${minute} ${dayPeriod} ${zoneName}`;
}

type SpotifyState = {
  isPlaying: boolean;
  title: string | null;
  artist: string | null;
  album: string | null;
  albumArt: string | null;
  url: string | null;
  fetchedAt: string;
};

const POLL_MS = 60_000;

function EqBars({ playing }: { playing: boolean }) {
  return (
    <span className="eq hero-live-bars" data-playing={playing} aria-hidden="true">
      <span className="eq-bar" />
      <span className="eq-bar" />
      <span className="eq-bar" />
    </span>
  );
}

export default function HeroLive() {
  const [now, setNow] = useState(() => formatClock(new Date()));

  useEffect(() => {
    // The homepage is statically prerendered, so the lazy initial state above
    // can be stale by the time a visitor loads it. suppressHydrationWarning
    // on the span lets React skip past that mismatch; this corrects it
    // immediately on mount instead of waiting up to a minute for the first tick.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(formatClock(new Date()));

    // A plain setInterval(60_000) ticks 60s after mount time, not on the
    // real minute boundary, so the display can lag up to 59s behind. Align
    // the first tick to the next minute boundary, then run every 60s from
    // there.
    let intervalId: ReturnType<typeof setInterval> | null = null;
    const msIntoMinute = Date.now() % 60_000;
    const timeoutId = setTimeout(() => {
      setNow(formatClock(new Date()));
      intervalId = setInterval(() => setNow(formatClock(new Date())), 60_000);
    }, 60_000 - msIntoMinute);

    // Background/inactive tabs throttle or pause timers (especially on
    // mobile), so the clock can go stale while hidden. visibilitychange
    // alone misses iOS Safari bfcache restores (swiping back/forward, or
    // returning from another app), so also resync on pageshow and focus.
    function resync() {
      setNow(formatClock(new Date()));
    }
    function handleVisibility() {
      if (!document.hidden) resync();
    }
    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("pageshow", resync);
    window.addEventListener("focus", resync);

    return () => {
      clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("pageshow", resync);
      window.removeEventListener("focus", resync);
    };
  }, []);

  const [track, setTrack] = useState<SpotifyState | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/spotify", { cache: "no-store" });
        if (!res.ok) return;
        const json = (await res.json()) as SpotifyState;
        if (!cancelled) setTrack(json);
      } catch {
        // Stay silent — the Spotify half just won't render.
      }
    }

    function stopPolling() {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    function startPolling() {
      stopPolling();
      timerRef.current = setInterval(load, POLL_MS);
    }

    function handleVisibility() {
      if (document.hidden) {
        stopPolling();
      } else {
        load();
        startPolling();
      }
    }

    load();
    startPolling();
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      cancelled = true;
      stopPolling();
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  const hasTrack = Boolean(track && track.title && track.artist);
  const trackLabel = track?.isPlaying ? "Listening live to" : "Last played";

  return (
    <section className="hero-live">
      <span className="mono-label hero-live-label">
        {CLOCK_LABEL}
        {hasTrack ? ` · ${trackLabel}` : ""}
      </span>
      <div className="hero-live-row">
        <span className="hero-live-value" suppressHydrationWarning>
          {now}
        </span>

        {hasTrack && track && (
          <>
            {track.albumArt && (
              <span className="hero-live-mini-art">
                <Image
                  src={track.albumArt}
                  alt={track.album ?? "Album art"}
                  fill
                  sizes="22px"
                />
              </span>
            )}
            {track.url ? (
              <a
                href={track.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hero-live-value hero-live-track"
              >
                {track.artist} — {track.title}
              </a>
            ) : (
              <span className="hero-live-value">
                {track.artist} — {track.title}
              </span>
            )}
            <EqBars playing={track.isPlaying} />
          </>
        )}
      </div>
    </section>
  );
}
