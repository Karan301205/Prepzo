import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ClerkProvider } from '@clerk/react'
import { PostHogProvider } from '@posthog/react'
import posthog from 'posthog-js'
import ErrorBoundary from './components/ErrorBoundary'

posthog.init(import.meta.env.VITE_PUBLIC_POSTHOG_TOKEN, {
  api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
  person_profiles: 'identified_only',
})

if (import.meta.env.DEV) {
  window.posthog = posthog
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY} afterSignOutUrl="/">
      <PostHogProvider client={posthog}>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </PostHogProvider>
    </ClerkProvider>
  </StrictMode>,
)
