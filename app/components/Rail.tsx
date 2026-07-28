"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";

const nav = [
  {
    href: "/",
    label: "Home",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        width="24"
        height="24"
        aria-hidden="true"
      >
        <path d="M4 10.5 12 4l8 6.5" />
        <path d="M5.5 9.5V20h13V9.5" />
        <path d="M9.5 20v-5.5h5V20" />
      </svg>
    ),
  },
  {
    href: "/profile",
    label: "Profile",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        width="24"
        height="24"
        aria-hidden="true"
      >
        <circle cx="12" cy="8" r="3.5" />
        <path d="M5 20c0-3.6 3.1-6 7-6s7 2.4 7 6" />
      </svg>
    ),
  },
  {
    href: "/blog",
    label: "Blog",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        width="24"
        height="24"
        aria-hidden="true"
      >
        <path d="M6 4h9l3 3v13H6z" />
        <path d="M9 9h6M9 13h6M9 17h4" />
      </svg>
    ),
  },
];

export default function Rail() {
  const pathname = usePathname();

  return (
    <nav className="rail" aria-label="Primary">
      {nav.map((item) => {
        const active =
          item.href === "/"
            ? pathname === "/"
            : pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            className="rail-btn"
            data-active={active ? "true" : undefined}
            aria-current={active ? "page" : undefined}
          >
            {item.icon}
            <span className="rail-tip mono-label" aria-hidden="true">
              {item.label}
            </span>
          </Link>
        );
      })}
      <span className="rail-spacer" aria-hidden="true" />
      <ThemeToggle />
    </nav>
  );
}
