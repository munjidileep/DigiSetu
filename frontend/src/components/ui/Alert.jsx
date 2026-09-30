import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

/**
 * Alert
 *
 * @prop {('success'|'warning'|'error'|'info')} variant
 * @prop {string} title
 * @prop {string|React.ReactNode} description
 * @prop {boolean} dismissible
 * @prop {() => void} onDismiss
 */

const config = {
  success: {
    icon: CheckCircle2,
    wrapper: 'bg-[var(--color-success-light)] border-[var(--color-success)]/30',
    icon_class: 'text-[var(--color-success)]',
    title_class: 'text-emerald-800',
    body_class: 'text-emerald-700',
  },
  warning: {
    icon: AlertTriangle,
    wrapper: 'bg-[var(--color-warning-light)] border-[var(--color-warning)]/30',
    icon_class: 'text-[var(--color-warning)]',
    title_class: 'text-amber-800',
    body_class: 'text-amber-700',
  },
  error: {
    icon: XCircle,
    wrapper: 'bg-[var(--color-danger-light)] border-[var(--color-danger)]/30',
    icon_class: 'text-[var(--color-danger)]',
    title_class: 'text-red-800',
    body_class: 'text-red-700',
  },
  info: {
    icon: Info,
    wrapper: 'bg-[var(--color-info-light)] border-[var(--color-info)]/30',
    icon_class: 'text-[var(--color-info)]',
    title_class: 'text-blue-800',
    body_class: 'text-blue-700',
  },
};

const Alert = ({
  variant = 'info',
  title,
  description,
  dismissible = false,
  onDismiss,
  className = '',
  ...props
}) => {
  const c = config[variant] ?? config.info;
  const Icon = c.icon;

  return (
    <div
      role="alert"
      className={[
        'flex gap-3 p-4 rounded-[var(--radius-md)] border',
        c.wrapper,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      <Icon size={18} className={['mt-0.5 shrink-0', c.icon_class].join(' ')} />

      <div className="flex-1 min-w-0">
        {title && (
          <p className={['text-sm font-semibold leading-5', c.title_class].join(' ')}>
            {title}
          </p>
        )}
        {description && (
          <p className={['text-sm mt-0.5 leading-5', c.body_class].join(' ')}>
            {description}
          </p>
        )}
      </div>

      {dismissible && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss alert"
          className={[
            'shrink-0 p-0.5 rounded hover:bg-black/5 transition-[var(--transition-fast)]',
            c.icon_class,
          ].join(' ')}
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default Alert;
