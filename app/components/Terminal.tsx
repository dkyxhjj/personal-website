"use client";

import { useState, useEffect, useRef, useCallback } from "react";

const PROMPT = "~ %";

const PROFILE = {
  email: "richardli.060411@gmail.com",
  github: "https://github.com/dkyxhjj",
  linkedin: "https://linkedin.com/in/chengtai",
  spotify: "https://open.spotify.com/user/1323332",
};

const PROJECTS: Record<
  string,
  { desc: string; stack: string; url: string }
> = {
  "homie": {
    desc: "Cross-platform roommate app — chore splitting, shared expenses, group scheduling.",
    stack: "React Native · Supabase · TypeScript",
    url: "https://github.com/TravisHaa/CL_Homie",
  },
  "scrubs": {
    desc: "Privacy-first iOS app that redacts PHI from healthcare photos entirely on-device — zero network calls, zero HIPAA exposure.",
    stack: "Swift · Apple Vision · On-device ML",
    url: "https://devpost.com/software/scrubs",
  },
  "iassist": {
    desc: "AI-powered vision assistant giving visually impaired users a real time navigation from just a smartphone",
    stack: "Computer Vision · Assessibility · AI",
    url: "https://devpost.com/software/iassist-qcnmbp",
  },
  "embers": {
    desc: "Insurance valuation tool that turns 2-minute home walkthroughs into detailed inventory reports with YOLOv11 + Gemini 2.5.",
    stack: "Next.js · Gemini API",
    url: "https://github.com/dkyxhjj/embers",
  },
  "cordial.ai": {
    desc: "Email assistant that fills in the blanks for you",
    stack: "HTML · Chrome Webstore · Productivity",
    url: "https://github.com/dkyxhjj/cordial.ai",
  },
};


type CommandResult = string | { type: "node"; node: React.ReactNode };

const listProjects = (): CommandResult => ({
  type: "node",
  node: (
    <div>
      <div className="flex flex-wrap gap-x-6 gap-y-1">
        {Object.entries(PROJECTS).map(([name, p]) => (
          <a
            key={name}
            href={p.url}
            target="_blank"
            rel="noreferrer"
            className="whitespace-nowrap rounded-sm text-neutral-400 underline-offset-4 hover:text-emerald-400 hover:underline focus-visible:text-emerald-400 focus-visible:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500"
          >
            {name}/
          </a>
        ))}
      </div>
      <div className="mt-3 text-neutral-600">cat &lt;name&gt; for detail</div>
    </div>
  ),
});

const catProject = (arg?: string): CommandResult => {
  const key = (arg || "").replace(/\/$/, "").toLowerCase();
  const p = PROJECTS[key];
  if (!p) {
    return `cat: ${arg || ""}: no such project\ntry projects for the list`;
  }
  return {
    type: "node",
    node: (
      <div className="space-y-1">
        <div className="text-neutral-300">{key}/</div>
        <div className="text-neutral-400">{p.desc}</div>
        <div className="text-neutral-500">{p.stack}</div>
        <a
          href={p.url}
          target="_blank"
          rel="noreferrer"
          className="inline-block rounded-sm text-emerald-400 underline underline-offset-4 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500"
        >
          {p.url.replace("https://", "")}
        </a>
      </div>
    ),
  };
};

const LOGO = `.------.
| >_   |
|      |
'------'`;

const neofetch = (): CommandResult => ({
  type: "node",
  node: (
    <div className="flex gap-3">
      <pre className="whitespace-pre leading-tight text-emerald-400">{LOGO}</pre>
      <div className="min-w-0 leading-tight">
        <div>
          <span className="text-emerald-400">richard</span>
          <span className="text-neutral-500">@</span>
          <span className="text-emerald-400">ucla</span>
        </div>
        <div className="text-neutral-600">------------</div>
        {(
          [
            ["role", "stats + data science"],
            ["school", "UCLA '28"],
            ["locale", "Los Angeles / Toronto"],
            ["stack", "PySpark · Airflow · React · Postgres · TypeScript"],
          ] as [string, string][]
        ).map(([label, value]) => (
          <div key={label}>
            <span className="text-emerald-400">{label.padEnd(7)}</span>
            <span className="text-neutral-400">{value}</span>
          </div>
        ))}
      </div>
    </div>
  ),
});

const COMMANDS: Record<string, (arg?: string) => CommandResult> = {
  help: () =>
    [
      "neofetch   system info",
      "now        what I'm working on",
      "projects   things I've shipped",
      "cat        cat <project>",
      "playlist   what I'm listening to",
      "contact    how to reach me",
      "clear      clear the terminal",
    ].join("\n"),

  neofetch,

  now: () =>
    "shipping Homie at Creative Labs\nlooking for summer 2027 internships",

  projects: listProjects,

  cat: catProject,

  playlist: () => ({
    type: "node",
    node: (
      <div>
        <span className="text-neutral-400">off the clock, on rotation: </span>
        <a
          href={PROFILE.spotify}
          target="_blank"
          rel="noreferrer"
          className="rounded-sm text-emerald-400 underline underline-offset-4 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500"
        >
          open in Spotify
        </a>
      </div>
    ),
  }),

  contact: () =>
    [
      `email     ${PROFILE.email}`,
      `github    ${PROFILE.github}`,
      `linkedin  ${PROFILE.linkedin}`,
    ].join("\n"),

  sudo: () => "nice try",

  "rm -rf /": () => "not on my watch",

  ls: listProjects,
};

const BOOT: { cmd: string; out: CommandResult }[] = [
  { cmd: "neofetch", out: COMMANDS.neofetch() },
  { cmd: "now", out: COMMANDS.now() },
];

type Line =
  | { type: "cmd" | "out" | "hint"; text: string }
  | { type: "node"; node: React.ReactNode };

const toResult = (out: CommandResult): Line =>
  typeof out === "string"
    ? { type: "out", text: out }
    : { type: "node", node: out.node };

export default function Terminal() {
  const [lines, setLines] = useState<Line[]>([]);
  const [typing, setTyping] = useState("");
  const [booted, setBooted] = useState(false);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [histIndex, setHistIndex] = useState(-1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduce) {
      setLines(
        BOOT.flatMap((s) => [{ type: "cmd", text: s.cmd }, toResult(s.out)])
      );
      setLines((l) => [...l, { type: "hint", text: "type help to explore" }]);
      setBooted(true);
      return;
    }

    let cancelled = false;
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

    (async () => {
      await sleep(400);
      for (const step of BOOT) {
        for (let i = 1; i <= step.cmd.length; i++) {
          if (cancelled) return;
          setTyping(step.cmd.slice(0, i));
          await sleep(55 + Math.random() * 45);
        }
        await sleep(220);
        if (cancelled) return;
        setTyping("");
        setLines((l) => [
          ...l,
          { type: "cmd", text: step.cmd },
          toResult(step.out),
        ]);
        await sleep(450);
      }
      if (cancelled) return;
      setLines((l) => [...l, { type: "hint", text: "type help to explore" }]);
      setBooted(true);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [lines, typing]);

  const run = useCallback((raw: string) => {
    const cmd = raw.trim();
    if (!cmd) return;
    setHistory((h) => [cmd, ...h]);
    setHistIndex(-1);

    if (cmd === "clear") {
      setLines([]);
      return;
    }

    const lower = cmd.toLowerCase();
    const [first, ...rest] = lower.split(" ");
    const handler = COMMANDS[lower] ?? COMMANDS[first];
    const arg = COMMANDS[lower] ? "" : rest.join(" ");

    const out = handler
      ? handler(arg)
      : `command not found: ${cmd}\ntype help for a list`;

    setLines((l) => [...l, { type: "cmd", text: cmd }, toResult(out)]);
  }, []);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      run(input);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = Math.min(histIndex + 1, history.length - 1);
      if (next >= 0) {
        setHistIndex(next);
        setInput(history[next]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = histIndex - 1;
      setHistIndex(next);
      setInput(next < 0 ? "" : history[next]);
    }
  };

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className="cursor-text rounded-xl border border-white/10 bg-neutral-950 p-5 font-mono text-sm"
    >
      <div className="mb-4 flex gap-2">
        <span className="h-3 w-3 rounded-full bg-white/15" />
        <span className="h-3 w-3 rounded-full bg-white/15" />
        <span className="h-3 w-3 rounded-full bg-white/15" />
      </div>

      <div ref={scrollRef} className="max-h-72 overflow-y-auto">
        {lines.map((line, i) =>
          line.type === "cmd" ? (
            <div key={i} className="mt-3 text-neutral-500 first:mt-0">
              {PROMPT} <span className="text-neutral-300">{line.text}</span>
            </div>
          ) : line.type === "hint" ? (
            <div key={i} className="mt-4 text-neutral-600">
              {line.text}
            </div>
          ) : line.type === "node" ? (
            <div key={i} className="mt-1">
              {line.node}
            </div>
          ) : (
            <pre
              key={i}
              className="mt-1 whitespace-pre-wrap font-mono text-neutral-400"
            >
              {line.text}
            </pre>
          )
        )}

        {!booted && (
          <div className="mt-3 text-neutral-500">
            {PROMPT} <span className="text-neutral-300">{typing}</span>
            <span className="ml-0.5 inline-block h-4 w-2 translate-y-0.5 animate-pulse bg-emerald-500" />
          </div>
        )}

        {booted && (
          <div className="mt-3 flex items-center text-neutral-500">
            <span>{PROMPT}&nbsp;</span>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              spellCheck={false}
              autoComplete="off"
              aria-label="Terminal input"
              className="flex-1 bg-transparent text-neutral-300 outline-none"
            />
          </div>
        )}
      </div>
    </div>
  );
}
