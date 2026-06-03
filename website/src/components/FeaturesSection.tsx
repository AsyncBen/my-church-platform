import React from "react";
import {
  Zap,
  Users,
  BookOpen,
  Rss,
  Bell,
  Heart,
  Monitor,
  Smartphone,
  LucideIcon,
} from "lucide-react";

// Types
interface Feature {
  icon: LucideIcon;
  title: string;
  desc: string;
  tag: string;
  color: string;
  bg: string;
}

interface FeatureCardProps {
  feature: Feature;
}

// Data
const features: Feature[] = [
  {
    icon: Zap,
    title: "Live Scripture Synchronization",
    desc: "Every verse displayed on the media panel instantly appears on every congregation member's phone. No delays, no distractions.",
    tag: "Flagship",
    color: "var(--church-blue-light)",
    bg: "rgba(61,107,196,0.08)",
  },
  {
    icon: Users,
    title: "Ministry Communities",
    desc: "Youth ministry, worship team, prayer groups — each with their own internal communication channel and member directory.",
    tag: "Community",
    color: "#059669",
    bg: "rgba(5,150,105,0.08)",
  },
  {
    icon: BookOpen,
    title: "Sermon Notes",
    desc: "Follow along with synchronized notes, save highlighted scriptures, and revisit teachings from past services anytime.",
    tag: "Discipleship",
    color: "var(--church-gold)",
    bg: "rgba(200,150,44,0.08)",
  },
  {
    icon: Rss,
    title: "Church Feed",
    desc: "A curated, pastor-approved feed of updates, devotionals, and community stories that keeps your congregation engaged all week.",
    tag: "Engagement",
    color: "#7C3AED",
    bg: "rgba(124,58,237,0.08)",
  },
  {
    icon: Bell,
    title: "Announcements",
    desc: "Push announcements to your entire church, specific ministries, or individual members — with read receipts and scheduling.",
    tag: "Communication",
    color: "#DC2626",
    bg: "rgba(220,38,38,0.08)",
  },
  {
    icon: Heart,
    title: "Giving Tracking",
    desc: "Transparent, simple giving with real-time fund tracking and church-friendly reporting designed with ministry in mind.",
    tag: "Stewardship",
    color: "#C8962C",
    bg: "rgba(200,150,44,0.08)",
  },
  {
    icon: Monitor,
    title: "Realtime Media Panel",
    desc: "A purpose-built dashboard for your media team — manage scripture queues, broadcast content, and monitor the live experience.",
    tag: "Leadership",
    color: "var(--church-blue)",
    bg: "rgba(27,58,122,0.08)",
  },
  {
    icon: Smartphone,
    title: "Congregation App",
    desc: "A beautifully designed mobile app that becomes every member's personal connection to their church, 24/7.",
    tag: "Mobile",
    color: "#0891B2",
    bg: "rgba(8,145,178,0.08)",
  },
];

// Components
const FeatureCard: React.FC<FeatureCardProps> = ({ feature }) => {
  const Icon: LucideIcon = feature.icon;

  return (
    <div
      className="relative rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group cursor-default"
      style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
      }}
      role="article"
      aria-label={`${feature.title} - ${feature.tag}`}
    >
      {/* Tag */}
      <span
        className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full text-xs font-semibold"
        style={{ background: feature.bg, color: feature.color }}
      >
        {feature.tag}
      </span>

      {/* Icon */}
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
        style={{ background: feature.bg }}
      >
        <Icon size={22} style={{ color: feature.color }} aria-hidden="true" />
      </div>

      <h3
        className="mb-2 text-base font-semibold leading-snug"
        style={{ color: "var(--foreground)", fontFamily: "var(--font-display)" }}
      >
        {feature.title}
      </h3>
      <p className="text-sm leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
        {feature.desc}
      </p>
    </div>
  );
};

const SectionHeader: React.FC = () => {
  return (
    <div className="text-center mb-16 max-w-2xl mx-auto">
      <div
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-sm font-medium"
        style={{
          background: "rgba(27,58,122,0.08)",
          border: "1px solid rgba(27,58,122,0.15)",
          color: "var(--church-blue)",
        }}
        role="banner"
      >
        Everything Your Church Needs
      </div>
      <h2
        className="mb-4"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(2rem, 4vw, 3rem)",
          fontWeight: 700,
          color: "var(--foreground)",
          lineHeight: 1.2,
        }}
      >
        A Complete Platform for
        <br />
        <em style={{ color: "var(--church-blue)", fontStyle: "italic" }}>Modern Ministry</em>
      </h2>
      <p className="text-base leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
        From the sanctuary to small groups, My Church equips every layer of your church
        with tools designed for community, not just communication.
      </p>
    </div>
  );
};

export const FeaturesSection: React.FC = () => {
  return (
    <section 
      id="features" 
      className="py-24 lg:py-32" 
      style={{ background: "var(--background)" }}
      aria-labelledby="features-heading"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <span id="features-heading" className="sr-only">Platform Features</span>
        
        <SectionHeader />

        {/* Grid */}
        <div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          role="list"
          aria-label="Feature cards"
        >
          {features.map((feature: Feature) => (
            <div key={feature.title} role="listitem">
              <FeatureCard feature={feature} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;