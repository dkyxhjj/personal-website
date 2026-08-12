import type { Metadata } from "next";
import { Marquee } from "@/components/ui/marquee";
import ProjectCards from "../components/ProjectCards";
import Playlist from "../components/Playlist";

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
    period: "Apr 2026 – present",
    description:
      "Building Homie, a cross-platform roommate app — chore splitting, shared expenses, and group scheduling.",
    tags: ["React Native", "Supabase", "TypeScript"],
  },
  {
    role: "Data Engineer Intern",
    company: "Royal Bank of Canada",
    href: undefined as string | undefined,
    period: "May 2025 – Aug 2025",
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
    period: "Sep 2024 – May 2025",
    description:
      "Modeled NBA upset likelihood against betting-market odds using multivariate regression.",
    tags: ["R", "pandas", "Machine Learning"],
  },
];

const projects = [
  {
    title: "MLB Predictor",
    href: "https://mlb-predictor.pages.dev/",
    award: "Step 1 on beating Vegas",
    description: "Full-stack baseball analytics platform that models MLB game scores using historical Statcast data, using feature engineering, probabilistic modeling, and interactive data visualization",
    tags: ["Linear Regression", "scikit learn", "Statcast"],
  },
  {
    title: "Scrubs",
    href: "https://devpost.com/software/scrubs",
    award: "Best Use of Zetic · LAHacks 2026",
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
    award: "Best Use of Groq.AI · DevFest 2025",
    description:
      "AI-powered vision assistant giving visually impaired users real-time navigation from just a smartphone.",
    tags: ["Computer Vision", "Accessibility", "AI"],
  },
  {
    title: "Cordial.AI",
    href: "https://github.com/dkyxhjj/cordial.ai",
    award: "40k+ impressions on Linkedin, ~400 installs",
    description: "Chrome extension email assistant that fills in the blanks for you.",
    tags: ["HTML", "Chrome Web Store", "Productivity"],
  },
];

const skills = [
  "C++",
  "Bash",
  "scikit-learn",
  "Swift",
  "Docker",
  "Kubernetes",
  "Git",
  "Pyspark",
  "Airflow",
  "TypeScript",
  "Python",
  "R",
  "Next.js",
  "React",
  "Node",
  "React Native",
  "Expo",
  "pandas",
  "PyTorch",
  "SQL",
];

const elsewhere = [
  ["GitHub", "https://github.com/dkyxhjj"],
  ["LinkedIn", "https://www.linkedin.com/in/chengtai/"],
  ["Email", "mailto:richardli.060411@gmail.com"],

];

export default function Profile() {
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
        <h2>Now &amp; Before</h2>
        <style>{`
          .fact-list li.now-before-row {
            display: grid;
            grid-template-columns: 6rem 1fr;
            column-gap: 1.5rem;
            align-items: start;
          }

          @media (max-width: 640px) {
            .fact-list li.now-before-row {
              grid-template-columns: 1fr;
              row-gap: 0.4rem;
            }
          }

          .now-before-copy {
            font-size: 0.9em;
            line-height: 1.55;
          }

          .mono-label.now-before-label {
            font-size: 1rem;
          }
        `}</style>
        <ul className="fact-list">
          <li className="now-before-row">
            <span className="mono-label now-before-label">Now</span>
            <p className="now-before-copy" style={{ margin: 0 }}>
              Finishing my degree at UCLA this year, splitting most days
              between STATS 102B problem sets and two LeetCode questions
              before lecture. Saturdays are for testing a new Westwood cafe
              and updating my poker equity spreadsheet.
            </p>
          </li>
          <li className="now-before-row">
            <span className="mono-label now-before-label">Before</span>
            <p className="now-before-copy" style={{ margin: 0 }}>
              Before that, I shipped Embers at LAHacks 2025 and spent two
              quarters in the Bruin Sports Analytics lab modeling NBA upset
              odds in R. Cordial.AI, my Chrome extension, came out of that
              same stretch and now sits at 400 installs.
            </p>
          </li>
        </ul>
      </section>

      <section className="section">
        <h2>Experience</h2>
        <style>{`
          .entry.experience-row {
            display: grid;
            /* 20ch comfortably fits "MAY 2025 – AUG 2025" (19 chars) in the
               monospace date font, +16px breathing room */
            grid-template-columns: calc(20ch + 16px) 1fr;
            column-gap: 1.5rem;
            align-items: baseline;
            padding: 1.4rem 0;
          }

          @media (max-width: 899px) {
            .entry.experience-row {
              grid-template-columns: 1fr;
              row-gap: 0.4rem;
              align-items: start;
            }

            .experience-date {
              display: flex;
              flex-direction: column;
            }
          }

          .mono-label.experience-date {
            font-size: 0.85rem;
            line-height: 1.15;
            letter-spacing: 0.02em;
            color: var(--muted);
          }

          .experience-date-part {
            white-space: nowrap;
          }

          .experience-company {
            color: var(--muted);
          }

          .experience-desc {
            max-width: 68ch;
          }

          .experience-tags {
            line-height: 1.4;
          }
        `}</style>
        <ul className="entry-list">
          {experience.map((job) => {
            const [periodStart, periodEnd] = job.period.split(" – ");
            return (
            <li
              key={`${job.role}-${job.company}`}
              className="entry experience-row"
            >
              <span className="mono-label experience-date">
                <span className="experience-date-part">{periodStart}</span>{" "}
                <span className="experience-date-part">{`– ${periodEnd}`}</span>
              </span>
              <div className="experience-body">
                <span className="entry-title">
                  {job.role} ·{" "}
                  <span className="experience-company">
                    {job.href ? (
                      <a href={job.href} target="_blank" rel="noopener noreferrer">
                        {job.company}
                      </a>
                    ) : (
                      job.company
                    )}
                  </span>
                </span>
                <p className="entry-desc experience-desc">{job.description}</p>
                <p className="entry-tags mono experience-tags">
                  {job.tags.join("  ·  ")}
                </p>
              </div>
            </li>
            );
          })}
        </ul>
      </section>

      <section className="section">
        <h2>Projects</h2>
        <ProjectCards items={projects} />
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

      <Playlist />

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
