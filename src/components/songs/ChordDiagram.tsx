import { cn } from "@/lib/utils";

const STRING_COUNT = 6;
const FRET_COUNT = 4;

export function ChordDiagram({
  name,
  fingering,
  className,
}: {
  name?: string;
  fingering: string;
  className?: string;
}) {
  const parsed = fingering
    .toLowerCase()
    .padEnd(6, "x")
    .slice(0, 6)
    .split("")
    .map((char) => (char === "x" ? "x" : Number(char)));

  const played = parsed.filter((fret): fret is number => fret !== "x" && fret > 0);
  const maxFret = played.length ? Math.max(...played) : 0;
  const startFret = maxFret > FRET_COUNT ? Math.min(...played) : 1;
  const showNut = startFret === 1;

  const width = 72;
  const height = 92;
  const padX = 14;
  const padY = 22;
  const gridW = width - padX * 2;
  const gridH = 52;
  const stringGap = gridW / (STRING_COUNT - 1);
  const fretGap = gridH / FRET_COUNT;

  return (
    <div className={cn("inline-flex flex-col items-center", className)}>
      {name ? (
        <span className="mb-0.5 text-[11px] font-semibold text-zinc-800">{name}</span>
      ) : null}
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        aria-hidden
      >
        {parsed.map((fret, stringIndex) => {
          const x = padX + stringIndex * stringGap;
          const mark = fret === "x" ? "×" : fret === 0 ? "○" : "";
          if (!mark) return null;
          return (
            <text
              key={`m-${stringIndex}`}
              x={x}
              y={14}
              textAnchor="middle"
              className="fill-zinc-700"
              style={{ fontSize: 10, fontFamily: "ui-sans-serif, system-ui" }}
            >
              {mark}
            </text>
          );
        })}
        {showNut ? (
          <rect
            x={padX - 0.5}
            y={padY - 2}
            width={gridW + 1}
            height={3}
            className="fill-zinc-800"
          />
        ) : (
          <text
            x={4}
            y={padY + fretGap * 0.7}
            className="fill-zinc-500"
            style={{ fontSize: 9 }}
          >
            {startFret}
          </text>
        )}
        {Array.from({ length: STRING_COUNT }).map((_, index) => (
          <line
            key={`s-${index}`}
            x1={padX + index * stringGap}
            y1={padY}
            x2={padX + index * stringGap}
            y2={padY + gridH}
            className="stroke-zinc-700"
            strokeWidth={index === 0 ? 1.6 : 1}
          />
        ))}
        {Array.from({ length: FRET_COUNT + 1 }).map((_, index) => (
          <line
            key={`f-${index}`}
            x1={padX}
            y1={padY + index * fretGap}
            x2={padX + gridW}
            y2={padY + index * fretGap}
            className="stroke-zinc-700"
            strokeWidth={1}
          />
        ))}
        {parsed.map((fret, stringIndex) => {
          if (fret === "x" || fret === 0) return null;
          const relative = fret - startFret + 1;
          if (relative < 1 || relative > FRET_COUNT) return null;
          const x = padX + stringIndex * stringGap;
          const y = padY + (relative - 0.5) * fretGap;
          return <circle key={`d-${stringIndex}`} cx={x} cy={y} r={4.2} className="fill-zinc-900" />;
        })}
      </svg>
    </div>
  );
}
