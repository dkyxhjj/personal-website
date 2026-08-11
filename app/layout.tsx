import type { Metadata } from "next";
import { Instrument_Serif, Newsreader, IBM_Plex_Mono } from "next/font/google";
import Rail from "./components/Rail";
import "./globals.css";

const display = Instrument_Serif({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
});

const body = Newsreader({
  variable: "--font-body",
  subsets: ["latin"],
});

const mono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: {
    default: "Richard Li",
    template: "%s · Richard Li",
  },
  description:
    "Richard Li — UCLA statistics and data science student building web and mobile apps and poker analytics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${mono.variable}`}
    >
      <body>
        <div
          aria-hidden
          className="fixed inset-0 -z-10"
          style={{
            backgroundImage: "url(/background/toronto-bg.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(14px) saturate(0.7)",
            transform: "scale(1.08)",
          }}
        />
        <div aria-hidden className="fixed inset-0 -z-10 bg-black/75" />
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Rail />
        <main id="main">{children}</main>
      </body>
    </html>
  );
}
