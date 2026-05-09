import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuth, UserButton, SignInButton } from '@clerk/react';

function ArrowRightIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
      <path d="M3.33 8H12.67M12.67 8L8.67 4M12.67 8L8.67 12"
        stroke="#0A0A0F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isSignedIn, isLoaded } = useAuth();

  const isHomePage = location.pathname === '/';

  const navLinks = [
    { path: '/input',     label: 'Input' },
    { path: '/result',    label: 'Result' },
    { path: '/chat',      label: 'Chat' },
    { path: '/analytics', label: 'Analytics' },
  ];

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, height: 56,
      background: 'rgba(245,245,245,0.88)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid #E0E0E8',
      zIndex: 1000,
      display: 'flex', alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px',
    }}>
      {/* Logo — always links to home */}
      <Link to="/" style={{ textDecoration: 'none' }}>
        <span style={{
          fontFamily: "'Sora', sans-serif",
          fontWeight: 700, fontSize: 18,
          color: '#0A0A0F', letterSpacing: '-0.03em',
        }}>
          Prepzo<span style={{ color: '#6C63FF' }}>.ai</span>
        </span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
        {/* Show nav links only when signed in AND not on home page */}
        {isSignedIn && !isHomePage && navLinks.map((link) => (
          <Link key={link.path} to={link.path} style={{
            fontFamily: "'Sora', sans-serif",
            fontSize: 14,
            color: location.pathname === link.path ? '#0A0A0F' : '#6B6B80',
            textDecoration: 'none',
            letterSpacing: '-0.01em',
            fontWeight: location.pathname === link.path ? 600 : 400,
            transition: 'color 0.2s',
          }}>
            {link.label}
          </Link>
        ))}

        {/* Auth — show after Clerk loads */}
        {isLoaded && (
          isSignedIn ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              {/* Go to app button — shown on home page only */}
              {isHomePage && (
                <button
                  onClick={() => navigate('/input')}
                  style={{
                    fontFamily: "'Sora', sans-serif",
                    fontSize: 14, fontWeight: 500,
                    color: '#6B6B80', background: 'none',
                    border: 'none', cursor: 'pointer', padding: 0,
                  }}
                >
                  Dashboard →
                </button>
              )}
              {/* Clerk avatar + dropdown (sign out, profile, etc.) */}
              <UserButton afterSignOutUrl="/" />
            </div>
          ) : (
            /* Sign In pill button */
            <SignInButton mode="modal">
              <button style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                background: '#0A0A0F', color: '#FFFFFF',
                fontFamily: "'Sora', sans-serif",
                fontWeight: 500, fontSize: 14,
                border: 'none', borderRadius: 999,
                paddingLeft: 20, paddingRight: 8,
                paddingTop: 8, paddingBottom: 8,
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#1A1626'}
              onMouseLeave={e => e.currentTarget.style.background = '#0A0A0F'}
              >
                Sign In
                <span style={{
                  background: '#FFFFFF', borderRadius: '50%',
                  width: 26, height: 26,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <ArrowRightIcon />
                </span>
              </button>
            </SignInButton>
          )
        )}
      </div>
    </nav>
  );
}