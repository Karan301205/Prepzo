import { motion } from 'framer-motion';

export default function ChatBubble({ message }) {
  const isUser = message.role === 'user';

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
        {message.content === '' && message.isTyping ? (
          <div style={{ display: 'flex', alignItems: 'center', height: 24 }}>
            <span className="typing-dot" />
            <span className="typing-dot" />
            <span className="typing-dot" />
          </div>
        ) : (
          message.content
        )}
      </div>
    </motion.div>
  );
}
