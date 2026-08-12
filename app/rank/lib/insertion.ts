import type { Album } from "../data/albums";

export type InsertionState = {
  buckets: Record<number, string[]>;
  pending: { albumId: string; rating: number; lo: number; hi: number } | null;
};

export function startInsert(state: InsertionState, albumId: string, rating: number): InsertionState {
  const buckets: Record<number, string[]> = {};
  for (const [key, ids] of Object.entries(state.buckets)) {
    buckets[Number(key)] = ids.filter((id) => id !== albumId);
  }

  const target = buckets[rating] ?? [];
  if (target.length === 0) {
    return {
      buckets: { ...buckets, [rating]: [albumId] },
      pending: null,
    };
  }

  return {
    buckets,
    pending: { albumId, rating, lo: 0, hi: target.length },
  };
}

export function currentComparison(state: InsertionState): { albumId: string; opponentId: string } | null {
  if (!state.pending) return null;
  const { albumId, rating, lo, hi } = state.pending;
  const bucket = state.buckets[rating] ?? [];
  const mid = (lo + hi) >> 1;
  return { albumId, opponentId: bucket[mid] };
}

export function resolveComparison(state: InsertionState, winner: "new" | "existing"): InsertionState {
  if (!state.pending) return state;
  const { albumId, rating, lo, hi } = state.pending;
  const bucket = state.buckets[rating] ?? [];
  const mid = (lo + hi) >> 1;

  const nextLo = winner === "existing" ? mid + 1 : lo;
  const nextHi = winner === "new" ? mid : hi;

  if (nextLo === nextHi) {
    const nextBucket = [...bucket];
    nextBucket.splice(nextLo, 0, albumId);
    return {
      buckets: { ...state.buckets, [rating]: nextBucket },
      pending: null,
    };
  }

  return {
    ...state,
    pending: { albumId, rating, lo: nextLo, hi: nextHi },
  };
}

export function remainingComparisons(state: InsertionState): number {
  if (!state.pending) return 0;
  const { lo, hi } = state.pending;
  return Math.ceil(Math.log2(hi - lo + 1));
}

export function finalOrder(state: InsertionState, albums: Album[]): Album[] {
  const byId = new Map(albums.map((album) => [album.id, album]));
  const result: Album[] = [];
  for (let rating = 10; rating >= 0; rating--) {
    const bucket = state.buckets[rating];
    if (!bucket) continue;
    for (const id of bucket) {
      const album = byId.get(id);
      if (album) result.push(album);
    }
  }
  return result;
}
