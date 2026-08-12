import { test } from "node:test";
import assert from "node:assert/strict";
import {
  startInsert,
  currentComparison,
  resolveComparison,
  remainingComparisons,
  finalOrder,
  type InsertionState,
} from "./insertion";
import type { Album } from "../data/albums";

test("first album into an empty rating inserts with zero comparisons", () => {
  const state: InsertionState = { buckets: {}, pending: null };
  const next = startInsert(state, "a", 7);

  assert.deepEqual(next.buckets[7], ["a"]);
  assert.equal(next.pending, null);
  assert.equal(remainingComparisons(next), 0);
});

test("second album into that rating takes exactly one comparison; 'new' places it first, 'existing' places it second", () => {
  const base: InsertionState = { buckets: { 7: ["a"] }, pending: null };

  const withNew = startInsert(base, "b", 7);
  assert.equal(remainingComparisons(withNew), 1);
  assert.deepEqual(currentComparison(withNew), { albumId: "b", opponentId: "a" });
  const afterNew = resolveComparison(withNew, "new");
  assert.deepEqual(afterNew.buckets[7], ["b", "a"]);
  assert.equal(afterNew.pending, null);

  const withExisting = startInsert(base, "c", 7);
  const afterExisting = resolveComparison(withExisting, "existing");
  assert.deepEqual(afterExisting.buckets[7], ["a", "c"]);
  assert.equal(afterExisting.pending, null);
});

test("a bucket of 7 never takes more than 3 comparisons to insert into", () => {
  let seeded: InsertionState = { buckets: {}, pending: null };
  for (let i = 0; i < 7; i++) {
    seeded = startInsert(seeded, `seed-${i}`, 5);
    while (seeded.pending) {
      seeded = resolveComparison(seeded, "new");
    }
  }
  assert.equal(seeded.buckets[5].length, 7);

  const started = startInsert(seeded, "newcomer", 5);
  assert.equal(remainingComparisons(started), 3);

  function assertBounded(state: InsertionState, comparisonsSoFar: number) {
    if (!state.pending) {
      assert.ok(comparisonsSoFar <= 3, `took ${comparisonsSoFar} comparisons`);
      return;
    }
    assert.ok(comparisonsSoFar < 3, "exceeded 3 comparisons while still pending");
    for (const winner of ["new", "existing"] as const) {
      assertBounded(resolveComparison(state, winner), comparisonsSoFar + 1);
    }
  }

  assertBounded(started, 0);
});

test("re-rating an already-placed album removes it from its old bucket and re-inserts cleanly, with zero duplicate ids anywhere in state", () => {
  let state: InsertionState = { buckets: {}, pending: null };
  state = startInsert(state, "a", 5);
  state = startInsert(state, "b", 5);
  state = resolveComparison(state, "existing");
  assert.deepEqual(state.buckets[5], ["a", "b"]);

  state = startInsert(state, "a", 9);
  assert.deepEqual(state.buckets[5], ["b"]);
  assert.deepEqual(state.buckets[9], ["a"]);

  const allIds = Object.values(state.buckets).flat();
  assert.equal(allIds.length, new Set(allIds).size);
});

test("finalOrder on a fully rated state returns 18 unique ids in descending rating order", () => {
  const albums: Album[] = Array.from({ length: 18 }, (_, i) => ({
    id: `album-${i}`,
    title: `Album ${i}`,
    year: 2000 + i,
    cover: "",
    criticScore: 50,
  }));

  let state: InsertionState = { buckets: {}, pending: null };
  const ratingById = new Map<string, number>();
  albums.forEach((album, i) => {
    const rating = i % 11;
    ratingById.set(album.id, rating);
    state = startInsert(state, album.id, rating);
    while (state.pending) {
      state = resolveComparison(state, i % 2 === 0 ? "new" : "existing");
    }
  });

  const ordered = finalOrder(state, albums);
  const ids = ordered.map((a) => a.id);

  assert.equal(ordered.length, 18);
  assert.equal(new Set(ids).size, 18);

  const orderedRatings = ids.map((id) => ratingById.get(id)!);
  for (let i = 1; i < orderedRatings.length; i++) {
    assert.ok(orderedRatings[i - 1] >= orderedRatings[i], "ratings must be non-increasing");
  }
});
