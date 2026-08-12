// Flat, borderless project list: content sitting on the page, not panels floating
// above it. Each item is separated only by a hairline top rule.
export type ProjectItem = {
  title: string;
  href?: string;
  award?: string;
  description: string;
  tags: string[];
};

function ExternalLink({ href, children }: { href: string; children: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

export default function ProjectCards({ items }: { items: ProjectItem[] }) {
  return (
    <div className="grid grid-cols-1 items-start gap-x-16 gap-y-4 sm:grid-cols-2">
      {items.map((item) => (
        <div key={item.title} className="group border-t border-white/[0.08] py-8">
          {item.award && (
            <p
              className="m-0 font-[family-name:var(--font-mono)] text-[0.7rem] uppercase tracking-[0.08em] opacity-45"
              style={{ color: "var(--text)" }}
            >
              {item.award}
            </p>
          )}
          <h3
            className="mt-2 font-[family-name:var(--font-display)] text-xl leading-tight tracking-[-0.01em] opacity-85 transition-opacity duration-200 group-hover:opacity-100"
            style={{ color: "var(--text)" }}
          >
            {item.href ? <ExternalLink href={item.href}>{item.title}</ExternalLink> : item.title}
          </h3>
          <p
            className="mt-3 text-sm leading-relaxed opacity-60 transition-opacity duration-200 group-hover:opacity-100"
            style={{ color: "var(--text)" }}
          >
            {item.description}
          </p>
          <p
            className="mt-3 font-[family-name:var(--font-mono)] text-[11px] tracking-[0.02em] opacity-35"
            style={{ color: "var(--text)" }}
          >
            {item.tags.join("  ·  ")}
          </p>
        </div>
      ))}
    </div>
  );
}
