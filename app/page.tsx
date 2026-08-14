import Link from "next/link";
import DiagonalGrid from "./components/DiagonalGrid";
import HeroLive from "./components/HeroLive";

const facts = [
  ["Studying", "B.S. Statistics & Data Science, UCLA"],
  ["Building", "Web & mobile apps, mostly in TypeScript"],
  ["Based in", "Toronto, Los Angeles, Shanghai"],
  ["Currently", "Open to summer 2027 internships"],
];

export default function Home() {
  return (
    <div className="page">
      <DiagonalGrid />
      <HeroLive />
      <span className="mono-label eyebrow">Richard Li — Statistics & Data Science</span>
      <h1>
        I build software the way I study probability — carefully, and with a bias
        toward the truth in the data.
      </h1>
      <p>
        I&rsquo;m a rising third year statistics and data science student at UCLA who spends most of
        his time shipping things: web apps, mobile apps, and the occasional
        analytics engine that tells me whether my poker instincts hold up under a
        few million simulated hands. I like problems where the math is honest and
        the interface is quiet.
      </p>
      <p>
        Outside of coursework, I spend my time exploring problems that sit at the intersection of statistics, software, and decision-making. Recently that has meant building a React Native application, studying game-theoretic poker through solver analysis, and reading about machine learning, optimization, and probability. Every project is another excuse to learn something new. If any of that resonates, there's a longer version of the story.{" "}
        <Link href="/profile" className="lead-more">
          More about me »
        </Link>
      </p>

      <ul className="fact-list mono">
        {facts.map(([k, v]) => (
          <li key={k}>
            <span>{k}</span>
            <span style={{ textAlign: "right", color: "var(--text)" }}>{v}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
