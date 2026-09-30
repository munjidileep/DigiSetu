import { useEffect, useRef } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, LogOut } from 'lucide-react';
import Button from '../../ui/Button';
import { NAV_ITEMS } from './NavLinks';
import { useAuth } from '../../../context/AuthContext';

// Mobile slide-down menu with focus trap and scroll lock
const menuVariants = {
  hidden: {
    opacity: 0,
    height: 0,
    transition: { duration: 0.22, ease: [0.4, 0, 0.2, 1] },
  },
  visible: {
    opacity: 1,
    height: 'auto',
    transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -8 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.045, duration: 0.18, ease: 'easeOut' },
  }),
};

const MobileMenu = ({ open, onClose }) => {
  const { authenticated, user, logout } = useAuth();
  const firstLinkRef = useRef(null);

  // Focus first link when menu opens
  useEffect(() => {
    if (open) {
      // Slight delay so the animation starts first
      const t = setTimeout(() => firstLinkRef.current?.focus(), 80);
      return () => clearTimeout(t);
    }
  }, [open]);

  // Close menu on Escape key
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const handleLogout = async () => {
    await logout();
    onClose();
  };

  const linkCls =
    'flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-[var(--radius-md)] ' +
    'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] ' +
    'hover:bg-gray-50 transition-colors duration-150 ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-secondary)]';

  const activeLinkCls =
    'flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-[var(--radius-md)] ' +
    'text-[var(--color-secondary)] bg-[var(--color-secondary-light)] ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-secondary)]';

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="mobile-menu"
          variants={menuVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="overflow-hidden"
          aria-label="Mobile navigation"
          role="dialog"
          aria-modal="true"
          id="mobile-menu"
        >
          <div className="border-t border-[var(--color-border)] bg-white px-4 pb-6 pt-3">
            {authenticated ? (
              <>
                {/* Nav links */}
                <ul className="flex flex-col gap-0.5 mb-5" role="list">
                  {NAV_ITEMS.map(({ label, to }, i) => (
                    <motion.li
                      key={label}
                      custom={i}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <NavLink
                        to={to}
                        end
                        ref={i === 0 ? firstLinkRef : undefined}
                        onClick={onClose}
                        className={({ isActive }) =>
                          isActive ? activeLinkCls : linkCls
                        }
                      >
                        {label}
                      </NavLink>
                    </motion.li>
                  ))}
                </ul>

                <div className="h-px bg-[var(--color-border)] mb-5" />

                {/* User info & logout */}
                <motion.div
                  custom={NAV_ITEMS.length}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex flex-col gap-3"
                >
                  <div className="px-4 py-2 bg-gray-50 rounded-[var(--radius-md)]">
                    <p className="text-xs font-medium text-[var(--color-text-secondary)]">
                      Signed in as
                    </p>
                    <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                      {user?.name || 'User'}
                    </p>
                  </div>

                  <Button
                    variant="outline"
                    size="md"
                    fullWidth
                    leftIcon={<LogOut size={15} />}
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </motion.div>
              </>
            ) : (
              // Show sign in button for guests
              <motion.div
                custom={0}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                className="py-3"
              >
                <Link to="/login" onClick={onClose} tabIndex={-1}>
                  <Button variant="primary" size="md" fullWidth>
                    Sign In
                  </Button>
                </Link>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
