import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { Analytics } from '@vercel/analytics/react'
import { ClerkProvider } from '@clerk/clerk-react'
import './index.css'
import App from './App.tsx'

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const clerkAppearance = {
  variables: {
    colorPrimary: '#1a1a1a',
    colorBackground: '#f5f2ed',
    colorInputBackground: '#ffffff',
    colorInputText: '#1a1a1a',
    borderRadius: '4px',
    fontFamily: 'Inter, sans-serif',
    colorText: '#1a1a1a',
    colorTextSecondary: '#8a8580',
    colorNeutral: '#1a1a1a',
  },
  elements: {
    card: {
      border: '1px solid #e0ddd8',
      boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
    },
    formButtonPrimary: {
      backgroundColor: '#1a1a1a',
      fontSize: '12px',
      fontFamily: "'Share Tech Mono', monospace",
      textTransform: 'uppercase' as const,
      letterSpacing: '1px',
    },
    formButtonPrimary__loading: {
      backgroundColor: '#333',
    },
    formFieldInput: {
      border: '1px solid #e0ddd8',
      fontSize: '12px',
    },
    formFieldInput__focused: {
      borderColor: '#1a1a1a',
      boxShadow: 'none',
    },
    footerActionLink: {
      color: '#1a1a1a',
    },
    footer: {
      display: 'none',
    },
    modalBackdrop: {
      backgroundColor: 'rgba(0,0,0,0.4)',
    },
    modalContent: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  },
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      {clerkPubKey ? (
        <ClerkProvider publishableKey={clerkPubKey} appearance={clerkAppearance}>
          <BrowserRouter>
            <Routes>
              <Route path="*" element={<App />} />
            </Routes>
            <Analytics />
          </BrowserRouter>
        </ClerkProvider>
      ) : (
        <BrowserRouter>
          <Routes>
            <Route path="*" element={<App />} />
          </Routes>
          <Analytics />
        </BrowserRouter>
      )}
    </HelmetProvider>
  </StrictMode>,
)
