import Link from "next/link";

export default function Landing() {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at center, #1a6b45 0%, #14533a 45%, #0b3526 100%)",
      }}
    >
      {/* Table rim */}
      <div className="pointer-events-none absolute inset-4 rounded-[48px] border-8 border-[#5c3a1e]/80 shadow-[inset_0_0_60px_rgba(0,0,0,0.5)] sm:inset-8" />
      {/* Inner felt line */}
      <div className="pointer-events-none absolute inset-10 rounded-[40px] border border-yellow-100/20 sm:inset-16" />

      {/* Floating suits */}
      <span className="animate-float pointer-events-none absolute left-[10%] top-[15%] rotate-[-15deg] text-6xl text-white/10 sm:text-8xl">
        ♠
      </span>
      <span className="animate-float-delayed pointer-events-none absolute right-[12%] top-[20%] rotate-[20deg] text-7xl text-red-300/10 sm:text-9xl">
        ♥
      </span>
      <span className="animate-float-delayed pointer-events-none absolute bottom-[18%] left-[15%] rotate-[10deg] text-7xl text-red-300/10 sm:text-9xl">
        ♦
      </span>
      <span className="animate-float pointer-events-none absolute bottom-[12%] right-[10%] rotate-[-10deg] text-6xl text-white/10 sm:text-8xl">
        ♣
      </span>

      <div className="relative flex flex-col items-center px-6 text-center">
        {/* Hole cards */}
        <div className="animate-rise mb-10 flex">
          <div className="flex h-32 w-24 rotate-[-8deg] flex-col justify-between rounded-xl border border-zinc-300 bg-white p-2.5 shadow-2xl sm:h-40 sm:w-28">
            <span className="text-left text-2xl font-bold leading-none text-zinc-900 sm:text-3xl">
              R<span className="block text-3xl sm:text-4xl">♠</span>
            </span>
            <span className="rotate-180 text-left text-2xl font-bold leading-none text-zinc-900 sm:text-3xl">
              R<span className="block text-3xl sm:text-4xl">♠</span>
            </span>
          </div>
          <div className="-ml-8 flex h-32 w-24 rotate-[8deg] flex-col justify-between rounded-xl border border-zinc-300 bg-white p-2.5 shadow-2xl sm:h-40 sm:w-28">
            <span className="text-left text-2xl font-bold leading-none text-red-600 sm:text-3xl">
              L<span className="block text-3xl sm:text-4xl">♥</span>
            </span>
            <span className="rotate-180 text-left text-2xl font-bold leading-none text-red-600 sm:text-3xl">
              L<span className="block text-3xl sm:text-4xl">♥</span>
            </span>
          </div>
        </div>

        <h1 className="animate-rise-delayed-1 text-5xl font-extrabold uppercase tracking-tight text-white sm:text-7xl md:text-8xl">
          Richard Li
        </h1>
        <p className="animate-rise-delayed-2 mt-4 text-xl font-medium text-emerald-100/80 sm:text-3xl">
          The odds are in your favor.
        </p>

        {/* All-in chip button */}
        <Link
          href="/portfolio"
          className="animate-rise-delayed-3 group mt-12 flex h-36 w-36 items-center justify-center rounded-full border-8 border-dashed border-white/80 bg-gradient-to-b from-red-600 to-red-700 shadow-[0_10px_40px_rgba(0,0,0,0.5)] transition-transform hover:scale-110 active:scale-95 sm:h-44 sm:w-44"
          aria-label="Go all in and enter the portfolio"
        >
          <span className="flex flex-col items-center font-extrabold uppercase tracking-widest text-white">
            <span className="text-2xl sm:text-3xl">All In</span>
            <span className="text-[11px] font-medium normal-case text-white/70 group-hover:text-white">
              enter site
            </span>
          </span>
        </Link>
      </div>
    </div>
  );
}
