import Image from "next/image";

const projects = [
  {
    title: "scrubs",
    description:
      "Privacy-first iOS app that redacts PHI from healthcare photos entirely on-device — zero network calls, zero HIPAA exposure.",
    href: "https://devpost.com/software/scrubs",
    image: "/projects/scrubs.png",
    award: "Best use of Zetic · LAHacks 2026",
    tags: ["Swift", "Apple Vision", "On-device ML"],
    linkLabel: "View on Devpost",
  },
  {
    title: "embers",
    description:
      "Insurance valuation tool that turns 2-minute home walkthroughs into detailed inventory reports with YOLOv11 + Gemini 2.5.",
    href: "https://devpost.com/software/insurefire",
    image: "/projects/embers.png",
    award: "1st Place · LAHacks 2025",
    tags: ["YOLOv11", "Gemini 2.5", "Python"],
    linkLabel: "View on Devpost",
  },
  {
    title: "iassist",
    description:
      "AI-powered vision assistant giving visually impaired users real-time navigation from just a smartphone.",
    href: "https://devpost.com/software/iassist-qcnmbp",
    image: "/projects/iassist.png",
    award: "Best use of Groq AI · Devfest 2025",
    tags: ["Computer Vision", "Accessibility", "AI"],
    linkLabel: "View on Devpost",
  },
  {
    title: "cordial.ai",
    description: "Email writing assistant that fills in the blank for you",
    href: "https://github.com/dkyxhjj/cordial.ai",
    image: "/projects/cordial.png",
    award: null,
    tags: ["AI", "Productivity"],
    linkLabel: "View on GitHub",
  },
];

const experience = [
  {
    role: "Software Engineer",
    company: "Creative Labs",
    period: "04 2026 — present",
    description:
      "Building and shipping core features for a cross-platform roommate management app",
    href: undefined as string | undefined,
    color: "text-violet-600 dark:text-violet-400",
  },
  {
    role: "Data Engineer Intern",
    company: "Royal Bank of Canada",
    period: "05 2025 — 08 2025",
    description:
      "Built personalized recommendation system that power data discovery for 500+ users on an enterprise level",
    href: undefined as string | undefined,
    color: "text-blue-600 dark:text-blue-400",
  },
  {
    role: "Undergraduate Researcher",
    company: "Bruin Sports Analytics",
    period: "09 2024 - 05 2025",
    description:
      "Conducted statistical testing on real life trends using multivariate regression analysis",
    href: "https://www.bruinsportsanalytics.com/post/nba-odds-upsets" as
      | string
      | undefined,
    color: "text-amber-600 dark:text-amber-400",
  },
];

const links = [
  { label: "GitHub", href: "https://github.com/dkyxhjj" },
  { label: "LinkedIn", href: "https://linkedin.com/in/chengtai" },
  { label: "Email", href: "mailto:richardli.060411@gmail.com" },
];

export default function Portfolio() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-24 font-sans sm:px-8 sm:py-32">
      <header>
        <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-zinc-200 px-3 py-1 text-xs font-medium text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
          Open to internships · Summer 2027
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-zinc-950 sm:text-5xl dark:text-zinc-50">
          Richard Chengtai Li
        </h1>
        <p className="mt-3 text-lg text-zinc-500 dark:text-zinc-400">
          Aspiring SWE and Data Engineer
        </p>
      </header>

      <section className="mt-6">
        <p className="leading-7 text-zinc-700 dark:text-zinc-300">
          I am a rising Junior at{" "}
          <span className="font-medium text-blue-700/90 dark:text-blue-400/90">
            UCLA
          </span>{" "}
          studying{" "}
          <span className="font-medium text-violet-700/90 dark:text-violet-400/90">
            Statistics and Data Science
          </span>
          , with a strong focus on{" "}
          <span className="font-medium text-emerald-700/90 dark:text-emerald-400/90">
            data engineering
          </span>{" "}
          and{" "}
          <span className="font-medium text-sky-700/90 dark:text-sky-400/90">
            backend development
          </span>
          . I enjoy the{" "}
          <span className="font-medium text-teal-700/90 dark:text-teal-400/90">
            exactness of statistics
          </span>{" "}
          and the creativity of building out the{" "}
          <span className="font-medium text-orange-700/90 dark:text-orange-400/90">
            architecture
          </span>{" "}
          that makes data usable. Beyond the terminal, you can find me{" "}
          <span className="font-medium text-indigo-700/90 dark:text-indigo-400/90">
            shooting hoops
          </span>
          ,{" "}
          <span className="font-medium text-fuchsia-700/90 dark:text-fuchsia-400/90">
            curating playlists
          </span>
          , or applying{" "}
          <span className="font-medium text-rose-700/90 dark:text-rose-400/90">
            probability theory
          </span>{" "}
          to my weekend{" "}
          <span className="font-medium text-red-700/90 dark:text-red-400/90">
            poker games
          </span>
          .
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-sm font-medium uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
          Experience
        </h2>
        <ul className="mt-6 space-y-5">
          {experience.map((job) => (
            <li key={`${job.role}-${job.company}`}>
              <a
                href={job.href}
                target={job.href ? "_blank" : undefined}
                rel={job.href ? "noopener noreferrer" : undefined}
                className="group block rounded-lg border border-zinc-200 p-5 transition-all hover:-translate-y-0.5 hover:border-zinc-400 hover:shadow-sm dark:border-zinc-800 dark:hover:border-zinc-600"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-medium text-zinc-950 underline-offset-4 group-hover:underline dark:text-zinc-50">
                    {job.role} ·{" "}
                    <span className={`font-semibold ${job.color}`}>
                      {job.company}
                    </span>
                  </span>
                  <span className="shrink-0 text-sm text-zinc-400 dark:text-zinc-500">
                    {job.period}
                  </span>
                </div>
                <p className="mt-1 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                  {job.description}
                </p>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-20">
        <h2 className="text-sm font-medium uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
          Projects
        </h2>
        <ul className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {projects.map((project) => (
            <li key={project.title}>
              <a
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full flex-col overflow-hidden rounded-lg border border-zinc-200 transition-all hover:-translate-y-0.5 hover:border-zinc-400 hover:shadow-sm dark:border-zinc-800 dark:hover:border-zinc-600"
              >
                <Image
                  src={project.image}
                  alt={`Snapshot of ${project.title}`}
                  width={1200}
                  height={630}
                  className="aspect-[1200/630] w-full border-b border-zinc-200 object-cover dark:border-zinc-800"
                />
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-medium text-zinc-950 underline-offset-4 group-hover:underline dark:text-zinc-50">
                      {project.title}
                    </span>
                    {project.award && (
                      <span className="shrink-0 rounded-full border border-amber-300 bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-400">
                        🏆 {project.award}
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                    {project.description}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className="mt-auto border-t border-zinc-100 pt-3 text-xs font-medium text-zinc-400 transition-colors group-hover:text-zinc-950 dark:border-zinc-800 dark:text-zinc-500 dark:group-hover:text-zinc-50">
                    {project.linkLabel} →
                  </span>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </section>
      <footer className="mt-24 border-t border-zinc-200 pt-8 dark:border-zinc-800">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <ul className="flex gap-6 text-sm">
            {links.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-500 underline-offset-4 hover:text-zinc-950 hover:underline dark:text-zinc-400 dark:hover:text-zinc-50"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <p className="text-sm text-zinc-400 dark:text-zinc-500">
            © {new Date().getFullYear()} Richard Li
          </p>
        </div>
        <p className="mt-6 text-xs text-zinc-400 dark:text-zinc-600">
          You made it to the bottom — statistically, that puts you in the top
          decile of visitors. ♠️
        </p>
      </footer>
    </main>
  );
}
