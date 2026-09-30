import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, User, LogOut } from 'lucide-react';

import Button from '../../ui/Button';
import Logo from './Logo';
import NavLinks from './NavLinks';
import MobileMenu from './MobileMenu';
import { useAuth } from '../../../context/AuthContext';

const SCROLL_THRESHOLD = 12; // Pixels to scroll before navbar fills in

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { authenticated, user, logout } = useAuth();

  // Track scroll position for navbar background
  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > SCROLL_THRESHOLD);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check initial scroll position
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Auto-close mobile menu on resize to desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const toggleMenu = () => setMenuOpen((v) => !v);
  const closeMenu = () => setMenuOpen(false);

  const handleLogout = async () => {
    await logout();
    closeMenu();
  };

  return (
    <motion.header
      role="banner"
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className={[
        'fixed top-0 inset-x-0 z-[var(--z-sticky)]',
        'transition-[background-color,box-shadow,backdrop-filter] duration-300 ease-in-out',
        scrolled
          ? 'bg-white/95 shadow-[var(--shadow-sm)] backdrop-blur-md'
          : 'bg-transparent',
      ].join(' ')}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px] gap-6">
          {/* Logo */}
          <Logo scrolled={scrolled} onClick={closeMenu} />

          {/* Desktop nav (authenticated only) */}
          {authenticated && (
            <div className="hidden md:flex flex-1 justify-center">
              <NavLinks scrolled={scrolled} onClose={closeMenu} />
            </div>
          )}

          {/* Desktop CTA buttons */}
          <div className="hidden md:flex items-center gap-2.5 shrink-0">
            {authenticated ? (
              <>
                <Link to="/profile">
                  <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={<User size={14} />}
                    className={
                      !scrolled
                        ? 'text-slate-600 hover:text-[var(--color-primary)] hover:bg-slate-100/70'
                        : ''
                    }
                  >
                    {user?.name || 'Profile'}
                  </Button>
                </Link>

                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<LogOut size={14} />}
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <Link to="/login">
                <Button
                  variant="primary"
                  size="sm"
                >
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile hamburger menu */}
          <div className="flex md:hidden">
            <motion.button
              type="button"
              aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={toggleMenu}
              whileTap={{ scale: 0.92 }}
              className={[
                'flex items-center justify-center w-9 h-9 rounded-[var(--radius-md)]',
                'transition-colors duration-150',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-secondary)]',
                scrolled
                  ? 'text-[var(--color-text-primary)] hover:bg-gray-100'
                  : 'text-[var(--color-primary)] hover:bg-slate-100/70',
              ].join(' ')}
            >
              <motion.span
                key={menuOpen ? 'close' : 'open'}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </motion.span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile drawer menu */}
      <MobileMenu open={menuOpen} onClose={closeMenu} />
    </motion.header>
  );
};

export default Navbar;
