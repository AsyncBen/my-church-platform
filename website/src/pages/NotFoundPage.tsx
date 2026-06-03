import React from "react";
import { Link } from "react-router";
import { PageLayout } from "../components/Layout";

// Types
interface NotFoundPageProps {
  className?: string;
  customMessage?: string;
  customTitle?: string;
  showBackButton?: boolean;
  backButtonText?: string;
  backButtonLink?: string;
}

interface ErrorDisplayProps {
  statusCode: number;
  title: string;
  message: string;
  icon?: string;
}

// Constants
const DEFAULT_ERROR_CONFIG: ErrorDisplayProps = {
  statusCode: 404,
  title: "Page not found",
  message: "The page you're looking for doesn't exist or has been moved.",
  icon: "✝",
};

// Sub-components
const ErrorIcon: React.FC<{ icon: string }> = React.memo(({ icon }) => {
  return (
    <div 
      className="text-6xl mb-6" 
      aria-hidden="true"
    >
      {icon}
    </div>
  );
});

ErrorIcon.displayName = "ErrorIcon";

const ErrorTitle: React.FC<{ statusCode: number }> = React.memo(({ statusCode }) => {
  return (
    <h1
      className="mb-3"
      style={{ 
        fontFamily: "var(--font-display)", 
        fontSize: "3rem", 
        fontWeight: 700, 
        color: "var(--foreground)" 
      }}
    >
      {statusCode}
    </h1>
  );
});

ErrorTitle.displayName = "ErrorTitle";

const ErrorMessage: React.FC<{ title: string; message: string }> = React.memo(({ title, message }) => {
  return (
    <>
      <p className="text-lg mb-2" style={{ color: "var(--foreground)" }}>
        {title}
      </p>
      <p className="mb-8 text-sm" style={{ color: "var(--muted-foreground)" }}>
        {message}
      </p>
    </>
  );
});

ErrorMessage.displayName = "ErrorMessage";

const BackButton: React.FC<{ to: string; text: string }> = React.memo(({ to, text }) => {
  return (
    <Link
      to={to}
      className="px-6 py-3 rounded-full font-semibold text-white text-sm transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      style={{ background: "var(--church-blue)" }}
      aria-label={`${text} - Return to homepage`}
    >
      {text}
    </Link>
  );
});

BackButton.displayName = "BackButton";

// Main Component (Simple version)
const NotFoundPage: React.FC<NotFoundPageProps> = ({
  customMessage,
  customTitle,
  showBackButton = true,
  backButtonText = "Back to Home",
  backButtonLink = "/",
}) => {
  const message = customMessage || DEFAULT_ERROR_CONFIG.message;
  const title = customTitle || DEFAULT_ERROR_CONFIG.title;

  return (
    <PageLayout>
      <div
        className="min-h-screen flex flex-col items-center justify-center text-center px-6"
        style={{ background: "var(--background)", paddingTop: 80 }}
        role="alert"
        aria-live="polite"
      >
        <ErrorIcon icon={DEFAULT_ERROR_CONFIG.icon} />
        <ErrorTitle statusCode={DEFAULT_ERROR_CONFIG.statusCode} />
        <ErrorMessage title={title} message={message} />
        
        {showBackButton && (
          <BackButton to={backButtonLink} text={backButtonText} />
        )}
      </div>
    </PageLayout>
  );
};

// Alternative: More comprehensive version with additional features
const NotFoundPageEnhanced: React.FC<NotFoundPageProps> = ({
  className,
  customMessage,
  customTitle,
  showBackButton = true,
  backButtonText = "Back to Home",
  backButtonLink = "/",
}) => {
  const message = customMessage || DEFAULT_ERROR_CONFIG.message;
  const title = customTitle || DEFAULT_ERROR_CONFIG.title;

  // Track 404 errors for analytics
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      console.warn(`404 Error: ${window.location.pathname}`);
      
      // Example analytics tracking
      // if ('gtag' in window) {
      //   (window as any).gtag('event', '404_error', {
      //     page_path: window.location.pathname,
      //     page_title: document.title,
      //   });
      // }
    }
  }, []);

  return (
    <PageLayout>
      <main
        className={`min-h-screen flex flex-col items-center justify-center text-center px-6 ${className || ''}`}
        style={{ background: "var(--background)", paddingTop: 80 }}
        role="alert"
        aria-live="polite"
        aria-label={`${DEFAULT_ERROR_CONFIG.statusCode} error: ${title}`}
      >
        <ErrorIcon icon={DEFAULT_ERROR_CONFIG.icon} />
        <ErrorTitle statusCode={DEFAULT_ERROR_CONFIG.statusCode} />
        <ErrorMessage title={title} message={message} />
        
        {showBackButton && (
          <BackButton to={backButtonLink} text={backButtonText} />
        )}
      </main>
    </PageLayout>
  );
};

// Optional: Reusable error page component that can handle different status codes
interface ErrorPageProps {
  statusCode: number;
  title: string;
  message: string;
  icon?: string;
  backButtonText?: string;
  backButtonLink?: string;
  showBackButton?: boolean;
}

const ErrorPage: React.FC<ErrorPageProps> = ({
  statusCode,
  title,
  message,
  icon = "✝",
  backButtonText = "Back to Home",
  backButtonLink = "/",
  showBackButton = true,
}) => {
  return (
    <PageLayout>
      <div
        className="min-h-screen flex flex-col items-center justify-center text-center px-6"
        style={{ background: "var(--background)", paddingTop: 80 }}
        role="alert"
        aria-live="polite"
      >
        <ErrorIcon icon={icon} />
        <ErrorTitle statusCode={statusCode} />
        <ErrorMessage title={title} message={message} />
        
        {showBackButton && (
          <BackButton to={backButtonLink} text={backButtonText} />
        )}
      </div>
    </PageLayout>
  );
};

// Export the main component
export default React.memo(NotFoundPage);

// Also export the enhanced versions and types
export { 
  NotFoundPageEnhanced, 
  ErrorPage,
  ErrorIcon,
  ErrorTitle,
  ErrorMessage,
  BackButton,
};

// Export types
export type { 
  NotFoundPageProps, 
  ErrorDisplayProps, 
  ErrorPageProps 
};

// Export constants
export { DEFAULT_ERROR_CONFIG };