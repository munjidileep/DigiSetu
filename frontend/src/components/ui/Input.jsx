import { forwardRef, useState } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

/**
 * Input
 *
 * @prop {('text'|'password'|'email'|'number'|'search')} type
 * @prop {string} label
 * @prop {string} placeholder
 * @prop {string} hint       — helper text below field
 * @prop {string} error      — error message; puts field in error state
 * @prop {boolean} disabled
 * @prop {React.ReactNode} leftIcon
 * @prop {React.ReactNode} rightIcon
 * @prop {('sm'|'md'|'lg')} size
 */

const sizes = {
  sm: 'h-8 text-xs px-3',
  md: 'h-10 text-sm px-3',
  lg: 'h-11 text-base px-4',
};

const Input = forwardRef(function Input(
  {
    type = 'text',
    label,
    placeholder,
    hint,
    error,
    disabled = false,
    leftIcon,
    rightIcon,
    size = 'md',
    id,
    className = '',
    ...props
  },
  ref
) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const resolvedType = isPassword ? (showPassword ? 'text' : 'password') : type;
  const inputId = id ?? (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  const baseInput = [
    'w-full rounded-[var(--radius-md)] border bg-white font-[var(--font-family)]',
    'text-[var(--color-text-primary)] placeholder:text-[var(--color-text-disabled)]',
    'transition-[var(--transition-fast)]',
    'focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] focus:ring-offset-0 focus:border-[var(--color-secondary)]',
    error
      ? 'border-[var(--color-danger)] focus:ring-[var(--color-danger)]'
      : 'border-[var(--color-border)] hover:border-[var(--color-border-strong)]',
    disabled ? 'bg-gray-50 text-[var(--color-text-disabled)] cursor-not-allowed' : '',
    leftIcon ? 'pl-9' : '',
    isPassword || rightIcon ? 'pr-9' : '',
    sizes[size] ?? sizes.md,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-[var(--color-text-primary)] select-none"
        >
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        {leftIcon && (
          <span className="absolute left-3 text-[var(--color-text-secondary)] pointer-events-none">
            {leftIcon}
          </span>
        )}

        <input
          ref={ref}
          id={inputId}
          type={resolvedType}
          placeholder={placeholder}
          disabled={disabled}
          className={baseInput}
          aria-invalid={!!error}
          aria-describedby={
            error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
          }
          {...props}
        />

        {/* Right slot: password toggle > error icon > custom right icon */}
        {isPassword ? (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-[var(--transition-fast)]"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        ) : error ? (
          <span className="absolute right-3 text-[var(--color-danger)] pointer-events-none">
            <AlertCircle size={16} />
          </span>
        ) : rightIcon ? (
          <span className="absolute right-3 text-[var(--color-text-secondary)] pointer-events-none">
            {rightIcon}
          </span>
        ) : null}
      </div>

      {error && (
        <p
          id={`${inputId}-error`}
          className="text-xs text-[var(--color-danger)] flex items-center gap-1"
          role="alert"
        >
          {error}
        </p>
      )}

      {hint && !error && (
        <p
          id={`${inputId}-hint`}
          className="text-xs text-[var(--color-text-secondary)]"
        >
          {hint}
        </p>
      )}
    </div>
  );
});

export default Input;
