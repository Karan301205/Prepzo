import { Component } from 'react';

/**
 * Catches unexpected render-time JS errors and shows a friendly fallback
 * instead of a blank screen. Async errors (API calls) are handled locally
 * in each component via try/catch.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            background: '#F5F5F5',
          }}
        >
          <div
            style={{
              background: '#FFFFFF',
              border: '1.5px solid #E0E0E8',
              borderRadius: 20,
              padding: '40px 32px',
              maxWidth: 480,
              width: '100%',
              textAlign: 'center',
            }}
          >
            <span style={{ fontSize: 40, display: 'block', marginBottom: 16 }}>💥</span>
            <h2
              style={{
                fontFamily: "'Sora', sans-serif",
                fontWeight: 600,
                fontSize: 22,
                color: '#0A0A0F',
                marginBottom: 10,
              }}
            >
              Something went wrong
            </h2>
            <p
              style={{
                fontFamily: "'Sora', sans-serif",
                fontSize: 14,
                color: '#6B6B80',
                lineHeight: 1.6,
                marginBottom: 24,
              }}
            >
              An unexpected error occurred. Refreshing the page usually fixes this.
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                background: '#0A0A0F',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: 999,
                padding: '12px 28px',
                fontFamily: "'Sora', sans-serif",
                fontSize: 15,
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
