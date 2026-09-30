/**
 * Progress
 *
 * @prop {('linear'|'circular')} variant
 * @prop {number} value      — 0–100
 * @prop {('sm'|'md'|'lg')} size
 * @prop {('default'|'success'|'warning'|'danger')} color
 * @prop {boolean} showLabel
 * @prop {string} label
 */

const colorMap = {
  default: 'var(--color-secondary)',
  success: 'var(--color-success)',
  warning: 'var(--color-warning)',
  danger:  'var(--color-danger)',
};

/* ── Linear ─────────────────────────────────────────────── */
const trackHeights = { sm: 'h-1', md: 'h-2', lg: 'h-3' };

const LinearProgress = ({ value = 0, size = 'md', color = 'default', showLabel = false, label }) => {
  const pct = Math.min(100, Math.max(0, value));
  const fillColor = colorMap[color] ?? colorMap.default;

  return (
    <div className="w-full flex flex-col gap-1.5">
      {(showLabel || label) && (
        <div className="flex justify-between items-center">
          {label && (
            <span className="text-xs font-medium text-[var(--color-text-secondary)]">{label}</span>
          )}
          {showLabel && (
            <span className="text-xs font-semibold text-[var(--color-text-primary)] ml-auto">
              {pct}%
            </span>
          )}
        </div>
      )}
      <div
        className={[
          'w-full rounded-full bg-gray-100 overflow-hidden',
          trackHeights[size] ?? trackHeights.md,
        ].join(' ')}
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full transition-[width] duration-500 ease-out"
          style={{ width: `${pct}%`, backgroundColor: fillColor }}
        />
      </div>
    </div>
  );
};

/* ── Circular ────────────────────────────────────────────── */
const circularSizes = { sm: 40, md: 56, lg: 72 };
const strokeWidths  = { sm: 4,  md: 5,  lg: 6  };

const CircularProgress = ({ value = 0, size = 'md', color = 'default', showLabel = false }) => {
  const pct = Math.min(100, Math.max(0, value));
  const px   = circularSizes[size] ?? circularSizes.md;
  const sw   = strokeWidths[size]  ?? strokeWidths.md;
  const r    = (px - sw) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  const fillColor = colorMap[color] ?? colorMap.default;
  const fontSize  = { sm: 9, md: 12, lg: 15 }[size] ?? 12;

  return (
    <svg
      width={px}
      height={px}
      viewBox={`0 0 ${px} ${px}`}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      {/* Track */}
      <circle
        cx={px / 2}
        cy={px / 2}
        r={r}
        fill="none"
        stroke="#E5E7EB"
        strokeWidth={sw}
      />
      {/* Fill */}
      <circle
        cx={px / 2}
        cy={px / 2}
        r={r}
        fill="none"
        stroke={fillColor}
        strokeWidth={sw}
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${px / 2} ${px / 2})`}
        style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
      />
      {showLabel && (
        <text
          x="50%"
          y="50%"
          dominantBaseline="central"
          textAnchor="middle"
          fontSize={fontSize}
          fontWeight="600"
          fill="var(--color-text-primary)"
        >
          {pct}%
        </text>
      )}
    </svg>
  );
};

/* ── Unified export ──────────────────────────────────────── */
const Progress = ({ variant = 'linear', ...props }) => {
  if (variant === 'circular') return <CircularProgress {...props} />;
  return <LinearProgress {...props} />;
};

export default Progress;
