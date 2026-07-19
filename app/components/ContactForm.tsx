"use client";

import { useState, type FormEvent } from "react";

const EMAIL = "richardli.060411@gmail.com";

const FIELD_CLASS =
  "w-full rounded-lg border border-zinc-200 bg-transparent px-3 py-2 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-400 dark:border-zinc-800 dark:text-zinc-50 dark:placeholder:text-zinc-600 dark:focus:border-zinc-500";
const LABEL_CLASS =
  "mb-1.5 block text-xs font-medium tracking-wide text-zinc-500 dark:text-zinc-400";

const MailIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-3.5 w-3.5"
  >
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    // Honeypot: real users never fill this in.
    if (data.get("company")) return;

    setStatus("sending");
    try {
      const res = await fetch(`https://formsubmit.co/ajax/${EMAIL}`, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="mt-6 flex w-full flex-col items-center gap-2 rounded-lg border border-zinc-200 px-6 py-16 text-center dark:border-zinc-800">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </span>
        <p className="text-base font-medium text-zinc-950 dark:text-zinc-50">
          Message sent
        </p>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Thanks for reaching out — I usually reply within a day.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6 w-full rounded-lg border border-zinc-200 p-8 dark:border-zinc-800">
      <p className="mb-5 text-xs text-zinc-400 dark:text-zinc-500">
        Usually replies within a day.
      </p>
      <form onSubmit={handleSubmit} className="space-y-5">
        <input type="hidden" name="_captcha" value="false" />
        <input
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute left-[-9999px] h-0 w-0 opacity-0"
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="contact-name" className={LABEL_CLASS}>
              Name
            </label>
            <input
              id="contact-name"
              type="text"
              name="name"
              autoComplete="name"
              placeholder="Jane Doe"
              required
              className={FIELD_CLASS}
            />
          </div>
          <div>
            <label htmlFor="contact-email" className={LABEL_CLASS}>
              Email
            </label>
            <input
              id="contact-email"
              type="email"
              name="email"
              autoComplete="email"
              placeholder="jane@email.com"
              required
              className={FIELD_CLASS}
            />
          </div>
        </div>
        <div>
          <label htmlFor="contact-message" className={LABEL_CLASS}>
            Message
          </label>
          <textarea
            id="contact-message"
            name="message"
            rows={6}
            placeholder="What's on your mind?"
            required
            className={`${FIELD_CLASS} resize-y`}
          />
        </div>
        <button
          type="submit"
          disabled={status === "sending"}
          className="w-full rounded-lg bg-zinc-950 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-60 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
        >
          {status === "sending" ? "Sending…" : "Send"}
        </button>
        {status === "error" && (
          <p className="text-sm text-red-600 dark:text-red-400">
            Something went wrong — your message wasn&rsquo;t sent. Email me
            directly at{" "}
            <a href={`mailto:${EMAIL}`} className="underline">
              {EMAIL}
            </a>
            .
          </p>
        )}
        <div className="flex items-center gap-3 text-xs text-zinc-300 dark:text-zinc-700">
          <span className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
          or
          <span className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
        </div>
        <a
          href={`mailto:${EMAIL}`}
          className="flex items-center justify-center gap-1.5 text-xs text-zinc-400 transition-colors hover:text-zinc-950 dark:text-zinc-500 dark:hover:text-zinc-50"
        >
          <MailIcon />
          {EMAIL}
        </a>
      </form>
    </div>
  );
}
