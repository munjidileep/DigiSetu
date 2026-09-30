import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, FileSearch, ShieldAlert, XCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/layout/Navbar';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import api from '../services/api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const ReviewerQueue = () => {
  const { authenticated, loading, user } = useAuth();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);
  const [decision, setDecision] = useState('APPROVE');
  const [reviewComment, setReviewComment] = useState('');
  const [fetching, setFetching] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const loadQueue = async () => {
    setFetching(true);
    try {
      const response = await api.get('/reviews/queue');
      setReviews(response.data.reviews || []);
      setError(null);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to load the reviewer queue.');
    } finally {
      setFetching(false);
    }
  };

  const openReview = async (id) => {
    try {
      const response = await api.get(`/reviews/${id}`);
      setSelectedReview(response.data.review);
      setMessage(null);
      setError(null);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to load review details.');
    }
  };

  useEffect(() => {
    if (!loading && !authenticated) {
      navigate('/login');
      return;
    }
    if (authenticated && user?.role === 'reviewer') loadQueue();
  }, [authenticated, loading, navigate, user?.role]);

  const submitDecision = async () => {
    if (!selectedReview) return;
    setSaving(true);
    try {
      const response = await api.post(`/reviews/${selectedReview.id}/decision`, {
        decision,
        reviewComment
      });
      setMessage(response.data.message);
      setSelectedReview(null);
      setReviewComment('');
      await loadQueue();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to save the review decision.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!authenticated) return null;
  if (user?.role !== 'reviewer') return <div className="min-h-screen flex items-center justify-center">Reviewer access required.</div>;

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-28 pb-12">
        <div className="mb-8">
          <p className="text-sm font-semibold text-[var(--color-secondary)]">Verification Reviewer</p>
          <h1 className="text-3xl font-extrabold text-[var(--color-text-primary)]">Review queue</h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-2">Inspect automated evidence before making a final verification decision.</p>
        </div>

        {error && <div className="mb-6"><Alert variant="error" description={error} dismissible onDismiss={() => setError(null)} /></div>}
        {message && <div className="mb-6"><Alert variant="success" description={message} dismissible onDismiss={() => setMessage(null)} /></div>}

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
          <Card>
            <Card.Body>
              <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">Pending reviews</h2>
              {fetching ? <p className="text-sm text-[var(--color-text-secondary)]">Loading queue...</p> : reviews.length === 0 ? (
                <p className="text-sm text-[var(--color-text-secondary)]">No verification requests are awaiting review.</p>
              ) : (
                <div className="space-y-3">
                  {reviews.map((review) => (
                    <button key={review.id} onClick={() => openReview(review.id)} className="w-full text-left border border-[var(--color-border)] rounded-lg p-4 hover:border-[var(--color-secondary)] transition-colors">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-[var(--color-text-primary)] capitalize">{review.documentType}</p>
                          <p className="text-xs text-[var(--color-text-secondary)]">{new Date(review.submittedAt).toLocaleString()}</p>
                        </div>
                        <span className="text-xs rounded-full bg-amber-100 text-amber-800 px-2 py-1">Under Review</span>
                      </div>
                      <p className="text-sm text-[var(--color-text-secondary)] mt-3">{review.reason}</p>
                      <p className="text-xs text-[var(--color-text-disabled)] mt-2">Name: {review.extractedName || 'Not detected'} · DOB: {review.extractedDateOfBirth || 'Not detected'}</p>
                    </button>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>

          <Card>
            <Card.Body>
              {!selectedReview ? (
                <div className="py-16 text-center text-[var(--color-text-secondary)]">
                  <FileSearch size={36} className="mx-auto mb-3" />
                  <p className="text-sm">Select a review to inspect its evidence.</p>
                </div>
              ) : (
                <div>
                  <div className="flex items-start justify-between gap-4 mb-5">
                    <div>
                      <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">Review details</h2>
                      <p className="text-sm text-[var(--color-text-secondary)] capitalize">{selectedReview.documentType} · {selectedReview.originalFileName}</p>
                    </div>
                    <ShieldAlert size={24} className="text-amber-600" />
                  </div>

                  <iframe title="Authenticated document preview" src={`${API_BASE_URL}/reviews/${selectedReview.id}/document`} className="w-full h-64 border border-[var(--color-border)] rounded-lg mb-5" />

                  <div className="grid gap-3 sm:grid-cols-2 text-sm">
                    <p><strong>Name:</strong> {selectedReview.extractedFields.name || 'Not detected'}</p>
                    <p><strong>Date of birth:</strong> {selectedReview.extractedFields.dateOfBirth || 'Not detected'}</p>
                    <p><strong>Document number:</strong> {selectedReview.extractedFields.documentNumber || 'Not detected'}</p>
                    <p><strong>Type match:</strong> {selectedReview.documentTypeMatch ? 'Passed' : 'Requires review'}</p>
                    <p><strong>Identity:</strong> {selectedReview.identityConsistency}</p>
                    <p><strong>Tamper:</strong> {selectedReview.tamperStatus}</p>
                  </div>

                  <div className="mt-5">
                    <p className="text-sm font-semibold text-[var(--color-text-primary)]">Automated review reason</p>
                    <p className="text-sm text-[var(--color-text-secondary)] mt-1">{selectedReview.reason}</p>
                  </div>

                  <details className="mt-5 border border-[var(--color-border)] rounded-lg p-3">
                    <summary className="cursor-pointer text-sm font-semibold">View OCR and validation evidence</summary>
                    <pre className="mt-3 whitespace-pre-wrap text-xs text-[var(--color-text-secondary)]">{selectedReview.ocrText || 'No OCR text available.'}</pre>
                    <p className="text-xs mt-3">Field validation: {JSON.stringify(selectedReview.fieldValidation)}</p>
                    <p className="text-xs mt-2">Tamper indicators: {selectedReview.tamperIndicators.join(', ') || 'None reported'}</p>
                  </details>

                  <div className="mt-6 border-t border-[var(--color-border)] pt-5">
                    <label className="block text-sm font-semibold text-[var(--color-text-primary)] mb-2" htmlFor="review-decision">Decision</label>
                    <select id="review-decision" value={decision} onChange={(event) => setDecision(event.target.value)} className="w-full border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm">
                      <option value="APPROVE">Approve</option>
                      <option value="REJECT">Reject</option>
                      <option value="REQUEST_MORE_INFORMATION">Request more information</option>
                    </select>
                    <textarea value={reviewComment} onChange={(event) => setReviewComment(event.target.value)} placeholder="Review comment (optional)" className="w-full border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm mt-3 min-h-24" />
                    <div className="flex flex-wrap gap-3 mt-3">
                      <Button variant="primary" onClick={submitDecision} loading={saving} leftIcon={<CheckCircle2 size={15} />}>Save decision</Button>
                      <Button variant="outline" onClick={() => setSelectedReview(null)} disabled={saving} leftIcon={<XCircle size={15} />}>Close</Button>
                    </div>
                  </div>
                </div>
              )}
            </Card.Body>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ReviewerQueue;
