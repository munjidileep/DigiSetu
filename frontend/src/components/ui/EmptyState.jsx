import Button from './Button';

/**
 * EmptyState
 *
 * @prop {React.ReactNode} icon
 * @prop {string} title
 * @prop {string} description
 * @prop {string} actionLabel
 * @prop {() => void} onAction
 * @prop {('sm'|'md'|'lg')} size
 */

const paddings = { sm: 'py-8 px-4', md: 'py-12 px-6', lg: 'py-20 px-8' };
const iconSizes = { sm: 'w-10 h-10', md: 'w-14 h-14', lg: 'w-20 h-20' };

const EmptyState = ({
  icon,
  title = 'Nothing here yet',
  description,
  actionLabel,
  onAction,
  size = 'md',
  className = '',
  ...props
}) => {
  const pad     = paddings[size]  ?? paddings.md;
  const iconCls = iconSizes[size] ?? iconSizes.md;

  return (
    <div
      className={[
        'flex flex-col items-center justify-center text-center w-full',
        pad,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {icon && (
        <div
          className={[
            iconCls,
            'rounded-[var(--radius-xl)] bg-[var(--color-secondary-light)]',
            'flex items-center justify-center text-[var(--color-secondary)] mb-4',
          ].join(' ')}
        >
          {icon}
        </div>
      )}

      <p className="text-base font-semibold text-[var(--color-text-primary)] mb-1">
        {title}
      </p>

      {description && (
        <p className="text-sm text-[var(--color-text-secondary)] max-w-xs mb-5">
          {description}
        </p>
      )}

      {actionLabel && (
        <Button variant="outline" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
