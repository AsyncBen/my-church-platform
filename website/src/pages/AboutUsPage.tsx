import React, { useMemo } from "react";
import { Heart, Users, Zap, Shield, ArrowRight, LucideIcon } from "lucide-react";
import { Link } from "react-router";
import { PageLayout, PageHero } from "../components/Layout";

// Types
interface CompanyValue {
  icon: LucideIcon;
  title: string;
  desc: string;
  color: string;
  bg: string;
}

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  avatar: string;
  color: string;
  bg: string;
}

interface CompanyStat {
  value: string;
  label: string;
}

interface ValueCardProps {
  value: CompanyValue;
}

interface TeamMemberCardProps {
  member: TeamMember;
}

interface StatCardProps {
  stat: CompanyStat;
}

interface CTASectionProps {
  primaryLink: {
    to: string;
    label: string;
    icon?: LucideIcon;
  };
  secondaryLink: {
    to: string;
    label: string;
  };
}

// Constants
const COMPANY_VALUES: CompanyValue[] = [
  {
    icon: Heart,
    title: "Community First",
    desc: "Every feature we build starts with one question: does this help churches bring their congregations closer together?",
    color: "var(--church-gold)",
    bg: "rgba(200,150,44,0.08)",
  },
  {
    icon: Zap,
    title: "Radical Simplicity",
    desc: "Technology should serve the ministry, not distract from it. We obsess over simplicity so your team can focus on people.",
    color: "var(--church-blue-light)",
    bg: "rgba(61,107,196,0.08)",
  },
  {
    icon: Users,
    title: "Built for Every Church",
    desc: "From a 30-member house church to a 5,000-seat congregation — My Church scales to serve every church with equal care.",
    color: "#7C3AED",
    bg: "rgba(124,58,237,0.08)",
  },
  {
    icon: Shield,
    title: "Trust & Transparency",
    desc: "We handle sensitive data — giving records, personal information, sermon archives. We take that responsibility seriously, always.",
    color: "#059669",
    bg: "rgba(5,150,105,0.08)",
  },
];

const TEAM_MEMBERS: TeamMember[] = [
  {
    name: "Marcus Williams",
    role: "Co-Founder & CEO",
    bio: "Former worship leader and software engineer. Built My Church after watching too many media teams struggle with disconnected tools.",
    avatar: "MW",
    color: "var(--church-blue)",
    bg: "rgba(27,58,122,0.1)",
  },
  {
    name: "Priya Anand",
    role: "Co-Founder & CTO",
    bio: "15 years in realtime systems engineering. Designed the sub-10ms synchronization engine that powers every service.",
    avatar: "PA",
    color: "#7C3AED",
    bg: "rgba(124,58,237,0.1)",
  },
  {
    name: "Rachel Thompson",
    role: "Head of Church Success",
    bio: "Former church administrator with deep experience in ministry operations. Leads our onboarding and support teams.",
    avatar: "RT",
    color: "var(--church-gold)",
    bg: "rgba(200,150,44,0.1)",
  },
  {
    name: "James Okafor",
    role: "Head of Design",
    bio: "Believes church technology should be beautiful and serene. Responsible for every pixel of the My Church experience.",
    avatar: "JO",
    color: "#059669",
    bg: "rgba(5,150,105,0.1)",
  },
];

const COMPANY_STATS: CompanyStat[] = [
  { value: "2,400+", label: "Churches Served" },
  { value: "1.2M", label: "Congregation Members" },
  { value: "47", label: "Team Members" },
  { value: "2019", label: "Founded" },
];

const MISSION_STATEMENT: string = 
  "My Church exists to make church communication simpler, community stronger, and spiritual engagement more accessible for every member.";

const ABOUT_PARAGRAPHS: string[] = [
  "My Church is a modern church engagement platform designed to strengthen the connection between churches and their congregations. We believe that church is more than a Sunday service — it is a living community that thrives through communication, discipleship, fellowship, and shared purpose.",
  "Our platform brings the entire church experience into one place, allowing members to stay connected through live scripture synchronization, announcements, sermon notes, ministry communities, church feeds, and meaningful interactions throughout the week.",
  "Whether in the sanctuary, at home, or on the go, My Church helps believers stay engaged, informed, and connected to the life of their church.",
];

// Helper functions
const getTeamMemberInitials = (name: string): string => {
  return name
    .split(" ")
    .map(word => word.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

// Custom hooks
const useTeamMembers = (): TeamMember[] => {
  return useMemo(() => TEAM_MEMBERS, []);
};

const useCompanyValues = (): CompanyValue[] => {
  return useMemo(() => COMPANY_VALUES, []);
};

const useCompanyStats = (): CompanyStat[] => {
  return useMemo(() => COMPANY_STATS, []);
};

// Sub-components
const StatCard: React.FC<StatCardProps> = React.memo(({ stat }) => {
  return (
    <div
      className="p-6 rounded-2xl text-center transition-all hover:shadow-md"
      style={{ background: "var(--card)", border: "1px solid var(--border)" }}
      role="article"
      aria-label={`${stat.value} ${stat.label}`}
    >
      <div
        className="text-3xl font-bold mb-1"
        style={{ fontFamily: "var(--font-display)", color: "var(--church-blue)" }}
      >
        {stat.value}
      </div>
      <div className="text-sm" style={{ color: "var(--muted-foreground)" }}>
        {stat.label}
      </div>
    </div>
  );
});

StatCard.displayName = "StatCard";

const ValueCard: React.FC<ValueCardProps> = React.memo(({ value }) => {
  const Icon: LucideIcon = value.icon;

  return (
    <div
      className="p-6 rounded-2xl flex gap-4 transition-all hover:shadow-md"
      style={{ background: "var(--card)", border: "1px solid var(--border)" }}
      role="article"
      aria-label={value.title}
    >
      <div 
        className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" 
        style={{ background: value.bg }}
        aria-hidden="true"
      >
        <Icon size={20} style={{ color: value.color }} />
      </div>
      <div>
        <h3 
          className="font-semibold mb-1" 
          style={{ color: "var(--foreground)", fontFamily: "var(--font-display)" }}
        >
          {value.title}
        </h3>
        <p className="text-sm leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
          {value.desc}
        </p>
      </div>
    </div>
  );
});

ValueCard.displayName = "ValueCard";

const TeamMemberCard: React.FC<TeamMemberCardProps> = React.memo(({ member }) => {
  return (
    <div
      className="p-5 rounded-2xl text-center transition-all hover:-translate-y-1 hover:shadow-md"
      style={{ background: "var(--card)", border: "1px solid var(--border)" }}
      role="article"
      aria-label={`${member.name}, ${member.role}`}
    >
      <div
        className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-lg font-bold"
        style={{ 
          background: member.bg, 
          color: member.color, 
          border: `2px solid ${member.color}30` 
        }}
        aria-hidden="true"
      >
        {member.avatar}
      </div>
      <h3 
        className="font-semibold mb-0.5" 
        style={{ color: "var(--foreground)", fontFamily: "var(--font-display)" }}
      >
        {member.name}
      </h3>
      <div className="text-xs mb-3 font-medium" style={{ color: member.color }}>
        {member.role}
      </div>
      <p className="text-xs leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
        {member.bio}
      </p>
    </div>
  );
});

TeamMemberCard.displayName = "TeamMemberCard";

const MissionQuote: React.FC = () => {
  return (
    <blockquote
      className="mt-8 p-5 rounded-2xl"
      style={{ 
        background: "rgba(27,58,122,0.06)", 
        border: "1px solid rgba(27,58,122,0.15)" 
      }}
      cite="My Church Mission Statement"
    >
      <p
        className="leading-relaxed"
        style={{ 
          fontFamily: "var(--font-display)", 
          fontStyle: "italic", 
          fontSize: "1.05rem", 
          color: "var(--church-blue)" 
        }}
      >
        "{MISSION_STATEMENT}"
      </p>
    </blockquote>
  );
};

const GlobalPresenceCard: React.FC = () => {
  return (
    <div
      className="mt-4 p-5 rounded-2xl"
      style={{ 
        background: "linear-gradient(135deg, #1B3A7A, #2A4F9E)", 
        boxShadow: "0 8px 32px rgba(27,58,122,0.25)" 
      }}
      role="region"
      aria-label="Global presence"
    >
      <div className="text-white/50 text-xs mb-2">
        Founded in Atlanta, GA — serving churches worldwide
      </div>
      <div 
        className="text-white font-semibold" 
        style={{ fontFamily: "var(--font-display)" }}
      >
        Every Sunday, over 1.2 million congregation members use My Church to engage with their faith community.
      </div>
    </div>
  );
};

const AboutContent: React.FC = () => {
  return (
    <div>
      <h2
        className="mb-5"
        style={{ 
          fontFamily: "var(--font-display)", 
          fontSize: "clamp(1.8rem,3.5vw,2.4rem)", 
          fontWeight: 700, 
          color: "var(--foreground)", 
          lineHeight: 1.2 
        }}
      >
        Who We Are
      </h2>
      <div className="space-y-4 text-base leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
        {ABOUT_PARAGRAPHS.map((paragraph: string, index: number) => (
          <p key={`about-para-${index}`}>
            {index === 0 && (
              <strong style={{ color: "var(--foreground)" }}>
                My Church{" "}
              </strong>
            )}
            {index === 0 
              ? paragraph.replace("My Church", "") 
              : paragraph}
          </p>
        ))}
      </div>
      <MissionQuote />
    </div>
  );
};

const CTASection: React.FC = () => {
  return (
    <section
      className="py-20"
      style={{ background: "linear-gradient(135deg, #0B1A40, #1B3A7A)" }}
      aria-labelledby="cta-heading"
    >
      <div className="max-w-2xl mx-auto px-6 text-center">
        <span id="cta-heading" className="sr-only">Call to Action</span>
        
        <h2
          className="text-white mb-4"
          style={{ 
            fontFamily: "var(--font-display)", 
            fontSize: "clamp(1.8rem,3.5vw,2.4rem)", 
            fontWeight: 700 
          }}
        >
          Driven by Purpose
        </h2>
        <p className="text-white/60 mb-8 leading-relaxed">
          Our mission isn't a tagline — it's the reason we come to work. Learn more about what drives us.
        </p>
        <div className="flex flex-wrap gap-4 justify-center" role="group" aria-label="Action buttons">
          <Link
            to="/our-mission"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-white transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
            style={{ 
              background: "var(--church-gold)", 
              boxShadow: "0 4px 20px rgba(200,150,44,0.4)" 
            }}
            aria-label="Learn about our mission"
          >
            Our Mission <ArrowRight size={18} aria-hidden="true" />
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
            style={{ 
              background: "rgba(255,255,255,0.1)", 
              border: "1px solid rgba(255,255,255,0.2)", 
              color: "#fff" 
            }}
            aria-label="Get in touch with us"
          >
            Get in Touch
          </Link>
        </div>
      </div>
    </section>
  );
};

// Main Component
const AboutUsPage: React.FC = () => {
  const teamMembers = useTeamMembers();
  const companyValues = useCompanyValues();
  const companyStats = useCompanyStats();

  return (
    <PageLayout>
      <PageHero
        badge="Our Story"
        title={
          <>
            Technology in Service
            <br />
            <em style={{ color: "var(--church-gold-light)" }}>of the Church</em>
          </>
        }
        subtitle="My Church was born from a simple conviction: the church deserves technology built for its unique mission — not adapted from corporate tools."
      />

      {/* About Section */}
      <section 
        className="py-20" 
        style={{ background: "var(--background)" }}
        aria-labelledby="about-heading"
      >
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <span id="about-heading" className="sr-only">About My Church</span>
          
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <AboutContent />

            {/* Stats */}
            <div>
              <div 
                className="grid grid-cols-2 gap-4"
                role="list"
                aria-label="Company statistics"
              >
                {companyStats.map((stat: CompanyStat) => (
                  <div key={stat.label} role="listitem">
                    <StatCard stat={stat} />
                  </div>
                ))}
              </div>
              <GlobalPresenceCard />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section 
        className="py-20" 
        style={{ background: "linear-gradient(180deg, #EEF2FB, #F8F9FC)" }}
        aria-labelledby="values-heading"
      >
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <h2
            id="values-heading"
            className="text-center mb-10"
            style={{ 
              fontFamily: "var(--font-display)", 
              fontSize: "clamp(1.6rem,3vw,2.2rem)", 
              fontWeight: 700, 
              color: "var(--foreground)" 
            }}
          >
            What We Believe
          </h2>
          <div 
            className="grid sm:grid-cols-2 gap-5"
            role="list"
            aria-label="Company values"
          >
            {companyValues.map((value: CompanyValue) => (
              <div key={value.title} role="listitem">
                <ValueCard value={value} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section 
        className="py-20" 
        style={{ background: "var(--background)" }}
        aria-labelledby="team-heading"
      >
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2
              id="team-heading"
              style={{ 
                fontFamily: "var(--font-display)", 
                fontSize: "clamp(1.6rem,3vw,2.2rem)", 
                fontWeight: 700, 
                color: "var(--foreground)" 
              }}
            >
              Leadership Team
            </h2>
            <p className="mt-2 text-sm" style={{ color: "var(--muted-foreground)" }}>
              A team united by faith, technology, and a deep love for the local church.
            </p>
          </div>
          <div 
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5"
            role="list"
            aria-label="Leadership team members"
          >
            {teamMembers.map((member: TeamMember) => (
              <div key={member.name} role="listitem">
                <TeamMemberCard member={member} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </PageLayout>
  );
};

// Export with metadata
export default React.memo(AboutUsPage);

// Export types for reuse
export type { 
  CompanyValue, 
  TeamMember, 
  CompanyStat, 
  ValueCardProps, 
  TeamMemberCardProps 
};

// Export constants if needed elsewhere
export { COMPANY_VALUES, TEAM_MEMBERS, COMPANY_STATS, MISSION_STATEMENT };