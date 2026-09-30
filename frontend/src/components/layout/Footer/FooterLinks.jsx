import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck, KeyRound, Link as LinkIcon, BrainCircuit, ExternalLink,
} from 'lucide-react';
import { FOOTER_COLUMNS } from '../../../data/footerData';

/* ── Icon map for Powered By items ──────────────────────── */
const ICON_MAP = { ShieldCheck, KeyRound, Link: LinkIcon, BrainCircuit };

/* ── Smooth-scroll helper ────────────────────────────────── */
const scrollTo = (id) =>
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

/* ── Animation variants ──────────────────────────────────── */
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const colVariants = {
  hidden:  { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.42, ease: [0.16, 1, 0.3, 1] } },
};

/* ── Shared link class ───────────────────────────────────── */
const linkCls =
  'text-sm text-slate-400 hover:text-white transition-colors duration-150 ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-secondary)] ' +
  'rounded-[var(--radius-sm)]';

/* ── Tooltip ─────────────────────────────────────────────── */
const Tooltip = ({ text }) => (
  <AnimatePresence>
    <motion.div
      initial={{ opacity: 0, y: 4, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 4, scale: 0.96 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      role="tooltip"
      className={[
        'absolute left-full ml-2.5 top-1/2 -translate-y-1/2 z-50',
        'whitespace-nowrap px-2.5 py-1.5 rounded-[var(--radius-md)]',
        'bg-slate-700 border border-white/10 text-[10px] font-medium text-slate-200',
        'shadow-[var(--shadow-lg)] pointer-events-none',
      ].join(' ')}
    >
      {text}
      {/* Arrow pointing left */}
      <span
        className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-700"
        aria-hidden="true"
      />
    </motion.div>
  </AnimatePresence>
);

/* ── Powered-By item (icon + label + tooltip) ────────────── */
const PoweredByItem = ({ item }) => {
  const [hovered, setHovered] = useState(false);
  const Icon = ICON_MAP[item.icon] ?? ShieldCheck;
  const isExternal = item.type === 'external' && item.href;

  const inner = (
    <span className="flex items-center gap-2">
      <span
        className="w-5 h-5 rounded-[var(--radius-sm)] flex items-center justify-center shrink-0"
        style={{ backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        <Icon size={11} className="text-slate-400" />
      </span>
      <span className="text-sm text-slate-400 group-hover:text-white transition-colors duration-150">
        {item.label}
      </span>
      {isExternal && (
        <ExternalLink size={10} className="text-slate-600 group-hover:text-slate-400 transition-colors duration-150" />
      )}
    </span>
  );

  return (
    <li
      className="relative group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setHovered(true)}
      onBlurCapture={() => setHovered(false)}
    >
      {isExternal ? (
        <a
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${item.label} — opens in new tab`}
          className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-secondary)] rounded-[var(--radius-sm)]"
        >
          {inner}
        </a>
      ) : (
        <span aria-label={item.label}>{inner}</span>
      )}

      {/* Tooltip — renders to the right */}
      {hovered && item.tooltip && <Tooltip text={item.tooltip} />}
    </li>
  );
};

/* ── Single column ───────────────────────────────────────── */
const FooterColumn = ({ col }) => {
  const isPowered = col.type === 'powered';

  return (
    <motion.div variants={colVariants} className="flex flex-col gap-4">
      {/* Heading */}
      <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
        {col.heading}
      </p>

      <ul className="flex flex-col gap-2.5" role="list">
        {col.links.map((item) => {
          /* Powered By column — special rendering */
          if (isPowered) {
            return <PoweredByItem key={item.label} item={item} />;
          }

          const { label, href, type } = item;

          /* Hash — smooth scroll */
          if (type === 'hash') {
            return (
              <li key={label}>
                <a
                  href={href}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollTo(href.slice(1));
                  }}
                  className={linkCls}
                >
                  {label}
                </a>
              </li>
            );
          }

          /* External — new tab */
          if (type === 'external') {
            return (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${label} — opens in new tab`}
                  className={`${linkCls} inline-flex items-center gap-1.5`}
                >
                  {label}
                  <ExternalLink size={11} className="opacity-50" />
                </a>
              </li>
            );
          }

          /* Route — React Router Link */
          return (
            <li key={label}>
              <Link to={href} className={linkCls}>
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </motion.div>
  );
};

/* ── Grid ────────────────────────────────────────────────── */
const FooterLinks = () => (
  <motion.div
    variants={containerVariants}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: '-40px' }}
    className="grid grid-cols-2 sm:grid-cols-4 gap-8"
  >
    {FOOTER_COLUMNS.map((col) => (
      <FooterColumn key={col.heading} col={col} />
    ))}
  </motion.div>
);

export default FooterLinks;
