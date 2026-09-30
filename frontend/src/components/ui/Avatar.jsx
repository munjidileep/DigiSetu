/**
 * Avatar
 *
 * @prop {string} src         — image URL
 * @prop {string} alt
 * @prop {string} name        — used to generate initials fallback
 * @prop {('xs'|'sm'|'md'|'lg'|'xl'|'2xl')} size
 * @prop {('circle'|'rounded')} shape
 * @prop {('online'|'offline'|'away'|'busy'|null)} status
 */

const sizes = {
  xs:  'w-6 h-6 text-[9px]',
  sm:  'w-8 h-8 text-xs',
  md:  'w-10 h-10 text-sm',
  lg:  'w-12 h-12 text-base',
  xl:  'w-16 h-16 text-lg',
  '2xl': 'w-20 h-20 text-xl',
};

const statusSadge = {
  xs:  'w-1.5 h-1.5 border',
  sm:  'w-2 h-2 border',
  md:  'w-2.5 h-2.5 border-2',
  lg:  'w-3 h-3 border-2',
  xl:  'w-3.5 h-3.5 border-2',
  '2xl': 'w-4 h-4 border-2',
};

const statusColors = {
  online:  'bg-[var(--color-success)]',
  offline: 'bg-gray-400',
  away:    'bg-[var(--color-warning)]',
  busy:    'bg-[var(--color-danger)]',
};

const getInitials = (name = '') => {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

// Deterministic background from name
const bgPalette = [
  'bg-blue-100 text-blue-700',
  'bg-violet-100 text-violet-700',
  'bg-emerald-100 text-emerald-700',
  'bg-amber-100 text-amber-700',
  'bg-rose-100 text-rose-700',
  'bg-cyan-100 text-cyan-700',
  'bg-indigo-100 text-indigo-700',
];

const getColor = (name = '') => {
  const code = [...name].reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return bgPalette[code % bgPalette.length];
};

const Avatar = ({
  src,
  alt = '',
  name = '',
  size = 'md',
  shape = 'circle',
  status = null,
  className = '',
  ...props
}) => {
  const sizeClass  = sizes[size]  ?? sizes.md;
  const shapeClass = shape === 'circle' ? 'rounded-full' : 'rounded-[var(--radius-md)]';
  const colorClass = getColor(name);
  const initials   = getInitials(name);

  return (
    <div className={['relative inline-flex shrink-0', className].filter(Boolean).join(' ')} {...props}>
      {src ? (
        <img
          src={src}
          alt={alt || name}
          className={['object-cover', sizeClass, shapeClass].join(' ')}
          draggable={false}
        />
      ) : (
        <span
          aria-label={name || alt}
          className={[
            'inline-flex items-center justify-center font-semibold select-none',
            sizeClass,
            shapeClass,
            colorClass,
          ].join(' ')}
        >
          {initials || '?'}
        </span>
      )}

      {status && (
        <span
          aria-label={status}
          className={[
            'absolute bottom-0 right-0 rounded-full border-white',
            statusColors[status] ?? statusColors.offline,
            statusSadge[size] ?? statusSadge.md,
          ].join(' ')}
        />
      )}
    </div>
  );
};

export default Avatar;
