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
      "AI-powered vision assistant giving visually impaired users a real time navigation from just a smartphone",
    image: "/projects/iassist.png",
    award: "Best use of Groq.AI · DevFest 2025",
    tags: ["Computer Vision", "Assessibility", "AI"],
    links: [{ label: "Devpost", href: "https://devpost.com/software/iassist-qcnmbp" }],
  },
  {
    title: "cordial.ai",
    description:
      "Email assistant that fills in the blanks for you",
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
  coursework: [
    "Probability Theory",
    "Statistical Methods",
    "Machine Learning",
    "Data Engineering",
    "Algorithms & Data Structures",
  ],
};

const skills = [
  "Python",
  "R",
  "Swift",
  "React",
  "React Native",
  "Supabase",
  "PySpark",
  "Airflow",
  "TypeScript",
  "SQL",
  "TensorFlow",
  "Cloudflare Workers",
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
      "Built a personalized recommendation system that powers data discovery for 500+ enterprise users, surfacing 1,000+ datasets per week",
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

export default function Home() {
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
          SWE & Data Engineer
        </p>

      <a
        href="#contact"
        className="mt-5 inline-flex rounded-lg bg-zinc-950 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
      >
        Reach out
      </a>

      </header>

      <section className="mt-6">
        <p className="leading-7 text-zinc-700 dark:text-zinc-300">
          I am a rising junior at{" "}
          <span className="font-medium text-blue-700/90 dark:text-blue-400/90">
            UCLA
          </span>{" "}
          studying{" "}
          <span className="font-medium text-zinc-950 dark:text-zinc-50">
            Statistics and Data Science
          </span>
          , with a focus on{" "}
          <span className="font-medium text-emerald-700/90 dark:text-emerald-400/90">
            data engineering
          </span>{" "}
          and{" "}
          <span className="font-medium text-emerald-700/90 dark:text-emerald-400/90">
            backend development
          </span>
          . I enjoy the exactness of statistics and the creativity of building
          the architecture that makes data usable. Beyond the terminal, you can
          find me shooting hoops, curating playlists, or applying probability
          theory to weekend poker games.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-sm font-medium uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
          Education
        </h2>
        <div className="mt-6 rounded-lg border border-zinc-200 p-5 transition-all hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600">
          <div className="flex items-baseline justify-between gap-4">
            <span className="font-medium text-zinc-950 dark:text-zinc-50">
              {education.school}
            </span>
            <span className="shrink-0 text-sm text-zinc-400 dark:text-zinc-500">
              {education.graduation}
            </span>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {education.degree} · Minors in {education.minors}
          </p>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            GPA: {education.gpa}
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {education.coursework.map((course) => (
              <span
                key={course}
                className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
              >
                {course}
              </span>
            ))}
          </div>
        </div>
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
              <div
                className="group flex h-full flex-col overflow-hidden rounded-lg border border-zinc-200 transition-all hover:-translate-y-0.5 hover:border-zinc-400 hover:shadow-sm dark:border-zinc-800 dark:hover:border-zinc-600"
              >
                <img
                  src={project.image}
                  alt={`Snapshot of ${project.title}`}
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
      <section className="mt-20">
        <h2 className="text-sm font-medium uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
          Skills
        </h2>
        <div className="mt-6 flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span
              key={skill}
              className="rounded-full border border-zinc-200 px-3 py-1 text-sm font-medium text-zinc-700 dark:border-zinc-800 dark:text-zinc-300"
            >
              {skill}
            </span>
          ))}
        </div>
      </section>
      <section id="contact" className="mt-20">
        <h2 className="text-sm font-medium uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
          Contact
        </h2>
        <form
          action="https://formsubmit.co/richardli.060411@gmail.com"
          method="POST"
          className="mt-6 w-full max-w-sm space-y-3"
        >
          <input type="hidden" name="_captcha" value="false" />
          <input type="hidden" name="_next" value="/" />
          <input
            type="text"
            name="name"
            placeholder="Name"
            required
            className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50"
          />
          <textarea
            name="message"
            placeholder="Message"
            rows={4}
            required
            className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50"
          />
          <button
            type="submit"
            className="w-full rounded-lg bg-zinc-950 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
          >
            Send
          </button>
        </form>
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
