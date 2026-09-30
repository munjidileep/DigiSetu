import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import {
  ShieldCheck, CheckCircle2, FileText, History, 
  ArrowRight, Fingerprint, AlertCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/layout/Navbar';
import Card from '../components/ui/Card';

const Dashboard = () => {
  const { user, authenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !authenticated) {
      navigate('/login');
    }
  }, [authenticated, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-bg)' }}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[var(--color-secondary)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-[var(--color-text-secondary)]">Loading...</p>
        </div>
      </div>
    );
  }

  if (!authenticated || !user) {
    return null;
  }

  const navigationCards = [
    {
      icon: Fingerprint,
      title: 'Verify Identity',
      description: 'Start or continue your identity verification.',
      link: '/verify',
      color: '#2563EB',
      bg: '#EFF6FF',
    },
    {
      icon: FileText,
      title: 'My Documents',
      description: 'View the documents you have submitted.',
      link: '/documents',
      color: '#10B981',
      bg: '#ECFDF5',
    },
    {
      icon: History,
      title: 'Verification History',
      description: 'View your previous verification attempts.',
      link: '/verification-history',
      color: '#6366F1',
      bg: 'rgba(99,102,241,0.08)',
    },
  ];

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
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px]"
          style={{ background: 'radial-gradient(ellipse 70% 55% at 50% 0%, rgba(16,185,129,0.07) 0%, transparent 70%)' }}
        />
      </div>

      {/* Main */}
      <main className="relative z-10 flex-1 pt-[72px]">
        <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-12">
          {/* Welcome Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-10"
          >
            <h1 className="text-3xl font-extrabold text-[var(--color-text-primary)] tracking-tight mb-2">
              Welcome to DigiSetu
            </h1>
            <p className="text-base text-[var(--color-text-secondary)]">
              Your identity verification journey starts here.
            </p>
          </motion.div>

          {/* Authentication Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-6"
          >
            <Card>
              <Card.Body>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
                    <CheckCircle2 size={24} className="text-green-600" strokeWidth={2} />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-1">
                      Authentication
                    </h2>
                    <p className="text-sm text-[var(--color-text-secondary)] mb-2">
                      ✓ Successfully authenticated with eSignet
                    </p>
                    <p className="text-xs text-[var(--color-text-disabled)]">
                      Signed in as <strong>{user.name}</strong>
                    </p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </motion.div>

          {/* Identity Verification Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mb-10"
          >
            <Card>
              <Card.Body>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                    <AlertCircle size={24} className="text-amber-600" strokeWidth={2} />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-1">
                      Identity Verification
                    </h2>
                    <p className="text-sm text-[var(--color-text-secondary)] mb-4">
                      Not started
                    </p>
                    <Link to="/verify">
                      <button className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-secondary)] text-white font-medium text-sm rounded-lg hover:bg-[var(--color-secondary-hover)] transition-colors">
                        <Fingerprint size={16} />
                        <span>Start Verification</span>
                        <ArrowRight size={16} />
                      </button>
                    </Link>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </motion.div>

          {/* Navigation Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--color-text-disabled)] mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {navigationCards.map(({ icon: Icon, title, description, link, color, bg }, index) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.25 + index * 0.05 }}
                >
                  <Link to={link}>
                    <Card variant="hover" className="h-full">
                      <Card.Body>
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                          style={{ backgroundColor: bg }}
                        >
                          <Icon size={24} style={{ color }} strokeWidth={2} />
                        </div>
                        <h3 className="text-base font-semibold text-[var(--color-text-primary)] mb-2">
                          {title}
                        </h3>
                        <p className="text-sm text-[var(--color-text-secondary)]">
                          {description}
                        </p>
                      </Card.Body>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[var(--color-border)] shrink-0">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 text-center">
          <p className="text-xs text-[var(--color-text-disabled)]">
            © {new Date().getFullYear()} DigiSetu · Powered by MOSIP
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
