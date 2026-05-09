import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@clerk/react';
import { supabase } from '../services/supabase';

const C = {
  bg: '#F5F5F5', surface: '#FFFFFF', dark: '#1A1626',
  accent: '#6C63FF', accentSoft: '#EEEDFF',
  border: '#E0E0E8', text: '#0A0A0F', muted: '#6B6B80',
};
const fontD = "'Sora', sans-serif";
const fontM = "'DM Mono', monospace";

const RATING_EMOJIS = ['😞', '😕', '😐', '😊', '🤩'];
const RATING_LABELS = ['Poor', 'Below avg', 'Okay', 'Good', 'Excellent'];

export default function FeedbackModal({ isOpen, onClose, context = 'general', planMode = null, subject = null }) {
  const { user } = useUser();
  const [rating, setRating] = useState(null);
  const [hoveredRating, setHoveredRating] = useState(null);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit() {
    if (rating === null) { setError('Please select a rating.'); return; }
    setLoading(true);
    setError('');

    const { error: sbError } = await supabase
      .from('feedback')
      .insert({
        clerk_user_id: user?.id || null,
        user_email: user?.primaryEmailAddress?.emailAddress || null,
        rating: rating + 1,           // store as 1–5
        comment: comment.trim() || null,
        context,                       // 'result' | 'chat' | 'general'
        plan_mode: planMode,           // 'survival' | 'balanced' | 'full' | null
        subject: subject || null,
      });

    setLoading(false);
    if (sbError) {
      setError('Failed to save. Please try again.');
      console.error('Feedback error:', sbError.message);
    } else {
      setSubmitted(true);
      setTimeout(() => { onClose(); setSubmitted(false); setRating(null); setComment(''); }, 2000);
    }
  }

  const displayRating = hoveredRating !== null ? hoveredRating : rating;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed', inset: 0, zIndex: 1000,
              background: 'rgba(10,10,15,0.5)',
              backdropFilter: 'blur(4px)',
            }}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            style={{
              position: 'fixed',
              top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 1001,
              background: C.surface,
              border: `1.5px solid ${C.border}`,
              borderRadius: 24,
              padding: '36px 32px',
              width: '90%',
              maxWidth: 440,
              boxShadow: '0 24px 80px rgba(0,0,0,0.18)',
            }}
          >
            {submitted ? (
              /* Success state */
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
                <h3 style={{ fontFamily: fontD, fontWeight: 700, fontSize: 22, color: C.text, letterSpacing: '-0.02em', marginBottom: 8 }}>
                  Thank you!
                </h3>
                <p style={{ fontFamily: fontD, fontSize: 14, color: C.muted }}>
                  Your feedback helps us improve Prepzo.
                </p>
              </div>
            ) : (
              <>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                  <div>
                    <h3 style={{ fontFamily: fontD, fontWeight: 700, fontSize: 20, color: C.text, letterSpacing: '-0.02em', marginBottom: 4 }}>
                      How was your experience?
                    </h3>
                    <p style={{ fontFamily: fontD, fontSize: 13, color: C.muted }}>
                      {context === 'result' ? 'Rate your study plan' : context === 'chat' ? 'Rate the AI chat' : 'Rate Prepzo overall'}
                    </p>
                  </div>
                  <button onClick={onClose} style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: C.muted, fontSize: 20, lineHeight: 1, padding: 4,
                  }}>×</button>
                </div>

                {/* Emoji rating */}
                <div style={{ marginBottom: 24 }}>
                  <p style={{ fontFamily: fontM, fontSize: 11, color: C.muted, letterSpacing: '0.08em', marginBottom: 12 }}>
                    YOUR RATING
                  </p>
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                    {RATING_EMOJIS.map((emoji, i) => (
                      <button
                        key={i}
                        onClick={() => setRating(i)}
                        onMouseEnter={() => setHoveredRating(i)}
                        onMouseLeave={() => setHoveredRating(null)}
                        style={{
                          width: 52, height: 52,
                          borderRadius: 14,
                          border: `1.5px solid ${rating === i ? C.accent : C.border}`,
                          background: rating === i ? C.accentSoft : C.bg,
                          fontSize: 24,
                          cursor: 'pointer',
                          transition: 'all 0.15s',
                          transform: displayRating === i ? 'scale(1.15)' : 'scale(1)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                  {displayRating !== null && (
                    <p style={{
                      fontFamily: fontD, fontSize: 13, color: C.accent,
                      textAlign: 'center', marginTop: 8,
                      transition: 'opacity 0.15s',
                    }}>
                      {RATING_LABELS[displayRating]}
                    </p>
                  )}
                </div>

                {/* Comment */}
                <div style={{ marginBottom: 20 }}>
                  <p style={{ fontFamily: fontM, fontSize: 11, color: C.muted, letterSpacing: '0.08em', marginBottom: 8 }}>
                    COMMENTS (OPTIONAL)
                  </p>
                  <textarea
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    placeholder="What could be better? What did you love?"
                    maxLength={500}
                    rows={3}
                    style={{
                      width: '100%',
                      fontFamily: fontD, fontSize: 14, color: C.text,
                      background: C.bg,
                      border: `1.5px solid ${C.border}`,
                      borderRadius: 12, padding: '12px 14px',
                      resize: 'none', outline: 'none',
                      transition: 'border-color 0.2s',
                      boxSizing: 'border-box',
                    }}
                    onFocus={e => e.target.style.borderColor = C.accent}
                    onBlur={e => e.target.style.borderColor = C.border}
                  />
                  <p style={{ fontFamily: fontM, fontSize: 11, color: C.muted, textAlign: 'right', marginTop: 4 }}>
                    {comment.length}/500
                  </p>
                </div>

                {/* Error */}
                {error && (
                  <p style={{ fontFamily: fontD, fontSize: 13, color: '#E8341C', marginBottom: 12 }}>{error}</p>
                )}

                {/* Submit */}
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  style={{
                    width: '100%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    gap: 10,
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
