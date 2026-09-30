import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, CheckCircle2, Lock, Eye, Fingerprint } from 'lucide-react';
import authService from '../services/authService';
import Navbar from '../components/layout/Navbar';

const TRUST_POINTS = [
  { icon: 'Lock', label: 'Bank-grade encryption', color: '#10B981' },
  { icon: 'Eye', label: 'Privacy protected', color: '#2563EB' },
  { icon: 'Fingerprint', label: 'Government verified', color: '#6366F1' },
];

const ICON_MAP = { Lock, Eye, Fingerprint };

const Login = () => {
  const handleESignetLogin = () => {
    authService.initiateESignetAuth();
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-bg)' }}>
      {/* Navbar */}
      <Navbar />

      {/* Background */}
      <div aria-hidden="true" className="fixed inset-0 pointer-events-none select-none overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.022]"
          style={{
            backgroundImage: 'radial-gradient(circle, #0F172A 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[520px]"
          style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 0%, rgba(37,99,235,0.09) 0%, transparent 70%)' }}
        />
      </div>

      {/* Main */}
      <main className="relative z-10 flex-1 flex items-center justify-center pt-[72px]">
        <div className="max-w-md mx-auto w-full px-4 sm:px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-8"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--color-secondary)] to-[#6366F1] flex items-center justify-center mx-auto mb-4 shadow-lg">
              <ShieldCheck size={32} className="text-white" strokeWidth={2} />
            </div>
            <h1 className="text-3xl font-extrabold text-[var(--color-text-primary)] tracking-tight mb-2">
              Verify your identity
            </h1>
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
              Secure identity verification powered by DigiSetu
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white rounded-2xl border border-[var(--color-border)] shadow-xl p-8"
          >
            <button
              onClick={handleESignetLogin}
              className="w-full py-4 px-6 bg-gradient-to-r from-[var(--color-secondary)] to-[#6366F1] text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
            >
              Continue with eSignet
            </button>

            <div className="mt-6 pt-6 border-t border-[var(--color-border)]">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-disabled)] mb-3">
                Secure & Trusted
              </p>
              <div className="space-y-2">
                {TRUST_POINTS.map(({ icon, label, color }) => {
                  const Icon = ICON_MAP[icon];
                  return (
                    <div key={label} className="flex items-center gap-2">
                      <CheckCircle2 size={14} style={{ color }} strokeWidth={2.5} />
                      <span className="text-sm text-[var(--color-text-secondary)]">{label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="relative z-10 border-t border-[var(--color-border)] shrink-0"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
          <p className="text-xs text-center text-[var(--color-text-disabled)]">
            © {new Date().getFullYear()} DigiSetu · Powered by MOSIP
          </p>
        </div>
      </motion.footer>
    </div>
  );
};

export default Login;
