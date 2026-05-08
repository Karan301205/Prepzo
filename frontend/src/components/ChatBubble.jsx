import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

/**
 * Typewriter hook — reveals text character by character.
 * Only runs when `enabled` is true (for new messages only).
 */
function useTypewriter(text, enabled, speed = 18) {
  const [displayed, setDisplayed] = useState(enabled ? '' : text);
  const [isDone, setIsDone] = useState(!enabled);
  const indexRef = useRef(0);

  useEffect(() => {
    if (!enabled) {
      setDisplayed(text);
      setIsDone(true);
      return;
    }

    setDisplayed('');
    setIsDone(false);
    indexRef.current = 0;

    const interval = setInterval(() => {
      indexRef.current += 1;
      if (indexRef.current >= text.length) {
        setDisplayed(text);
        setIsDone(true);
        clearInterval(interval);
      } else {
        setDisplayed(text.slice(0, indexRef.current));
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, enabled, speed]);

  return { displayed, isDone };
}

export default function ChatBubble({ message }) {
  const isUser = message.role === 'user';
  const isNew = message.isNew === true; // only animate fresh responses

  if (isUser) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          alignSelf: 'flex-end',
          background: '#0A0A0F',
          color: '#F0F0FF',
          borderRadius: '18px 18px 4px 18px',
          padding: '12px 18px',
          maxWidth: '70%',
          fontFamily: "'Sora', sans-serif",
          fontSize: 14,
          lineHeight: 1.6,
          marginBottom: 16,
          whiteSpace: 'pre-wrap',
        }}
      >
        {message.content}
      </motion.div>
    );
  }

  // Typing indicator (3 dots)
  if (message.content === '' && message.isTyping) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ alignSelf: 'flex-start', maxWidth: '80%', marginBottom: 16 }}
      >
        <div
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 11,
            color: '#6B6B80',
            letterSpacing: '0.06em',
            marginBottom: 6,
            marginLeft: 4,
          }}
        >
          Prepzo
        </div>
        <div
          style={{
            background: '#FFFFFF',
            border: '1.5px solid #E0E0E8',
            borderRadius: '18px 18px 18px 4px',
            padding: '14px 18px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', height: 24 }}>
            <span className="typing-dot" />
            <span className="typing-dot" />
            <span className="typing-dot" />
          </div>
        </div>
      </motion.div>
    );
  }

  // Assistant message with typewriter
  const { displayed, isDone } = useTypewriter(message.content, isNew);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        alignSelf: 'flex-start',
        maxWidth: '80%',
        marginBottom: 16,
      }}
    >
      <div
        style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 11,
          color: '#6B6B80',
          letterSpacing: '0.06em',
          marginBottom: 6,
          marginLeft: 4,
        }}
      >
        Prepzo
      </div>
      <div
        style={{
          background: '#FFFFFF',
          border: '1.5px solid #E0E0E8',
          color: '#0A0A0F',
          borderRadius: '18px 18px 18px 4px',
          padding: '14px 18px',
          fontFamily: "'Sora', sans-serif",
          fontSize: 14,
          lineHeight: 1.7,
          whiteSpace: 'pre-wrap',
        }}
      >
        {displayed}
        {!isDone && (
          <span
            style={{
              display: 'inline-block',
              width: 2,
              height: 16,
              background: '#6C63FF',
              marginLeft: 2,
              verticalAlign: 'text-bottom',
              animation: 'cursorBlink 0.8s infinite',
            }}
          />
        )}
      </div>
    </motion.div>
  );
}
