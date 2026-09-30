import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';

// DigiSetu logo with hover animation
const Logo = ({ scrolled = false, onClick }) => {
  return (
    <Link
      to="/"
      onClick={onClick}
      aria-label="DigiSetu — Home"
      className="flex items-center gap-2.5 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-secondary)] rounded-[var(--radius-sm)]"
    >
      <motion.div
        whileHover={{ scale: 1.08, rotate: -4 }}
        transition={{ type: 'spring', stiffness: 400, damping: 18 }}
        className="flex items-center justify-center w-8 h-8 rounded-[var(--radius-md)] bg-[var(--color-secondary)] text-white shrink-0"
        aria-hidden="true"
      >
        <ShieldCheck size={18} strokeWidth={2.2} />
      </motion.div>

      <div className="flex flex-col leading-none">
        <span
          className={[
            'text-[15px] font-bold tracking-tight transition-colors duration-200',
            scrolled
              ? 'text-[var(--color-text-primary)]'
              : 'text-[var(--color-primary)]',
          ].join(' ')}
        >
          DigiSetu
        </span>
        <span className="text-[9px] font-medium tracking-widest uppercase text-[var(--color-text-secondary)] mt-[1px]">
          Powered by MOSIP
        </span>
      </div>
    </Link>
  );
};

export default Logo;
