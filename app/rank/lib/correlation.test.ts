import { test } from "node:test";
import assert from "node:assert/strict";
import { kendallTauB } from "./correlation";
import type { Album } from "../data/albums";

function makeAlbum(id: string, criticScore: number): Album {
  return { id, title: id, year: 2020, cover: "", criticScore };
}

test("perfect agreement with critic ranking returns tau of 1.0", () => {
  const userOrder = [
    makeAlbum("a", 90),
    makeAlbum("b", 80),
    makeAlbum("c", 70),
    makeAlbum("d", 60),
    makeAlbum("e", 50),
  ];
  assert.equal(kendallTauB(userOrder), 1);
});

test("exact reverse of critic ranking returns tau near -1 but not exactly -1 due to critic ties", () => {
  const criticOrder = [
    makeAlbum("a", 90),
    makeAlbum("b", 80),
    makeAlbum("c", 70),
    makeAlbum("d", 70), // tied with c
    makeAlbum("e", 60),
    makeAlbum("f", 50),
  ];
  const userOrder = [...criticOrder].reverse();

  const tau = kendallTauB(userOrder);
  assert.ok(tau < -0.9, `expected tau close to -1, got ${tau}`);
  assert.notEqual(tau, -1);
});

test("breaking a user-side tie differently changes tau", () => {
  const p = makeAlbum("p", 90);
  const q = makeAlbum("q", 80);
  const r = makeAlbum("r", 70);
  const s = makeAlbum("s", 60);
  const t = makeAlbum("t", 50);
  const u = makeAlbum("u", 40);

  // Suppose the user rated {r, s, t} identically. The deterministic
  // pre-drag seed order leaves that group in one arbitrary sub-order...
  const seedOrder = [p, q, r, s, t, u];
  // ...while actually dragging to break the tie reorders just that group,
  // without touching anything the user rated distinctly.
  const draggedOrder = [p, q, t, r, s, u];

  const seedTau = kendallTauB(seedOrder);
  const draggedTau = kendallTauB(draggedOrder);

  assert.notEqual(seedTau, draggedTau);
  assert.ok(draggedTau < seedTau, "dragging away from perfect critic order should lower tau");
});
