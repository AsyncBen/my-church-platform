import React, { useMemo } from "react";
import { 
  Monitor, 
  Wifi, 
  ListOrdered, 
  Bell, 
  Activity, 
  ArrowRight, 
  CheckCircle, 
  LucideIcon 
} from "lucide-react";
import { Link } from "react-router";
import { PageLayout, PageHero } from "../components/Layout";

// Types
interface SetupStep {
  icon: LucideIcon;
  step: string;
  title: string;
  color: string;
  bg: string;
  desc: string;
  notes: string[];
}

interface TeamRole {
  role: string;
  emoji: string;
  perms: string[];
  color: string;
}

interface SetupStepCardProps {
  step: SetupStep;
  index: number;
}

interface RoleCardProps {
  role: TeamRole;
}

interface ChecklistItemProps {
  item: string;
  color: string;
  size?: number;
}

interface CTASectionProps {
  title: string;
  description: string;
  buttonText: string;
  linkTo: string;
}

// Constants
const SETUP_STEPS: SetupStep[] = [
  {
    icon: Monitor,
    step: "01",
    title: "Access the Media Dashboard",
    color: "var(--church-blue)",
    bg: "rgba(27,58,122,0.08)",
    desc: "Log in as a media team admin and open the Media Dashboard from your church portal. The dashboard is optimized for a secondary screen or tablet positioned at the media desk.",
    notes: [
      "Works best on a 1080p+ display",
      "Chrome or Edge recommended for best performance",
      "Pin the dashboard as a browser tab for quick access each Sunday",
    ],
  },
  {
    icon: ListOrdered,
    step: "02",
    title: "Build Your Scripture Queue",
    color: "#7C3AED",
    bg: "rgba(124,58,237,0.08)",
    desc: "Before each service, load your sermon's scripture references into the Queue Manager. You can save queues as templates for recurring sermon series.",
    notes: [
      "Search any scripture by book, chapter, and verse",
      "Choose your preferred Bible translation per verse",
      "Reorder the queue at any time before or during service",
    ],
  },
  {
    icon: Wifi,
    step: "03",
    title: "Run a Sync Test",
    color: "var(--church-gold)",
    bg: "rgba(200,150,44,0.08)",
    desc: "At least 30 minutes before service, push a test verse to all connected devices. Confirm the sync indicator shows green for all active connections.",
    notes: [
      "Use the 'Test Mode' toggle to avoid disturbing members early",
      "Check that all ministry devices show the correct verse",
      "Verify the sync latency is under 10ms on the dashboard",
    ],
  },
  {
    icon: Bell,
    step: "04",
    title: "Queue Announcements",
    color: "#DC2626",
    bg: "rgba(220,38,38,0.08)",
    desc: "Load any planned announcements into the broadcast queue so they're ready to send at the right moment during or after service.",
    notes: [
      "Schedule announcements to send at a specific time",
      "Target the whole church or specific ministries",
      "Preview each announcement before broadcasting",
    ],
  },
  {
    icon: Activity,
    step: "05",
    title: "Monitor During Service",
    color: "#059669",
    bg: "rgba(5,150,105,0.08)",
    desc: "Use the Live Monitoring panel to see real-time engagement: who's connected, how many members have sermon notes open, and giving activity.",
    notes: [
      "The engagement counter updates every 5 seconds",
      "Red connection indicators help you spot sync issues",
      "All service data is saved automatically for post-service reports",
    ],
  },
];

const TEAM_ROLES: TeamRole[] = [
  {
    role: "Media Director",
    emoji: "🎬",
    perms: ["Full dashboard access", "Team member management", "Broadcast announcements", "View all reports"],
    color: "var(--church-blue)",
  },
  {
    role: "Operator",
    emoji: "🖥️",
    perms: ["Scripture queue control", "Push verses live", "Monitor sync status", "Send planned announcements"],
    color: "#7C3AED",
  },
  {
    role: "Support",
    emoji: "🛠️",
    perms: ["View dashboard (read-only)", "Monitor engagement data", "Flag sync issues", "View sermon queue"],
    color: "#0891B2",
  },
];

// Sub-components
const ChecklistItem: React.FC<ChecklistItemProps> = React.memo(({ item, color, size = 13 }) => {
  return (
    <div className="flex items-start gap-2">
      <CheckCircle 
        size={size} 
        style={{ color, flexShrink: 0, marginTop: 2 }} 
        aria-hidden="true" 
      />
      <span className="text-xs leading-snug" style={{ color: "var(--foreground)" }}>
        {item}
      </span>
    </div>
  );
});

ChecklistItem.displayName = "ChecklistItem";

const SetupStepCard: React.FC<SetupStepCardProps> = React.memo(({ step, index }) => {
  const Icon: LucideIcon = step.icon;

  return (
    <div
      className="rounded-2xl p-7 grid md:grid-cols-3 gap-6"
      style={{ background: "var(--card)", border: "1px solid var(--border)" }}
      role="article"
      aria-label={`Step ${step.step}: ${step.title}`}
    >
      <div className="md:col-span-2">
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: step.bg }}
            aria-hidden="true"
          >
            <Icon size={18} style={{ color: step.color }} />
          </div>
          <div
            className="text-xs font-bold tracking-wider"
            style={{ color: step.color }}
          >
            STEP {step.step}
          </div>
        </div>
        <h3
          className="mb-3"
          style={{ 
            fontFamily: "var(--font-display)", 
            fontWeight: 700, 
            fontSize: "1.2rem", 
            color: "var(--foreground)" 
          }}
        >
          {step.title}
        </h3>
        <p className="text-sm leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
          {step.desc}
        </p>
      </div>
      <div
        className="rounded-xl p-4"
        style={{ 
          background: step.bg, 
          border: `1px solid ${step.color}25` 
        }}
        role="complementary"
        aria-label="Step notes"
      >
        <div 
          className="text-xs font-semibold mb-3 uppercase tracking-wide" 
          style={{ color: step.color }}
        >
          Notes
        </div>
        <div className="space-y-2" role="list">
          {step.notes.map((note: string) => (
            <div key={note} role="listitem">
              <ChecklistItem item={note} color={step.color} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

SetupStepCard.displayName = "SetupStepCard";

const RoleCard: React.FC<RoleCardProps> = React.memo(({ role }) => {
  return (
    <div
      className="rounded-2xl p-6 transition-all hover:-translate-y-1 hover:shadow-md"
      style={{ background: "var(--card)", border: "1px solid var(--border)" }}
      role="article"
      aria-label={`${role.role} permissions`}
    >
      <div className="text-3xl mb-3" aria-hidden="true">
        {role.emoji}
      </div>
      <h3
        className="font-bold mb-4"
        style={{ 
          color: "var(--foreground)", 
          fontFamily: "var(--font-display)", 
          fontSize: "1.1rem" 
        }}
      >
        {role.role}
      </h3>
      <div className="space-y-2" role="list" aria-label={`${role.role} permissions list`}>
        {role.perms.map((permission: string) => (
          <div key={permission} role="listitem">
            <ChecklistItem item={permission} color={role.color} size={14} />
          </div>
        ))}
      </div>
    </div>
  );
});

RoleCard.displayName = "RoleCard";

const CTASection: React.FC<CTASectionProps> = React.memo(({ title, description, buttonText, linkTo }) => {
  return (
    <section
      className="py-20"
      style={{ background: "linear-gradient(135deg, #0B1A40, #1B3A7A)" }}
      aria-labelledby="media-cta-heading"
    >
      <div className="max-w-2xl mx-auto px-6 text-center">
        <span id="media-cta-heading" className="sr-only">
          Get help with media setup
        </span>
        
        <h2
          className="text-white mb-4"
          style={{ 
            fontFamily: "var(--font-display)", 
            fontSize: "clamp(1.8rem,3.5vw,2.4rem)", 
            fontWeight: 700 
          }}
        >
          {title}
        </h2>
        <p className="text-white/60 mb-8">
          {description}
        </p>
        <Link
          to={linkTo}
          className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-white transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
          style={{ 
            background: "var(--church-gold)", 
            boxShadow: "0 4px 20px rgba(200,150,44,0.4)" 
          }}
          aria-label={buttonText}
        >
          {buttonText} <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
});

CTASection.displayName = "CTASection";

const SetupStepsSection: React.FC = () => {
  return (
    <section 
      className="py-20" 
      style={{ background: "var(--background)" }}
      aria-labelledby="setup-steps-heading"
    >
      <div className="max-w-5xl mx-auto px-6 lg:px-8 space-y-6">
        <span id="setup-steps-heading" className="sr-only">
          Media dashboard setup steps
        </span>
        
        {SETUP_STEPS.map((step: SetupStep, index: number) => (
          <SetupStepCard key={step.step} step={step} index={index} />
        ))}
      </div>
    </section>
  );
};

const TeamRolesSection: React.FC = () => {
  return (
    <section 
      className="py-20" 
      style={{ background: "linear-gradient(180deg, #EEF2FB, #F8F9FC)" }}
      aria-labelledby="team-roles-heading"
    >
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2
            id="team-roles-heading"
            style={{ 
              fontFamily: "var(--font-display)", 
              fontSize: "clamp(1.6rem,3vw,2.2rem)", 
              fontWeight: 700, 
              color: "var(--foreground)" 
            }}
          >
            Team Roles & Permissions
          </h2>
          <p className="mt-2 text-sm" style={{ color: "var(--muted-foreground)" }}>
            Assign the right access level to each member of your media team.
          </p>
        </div>
        <div 
          className="grid md:grid-cols-3 gap-5"
          role="list"
          aria-label="Available team roles"
        >
          {TEAM_ROLES.map((role: TeamRole) => (
            <div key={role.role} role="listitem">
              <RoleCard role={role} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Main Component
const MediaTeamSetupPage: React.FC = () => {
  const ctaProps: CTASectionProps = useMemo(() => ({
    title: "Need Hands-On Help?",
    description: "Our media specialists can walk your team through setup in a live video session. Book a free session today.",
    buttonText: "Book a Media Setup Call",
    linkTo: "/contact",
  }), []);

  return (
    <PageLayout>
      <PageHero
        badge="Media Team Setup"
        title={
          <>
            Configure Your
            <br />
            <em style={{ color: "var(--church-gold-light)" }}>Media Dashboard</em>
          </>
        }
        subtitle="A step-by-step guide for setting up and operating My Church's media tools — built for the people who make Sunday mornings run."
      />

      <SetupStepsSection />
      <TeamRolesSection />
      <CTASection {...ctaProps} />
    </PageLayout>
  );
};

// Export with memo for performance
export default React.memo(MediaTeamSetupPage);

// Export types for reuse
export type { 
  SetupStep, 
  TeamRole, 
  SetupStepCardProps, 
  RoleCardProps, 
  ChecklistItemProps,
  CTASectionProps 
};

// Export constants if needed elsewhere
export { SETUP_STEPS, TEAM_ROLES };