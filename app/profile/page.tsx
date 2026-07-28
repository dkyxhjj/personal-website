import type { Metadata } from "next";
import { Marquee } from "@/components/ui/marquee";
import GradientCards, { type CardItem } from "../components/GradientCards";

export const metadata: Metadata = {
  title: "Profile",
  description:
    "About Richard Li — what I'm working on now, where I've been, the tools I reach for, and where to find me.",
};

const experience = [
  {
    role: "Software Engineer",
    company: "Creative Labs",
    href: undefined as string | undefined,
    period: "Apr 2026 — present",
    description:
      "Building Homie, a cross-platform roommate app — chore splitting, shared expenses, and group scheduling.",
    tags: ["React Native", "Supabase", "TypeScript"],
  },
  {
    role: "Data Engineer Intern",
    company: "Royal Bank of Canada",
    href: undefined as string | undefined,
    period: "May 2025 — Aug 2025",
    description:
      "Built a personalized recommendation system powering data discovery for 500+ enterprise users, surfacing 1,000+ datasets a week.",
    tags: ["PySpark", "Airflow", "Machine Learning"],
  },
  {
    role: "Undergraduate Researcher",
    company: "Bruin Sports Analytics",
    href: "https://www.bruinsportsanalytics.com/post/nba-odds-upsets" as
      | string
      | undefined,
    period: "Sep 2024 — May 2025",
    description:
      "Modeled NBA upset likelihood against betting-market odds using multivariate regression.",
    tags: ["R", "pandas", "Machine Learning"],
  },
];

const projects = [
  {
    title: "Scrubs",
    href: "https://devpost.com/software/scrubs",
    award: "Best use of Zetic · LAHacks 2026",
    description:
      "Privacy-first iOS app that redacts PHI from healthcare photos entirely on-device — zero network calls, zero HIPAA exposure.",
    tags: ["Swift", "Apple Vision", "On-device ML"],
  },
  {
    title: "Embers",
    href: "https://devpost.com/software/insurefire",
    award: "1st Place · LAHacks 2025",
    description:
      "Insurance valuation tool that turns 2-minute home walkthroughs into detailed inventory reports with YOLOv11 + Gemini 2.5.",
    tags: ["YOLOv11", "Gemini 2.5", "Python"],
  },
  {
    title: "iAssist",
    href: "https://devpost.com/software/iassist-qcnmbp",
    award: "Best use of Groq.AI · DevFest 2025",
    description:
      "AI-powered vision assistant giving visually impaired users real-time navigation from just a smartphone.",
    tags: ["Computer Vision", "Accessibility", "AI"],
  },
  {
    title: "Cordial.AI",
    href: "https://github.com/dkyxhjj/cordial.ai",
    award: "40k+ impression on Linkedin, ~400 installs",
    description: "Chrome extension email assistant that fills in the blanks for you.",
    tags: ["HTML", "Chrome Web Store", "Productivity"],
  },
];

const skills = [
  "TypeScript",
  "Python",
  "R",
  "Swift",
  "Next.js",
  "React",
  "Node",
  "React Native",
  "Expo",
  "pandas",
  "PyTorch",
  "SQL",
  "DuckDB",
];

const elsewhere = [
  ["GitHub", "https://github.com/dkyxhjj"],
  ["LinkedIn", "https://www.linkedin.com/in/chengtai/"],
  ["Email", "mailto:richardli.060411@gmail.com"],
];

export default function Profile() {
  const projectCards: CardItem[] = projects.map((project) => ({
    key: project.title,
    eyebrow: project.award ?? undefined,
    eyebrowAccent: true,
    title: project.title,
    titleHref: project.href,
    description: project.description,
    tags: project.tags,
  }));

  return (
    <div className="page">
      <span className="mono-label eyebrow">Profile</span>
      <h1>A little more about the person behind the commits.</h1>
      <p>
        I&rsquo;m Richard — a UCLA statistics and data science student who treats
        building software and studying uncertainty as the same discipline seen
        from two angles. I care about clean data, honest models, and interfaces
        that get out of the way.
      </p>

      <section className="section">
        <h2>Now</h2>
        <p>
          Finishing my degree while learning new and reviewing old leetcode questions
          daily while exporing the new niche cafe to study in. Most weeks are a
          mix of coursework, code review, and arguing with my own poker equity charts.
        </p>
      </section>

      <section className="section">
        <h2>Before</h2>
        <p>
          I got here through a stack of hackathon projects, a research stint in
          sports analytics, and a lot of late nights turning messy datasets into
          something a model could actually use. Each one taught me that shipping
          and rigor aren&rsquo;t opposites.
        </p>
      </section>

      <section className="section">
        <h2>Experience</h2>
        <ul className="entry-list">
          {experience.map((job) => (
            <li key={`${job.role}-${job.company}`} className="entry">
              <div className="entry-head">
                <span className="entry-title">
                  {job.role} ·{" "}
                  {job.href ? (
                    <a href={job.href} target="_blank" rel="noopener noreferrer">
                      {job.company}
                    </a>
                  ) : (
                    job.company
                  )}
                </span>
                <span className="entry-meta mono-label">{job.period}</span>
              </div>
              <p className="entry-desc">{job.description}</p>
              <p className="entry-tags mono">{job.tags.join("  ·  ")}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="section">
        <h2>Projects</h2>
        <GradientCards items={projectCards} />
      </section>

      <section className="section">
        <h2>Tools</h2>
        <div className="skills-marquee">
          <Marquee duration={30} pauseOnHover fadeAmount={12}>
            {skills.map((skill) => (
              <span key={skill} className="skill">
                {skill}
              </span>
            ))}
          </Marquee>
        </div>
      </section>

      <section className="section">
        <h2>Elsewhere</h2>
        <ul className="fact-list mono">
          {elsewhere.map(([label, href]) => (
            <li key={label}>
              <span>{label}</span>
              <a href={href} style={{ textAlign: "right" }}>
                {href === "#" ? "coming soon" : href} ↗
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
