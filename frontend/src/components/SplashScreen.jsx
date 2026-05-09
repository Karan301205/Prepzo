import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LETTERS = ['P', 'r', 'e', 'p', 'z', 'o'];
const DELAY_PER_LETTER = 0.3;

export default function SplashScreen({ onComplete }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Total: letters animate in over ~1.9s, .ai at 1.9s,
    // tagline at 2.2s, fade out starts at 2.6s
    const timer = setTimeout(() => {
      setVisible(false);
      // Give fade-out animation time (0.5s) then call onComplete
      setTimeout(onComplete, 500);
    }, 2600);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: '#0A0A0F',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 0,
          }}
        >
          {/* Brand name letter-by-letter */}
          <div style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: 0,
            lineHeight: 1,
          }}>
            {LETTERS.map((letter, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: i * DELAY_PER_LETTER,
                  duration: 0.35,
                  ease: 'easeOut',
                }}
                style={{
                  fontFamily: "'Sora', sans-serif",
                  fontWeight: 700,
                  fontSize: 'clamp(52px, 10vw, 88px)',
                  color: '#F0F0FF',
                  letterSpacing: '-0.04em',
                  display: 'inline-block',
                }}
              >
                {letter}
              </motion.span>
            ))}

            {/* .ai — accent color, delayed after all letters */}
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: LETTERS.length * DELAY_PER_LETTER,
                duration: 0.4,
                ease: 'easeOut',
              }}
              style={{
                fontFamily: "'Sora', sans-serif",
                fontWeight: 700,
                fontSize: 'clamp(52px, 10vw, 88px)',
                color: '#6C63FF',
                letterSpacing: '-0.04em',
                display: 'inline-block',
                // Glow effect on .ai
                textShadow: '0 0 40px rgba(108,99,255,0.6), 0 0 80px rgba(108,99,255,0.3)',
              }}
            >
              .ai
            </motion.span>
          </div>

          {/* Tagline — appears after brand name */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: LETTERS.length * DELAY_PER_LETTER + 0.5,
              duration: 0.4,
              ease: 'easeOut',
            }}
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 'clamp(12px, 2vw, 15px)',
              color: 'rgba(240,240,255,0.4)',
              letterSpacing: '0.12em',
              marginTop: 16,
              textTransform: 'uppercase',
            }}
          >
            Ace your exam. Decoded.
          </motion.p>

          {/* Bottom loading bar */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 120 }}
            transition={{
              delay: 0.2,
              duration: 2.2,
              ease: 'easeInOut',
            }}
            style={{
              position: 'absolute',
              bottom: 60,
              height: 2,
              background: '#6C63FF',
              borderRadius: 2,
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
