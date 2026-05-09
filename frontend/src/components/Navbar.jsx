import { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuth, UserButton, SignInButton } from '@clerk/react';
import { useViewport } from '../hooks/useViewport';

function ArrowRightIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
      <path d="M3.33 8H12.67M12.67 8L8.67 4M12.67 8L8.67 12"
        stroke="#0A0A0F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function HamburgerIcon({ open }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      {open ? (
        <>
          <path d="M5 5L17 17" stroke="#0A0A0F" strokeWidth="1.8" strokeLinecap="round"/>
          <path d="M17 5L5 17" stroke="#0A0A0F" strokeWidth="1.8" strokeLinecap="round"/>
        </>
      ) : (
        <>
          <path d="M3 6H19" stroke="#0A0A0F" strokeWidth="1.8" strokeLinecap="round"/>
          <path d="M3 11H19" stroke="#0A0A0F" strokeWidth="1.8" strokeLinecap="round"/>
          <path d="M3 16H19" stroke="#0A0A0F" strokeWidth="1.8" strokeLinecap="round"/>
        </>
      )}
    </svg>
  );
}

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isSignedIn, isLoaded } = useAuth();
  const { isMobile } = useViewport();
  const [menuOpen, setMenuOpen] = useState(false);

  const isHomePage = location.pathname === '/';
  const showNavLinks = isSignedIn && !isHomePage;

  const navLinks = [
    { path: '/input',     label: 'Input' },
    { path: '/result',    label: 'Result' },
    { path: '/chat',      label: 'Chat' },
    { path: '/analytics', label: 'Analytics' },
  ];

  // Close menu when switching to desktop
  useEffect(() => {
    if (!isMobile) setMenuOpen(false);
  }, [isMobile]);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: 56,
        background: 'rgba(245,245,245,0.88)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid #E0E0E8',
        zIndex: 1000,
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        padding: isMobile ? '0 16px' : '0 32px',
      }}>
        {/* Logo */}
        <Link to="/" onClick={closeMenu} style={{ textDecoration: 'none', flexShrink: 0 }}>
          <span style={{
            fontFamily: "'Sora', sans-serif",
            fontWeight: 700, fontSize: 18,
            color: '#0A0A0F', letterSpacing: '-0.03em',
          }}>
            Prepzo<span style={{ color: '#6C63FF' }}>.ai</span>
          </span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 10 : 28 }}>
          {/* Desktop nav links only */}
          {!isMobile && showNavLinks && navLinks.map((link) => (
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

          {/* Auth area */}
          {isLoaded && (
            isSignedIn ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {isHomePage && !isMobile && (
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
                <UserButton afterSignOutUrl="/" />
              </div>
            ) : (
              <SignInButton mode="modal">
                <button style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: '#0A0A0F', color: '#FFFFFF',
                  fontFamily: "'Sora', sans-serif",
                  fontWeight: 500, fontSize: isMobile ? 13 : 14,
                  border: 'none', borderRadius: 999,
                  paddingLeft: isMobile ? 14 : 20,
                  paddingRight: isMobile ? 14 : 8,
                  paddingTop: 8, paddingBottom: 8,
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#1A1626'}
                onMouseLeave={e => e.currentTarget.style.background = '#0A0A0F'}
                >
                  Sign In
                  {!isMobile && (
                    <span style={{
                      background: '#FFFFFF', borderRadius: '50%',
                      width: 26, height: 26,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <ArrowRightIcon />
                    </span>
                  )}
                </button>
              </SignInButton>
            )
          )}

          {/* Hamburger — mobile only when nav links should be shown */}
          {isMobile && showNavLinks && (
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? 'Close menu' : 'Open navigation menu'}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                padding: 4, borderRadius: 8, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <HamburgerIcon open={menuOpen} />
            </button>
          )}
        </div>
      </nav>

      {/* Mobile slide-down menu */}
      {isMobile && menuOpen && showNavLinks && (
        <>
          {/* Backdrop */}
          <div
            onClick={closeMenu}
            style={{
              position: 'fixed', inset: 0, zIndex: 997,
              background: 'rgba(0,0,0,0.12)',
            }}
          />
          {/* Menu panel */}
          <div style={{
            position: 'fixed', top: 56, left: 0, right: 0, zIndex: 998,
            background: 'rgba(245,245,245,0.97)',
            backdropFilter: 'blur(16px)',
            borderBottom: '1px solid #E0E0E8',
            paddingBottom: 8,
          }}>
            {navLinks.map((link, i) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={closeMenu}
                style={{
                  display: 'flex', alignItems: 'center',
                  padding: '14px 20px',
                  fontFamily: "'Sora', sans-serif",
                  fontSize: 15,
                  color: location.pathname === link.path ? '#6C63FF' : '#0A0A0F',
                  textDecoration: 'none',
                  fontWeight: location.pathname === link.path ? 600 : 400,
                  borderBottom: i < navLinks.length - 1 ? '1px solid #F0F0F5' : 'none',
                }}
              >
                {link.label}
                {location.pathname === link.path && (
                  <span style={{
                    marginLeft: 'auto',
                    width: 6, height: 6, borderRadius: '50%',
                    background: '#6C63FF', flexShrink: 0,
                  }} />
                )}
              </Link>
            ))}
          </div>
        </>
      )}
    </>
  );
}
