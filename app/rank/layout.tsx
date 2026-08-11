export default function RankLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="min-[900px]:pl-[var(--rail-w)]">{children}</div>;
}
