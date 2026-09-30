/**
 * Card
 *
 * @prop {('default'|'hover'|'elevated'|'flat')} variant
 * @prop {string} className
 * @prop {React.ReactNode} children
 */

const variants = {
  default:
    'bg-[var(--color-card)] border border-[var(--color-border)] shadow-[var(--shadow-card)] rounded-[var(--radius-lg)]',
  hover:
    'bg-[var(--color-card)] border border-[var(--color-border)] shadow-[var(--shadow-card)] rounded-[var(--radius-lg)] transition-[var(--transition-smooth)] hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-0.5 cursor-pointer',
  elevated:
    'bg-[var(--color-card)] border border-[var(--color-border)] shadow-[var(--shadow-xl)] rounded-[var(--radius-lg)]',
  flat:
    'bg-[var(--color-card)] border border-[var(--color-border)] rounded-[var(--radius-lg)]',
};

const Card = ({ variant = 'default', className = '', children, ...props }) => {
  return (
    <div
      className={[variants[variant] ?? variants.default, className]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {children}
    </div>
  );
};

Card.Header = function CardHeader({ className = '', children, ...props }) {
  return (
    <div
      className={['px-6 py-4 border-b border-[var(--color-border)]', className]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {children}
    </div>
  );
};

Card.Body = function CardBody({ className = '', children, ...props }) {
  return (
    <div
      className={['px-6 py-5', className].filter(Boolean).join(' ')}
      {...props}
    >
      {children}
    </div>
  );
};

Card.Footer = function CardFooter({ className = '', children, ...props }) {
  return (
    <div
      className={[
        'px-6 py-4 border-t border-[var(--color-border)] bg-gray-50/50 rounded-b-[var(--radius-lg)]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
