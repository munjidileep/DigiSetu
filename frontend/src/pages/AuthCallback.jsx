import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/layout/Navbar';

// OAuth callback handler - completes authentication flow
const AuthCallback = () => {
  const navigate = useNavigate();
  const { checkAuth } = useAuth();

  useEffect(() => {
    const verifyAuth = async () => {
      await new Promise(resolve => setTimeout(resolve, 500)); // Wait for session establishment
      await checkAuth(); // Verify authentication
      navigate('/home', { replace: true }); // Redirect to home
    };

    verifyAuth();
  }, [checkAuth, navigate]);

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
          style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 0%, rgba(16,185,129,0.09) 0%, transparent 70%)' }}
        />
      </div>

      {/* Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center pt-[72px]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-center"
        >
          <div className="relative inline-block mb-6">
            {/* Pulse rings */}
            {[1, 2, 3].map((n) => (
              <motion.div
                key={n}
                className="absolute rounded-full border-2 border-[var(--color-success)]"
                animate={{ 
                  scale: [1, 1.3 + n * 0.2], 
                  opacity: [0.6, 0] 
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  delay: n * 0.3,
                  ease: 'easeOut'
                }}
                style={{ 
                  width: 64 + n * 16, 
                  height: 64 + n * 16, 
                  inset: -(n * 8 + 4) 
                }}
              />
            ))}
            
            <div
              className="relative z-10 w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl"
              style={{ background: 'linear-gradient(135deg, var(--color-success) 0%, #059669 100%)' }}
            >
              <ShieldCheck size={32} className="text-white" strokeWidth={2} />
            </div>
          </div>

          <h2 className="text-2xl font-extrabold text-[var(--color-text-primary)] mb-2">
            Authenticating...
          </h2>
          <p className="text-sm text-[var(--color-text-secondary)] mb-6">
            Verifying your identity
          </p>

          <div className="flex items-center justify-center gap-2">
            <Loader2 size={16} className="text-[var(--color-secondary)] animate-spin" />
            <span className="text-xs text-[var(--color-text-disabled)]">
              Please wait
            </span>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default AuthCallback;
