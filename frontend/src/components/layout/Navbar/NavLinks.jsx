import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

// Nav link definitions and smooth scroll support
export const NAV_ITEMS = [
  { label: 'Dashboard',            to: '/dashboard',            type: 'route' },
  { label: 'Verify Identity',      to: '/verify',               type: 'route' },
  { label: 'My Documents',         to: '/documents',            type: 'route' },
  { label: 'Verification History', to: '/verification-history', type: 'route' },
];

// Desktop horizontal navigation with animated underline
const NavLinks = ({ scrolled = false, onClose }) => {
  const { pathname } = useLocation();

  const linkBase = [
    'relative text-sm font-medium px-1 py-1 transition-colors duration-150',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-secondary)] rounded-[var(--radius-sm)]',
  ].join(' ');

  const activeColor   = 'text-[var(--color-secondary)]';
  const defaultColor  = scrolled
    ? 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
    : 'text-slate-600 hover:text-[var(--color-primary)]';

  return (
    <nav aria-label="Main navigation">
      <ul className="flex items-center gap-1" role="list">
        {NAV_ITEMS.map(({ label, to, type }) => (
          <li key={label}>
            <NavLink
              to={to}
              end
              onClick={onClose}
              className={({ isActive }) =>
                [linkBase, isActive ? activeColor : defaultColor].join(' ')
              }
            >
              {({ isActive }) => (
                <>
                  {label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute -bottom-0.5 left-0 right-0 h-[2px] bg-[var(--color-secondary)] rounded-full"
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default NavLinks;
