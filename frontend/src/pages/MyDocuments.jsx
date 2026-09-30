import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { FileText, Fingerprint } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/layout/Navbar';
import Card from '../components/ui/Card';
import EmptyState from '../components/ui/EmptyState';
import api from '../services/api';

const MyDocuments = () => {
  const { authenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !authenticated) {
      navigate('/login');
      return;
    }

    if (authenticated) {
      const fetchDocuments = async () => {
        try {
          const response = await api.get('/documents/me');
          setDocuments(response.data.documents || []);
        } catch (error) {
          console.error('Failed to fetch documents:', error);
          setDocuments([]);
        } finally {
          setFetching(false);
        }
      };

      fetchDocuments();
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

  if (!authenticated) {
    return null;
  }

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
        <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-12">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--color-secondary)] to-[#6366F1] flex items-center justify-center shadow-lg">
                <FileText size={24} className="text-white" strokeWidth={2} />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold text-[var(--color-text-primary)]">
                  My Documents
                </h1>
              </div>
            </div>
            <p className="text-sm text-[var(--color-text-secondary)]">
              View and manage the documents you have submitted for verification.
            </p>
          </motion.div>

          {/* Documents List or Empty State */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card>
              <Card.Body>
                {fetching ? (
                  <div className="text-center py-8 text-sm text-[var(--color-text-secondary)]">
                    Loading your documents...
                  </div>
                ) : documents.length === 0 ? (
                  <EmptyState
                    icon={<FileText size={28} />}
                    title="You haven't submitted any documents yet."
                    description="Start your identity verification journey by uploading a document."
                    size="lg"
                  />
                ) : (
                  <div className="space-y-4">
                    {documents.map((doc) => (
                      <div key={doc.id} className="p-4 border border-[var(--color-border)] rounded-lg flex items-center justify-between gap-4">
                        <div>
                          <p className="font-semibold text-[var(--color-text-primary)] capitalize">{doc.documentType}</p>
                          <p className="text-sm text-[var(--color-text-secondary)]">{doc.originalFileName}</p>
                        </div>
                        <span className="px-2 py-1 text-xs rounded-full bg-[var(--color-secondary-soft)] text-[var(--color-secondary)] uppercase tracking-wide">
                          {doc.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </Card.Body>
              {documents.length === 0 && (
                <Card.Footer>
                  <Link to="/verify">
                    <button className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-secondary)] text-white font-medium text-sm rounded-lg hover:bg-[var(--color-secondary-hover)] transition-colors">
                      <Fingerprint size={16} />
                      <span>Verify Your Identity</span>
                    </button>
                  </Link>
                </Card.Footer>
              )}
            </Card>
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

export default MyDocuments;
