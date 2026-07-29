import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { posts, getPost, formatPostDate } from "@/lib/posts";

export async function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata(
  props: PageProps<"/blog/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const post = getPost(slug);

  if (!post) {
    return {};
  }

  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogPostPage(props: PageProps<"/blog/[slug]">) {
  const { slug } = await props.params;
  const post = getPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="page">
      <Link href="/blog" className="mono-label back-link">
        « Back to blog
      </Link>
      <span className="mono-label post-date">{formatPostDate(post.date)}</span>
      <h1>{post.title}</h1>
      <div className="post-body">
        {post.content.map((block, i) => {
          switch (block.type) {
            case "subtitle":
              return (
                <p key={i} className="post-subtitle">
                  {block.text}
                </p>
              );
            case "p":
              return (
                <p key={i} className={block.muted ? "muted" : undefined}>
                  {block.text}
                </p>
              );
            case "h2":
              return <h2 key={i}>{block.text}</h2>;
            case "image":
              return (
                <figure key={i} className="post-figure">
                  <Image
                    src={block.src}
                    alt={block.alt}
                    width={block.width}
                    height={block.height}
                  />
                  {block.caption ? (
                    <figcaption>{block.caption}</figcaption>
                  ) : null}
                </figure>
              );
            case "list": {
              const Tag = block.ordered ? "ol" : "ul";
              return (
                <Tag key={i} className="post-list-block">
                  {block.items.map((item, j) => (
                    <li key={j}>{item}</li>
                  ))}
                </Tag>
              );
            }
            case "facts":
              return (
                <ul key={i} className="fact-list mono">
                  {block.items.map(([label, value]) => (
                    <li key={label}>
                      <span>{label}</span>
                      <span>{value}</span>
                    </li>
                  ))}
                </ul>
              );
            case "links":
              return (
                <ul key={i} className="fact-list mono">
                  {block.items.map(([label, href]) => (
                    <li key={label}>
                      <span>{label}</span>
                      <a href={href} style={{ textAlign: "right" }}>
                        {href.replace(/^mailto:/, "")} ↗
                      </a>
                    </li>
                  ))}
                </ul>
              );
            default:
              return null;
          }
        })}
      </div>
    </div>
  );
}
