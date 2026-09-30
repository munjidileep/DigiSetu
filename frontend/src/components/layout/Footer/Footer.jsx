import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import FooterLinks  from './FooterLinks';
import FooterBottom from './FooterBottom';
import { FOOTER_META } from '../../../data/footerData';

const Footer = () => (
  <motion.footer
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
    aria-label="Site footer"
    className="relative overflow-hidden"
    style={{ backgroundColor: 'var(--color-primary)' }}
  >
    {/* ── Subtle background texture ────────────────── */}
    <div aria-hidden="true" className="absolute inset-0 pointer-events-none select-none overflow-hidden">
      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />
      {/* Top glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px]"
        style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 0%, rgba(37,99,235,0.15) 0%, transparent 70%)' }}
      />
    </div>

    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 flex flex-col gap-12">

      {/* ── Brand + tagline ──────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">

        {/* Logo */}
        <Link
          to="/"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-2.5 select-none group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-secondary)] rounded-[var(--radius-sm)]"
          aria-label="IdentityGuard AI — Home"
        >
          <motion.div
            whileHover={{ scale: 1.08, rotate: -4 }}
            transition={{ type: 'spring', stiffness: 400, damping: 18 }}
            className="w-9 h-9 rounded-[var(--radius-md)] bg-[var(--color-secondary)] flex items-center justify-center shrink-0"
          >
            <ShieldCheck size={20} className="text-white" strokeWidth={2.2} />
          </motion.div>

          <div className="flex flex-col leading-none">
            <span className="text-[15px] font-bold text-white tracking-tight">
              {FOOTER_META.brandName.replace(' AI', '')}
              <span className="text-[var(--color-secondary)]"> AI</span>
            </span>
            <span className="text-[9px] font-medium tracking-widest uppercase text-slate-500 mt-[2px]">
              {FOOTER_META.tagline}
            </span>
          </div>
        </Link>

        {/* Short elevator pitch */}
        <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
          Enterprise AI-powered identity verification. Built on MOSIP.
          Trusted by banks, insurers and government departments.
        </p>
      </div>

      {/* ── Nav columns ─────────────────────────────── */}
      <FooterLinks />

      {/* ── Bottom bar ──────────────────────────────── */}
      <FooterBottom />
    </div>
  </motion.footer>
);

export default Footer;
