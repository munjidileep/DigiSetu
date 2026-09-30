import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Button
 *
 * @prop {('primary'|'secondary'|'outline'|'ghost'|'danger')} variant
 * @prop {('sm'|'md'|'lg'|'xl')} size
 * @prop {boolean} loading
 * @prop {boolean} disabled
 * @prop {boolean} fullWidth
 * @prop {React.ReactNode} leftIcon
 * @prop {React.ReactNode} rightIcon
 */

const variants = {
  primary:
    'bg-[var(--color-secondary)] text-white hover:bg-[var(--color-secondary-hover)] active:scale-[0.98]',
  secondary:
    'bg-[var(--color-primary)] text-white hover:bg-slate-800 active:scale-[0.98]',
  outline:
    'bg-transparent border border-[var(--color-border-strong)] text-[var(--color-text-primary)] hover:bg-gray-50 active:scale-[0.98]',
  ghost:
    'bg-transparent text-[var(--color-text-primary)] hover:bg-gray-100 active:scale-[0.98]',
  danger:
    'bg-[var(--color-danger)] text-white hover:bg-red-600 active:scale-[0.98]',
  success:
    'bg-[var(--color-success)] text-white hover:bg-emerald-600 active:scale-[0.98]',
};

const sizes = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-9 px-4 text-sm gap-2',
  lg: 'h-11 px-5 text-base gap-2',
  xl: 'h-12 px-6 text-base gap-2.5',
};

const iconSizes = {
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
};

const Button = forwardRef(function Button(
  {
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    fullWidth = false,
    leftIcon,
    rightIcon,
    children,
    className = '',
    type = 'button',
    ...props
  },
  ref
) {
  const isDisabled = disabled || loading;

  return (
    <button
      ref={ref}
      type={type}
      disabled={isDisabled}
      className={[
        // base
        'inline-flex items-center justify-center font-medium rounded-[var(--radius-md)]',
        'transition-[var(--transition-fast)] select-none cursor-pointer',
        'focus-ring',
        // variant
        variants[variant] ?? variants.primary,
        // size
        sizes[size] ?? sizes.md,
        // state
        isDisabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : '',
        fullWidth ? 'w-full' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {loading ? (
        <Loader2 size={iconSizes[size]} className="animate-spin shrink-0" />
      ) : (
        leftIcon && <span className="shrink-0">{leftIcon}</span>
      )}
      {children}
      {!loading && rightIcon && (
        <span className="shrink-0">{rightIcon}</span>
      )}
    </button>
  );
});

export default Button;
