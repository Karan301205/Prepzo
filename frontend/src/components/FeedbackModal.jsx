// src/components/FeedbackModal.jsx
// REPLACES both FeedbackSection.jsx and old FeedbackModal.jsx
// Single popup modal — triggered by "Rate this plan" button
// Stores directly in Supabase feedback table

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@clerk/react';
import { submitFeedback } from '../services/supabase';

const C = {
  bg: '#F5F5F5',
  surface: '#FFFFFF',
  accent: '#6C63FF',
  accentSoft: '#EEEDFF',
  border: '#E0E0E8',
  text: '#0A0A0F',
  muted: '#6B6B80',
};
const fontD = "'Sora', sans-serif";
const fontM = "'DM Mono', monospace";

const EMOJIS =  ['😞', '😕', '😐', '😊', '🤩'];
const LABELS =  ['Poor', 'Below avg', 'Okay', 'Good', 'Excellent'];

export default function FeedbackModal({
  isOpen,
  onClose,
  context = 'result',
  planMode = null,
  subject = null,
}) {
  const { user } = useUser();
  const [rating, setRating]         = useState(null);   // 0–4 index
  const [hovered, setHovered]       = useState(null);
  const [comment, setComment]       = useState('');
  const [loading, setLoading]       = useState(false);
  const [submitted, setSubmitted]   = useState(false);
  const [error, setError]           = useState('');

  const displayRating = hovered !== null ? hovered : rating;

  async function handleSubmit() {
    if (rating === null) { setError('Please select a rating.'); return; }
    setLoading(true);
    setError('');

    const result = await submitFeedback({
      clerkUserId: user?.id || null,
      userEmail:   user?.primaryEmailAddress?.emailAddress || null,
      rating:      rating + 1,   // convert 0-based index to 1–5
      comment:     comment,
      context,
      planMode,
      subject,
    });

    setLoading(false);
    if (result.success) {
      setSubmitted(true);
      setTimeout(() => {
        onClose();
        // reset after close
        setTimeout(() => { setSubmitted(false); setRating(null); setComment(''); }, 300);
      }, 2000);
    } else {
      setError('Could not save. Please try again.');
    }
  }

  function handleClose() {
    onClose();
    setTimeout(() => { setSubmitted(false); setRating(null); setComment(''); setError(''); }, 300);
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="fb-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            style={{
              position: 'fixed', inset: 0, zIndex: 2000,
              background: 'rgba(10,10,15,0.55)',
              backdropFilter: 'blur(6px)',
            }}
          />

          {/* Modal card */}
          <motion.div
            key="fb-modal"
            initial={{ opacity: 0, scale: 0.93, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 20 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            style={{
              position: 'fixed',
              top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 2001,
              background: C.surface,
              border: `1.5px solid ${C.border}`,
              borderRadius: 24,
              padding: '36px 32px',
              width: '92%',
              maxWidth: 420,
              boxShadow: '0 32px 80px rgba(0,0,0,0.2)',
              boxSizing: 'border-box',
            }}
          >
            {submitted ? (
              /* ── Success state ── */
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: 52, marginBottom: 16 }}>🎉</div>
                <h3 style={{
                  fontFamily: fontD, fontWeight: 700, fontSize: 22,
                  color: C.text, letterSpacing: '-0.02em', marginBottom: 8,
                }}>
                  Thank you!
                </h3>
                <p style={{ fontFamily: fontD, fontSize: 14, color: C.muted }}>
                  Your feedback helps us improve Prepzo.
                </p>
              </div>
            ) : (
              /* ── Form state ── */
              <>
                {/* Header row */}
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'flex-start', marginBottom: 24,
                }}>
                  <div>
                    <h3 style={{
                      fontFamily: fontD, fontWeight: 700, fontSize: 20,
                      color: C.text, letterSpacing: '-0.02em', marginBottom: 4,
                    }}>
                      How was your experience?
                    </h3>
                    <p style={{ fontFamily: fontD, fontSize: 13, color: C.muted }}>
                      {context === 'result' ? 'Rate your study plan'
                        : context === 'chat' ? 'Rate the AI chat'
                        : 'Rate Prepzo overall'}
                    </p>
                  </div>
                  <button
                    onClick={handleClose}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: C.muted, fontSize: 22, lineHeight: 1, padding: 4,
                      flexShrink: 0,
                    }}
                  >
                    ×
                  </button>
                </div>

                {/* Emoji rating row */}
                <div style={{ marginBottom: 24 }}>
                  <p style={{
                    fontFamily: fontM, fontSize: 11, color: C.muted,
                    letterSpacing: '0.08em', marginBottom: 14, textTransform: 'uppercase',
                  }}>
                    Your Rating
                  </p>
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                    {EMOJIS.map((emoji, i) => (
                      <button
                        key={i}
                        onClick={() => setRating(i)}
                        onMouseEnter={() => setHovered(i)}
                        onMouseLeave={() => setHovered(null)}
                        style={{
                          width: 52, height: 52, borderRadius: 14,
                          border: `1.5px solid ${rating === i ? C.accent : C.border}`,
                          background: rating === i ? C.accentSoft : C.bg,
                          fontSize: 24, cursor: 'pointer',
                          transition: 'all 0.15s',
                          transform: displayRating === i ? 'scale(1.18)' : 'scale(1)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                  <p style={{
                    fontFamily: fontD, fontSize: 13, color: C.accent,
                    textAlign: 'center', marginTop: 10, minHeight: 20,
                    transition: 'opacity 0.15s',
                    opacity: displayRating !== null ? 1 : 0,
                  }}>
                    {displayRating !== null ? LABELS[displayRating] : ''}
                  </p>
                </div>

                {/* Comment textarea */}
                <div style={{ marginBottom: 20 }}>
                  <p style={{
                    fontFamily: fontM, fontSize: 11, color: C.muted,
                    letterSpacing: '0.08em', marginBottom: 8, textTransform: 'uppercase',
                  }}>
                    Comments (Optional)
                  </p>
                  <textarea
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    placeholder="What could be better? What did you love?"
                    maxLength={500}
                    rows={3}
                    style={{
                      width: '100%', boxSizing: 'border-box',
                      fontFamily: fontD, fontSize: 14, color: C.text,
                      background: C.bg,
                      border: `1.5px solid ${C.border}`,
                      borderRadius: 12, padding: '12px 14px',
                      resize: 'none', outline: 'none',
                      transition: 'border-color 0.2s',
                    }}
                    onFocus={e => e.target.style.borderColor = C.accent}
                    onBlur={e => e.target.style.borderColor = C.border}
                  />
                  <p style={{
                    fontFamily: fontM, fontSize: 11, color: C.muted,
                    textAlign: 'right', marginTop: 4,
                  }}>
                    {comment.length}/500
                  </p>
                </div>

                {/* Error */}
                {error && (
                  <p style={{
                    fontFamily: fontD, fontSize: 13, color: '#E8341C',
                    marginBottom: 12,
                  }}>
                    {error}
                  </p>
                )}

                {/* Submit button */}
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  style={{
                    width: '100%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: loading ? '#9995CC' : C.accent,
                    color: '#FFFFFF',
                    fontFamily: fontD, fontWeight: 600, fontSize: 15,
                    border: 'none', borderRadius: 12,
                    padding: '14px 0',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'background 0.2s',
                  }}
                >
                  {loading ? 'Saving...' : 'Submit Feedback'}
                </button>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}