import { CheckCircle2, Clock, XCircle, ShieldAlert, ShieldCheck } from 'lucide-react';

/**
 * Badge
 *
 * @prop {('verified'|'pending'|'rejected'|'high-risk'|'low-risk'|'info'|'default')} variant
 * @prop {('sm'|'md')} size
 * @prop {boolean} dot       — show colored dot instead of icon
 * @prop {boolean} withIcon  — show preset icon (default: true)
 */

const config = {
  verified: {
    label: 'Verified',
    icon: CheckCircle2,
    classes:
      'bg-[var(--color-success-light)] text-[var(--color-success)] ring-1 ring-[var(--color-success)]/20',
  },
  pending: {
    label: 'Pending',
    icon: Clock,
    classes:
      'bg-[var(--color-warning-light)] text-[var(--color-warning)] ring-1 ring-[var(--color-warning)]/20',
  },
  rejected: {
    label: 'Rejected',
    icon: XCircle,
    classes:
      'bg-[var(--color-danger-light)] text-[var(--color-danger)] ring-1 ring-[var(--color-danger)]/20',
  },
  'high-risk': {
    label: 'High Risk',
    icon: ShieldAlert,
    classes:
      'bg-[var(--color-danger-light)] text-[var(--color-danger)] ring-1 ring-[var(--color-danger)]/20',
  },
  'low-risk': {
    label: 'Low Risk',
    icon: ShieldCheck,
    classes:
      'bg-[var(--color-success-light)] text-[var(--color-success)] ring-1 ring-[var(--color-success)]/20',
  },
  info: {
    label: 'Info',
    icon: null,
    classes:
      'bg-[var(--color-info-light)] text-[var(--color-info)] ring-1 ring-[var(--color-info)]/20',
  },
  default: {
    label: 'Default',
    icon: null,
    classes:
      'bg-gray-100 text-[var(--color-text-secondary)] ring-1 ring-gray-200',
  },
};

const sizes = {
  sm: 'text-[10px] px-2 py-0.5 gap-1',
  md: 'text-xs px-2.5 py-1 gap-1.5',
};

const iconSizes = { sm: 10, md: 12 };

const Badge = ({
  variant = 'default',
  size = 'md',
  dot = false,
  withIcon = true,
  label,
  className = '',
  ...props
}) => {
  const preset = config[variant] ?? config.default;
  const Icon = preset.icon;
  const displayLabel = label ?? preset.label;

  return (
    <span
      className={[
        'inline-flex items-center font-medium rounded-[var(--radius-full)]',
        preset.classes,
        sizes[size] ?? sizes.md,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {dot ? (
        <span
          className="rounded-full shrink-0"
          style={{
            width: size === 'sm' ? 5 : 6,
            height: size === 'sm' ? 5 : 6,
            backgroundColor: 'currentColor',
          }}
        />
      ) : withIcon && Icon ? (
        <Icon size={iconSizes[size]} className="shrink-0" />
      ) : null}
      {displayLabel}
    </span>
  );
};

export default Badge;
