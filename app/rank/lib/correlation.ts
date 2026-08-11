import type { Album } from "../data/albums";

export function kendallTauB(userOrder: Album[]): number {
  const n = userOrder.length;

  let concordant = 0;
  let discordant = 0;
  let criticTiedPairs = 0;

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      // userOrder[i] precedes userOrder[j], so the user ranked i above j
      // (rank 1 = best). Array position is a strict order, so there is
      // never a tied pair on the user side.
      const a = userOrder[i];
      const b = userOrder[j];

      const criticDiff = a.criticScore - b.criticScore;

      if (criticDiff === 0) {
        criticTiedPairs++;
        continue;
      }

      // Concordant when the user's preference for a over b agrees with
      // a having the higher critic score.
      if (criticDiff > 0) {
        concordant++;
      } else {
        discordant++;
      }
    }
  }

  const n0 = (n * (n - 1)) / 2;
  const n1 = 0; // no user-side ties are possible from a strict array order
  const n2 = criticTiedPairs;

  const denominator = Math.sqrt((n0 - n1) * (n0 - n2));
  if (denominator === 0) return 0;

  return (concordant - discordant) / denominator;
}

export function verdict(tau: number): string {
  if (tau >= 0.5) return "Certified critic";
  if (tau >= 0.2) return "Broadly agrees with the critics";
  if (tau >= -0.2) return "Your own thing entirely";
  if (tau >= -0.5) return "Contrarian";
  return "Actively at war with the critics";
}
