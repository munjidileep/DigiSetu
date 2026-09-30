import { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Modal
 *
 * @prop {boolean} open
 * @prop {() => void} onClose
 * @prop {string} title
 * @prop {('sm'|'md'|'lg'|'xl'|'full')} size
 * @prop {boolean} closable    — show × button (default: true)
 * @prop {React.ReactNode} children
 * @prop {React.ReactNode} footer
 */

const widths = {
  sm:   'max-w-sm',
  md:   'max-w-md',
  lg:   'max-w-lg',
  xl:   'max-w-2xl',
  full: 'max-w-5xl',
};

const backdropVariants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1 },
};

const panelVariants = {
  hidden:  { opacity: 0, scale: 0.96, y: 8 },
  visible: { opacity: 1, scale: 1,    y: 0 },
};

const Modal = ({
  open = false,
  onClose,
  title,
  size = 'md',
  closable = true,
  children,
  footer,
  className = '',
}) => {
  // Close on Escape
  const handleKey = useCallback(
    (e) => {
      if (e.key === 'Escape' && closable) onClose?.();
    },
    [closable, onClose]
  );

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [open, handleKey]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          key="modal-backdrop"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(2px)' }}
          onClick={(e) => {
            if (e.target === e.currentTarget && closable) onClose?.();
          }}
          aria-modal="true"
          role="dialog"
          aria-label={title}
        >
          <motion.div
            key="modal-panel"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className={[
              'w-full bg-[var(--color-card)] rounded-[var(--radius-xl)]',
              'shadow-[var(--shadow-xl)] flex flex-col max-h-[90vh]',
              widths[size] ?? widths.md,
              className,
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {/* Header */}
            {(title || closable) && (
              <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)] shrink-0">
                {title && (
                  <h2 className="text-base font-semibold text-[var(--color-text-primary)]">
                    {title}
                  </h2>
                )}
                {closable && (
                  <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close modal"
                    className="ml-auto p-1.5 rounded-[var(--radius-sm)] text-[var(--color-text-secondary)] hover:bg-gray-100 hover:text-[var(--color-text-primary)] transition-[var(--transition-fast)]"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            )}

            {/* Body */}
            <div className="px-6 py-5 overflow-y-auto flex-1">{children}</div>

            {/* Footer */}
            {footer && (
              <div className="px-6 py-4 border-t border-[var(--color-border)] bg-gray-50/50 rounded-b-[var(--radius-xl)] shrink-0 flex justify-end gap-3">
                {footer}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default Modal;
