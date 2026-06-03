// src/main.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App';
import './index.css';

// Types
interface AppConfig {
  rootElement: HTMLElement | null;
  strictMode: boolean;
}

// Constants
const APP_CONFIG: AppConfig = {
  rootElement: document.getElementById('root'),
  strictMode: import.meta.env.DEV || false,
};

// Initialize theme before render
const initializeTheme = (): void => {
  try {
    const savedTheme = localStorage.getItem('theme-preference');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Listen for system theme changes
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleThemeChange = (e: MediaQueryListEvent): void => {
      if (!localStorage.getItem('theme-preference')) {
        if (e.matches) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    };

    darkModeMediaQuery.addEventListener('change', handleThemeChange);

    if (import.meta.env.DEV) {
      console.log('🎨 Theme initialized:', {
        mode: document.documentElement.classList.contains('dark') ? 'dark' : 'light',
      });
    }
  } catch (error) {
    console.warn('Failed to initialize theme:', error);
  }
};

// Setup global error handlers
const setupErrorHandlers = (): void => {
  window.onerror = (message, source, lineno, colno, error) => {
    console.error('Global error:', { message, source, lineno, colno, error });
    return false;
  };

  window.onunhandledrejection = (event) => {
    console.error('Unhandled promise rejection:', event.reason);
  };
};

// Error fallback component
const ErrorFallback: React.FC<{ error: Error }> = ({ error }) => {
  const isDev = import.meta.env.DEV;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '20px',
        fontFamily: 'var(--font-body, "Inter", system-ui, sans-serif)',
        backgroundColor: 'var(--background, #F8F9FC)',
        color: 'var(--foreground, #0F1C3F)',
        textAlign: 'center',
      }}
      role="alert"
    >
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }} aria-hidden="true">
        ✝
      </div>
      <h1
        style={{
          fontSize: '1.5rem',
          fontWeight: 700,
          marginBottom: '0.5rem',
          fontFamily: 'var(--font-display, "Playfair Display", Georgia, serif)',
        }}
      >
        Application Error
      </h1>
      <p
        style={{
          fontSize: '0.875rem',
          color: 'var(--muted-foreground, #5A6A8A)',
          marginBottom: '1.5rem',
          maxWidth: '400px',
          lineHeight: 1.6,
        }}
      >
        We encountered an error while loading My Church. Please try refreshing the page.
      </p>

      {isDev && error && (
        <pre
          style={{
            fontSize: '0.75rem',
            backgroundColor: 'rgba(27, 58, 122, 0.05)',
            padding: '1rem',
            borderRadius: '0.5rem',
            marginBottom: '1.5rem',
            maxWidth: '600px',
            overflow: 'auto',
            textAlign: 'left',
            border: '1px solid var(--border, rgba(27, 58, 122, 0.12))',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        >
          {error.message}
          {error.stack && `\n\n${error.stack}`}
        </pre>
      )}

      <button
        onClick={() => window.location.reload()}
        style={{
          padding: '0.75rem 1.5rem',
          borderRadius: '9999px',
          backgroundColor: 'var(--primary, #1B3A7A)',
          color: '#ffffff',
          fontWeight: 600,
          fontSize: '0.875rem',
          border: 'none',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          boxShadow: '0 4px 16px rgba(27, 58, 122, 0.25)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        Refresh Page
      </button>
    </div>
  );
};

// Main initialization
const initializeApp = (): void => {
  const rootElement = APP_CONFIG.rootElement;

  if (!rootElement) {
    throw new Error(
      'Failed to find the root element. Ensure there is a <div id="root"></div> in your HTML.'
    );
  }

  // Setup error handlers
  setupErrorHandlers();

  // Initialize theme
  initializeTheme();

  // Create React root
  const root = ReactDOM.createRoot(rootElement);

  // Render app - NO BrowserRouter wrapper since App uses RouterProvider
  root.render(
    APP_CONFIG.strictMode ? (
      <React.StrictMode>
        <React.Suspense
          fallback={
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                backgroundColor: 'var(--background, #F8F9FC)',
                gap: '1rem',
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  border: '4px solid var(--muted, #EEF2FB)',
                  borderTopColor: 'var(--primary, #1B3A7A)',
                  animation: 'spin 1s linear infinite',
                }}
                role="status"
                aria-label="Loading application"
              />
              <p
                style={{
                  fontSize: '0.875rem',
                  color: 'var(--muted-foreground, #5A6A8A)',
                  fontFamily: 'var(--font-body, "Inter", system-ui, sans-serif)',
                }}
              >
                Loading My Church...
              </p>
            </div>
          }
        >
          <App />
        </React.Suspense>
      </React.StrictMode>
    ) : (
      <React.Suspense
        fallback={
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '100vh',
              backgroundColor: 'var(--background, #F8F9FC)',
              gap: '1rem',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                border: '4px solid var(--muted, #EEF2FB)',
                borderTopColor: 'var(--primary, #1B3A7A)',
                animation: 'spin 1s linear infinite',
              }}
              role="status"
              aria-label="Loading application"
            />
            <p
              style={{
                fontSize: '0.875rem',
                color: 'var(--muted-foreground, #5A6A8A)',
                fontFamily: 'var(--font-body, "Inter", system-ui, sans-serif)',
              }}
            >
              Loading My Church...
            </p>
          </div>
        }
      >
        <App />
      </React.Suspense>
    )
  );

  // Log successful initialization
  if (import.meta.env.DEV) {
    console.log('🚀 My Church Platform initialized');
    console.log('📦 Environment:', import.meta.env.MODE);
    console.log('⚛️ React Version:', React.version);
  }
};

// Execute with error handling
try {
  initializeApp();
} catch (error) {
  const errorObj = error instanceof Error ? error : new Error('Unknown initialization error');
  console.error('Fatal initialization error:', errorObj);

  // Attempt to render error fallback
  const rootElement = document.getElementById('root');
  if (rootElement) {
    try {
      const root = ReactDOM.createRoot(rootElement);
      root.render(<ErrorFallback error={errorObj} />);
    } catch (renderError) {
      console.error('Failed to render error fallback:', renderError);
      // Last resort: reload page
      window.location.reload();
    }
  }
}

// Export for testing
export { APP_CONFIG, initializeApp, initializeTheme };