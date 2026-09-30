import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { User, Mail, Phone, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/layout/Navbar';
import Card from '../components/ui/Card';

const Profile = () => {
  const { user, authenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !authenticated) {
      navigate('/login'); // Redirect unauthenticated users
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

  const profileFields = [
    { icon: User, label: 'Full Name', value: user.name || 'Not available', color: '#2563EB' },
    { icon: Mail, label: 'Email', value: user.email || 'Not available', color: '#10B981' },
    { icon: Phone, label: 'Phone Number', value: user.phone_number || 'Not available', color: '#6366F1' },
    { icon: Calendar, label: 'Authentication Provider', value: 'eSignet (MOSIP)', color: '#0EA5E9' },
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
      </div>

      {/* Main */}
      <main className="relative z-10 flex-1 pt-[72px]">
        <div className="max-w-2xl mx-auto w-full px-4 sm:px-6 py-12">
          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--color-secondary)] to-[#6366F1] flex items-center justify-center shadow-lg">
                <User size={24} className="text-white" strokeWidth={2} />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold text-[var(--color-text-primary)]">
                  Profile
                </h1>
              </div>
            </div>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Your information from eSignet authentication.
            </p>
          </motion.div>

          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card>
              <Card.Body>
                <div className="space-y-4">
                  {profileFields.map(({ icon: Icon, label, value, color }) => (
                    <div key={label} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${color}15` }}
                      >
                        <Icon size={18} style={{ color }} strokeWidth={2} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-[var(--color-text-disabled)] mb-0.5">
                          {label}
                        </p>
                        <p className="text-sm font-semibold text-[var(--color-text-primary)] break-words">
                          {value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </motion.div>

          {/* Info Note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg"
          >
            <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
              <strong className="font-semibold">Note:</strong> Your profile information is securely retrieved from eSignet during authentication. DigiSetu does not store your personal data.
            </p>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[var(--color-border)] shrink-0 mt-auto">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 text-center">
          <p className="text-xs text-[var(--color-text-disabled)]">
            © {new Date().getFullYear()} DigiSetu · Powered by MOSIP
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Profile;
