/**
 * Loader
 *
 * @prop {('spinner'|'dots'|'pulse')} variant
 * @prop {('sm'|'md'|'lg'|'xl')} size
 * @prop {string} label       — sr-only accessible label
 * @prop {string} color       — CSS color value (defaults to secondary blue)
 * @prop {boolean} fullScreen — centres loader in the full viewport
 */

const spinnerSizes = { sm: 16, md: 24, lg: 36, xl: 48 };

const Spinner = ({ size = 'md', color }) => {
  const px = spinnerSizes[size] ?? spinnerSizes.md;
  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 24 24"
      fill="none"
      style={{ color: color ?? 'var(--color-secondary)' }}
      className="animate-spin"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeOpacity="0.2"
        strokeWidth="3"
      />
      <path
        d="M12 2a10 10 0 0 1 10 10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
};

const dotSizes = { sm: 'w-1.5 h-1.5', md: 'w-2 h-2', lg: 'w-3 h-3', xl: 'w-4 h-4' };

const Dots = ({ size = 'md', color }) => {
  const cls = dotSizes[size] ?? dotSizes.md;
  return (
    <div className="flex items-center gap-1.5" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={['rounded-full animate-bounce', cls].join(' ')}
          style={{
            backgroundColor: color ?? 'var(--color-secondary)',
            animationDelay: `${i * 0.15}s`,
          }}
        />
      ))}
    </div>
  );
};

const Pulse = ({ size = 'md', color }) => {
  const px = spinnerSizes[size] ?? spinnerSizes.md;
  return (
    <span
      className="rounded-full animate-pulse inline-block"
      style={{
        width: px,
        height: px,
        backgroundColor: color ?? 'var(--color-secondary)',
        opacity: 0.7,
      }}
      aria-hidden="true"
    />
  );
};

const Loader = ({
  variant = 'spinner',
  size = 'md',
  color,
  label = 'Loading…',
  fullScreen = false,
  className = '',
}) => {
  const inner = (
    <div
      className={['inline-flex flex-col items-center gap-2', className]
        .filter(Boolean)
        .join(' ')}
      role="status"
    >
      {variant === 'spinner' && <Spinner size={size} color={color} />}
      {variant === 'dots' && <Dots size={size} color={color} />}
      {variant === 'pulse' && <Pulse size={size} color={color} />}
      <span className="sr-only">{label}</span>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-[var(--z-overlay)]">
        {inner}
      </div>
    );
  }

  return inner;
};

export default Loader;
