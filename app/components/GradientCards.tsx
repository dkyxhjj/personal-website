// Adapted from components/ui/gradient-card-showcase.tsx — skew-gradient panel,
// hover-straighten, glass content, floating blobs — generalized so both the
// Experience and Projects sections can share it. Tokenized for light + dark.
// Pure CSS hover; global prefers-reduced-motion rule disables the animation.
export type CardItem = {
  key: string;
  eyebrow?: string;
  eyebrowAccent?: boolean;
  title: string;
  titleHref?: string;
  subtitle?: string;
  subtitleHref?: string;
  description: string;
  tags: string[];
};

const gradient = "linear-gradient(315deg, var(--accent), var(--accent-2))";

function ExternalLink({ href, children }: { href: string; children: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

export default function GradientCards({ items }: { items: CardItem[] }) {
  return (
    <div className="exp-cards">
      {items.map((item) => (
        <div key={item.key} className="exp-card group">
          {/* skewed gradient panel + its blurred glow */}
          <span className="exp-panel" style={{ background: gradient }} />
          <span className="exp-panel exp-panel-glow" style={{ background: gradient }} />

          {/* floating blurred blobs (appear on hover) */}
          <span className="pointer-events-none absolute inset-0 z-10">
            <span className="exp-blob exp-blob-a" />
            <span className="exp-blob exp-blob-b" />
          </span>

          {/* glass content */}
          <div className="exp-content">
            {item.eyebrow && (
              <span
                className="mono-label"
                style={{ color: item.eyebrowAccent ? "var(--accent)" : "var(--muted)" }}
              >
                {item.eyebrow}
              </span>
            )}
            <h3 className="exp-role">
              {item.titleHref ? (
                <ExternalLink href={item.titleHref}>{item.title}</ExternalLink>
              ) : (
                item.title
              )}
            </h3>
            {item.subtitle && (
              <span className="exp-company">
                {item.subtitleHref ? (
                  <ExternalLink href={item.subtitleHref}>{item.subtitle}</ExternalLink>
                ) : (
                  item.subtitle
                )}
              </span>
            )}
            <p className="exp-card-desc">{item.description}</p>
            <span className="entry-tags mono">{item.tags.join("  ·  ")}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
