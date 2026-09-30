/**
 * Divider
 *
 * @prop {('horizontal'|'vertical')} orientation
 * @prop {React.ReactNode} label   — optional centred text
 * @prop {string} className
 */

const Divider = ({
  orientation = 'horizontal',
  label,
  className = '',
  ...props
}) => {
  if (orientation === 'vertical') {
    return (
      <div
        role="separator"
        aria-orientation="vertical"
        className={['w-px self-stretch bg-[var(--color-border)]', className]
          .filter(Boolean)
          .join(' ')}
        {...props}
      />
    );
  }

  if (label) {
    return (
      <div
        role="separator"
        className={['flex items-center gap-3', className].filter(Boolean).join(' ')}
        {...props}
      >
        <span className="flex-1 h-px bg-[var(--color-border)]" />
        <span className="text-xs font-medium text-[var(--color-text-secondary)] whitespace-nowrap select-none">
          {label}
        </span>
        <span className="flex-1 h-px bg-[var(--color-border)]" />
      </div>
    );
  }

  return (
    <hr
      role="separator"
      className={['border-0 border-t border-[var(--color-border)] w-full', className]
        .filter(Boolean)
        .join(' ')}
      {...props}
    />
  );
};

export default Divider;
