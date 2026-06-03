import React, { useState, useCallback, useMemo } from "react";
import { Link } from "react-router";
import { PageLayout, PageHero } from "../components/Layout";

// Types
interface CookieExample {
  name: string;
  purpose: string;
  duration: string;
}

interface CookieType {
  type: string;
  emoji: string;
  required: boolean;
  color: string;
  bg: string;
  desc: string;
  examples: CookieExample[];
}

interface PolicySection {
  title: string;
  content: string;
}

interface CookieToggleProps {
  cookieType: CookieType;
  isToggled: boolean;
  onToggle: (type: string) => void;
}

interface CookieTypeCardProps {
  cookieType: CookieType;
  isToggled: boolean;
  onToggle: (type: string) => void;
}

interface CookieExampleRowProps {
  example: CookieExample;
  color: string;
  isLast: boolean;
}

interface ToggleSwitchProps {
  isToggled: boolean;
  color: string;
  onToggle: () => void;
  label: string;
}

type CookiePreferences = Record<string, boolean>;

interface PreferenceState {
  preferences: CookiePreferences;
  hasChanges: boolean;
  lastSaved: Date | null;
}

// Constants
const COOKIE_TYPES: CookieType[] = [
  {
    type: "Essential",
    emoji: "🔒",
    required: true,
    color: "#059669",
    bg: "rgba(5,150,105,0.08)",
    desc: "These cookies are strictly necessary for the My Church platform to function. They cannot be disabled.",
    examples: [
      { name: "session_id", purpose: "Maintains your login session across page navigation", duration: "Session" },
      { name: "csrf_token", purpose: "Protects against cross-site request forgery attacks", duration: "Session" },
      { name: "auth_token", purpose: "Authenticates you as a verified church administrator or member", duration: "30 days" },
    ],
  },
  {
    type: "Functional",
    emoji: "⚙️",
    required: false,
    color: "var(--church-blue)",
    bg: "rgba(27,58,122,0.08)",
    desc: "These cookies enable enhanced functionality such as remembering your preferences and settings.",
    examples: [
      { name: "preferred_translation", purpose: "Remembers your chosen Bible translation preference", duration: "1 year" },
      { name: "dashboard_layout", purpose: "Saves your media dashboard layout configuration", duration: "1 year" },
      { name: "notification_prefs", purpose: "Stores your push notification preferences", duration: "6 months" },
    ],
  },
  {
    type: "Analytics",
    emoji: "📊",
    required: false,
    color: "#7C3AED",
    bg: "rgba(124,58,237,0.08)",
    desc: "These cookies help us understand how the platform is used so we can improve it. All data is anonymized.",
    examples: [
      { name: "_mc_session", purpose: "Tracks anonymized session data to improve platform performance", duration: "30 days" },
      { name: "feature_usage", purpose: "Records which features are used to guide product development", duration: "90 days" },
      { name: "error_tracking", purpose: "Captures anonymized error logs to fix bugs faster", duration: "7 days" },
    ],
  },
];

const POLICY_SECTIONS: PolicySection[] = [
  {
    title: "What Are Cookies?",
    content: `Cookies are small text files placed on your device by websites and applications you visit. They serve a variety of purposes — from keeping you logged in to helping us understand how our platform is being used.

My Church uses cookies on both the web admin portal and the congregation mobile app (where applicable). We are committed to being transparent about what we collect and why.`,
  },
  {
    title: "How to Manage Cookies",
    content: `You can manage your cookie preferences at any time through your browser settings or through the My Church cookie preference panel. Please note that disabling essential cookies will prevent the platform from functioning correctly.

For browsers:
• Chrome: Settings → Privacy and Security → Cookies
• Safari: Preferences → Privacy
• Firefox: Preferences → Privacy & Security
• Edge: Settings → Privacy, Search and Services

For mobile apps, you can manage notification and tracking preferences in your device's app settings.`,
  },
  {
    title: "Third-Party Cookies",
    content: `In limited cases, My Church works with trusted third-party services that may set their own cookies. These are:

• Payment processing: our payment partners may set cookies to protect transaction integrity and prevent fraud.
• Customer support: our live chat provider uses session cookies to maintain support conversations.

We do not permit advertising networks, social media trackers, or marketing platforms to set cookies through My Church.`,
  },
  {
    title: "Updates to This Policy",
    content: `We may update this Cookie Policy as our platform evolves or as regulations change. We will notify church administrators of material changes via email and in-app notification. The "Last Updated" date at the top of this page reflects the most recent revision.`,
  },
];

const DEFAULT_PREFERENCES: CookiePreferences = {
  Functional: true,
  Analytics: false,
};

const LAST_UPDATED_DATE: string = "June 1, 2026";

// Custom hooks
const useCookiePreferences = (initialPreferences: CookiePreferences) => {
  const [state, setState] = useState<PreferenceState>({
    preferences: initialPreferences,
    hasChanges: false,
    lastSaved: null,
  });

  const handleToggle = useCallback((type: string): void => {
    setState((prev: PreferenceState) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [type]: !prev.preferences[type],
      },
      hasChanges: true,
    }));
  }, []);

  const handleSave = useCallback((): void => {
    // Save preferences to localStorage or API
    localStorage.setItem("cookie-preferences", JSON.stringify(state.preferences));
    
    setState((prev: PreferenceState) => ({
      ...prev,
      hasChanges: false,
      lastSaved: new Date(),
    }));

    console.log("Cookie preferences saved:", state.preferences);
  }, [state.preferences]);

  const toggleableCookies = useMemo((): CookieType[] => {
    return COOKIE_TYPES.filter(ct => !ct.required);
  }, []);

  return {
    preferences: state.preferences,
    hasChanges: state.hasChanges,
    lastSaved: state.lastSaved,
    toggleableCookies,
    handleToggle,
    handleSave,
  };
};

// Sub-components
const ToggleSwitch: React.FC<ToggleSwitchProps> = React.memo(({ isToggled, color, onToggle, label }) => {
  return (
    <button
      onClick={onToggle}
      className="flex-shrink-0 w-11 h-6 rounded-full transition-all duration-200 relative focus:outline-none focus:ring-2 focus:ring-offset-2"
      style={{ 
        background: isToggled ? color : "var(--muted)",
        "--tw-ring-color": color,
      } as React.CSSProperties}
      role="switch"
      aria-checked={isToggled}
      aria-label={label}
    >
      <div
        className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all duration-200 shadow-sm"
        style={{ 
          left: isToggled ? "calc(100% - 1.375rem)" : "0.125rem",
        }}
      />
    </button>
  );
});

ToggleSwitch.displayName = "ToggleSwitch";

const CookieExampleRow: React.FC<CookieExampleRowProps> = React.memo(({ example, color, isLast }) => {
  return (
    <div
      className="grid grid-cols-3 gap-4 px-5 py-3 text-xs"
      style={{ borderTop: !isLast ? "1px solid var(--border)" : "none" }}
    >
      <div className="font-mono font-semibold" style={{ color }}>
        {example.name}
      </div>
      <div style={{ color: "var(--muted-foreground)" }}>
        {example.purpose}
      </div>
      <div className="text-right" style={{ color: "var(--muted-foreground)" }}>
        {example.duration}
      </div>
    </div>
  );
});

CookieExampleRow.displayName = "CookieExampleRow";

const CookieTypeCard: React.FC<CookieTypeCardProps> = React.memo(({ cookieType, isToggled, onToggle }) => {
  const handleToggle = useCallback((): void => {
    onToggle(cookieType.type);
  }, [cookieType.type, onToggle]);

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ border: "1px solid var(--border)" }}
      role="region"
      aria-label={`${cookieType.type} cookies`}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between p-5"
        style={{ background: "var(--card)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
            style={{ background: cookieType.bg }}
            aria-hidden="true"
          >
            {cookieType.emoji}
          </div>
          <div>
            <h3 
              className="font-semibold text-sm" 
              style={{ color: "var(--foreground)", fontFamily: "var(--font-display)" }}
            >
              {cookieType.type} Cookies
            </h3>
            <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>
              {cookieType.desc}
            </div>
          </div>
        </div>
        
        {cookieType.required ? (
          <span
            className="px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0"
            style={{ background: "rgba(5,150,105,0.1)", color: "#059669" }}
            role="status"
            aria-label="Always enabled"
          >
            Always On
          </span>
        ) : (
          <ToggleSwitch
            isToggled={isToggled}
            color={cookieType.color}
            onToggle={handleToggle}
            label={`Toggle ${cookieType.type} cookies`}
          />
        )}
      </div>

      {/* Examples table */}
      <div style={{ background: "var(--background)", borderTop: "1px solid var(--border)" }}>
        {cookieType.examples.map((example: CookieExample, index: number) => (
          <CookieExampleRow
            key={example.name}
            example={example}
            color={cookieType.color}
            isLast={index === cookieType.examples.length - 1}
          />
        ))}
      </div>
    </div>
  );
});

CookieTypeCard.displayName = "CookieTypeCard";

const PolicyIntro: React.FC = () => {
  return (
    <div
      className="rounded-2xl p-6 mb-10"
      style={{ 
        background: "rgba(27,58,122,0.06)", 
        border: "1px solid rgba(27,58,122,0.15)" 
      }}
      role="note"
    >
      <p className="text-sm leading-relaxed" style={{ color: "var(--foreground)" }}>
        My Church uses cookies and similar technologies to operate the platform securely, remember your preferences,
        and improve the experience over time. This policy explains how and why we use cookies and how you can control them.
        For broader privacy practices, see our{" "}
        <Link 
          to="/privacy-policy" 
          style={{ color: "var(--church-blue)" }}
          className="hover:underline focus:outline-none focus:underline"
        >
          Privacy Policy
        </Link>.
      </p>
    </div>
  );
};

const CookiePreferencesPanel: React.FC = () => {
  const {
    preferences,
    hasChanges,
    handleToggle,
    handleSave,
  } = useCookiePreferences(DEFAULT_PREFERENCES);

  return (
    <div className="mb-12">
      <h2
        className="mb-6"
        style={{ 
          fontFamily: "var(--font-display)", 
          fontWeight: 700, 
          fontSize: "1.3rem", 
          color: "var(--foreground)" 
        }}
      >
        Cookie Preferences
      </h2>
      <div className="space-y-4" role="list" aria-label="Cookie type preferences">
        {COOKIE_TYPES.map((cookieType: CookieType) => (
          <div key={cookieType.type} role="listitem">
            <CookieTypeCard
              cookieType={cookieType}
              isToggled={preferences[cookieType.type] ?? false}
              onToggle={handleToggle}
            />
          </div>
        ))}
      </div>

      <button
        onClick={handleSave}
        disabled={!hasChanges}
        className="mt-4 w-full py-3 rounded-xl font-semibold text-white text-sm transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        style={{ 
          background: "var(--church-blue)", 
          boxShadow: "0 4px 16px rgba(27,58,122,0.25)" 
        }}
        aria-label="Save cookie preferences"
      >
        {hasChanges ? "Save Cookie Preferences" : "Preferences Saved ✓"}
      </button>
    </div>
  );
};

const PolicyContent: React.FC = () => {
  return (
    <div className="space-y-10">
      {POLICY_SECTIONS.map((section: PolicySection) => (
        <div key={section.title}>
          <h2
            className="mb-4"
            style={{ 
              fontFamily: "var(--font-display)", 
              fontWeight: 700, 
              fontSize: "1.15rem", 
              color: "var(--foreground)" 
            }}
          >
            {section.title}
          </h2>
          <div 
            className="text-sm leading-loose whitespace-pre-line" 
            style={{ color: "var(--muted-foreground)" }}
          >
            {section.content}
          </div>
          <div 
            style={{ height: 1, background: "var(--border)", marginTop: "2rem" }}
            aria-hidden="true"
          />
        </div>
      ))}
    </div>
  );
};

const ContactLink: React.FC = () => {
  return (
    <div className="mt-10 text-sm" style={{ color: "var(--muted-foreground)" }}>
      Questions?{" "}
      <Link 
        to="/contact" 
        style={{ color: "var(--church-blue)" }}
        className="hover:underline focus:outline-none focus:underline"
        aria-label="Contact privacy team"
      >
        Contact our privacy team.
      </Link>
    </div>
  );
};

// Main Component
const CookiePolicyPage: React.FC = () => {
  return (
    <PageLayout>
      <PageHero
        badge="Cookie Policy"
        title="Cookie Policy"
        subtitle={`Last updated: ${LAST_UPDATED_DATE}`}
        dark={false}
      />

      <section 
        className="pb-24" 
        style={{ background: "var(--background)" }}
        aria-labelledby="cookie-policy-heading"
      >
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <span id="cookie-policy-heading" className="sr-only">
            Cookie Policy and Preferences
          </span>
          
          <PolicyIntro />
          <CookiePreferencesPanel />
          <PolicyContent />
          <ContactLink />
        </div>
      </section>
    </PageLayout>
  );
};

export default React.memo(CookiePolicyPage);

// Export types for reuse
export type { 
  CookieType, 
  CookieExample, 
  CookiePreferences, 
  PolicySection,
  PreferenceState 
};

// Export constants if needed elsewhere
export { 
  COOKIE_TYPES, 
  POLICY_SECTIONS, 
  DEFAULT_PREFERENCES, 
  LAST_UPDATED_DATE 
};