import type { Metadata } from "next";
import { posts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Notes from Richard Li on statistics, building web and mobile apps, and poker analytics.",
};

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function formatDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}

export default function Blog() {
  return (
    <div className="page">
      <span className="mono-label eyebrow">Blog</span>
      <h1>Working notes on data, building, and the math of a good bet.</h1>
      <p className="muted">
        Occasional write-ups — half technical, half thinking out loud.
      </p>

      {posts.length === 0 ? (
        <div className="empty-state mono-label">Coming soon</div>
      ) : (
        <ul className="post-list">
          {posts.map((post) => (
            <li key={post.slug}>
              <a href="#">
                <span className="post-date mono-label">{formatDate(post.date)}</span>
                <span className="post-title">{post.title}</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
