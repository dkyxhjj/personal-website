"use client";

import { useMemo, useState } from "react";
import { ALBUMS, type Album } from "./data/albums";
import RatePhase from "./components/RatePhase";
import TierDrag from "./components/TierDrag";
import ResultsCard from "./components/ResultsCard";
import ComparisonPrompt, { type ComparisonSide } from "./components/ComparisonPrompt";
import {
  currentComparison,
  finalOrder as computeFinalOrder,
  remainingComparisons,
  resolveComparison,
  startInsert,
  type InsertionState,
} from "./lib/insertion";

type Phase = "rate" | "drag" | "results";

const EMPTY_INSERTION_STATE: InsertionState = { buckets: {}, pending: null };

export default function Home() {
  const [phase, setPhase] = useState<Phase>("rate");
  const [ratings, setRatings] = useState<Record<string, number> | null>(null);
  const [finalOrder, setFinalOrder] = useState<Album[] | null>(null);
  const [insertionState, setInsertionState] = useState<InsertionState>(EMPTY_INSERTION_STATE);
  const [resumeToken, setResumeToken] = useState(0);

  const albumsById = useMemo(() => new Map(ALBUMS.map((album) => [album.id, album])), []);

  // Called per rating from RatePhase. Returns whether it's safe to advance
  // immediately (empty bucket) or whether a comparison must resolve first.
  const handleRate = (albumId: string, score: number): boolean => {
    const next = startInsert(insertionState, albumId, score);
    setInsertionState(next);
    return next.pending === null;
  };

  const handlePick = (side: ComparisonSide) => {
    // "left" is always the album being placed; "right" and "too close" both
    // resolve as the existing album winning, per the comparison engine's contract.
    const winner = side === "left" ? "new" : "existing";
    const next = resolveComparison(insertionState, winner);
    setInsertionState(next);
    if (next.pending === null) {
      setResumeToken((t) => t + 1);
    }
  };

  if (phase === "rate") {
    const pending = insertionState.pending;
    const comparison = pending ? currentComparison(insertionState) : null;
    const left = comparison ? albumsById.get(comparison.albumId) : undefined;
    const right = comparison ? albumsById.get(comparison.opponentId) : undefined;

    return (
      <>
        {/* RatePhase stays mounted throughout so its internal index/progress survive
            a comparison; it's only visually and interactively hidden while pending. */}
        <div className={pending ? "hidden" : "contents"}>
          <RatePhase
            albums={ALBUMS}
            onRate={handleRate}
            paused={pending !== null}
            resumeToken={resumeToken}
            onComplete={(r) => {
              setRatings(r);
              setPhase("drag");
            }}
          />
        </div>
        {pending && left && right && (
          <ComparisonPrompt
            left={left}
            right={right}
            remaining={remainingComparisons(insertionState)}
            onPick={handlePick}
          />
        )}
      </>
    );
  }

  if (phase === "drag" && ratings) {
    return (
      <TierDrag
        albums={computeFinalOrder(insertionState, ALBUMS)}
        ratings={ratings}
        onConfirm={(final) => {
          setFinalOrder(final);
          setPhase("results");
        }}
      />
    );
  }

  if (phase === "results" && finalOrder && ratings) {
    return <ResultsCard ranked={finalOrder} ratings={ratings} />;
  }

  return null;
}
