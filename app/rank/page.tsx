"use client";

import { useState } from "react";
import { ALBUMS, type Album } from "./data/albums";
import RatePhase from "./components/RatePhase";
import TierDrag from "./components/TierDrag";
import ResultsCard from "./components/ResultsCard";

type Phase = "rate" | "drag" | "results";

export default function Home() {
  const [phase, setPhase] = useState<Phase>("rate");
  const [ratings, setRatings] = useState<Record<string, number> | null>(null);
  const [finalOrder, setFinalOrder] = useState<Album[] | null>(null);

  if (phase === "rate") {
    return (
      <RatePhase
        albums={ALBUMS}
        onComplete={(r) => {
          setRatings(r);
          setPhase("drag");
        }}
      />
    );
  }

  if (phase === "drag" && ratings) {
    return (
      <TierDrag
        albums={ALBUMS}
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
