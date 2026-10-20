// Typographic wordmark: "Syaha" in the display serif, "Tour" in spaced
// small capitals, and a single gold line tracing the curve of the Nile.

export function Wordmark({ tone = "dark", className = "" }: { tone?: "dark" | "light"; className?: string }) {
  const color = tone === "light" ? "text-ivory" : "text-nile";
  return (
    <span className={`inline-flex flex-col leading-none ${color} ${className}`}>
      <span className="flex items-baseline gap-2">
        <span className="font-display text-[1.7rem] font-semibold tracking-[0.01em]">Syaha</span>
        <span className="text-[0.62rem] font-semibold uppercase tracking-[0.42em]">Tour</span>
      </span>
      <svg viewBox="0 0 120 8" className="mt-0.5 h-[7px] w-[6.2rem]" aria-hidden="true">
        <path
          d="M1 5.5 C 18 1, 30 1, 44 4.5 S 72 8, 88 3.5 S 110 1.5, 119 4"
          fill="none"
          stroke="#B58B50"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <circle cx="104" cy="3" r="1.6" fill="#B58B50" />
      </svg>
    </span>
  );
}
