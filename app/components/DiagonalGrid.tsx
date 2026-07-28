// Signature element: fixed 13x13 grid anchored bottom-right, Home route only.
// Built with an SVG <pattern> rather than 169 hand-written rects.
export default function DiagonalGrid() {
  const cells = 13;

  return (
    <svg
      className="signature-grid"
      viewBox="0 0 130 130"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <pattern
          id="sig-cell"
          width="10"
          height="10"
          patternUnits="userSpaceOnUse"
        >
          <rect
            x="0"
            y="0"
            width="10"
            height="10"
            fill="none"
            stroke="var(--text)"
            strokeWidth="0.75"
          />
        </pattern>
      </defs>
      <rect x="0" y="0" width="130" height="130" fill="url(#sig-cell)" />
      {Array.from({ length: cells }, (_, i) => (
        <rect
          key={i}
          x={i * 10}
          y={i * 10}
          width="10"
          height="10"
          fill="var(--accent)"
        />
      ))}
    </svg>
  );
}
