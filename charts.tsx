export function Donut({
  segments,
  size = 168,
  thickness = 22,
  centerLabel = "TOTAL",
}: {
  segments: { label: string; value: number; color: string }[];
  size?: number;
  thickness?: number;
  centerLabel?: string;
}) {
  const total = segments.reduce((s, x) => s + x.value, 0);
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <div className="flex flex-col items-center gap-4">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#E2E8F0" strokeWidth={thickness} />
        {total > 0 &&
          segments
            .filter((s) => s.value > 0)
            .map((s, i) => {
              const dash = (s.value / total) * c;
              const el = (
                <circle
                  key={i}
                  cx={size / 2}
                  cy={size / 2}
                  r={r}
                  fill="none"
                  stroke={s.color}
                  strokeWidth={thickness}
                  strokeDasharray={`${dash} ${c - dash}`}
                  strokeDashoffset={c / 4 - offset}
                />
              );
              offset += dash;
              return el;
            })}
        <text x="50%" y="47%" textAnchor="middle" fill="#0f172a" fontSize="28" fontWeight="800" fontFamily="Sora, sans-serif">
          {total}
        </text>
        <text x="50%" y="60%" textAnchor="middle" fill="#64748b" fontSize="10" fontWeight="700" letterSpacing="1.5">
          {centerLabel}
        </text>
      </svg>
      <ul className="grid grid-cols-2 gap-x-5 gap-y-1.5">
        {segments.map((s) => (
          <li key={s.label} className="flex items-center gap-2 text-xs font-bold text-slate-600">
            <span className="size-2.5 rounded-full" style={{ backgroundColor: s.color }} />
            {s.label}
            <span className="text-slate-400">({s.value})</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function HBars({ items }: { items: { label: string; value: number; color?: string }[] }) {
  const max = Math.max(1, ...items.map((i) => i.value));
  return (
    <div className="space-y-3.5">
      {items.map((it) => (
        <div key={it.label}>
          <div className="flex items-baseline justify-between text-xs font-bold text-slate-600">
            <span>{it.label}</span>
            <span className="font-display text-sm text-slate-900">{it.value}</span>
          </div>
          <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${(it.value / max) * 100}%`, backgroundColor: it.color ?? "#0f766e" }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export function Funnel({ stages }: { stages: { label: string; value: number; color?: string }[] }) {
  const max = Math.max(1, ...stages.map((s) => s.value));
  return (
    <div className="space-y-2.5">
      {stages.map((s) => (
        <div key={s.label} className="flex items-center gap-3">
          <div className="w-44 shrink-0 text-xs font-bold text-slate-600">{s.label}</div>
          <div className="flex-1">
            <div
              className="flex h-9 items-center rounded-lg px-3 text-xs font-extrabold text-white shadow-sm"
              style={{ width: `${Math.max(9, (s.value / max) * 100)}%`, backgroundColor: s.color ?? "#115e59" }}
            >
              {s.value}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
