import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { GitBranch, ExternalLink, Mail, ArrowUp, ShieldCheck } from 'lucide-react';
import { FOOTER_META, SOCIAL_LINKS, TRUST_BADGES } from '../../../data/footerData';

const ICON_MAP = { GitBranch, ExternalLink, Mail };

const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

const legalLinkCls =
  'text-[10px] text-slate-600 hover:text-slate-400 transition-colors duration-150 ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-secondary)] ' +
  'rounded-[var(--radius-sm)]';

const FooterBottom = () => (
  <div className="flex flex-col gap-5 pt-8 border-t border-white/10">

    {/* ── Trust badges ────────────────────────────── */}
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="flex flex-wrap items-center justify-center gap-2"
    >
      {TRUST_BADGES.map(({ label }) => (
        <span
          key={label}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[var(--radius-full)] border border-white/10 bg-white/5 text-[10px] font-semibold text-slate-400"
        >
          <ShieldCheck size={9} className="text-[var(--color-success)]" />
          {label}
        </span>
      ))}
    </motion.div>

    {/* ── Main row ─────────────────────────────────── */}
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

      {/* Left — copyright + built-for line + legal links */}
      <div className="flex flex-col items-center sm:items-start gap-1">
        <p className="text-xs text-slate-500">{FOOTER_META.copyright}</p>
        <p className="text-[10px] text-slate-600">
          Built for Secure Digital Identity Verification · {FOOTER_META.madeWith}
        </p>
        {/* Legal links */}
        <div className="flex items-center gap-3 mt-0.5">
          <Link to="/privacy" className={legalLinkCls}>
            Privacy Policy
          </Link>
          <span className="text-slate-700 text-[10px]">·</span>
          <Link to="/terms" className={legalLinkCls}>
            Terms &amp; Conditions
          </Link>
        </div>
      </div>

      {/* Centre — version + MOSIP badge */}
      <div className="flex items-center gap-3">
        <span className="text-[10px] font-mono text-slate-600">{FOOTER_META.version}</span>
        <span className="h-3 w-px bg-white/10" />
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[var(--radius-full)] bg-white/5 border border-white/10 text-[10px] font-medium text-slate-400">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)] animate-pulse" />
          {FOOTER_META.tagline}
        </span>
      </div>

      {/* Right — social icons + back to top */}
      <div className="flex items-center gap-3">
        {SOCIAL_LINKS.map(({ label, icon, href, external }) => {
          const Icon = ICON_MAP[icon] ?? Mail;
          return (
            <motion.a
              key={label}
              href={href}
              target={external ? '_blank' : undefined}
              rel={external ? 'noopener noreferrer' : undefined}
              aria-label={label}
              whileHover={{ scale: 1.15, y: -2 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 400, damping: 14 }}
              className="w-8 h-8 rounded-[var(--radius-md)] flex items-center justify-center bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:border-white/20 hover:bg-white/10 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-secondary)]"
            >
              <Icon size={14} />
            </motion.a>
          );
        })}

        <span className="h-4 w-px bg-white/10" />

        {/* Back to top */}
        <motion.button
          type="button"
          onClick={scrollToTop}
          aria-label="Back to top"
          whileHover={{ scale: 1.12, y: -2 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 400, damping: 14 }}
          className="w-8 h-8 rounded-[var(--radius-md)] flex items-center justify-center bg-[var(--color-secondary)] text-white hover:bg-[var(--color-secondary-hover)] transition-colors duration-150 shadow-[var(--shadow-sm)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-secondary)]"
        >
          <ArrowUp size={14} strokeWidth={2.5} />
        </motion.button>
      </div>
    </div>
  </div>
);

export default FooterBottom;
