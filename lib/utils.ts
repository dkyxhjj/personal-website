// Minimal, dependency-free `cn` (class-name joiner).
// shadcn's canonical version wraps clsx + tailwind-merge; this project avoids
// adding those packages, so we implement the subset the UI components need:
// conditional strings, arrays, and {class: boolean} maps. If you later adopt
// more shadcn components and want tailwind-conflict resolution, swap this for
// `clsx` + `tailwind-merge`.
export type ClassValue =
  | string
  | number
  | null
  | false
  | undefined
  | ClassValue[]
  | Record<string, boolean | null | undefined>;

export function cn(...inputs: ClassValue[]): string {
  const out: string[] = [];

  for (const input of inputs) {
    if (!input) continue;

    if (typeof input === "string" || typeof input === "number") {
      out.push(String(input));
    } else if (Array.isArray(input)) {
      const nested = cn(...input);
      if (nested) out.push(nested);
    } else if (typeof input === "object") {
      for (const [key, value] of Object.entries(input)) {
        if (value) out.push(key);
      }
    }
  }

  return out.join(" ");
}
