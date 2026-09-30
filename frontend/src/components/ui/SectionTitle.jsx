/**
 * SectionTitle
 *
 * @prop {string} title
 * @prop {string} subtitle
 * @prop {React.ReactNode} action     — right-aligned slot (e.g. a Button)
 * @prop {('sm'|'md'|'lg')} size
 * @prop {boolean} divider            — show divider below
 */

const titleSizes = {
  sm: 'text-sm font-semibold',
  md: 'text-base font-semibold',
  lg: 'text-xl font-bold',
};

const subtitleSizes = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
};

const SectionTitle = ({
  title,
  subtitle,
  action,
  size = 'md',
  divider = false,
  className = '',
  ...props
}) => {
  return (
    <div className={['w-full', className].filter(Boolean).join(' ')} {...props}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-0.5 min-w-0">
          {title && (
            <h3
              className={[
                titleSizes[size] ?? titleSizes.md,
                'text-[var(--color-text-primary)] leading-snug',
              ].join(' ')}
            >
              {title}
            </h3>
          )}
          {subtitle && (
            <p
              className={[
                subtitleSizes[size] ?? subtitleSizes.md,
                'text-[var(--color-text-secondary)]',
              ].join(' ')}
            >
              {subtitle}
            </p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      {divider && <hr className="mt-3 border-0 border-t border-[var(--color-border)]" />}
    </div>
  );
};

export default SectionTitle;
