import type { Metadata } from "next";
import Link from "next/link";
import { posts, formatPostDate } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Notes from Richard Li on statistics, building web and mobile apps, and poker analytics.",
};

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
          {posts.map((post) => 
          (
            <li key={post.slug}>
              <Link href={`/blog/${post.slug}`}>
                <span className="post-date mono-label">{formatPostDate(post.date)}</span>
                <span className="post-title">{post.title}</span>
                <span className="post-excerpt">{post.excerpt}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
