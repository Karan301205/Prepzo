import { useLocation, Link } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();

  const navLinks = [
    { path: '/input', label: 'Input' },
    { path: '/result', label: 'Result' },
    { path: '/chat', label: 'Chat' },
    { path: '/analytics', label: 'Analytics' },
  ];

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 56,
        background: 'rgba(245, 245, 245, 0.85)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid #E0E0E8',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
      }}
    >
      <Link to="/input" style={{ textDecoration: 'none' }}>
        <span
          style={{
            fontFamily: "'Sora', sans-serif",
            fontWeight: 700,
            fontSize: 18,
            color: '#0A0A0F',
            letterSpacing: '-0.03em',
          }}
        >
          Prepzo<span style={{ color: '#6C63FF' }}>.ai</span>
        </span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            style={{
              fontFamily: "'Sora', sans-serif",
              fontSize: 14,
              color: location.pathname === link.path ? '#0A0A0F' : '#6B6B80',
              textDecoration: 'none',
              letterSpacing: '-0.01em',
              transition: 'color 0.2s ease',
              fontWeight: location.pathname === link.path ? 500 : 400,
            }}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
