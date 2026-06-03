import React, { useMemo } from "react";
import { ArrowRight, CheckCircle, LucideIcon } from "lucide-react";
import { Link } from "react-router";
import { PageLayout, PageHero } from "../components/Layout";

// Types
interface MissionPillar {
  emoji: string;
  title: string;
  desc: string;
  id: string;
}

interface Commitment {
  text: string;
  icon?: LucideIcon;
}

interface MissionStatement {
  quote: string;
  attribution: string;
}

interface VisionCard {
  icon: string;
  title: string;
  quote?: string;
  description: string;
}

interface PillarCardProps {
  pillar: MissionPillar;
  index: number;
}

interface CommitmentItemProps {
  commitment: string;
  index: number;
}

interface VisionCardProps {
  card: VisionCard;
}

interface MissionStatementProps {
  statement: MissionStatement;
}

interface CTASectionProps {
  title: string;
  description: string;
  buttonText: string;
  linkTo: string;
}

// Constants
const MISSION_STATEMENT: MissionStatement = {
  quote: "To empower churches with simple, modern technology that fosters connection, communication, discipleship, and community beyond the walls of the church.",
  attribution: "Our Mission Statement",
};

const MISSION_PILLARS: MissionPillar[] = [
  {
    id: "stronger-congregations",
    emoji: "🤝",
    title: "Build Stronger Congregations",
    desc: "We give churches the tools to foster genuine community — not just Sunday attendance. Ministry communities, sermon engagement, and church feeds keep relationships alive all week long.",
  },
  {
    id: "live-service",
    emoji: "⚡",
    title: "Enhance Live Service Participation",
    desc: "Realtime scripture synchronization ensures that every member, regardless of where they sit, is experiencing the service at the same moment. No one gets left behind.",
  },
  {
    id: "communication",
    emoji: "📣",
    title: "Improve Communication",
    desc: "Announcements that actually get read. Updates that reach the right people. My Church helps leadership communicate with clarity, speed, and intentionality.",
  },
  {
    id: "fellowship",
    emoji: "🌐",
    title: "Encourage Fellowship",
    desc: "Ministry communities and church feeds create digital spaces for encouragement, prayer, and connection — extending the church experience far beyond the building.",
  },
  {
    id: "digital-ministry",
    emoji: "🚀",
    title: "Create Seamless Digital Ministry",
    desc: "From giving to sermon notes to media synchronization — every tool is designed to feel like it belongs in a church, because it was built for one.",
  },
];

const COMMITMENTS: string[] = [
  "We will never sell congregation data to third parties.",
  "We will always offer an affordable path for small and growing churches.",
  "We will build features that serve ministry first, not feature checkboxes.",
  "We will listen to churches — our roadmap is shaped by pastor and media team feedback.",
  "We will treat every church with equal care, regardless of size or denomination.",
];

const VISION_CARDS: VisionCard[] = [
  {
    icon: "🌟",
    title: "Our Vision",
    quote: "To become the leading digital platform that helps churches build stronger, more connected faith communities worldwide.",
    description: "We envision a world where every believer — regardless of geography, church size, or circumstance — has access to a rich, connected church experience through technology.",
  },
  {
    icon: "💡",
    title: "Why It Matters",
    description: "At My Church, our mission is to help churches stay connected, informed, and united — every day, not just on Sundays. We believe that digital community, when done right, doesn't replace the local church — it strengthens it.",
  },
];

// Helper functions
const formatPillarNumber = (index: number): string => {
  return `0${index + 1}`;
};

const generatePillarId = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

// Sub-components
const MissionStatementBlock: React.FC<MissionStatementProps> = React.memo(({ statement }) => {
  return (
    <div
      className="rounded-3xl p-10 text-center mb-16"
      style={{
        background: "linear-gradient(135deg, #1B3A7A, #2A4F9E)",
        boxShadow: "0 24px 60px rgba(27,58,122,0.25)",
      }}
      role="region"
      aria-label="Mission statement"
    >
      <div className="text-5xl mb-5" aria-hidden="true">
        ✝
      </div>
      <blockquote
        className="text-white mb-4"
        style={{
          fontFamily: "var(--font-display)",
          fontStyle: "italic",
          fontSize: "clamp(1.4rem,3vw,2rem)",
          fontWeight: 600,
          lineHeight: 1.4,
        }}
        cite="My Church Mission"
      >
        "{statement.quote}"
      </blockquote>
      <div
        className="mt-4 text-white/50 text-sm tracking-widest uppercase"
        aria-label={statement.attribution}
      >
        {statement.attribution}
      </div>
    </div>
  );
});

MissionStatementBlock.displayName = "MissionStatementBlock";

const VisionCardComponent: React.FC<VisionCardProps> = React.memo(({ card }) => {
  return (
    <div
      className="rounded-2xl p-7 transition-all hover:shadow-md"
      style={{ background: "var(--card)", border: "1px solid var(--border)" }}
      role="article"
      aria-label={card.title}
    >
      <div className="text-2xl mb-3" aria-hidden="true">
        {card.icon}
      </div>
      <h3
        className="font-bold mb-3"
        style={{
          color: "var(--foreground)",
          fontFamily: "var(--font-display)",
          fontSize: "1.2rem",
        }}
      >
        {card.title}
      </h3>
      {card.quote && (
        <blockquote
          className="leading-relaxed mb-4"
          style={{ color: "var(--muted-foreground)" }}
        >
          "{card.quote}"
        </blockquote>
      )}
      <p className="text-sm leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
        {card.description}
      </p>
    </div>
  );
});

VisionCardComponent.displayName = "VisionCardComponent";

const PillarCard: React.FC<PillarCardProps> = React.memo(({ pillar, index }) => {
  return (
    <div
      className="flex gap-6 p-6 rounded-2xl transition-all hover:shadow-sm"
      style={{ background: "var(--card)", border: "1px solid var(--border)" }}
      role="article"
      aria-labelledby={`pillar-${pillar.id}`}
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
        style={{ background: "rgba(27,58,122,0.06)", fontSize: "1.5rem" }}
        aria-hidden="true"
      >
        {pillar.emoji}
      </div>
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div
            className="text-xs font-bold tracking-wider"
            style={{ color: "var(--church-blue)", opacity: 0.5 }}
            aria-label={`Pillar ${index + 1}`}
          >
            {formatPillarNumber(index)}
          </div>
          <h3
            id={`pillar-${pillar.id}`}
            className="font-semibold"
            style={{ color: "var(--foreground)", fontFamily: "var(--font-display)" }}
          >
            {pillar.title}
          </h3>
        </div>
        <p className="text-sm leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
          {pillar.desc}
        </p>
      </div>
    </div>
  );
});

PillarCard.displayName = "PillarCard";

const CommitmentItem: React.FC<CommitmentItemProps> = React.memo(({ commitment, index }) => {
  return (
    <div className="flex items-start gap-3" role="listitem">
      <CheckCircle
        size={18}
        style={{ color: "#059669", flexShrink: 0, marginTop: 1 }}
        aria-hidden="true"
      />
      <span className="text-sm leading-relaxed" style={{ color: "var(--foreground)" }}>
        {commitment}
      </span>
    </div>
  );
});

CommitmentItem.displayName = "CommitmentItem";

const MissionStatementSection: React.FC = () => {
  return (
    <section 
      className="py-20" 
      style={{ background: "var(--background)" }}
      aria-labelledby="mission-heading"
    >
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <span id="mission-heading" className="sr-only">
          Our mission and vision
        </span>
        
        <MissionStatementBlock statement={MISSION_STATEMENT} />

        {/* Vision cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {VISION_CARDS.map((card: VisionCard) => (
            <VisionCardComponent key={card.title} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
};

const PillarsSection: React.FC = () => {
  return (
    <section
      className="py-20"
      style={{ background: "linear-gradient(180deg, #EEF2FB, #F8F9FC)" }}
      aria-labelledby="pillars-heading"
    >
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2
            id="pillars-heading"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.8rem,3.5vw,2.4rem)",
              fontWeight: 700,
              color: "var(--foreground)",
            }}
          >
            Five Ways We Live Our Mission
          </h2>
          <p className="mt-3 text-sm" style={{ color: "var(--muted-foreground)" }}>
            We are committed to helping churches accomplish these five outcomes.
          </p>
        </div>
        <div className="space-y-4" role="list" aria-label="Mission pillars">
          {MISSION_PILLARS.map((pillar: MissionPillar, index: number) => (
            <div key={pillar.id} role="listitem">
              <PillarCard pillar={pillar} index={index} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CommitmentsSection: React.FC = () => {
  return (
    <section
      className="py-20"
      style={{ background: "var(--background)" }}
      aria-labelledby="commitments-heading"
    >
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        <h2
          id="commitments-heading"
          className="text-center mb-10"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.6rem,3vw,2.2rem)",
            fontWeight: 700,
            color: "var(--foreground)",
          }}
        >
          Our Commitments to Every Church
        </h2>
        <div
          className="rounded-2xl p-8"
          style={{ background: "var(--card)", border: "1px solid var(--border)" }}
        >
          <div className="space-y-4" role="list" aria-label="Our commitments">
            {COMMITMENTS.map((commitment: string, index: number) => (
              <CommitmentItem
                key={`commitment-${index}`}
                commitment={commitment}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const CTASection: React.FC<CTASectionProps> = React.memo(({ title, description, buttonText, linkTo }) => {
  return (
    <section
      className="py-20"
      style={{ background: "linear-gradient(135deg, #0B1A40, #1B3A7A)" }}
      aria-labelledby="mission-cta-heading"
    >
      <div className="max-w-2xl mx-auto px-6 text-center">
        <span id="mission-cta-heading" className="sr-only">
          Join our mission
        </span>
        
        <h2
          className="text-white mb-4"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.8rem,3.5vw,2.4rem)",
            fontWeight: 700,
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
            boxShadow: "0 4px 20px rgba(200,150,44,0.4)",
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

// Main Component
const OurMissionPage: React.FC = () => {
  const ctaProps: CTASectionProps = useMemo(() => ({
    title: "Join the Mission",
    description: "Bring your church into a more connected, spiritually engaged future.",
    buttonText: "Get Started",
    linkTo: "/church-onboarding",
  }), []);

  return (
    <PageLayout>
      <PageHero
        badge="Our Mission"
        title={
          <>
            Connecting Churches
            <br />
            <em style={{ color: "var(--church-gold-light)" }}>and Congregations</em>
          </>
        }
        subtitle='"Connecting churches and congregations through technology, community, and faith."'
      />

      <MissionStatementSection />
      <PillarsSection />
      <CommitmentsSection />
      <CTASection {...ctaProps} />
    </PageLayout>
  );
};

// Export with memo for performance
export default React.memo(OurMissionPage);

// Export types for reuse
export type {
  MissionPillar,
  Commitment,
  MissionStatement,
  VisionCard,
  PillarCardProps,
  CommitmentItemProps,
  VisionCardProps,
  MissionStatementProps,
  CTASectionProps,
};

// Export constants if needed elsewhere
export {
  MISSION_STATEMENT,
  MISSION_PILLARS,
  COMMITMENTS,
  VISION_CARDS,
};