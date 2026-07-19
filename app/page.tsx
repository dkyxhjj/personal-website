import Terminal from "./components/Terminal";
import ContactForm from "./components/ContactForm";

const projects = [
  {
    title: "scrubs",
    description:
      "Privacy-first iOS app that redacts PHI from healthcare photos entirely on-device — zero network calls, zero HIPAA exposure.",
    image: "/projects/scrubs.png",
    award: "Best use of Zetic · LAHacks 2026",
    tags: ["Swift", "Apple Vision", "On-device ML"],
    links: [{ label: "Devpost", href: "https://devpost.com/software/scrubs" }],
  },
  {
    title: "embers",
    description:
      "Insurance valuation tool that turns 2-minute home walkthroughs into detailed inventory reports with YOLOv11 + Gemini 2.5.",
    image: "/projects/embers.png",
    award: "1st Place · LAHacks 2025",
    tags: ["YOLOv11", "Gemini 2.5", "Python"],
    links: [{ label: "Devpost", href: "https://devpost.com/software/insurefire" }],
  },
  {
    title: "iassist",
    description:
      "AI-powered vision assistant giving visually impaired users real-time navigation from just a smartphone.",
    image: "/projects/iassist.png",
    award: "Best use of Groq.AI · DevFest 2025",
    tags: ["Computer Vision", "Accessibility", "AI"],
    links: [{ label: "Devpost", href: "https://devpost.com/software/iassist-qcnmbp" }],
  },
  {
    title: "cordial.ai",
    description:
      "Email assistant that fills in the blanks for you.",
    image: "/projects/cordial.png",
    award: null,
    tags: ["HTML", "Chrome Webstore", "Productivity"],
    links: [{ label: "GitHub", href: "https://github.com/dkyxhjj/cordial.ai" }],
  },
];

const education = {
  school: "University of California, Los Angeles",
  degree: "B.S. in Statistics and Data Science",
  minors: "Mathematics and Data Science Engineering",
  gpa: "3.97",
  graduation: "June 2028",
};

const experience = [
  {
    role: "Software Engineer",
    company: "Creative Labs",
    period: "Apr 2026 — present",
    current: true,
    description:
      "Shipping Homie, a cross-platform roommate app — chore splitting, shared expenses, and group scheduling.",
    tags: ["React Native", "Supabase", "TypeScript", "Figma"],
    href: undefined as string | undefined,
  },
  {
    role: "Data Engineer Intern",
    company: "Royal Bank of Canada",
    period: "May 2025 — Aug 2025",
    current: false,
    description:
      "Built a personalized recommendation system powering data discovery for 500+ enterprise users, surfacing 1,000+ datasets per week.",
    tags: ["PySpark", "Airflow", "Machine Learning"],
    href: undefined as string | undefined,
  },
  {
    role: "Undergraduate Researcher",
    company: "Bruin Sports Analytics",
    period: "Sep 2024 — May 2025",
    current: false,
    description:
      "Modeled NBA upset likelihood against betting-market odds using multivariate regression.",
    tags: ["R", "pandas", "Machine Learning"],
    href: "https://www.bruinsportsanalytics.com/post/nba-odds-upsets" as
      | string
      | undefined,
  },
];

const icons = {
  mail: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  ),
  github: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.21.09 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.25 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.62-5.49 5.92.43.37.82 1.1.82 2.22v3.29c0 .32.22.7.83.58C20.57 22.29 24 17.8 24 12.5 24 5.87 18.63.5 12 .5Z" />
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM7.12 20.45H3.55V9h3.57v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
    </svg>
  ),
};

const links = [
  { label: "Email me", href: "mailto:richardli.060411@gmail.com", icon: icons.mail },
  { label: "GitHub", href: "https://github.com/dkyxhjj", icon: icons.github },
  { label: "LinkedIn", href: "https://linkedin.com/in/chengtai", icon: icons.linkedin },
];

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-24 font-sans sm:px-8 sm:py-32">
      <header className="grid gap-10 md:grid-cols-[1fr_20rem] md:items-start">
        <div>
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-zinc-200 px-3 py-1 text-xs font-medium text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
            Open to internships · Summer 2027
          </p>
          <h1 className="max-w-[12ch] text-4xl font-bold tracking-tight text-balance text-zinc-950 sm:text-5xl dark:text-zinc-50">
            Richard Chengtai Li
          </h1>
          <p className="mt-3 text-lg text-zinc-500 dark:text-zinc-400">
            Stats + Data Engineering at UCLA
          </p>

          <p className="mt-5 max-w-prose leading-7 text-zinc-700 dark:text-zinc-300">
            I like the exactness of statistics and the mess of building the
            pipes that make data usable. Off the terminal, I&rsquo;m running
            probability on weekend poker games.
          </p>

          <nav className="mt-6 flex flex-wrap gap-2">
            {links.map((link, i) => {
              const external = link.href.startsWith("http");
              return (
                <a
                  key={link.label}
                  href={link.href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                  className={
                    i === 0
                      ? "inline-flex items-center gap-2 rounded-lg bg-zinc-950 px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
                      : "inline-flex items-center gap-2 rounded-lg border border-zinc-200 px-3.5 py-2 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-400 hover:text-zinc-950 dark:border-zinc-800 dark:text-zinc-300 dark:hover:border-zinc-600 dark:hover:text-zinc-50"
                  }
                >
                  {link.icon}
                  {link.label}
                </a>
              );
            })}
          </nav>
        </div>

        <div className="hidden md:block">
          <Terminal />
        </div>
      </header>

      <section className="mt-10">
        <h2 className="text-sm font-medium uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
          Experience
        </h2>
        <ol className="mt-6">
          {experience.map((job, i) => (
            <li key={`${job.role}-${job.company}`} className="relative pl-7">
              {i !== experience.length - 1 && (
                <span
                  aria-hidden
                  className="absolute left-[3.5px] top-2 h-full w-px bg-zinc-200 dark:bg-zinc-800"
                />
              )}
              <span
                aria-hidden
                className={`absolute left-0 top-[7px] h-2 w-2 rounded-full ${
                  job.current
                    ? "bg-emerald-500"
                    : "bg-zinc-300 dark:bg-zinc-600"
                }`}
              />
              <div className="pb-8">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-medium text-zinc-950 dark:text-zinc-50">
                    {job.role} ·{" "}
                    {job.href ? (
                      <a
                        href={job.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold underline-offset-4 hover:underline"
                      >
                        {job.company}
                      </a>
                    ) : (
                      <span className="font-semibold">{job.company}</span>
                    )}
                  </h3>
                  <span className="shrink-0 text-sm text-zinc-400 dark:text-zinc-500">
                    {job.period}
                  </span>
                </div>
                <p className="mt-1 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                  {job.description}
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {job.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-10">
        <h2 className="text-sm font-medium uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
          Education
        </h2>
        <div className="mt-6 rounded-lg border border-zinc-200 px-5 py-4 transition-all hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600">
          <div className="flex items-baseline justify-between gap-4">
            <span className="font-medium text-zinc-950 dark:text-zinc-50">
              {education.school}
            </span>
            <span className="shrink-0 text-sm text-zinc-400 dark:text-zinc-500">
              {education.graduation}
            </span>
          </div>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {education.degree} · Minors in {education.minors} · GPA{" "}
            {education.gpa}
          </p>
        </div>
      </section>

      <section className="mt-20">
        <h2 className="text-sm font-medium uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
          Projects
        </h2>
        <ul className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {projects.map((project) => (
            <li key={project.title}>
              <div
                className="group flex h-full flex-col overflow-hidden rounded-lg border border-zinc-200 transition-all hover:-translate-y-0.5 hover:border-zinc-400 hover:shadow-sm dark:border-zinc-800 dark:hover:border-zinc-600"
              >
                <div className="relative aspect-[1200/630] w-full border-b border-zinc-200 dark:border-zinc-800">
                  <img
                    src={project.image}
                    alt={`Snapshot of ${project.title}`}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/70" />
                </div>
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
                  <div className="mt-auto flex flex-wrap gap-3 border-t border-zinc-100 pt-3 text-xs font-medium dark:border-zinc-800">
                    {project.links.map((link) => (
                      <a
                        key={link.label}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-zinc-400 transition-colors hover:text-zinc-950 hover:underline dark:text-zinc-500 dark:hover:text-zinc-50"
                      >
                        {link.label} →
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
      <section id="contact" className="mt-20">
        <h2 className="text-sm font-medium uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
          Contact
        </h2>
        <ContactForm />
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
