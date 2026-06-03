import React from "react";
import { Heart, ShieldCheck, BarChart3, ChevronRight, LucideIcon } from "lucide-react";

// Types
interface QuickAmount {
  amount: string;
  index: number;
}

interface FrequencyOption {
  label: string;
  index: number;
}

interface FeaturePoint {
  icon: LucideIcon;
  title: string;
  desc: string;
}

interface FeaturePointProps {
  feature: FeaturePoint;
}

interface AmountButtonProps {
  amount: string;
  isSelected: boolean;
  onClick?: () => void;
}

interface FrequencyButtonProps {
  label: string;
  isSelected: boolean;
  onClick?: () => void;
}

// Constants
const QUICK_AMOUNTS: string[] = ["$20", "$50", "$100"];
const FREQUENCY_OPTIONS: string[] = ["One-time", "Weekly", "Monthly"];
const FEATURE_POINTS: FeaturePoint[] = [
  {
    icon: ShieldCheck,
    title: "Bank-level security",
    desc: "Every transaction is encrypted and PCI-DSS compliant for complete peace of mind.",
  },
  {
    icon: BarChart3,
    title: "Church-friendly reporting",
    desc: "Real-time fund dashboards for leadership and instant tax receipts for every giver.",
  },
  {
    icon: Heart,
    title: "Multiple giving funds",
    desc: "Members can direct their gifts to general offerings, building funds, missions, and more.",
  },
];

// Sub-components
const AmountButton: React.FC<AmountButtonProps> = ({ amount, isSelected, onClick }) => {
  const buttonStyles: React.CSSProperties = {
    background: isSelected ? "var(--church-gold)" : "rgba(255,255,255,0.06)",
    color: isSelected ? "#fff" : "rgba(255,255,255,0.5)",
  };

  return (
    <button
      className="py-2 rounded-lg text-xs font-semibold transition-all hover:opacity-90"
      style={buttonStyles}
      onClick={onClick}
      aria-pressed={isSelected}
      aria-label={`Select ${amount} amount`}
    >
      {amount}
    </button>
  );
};

const FrequencyButton: React.FC<FrequencyButtonProps> = ({ label, isSelected, onClick }) => {
  const buttonStyles: React.CSSProperties = {
    background: isSelected ? "rgba(27,58,122,0.3)" : "rgba(255,255,255,0.04)",
    border: isSelected ? "1px solid rgba(61,107,196,0.4)" : "none",
    color: isSelected ? "#7EA8E8" : "rgba(255,255,255,0.3)",
  };

  return (
    <button
      className="flex-1 py-1.5 rounded-lg text-center transition-all hover:opacity-90"
      style={buttonStyles}
      onClick={onClick}
      aria-pressed={isSelected}
      aria-label={`Select ${label} frequency`}
    >
      {label}
    </button>
  );
};

const FeaturePointItem: React.FC<FeaturePointProps> = ({ feature }) => {
  const { icon: Icon, title, desc } = feature;

  return (
    <div className="flex items-start gap-4" role="listitem">
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{ background: "rgba(200,150,44,0.1)" }}
        aria-hidden="true"
      >
        <Icon size={18} style={{ color: "var(--church-gold)" }} />
      </div>
      <div>
        <div
          className="font-semibold text-sm mb-1"
          style={{ color: "var(--foreground)", fontFamily: "var(--font-display)" }}
        >
          {title}
        </div>
        <div className="text-sm leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
          {desc}
        </div>
      </div>
    </div>
  );
};

const GivingMockup: React.FC = () => {
  const [selectedAmount, setSelectedAmount] = React.useState<string>("$50.00");
  const [selectedFrequency, setSelectedFrequency] = React.useState<string>("One-time");
  const [selectedFund, setSelectedFund] = React.useState<string>("General Offering");

  const handleAmountSelect = (amount: string): void => {
    setSelectedAmount(amount);
  };

  const handleFrequencySelect = (frequency: string): void => {
    setSelectedFrequency(frequency);
  };

  return (
    <div
      className="relative rounded-[2.5rem] overflow-hidden mx-auto shadow-2xl"
      style={{
        width: 240,
        height: 460,
        background: "#0F1C3F",
        border: "2px solid rgba(255,255,255,0.1)",
        boxShadow: "0 32px 80px rgba(27,58,122,0.35)",
      }}
      role="complementary"
      aria-label="Giving interface mockup"
    >
      {/* Header */}
      <div className="px-5 pt-6 pb-4">
        <div className="flex items-center justify-between mb-1">
          <span
            className="text-white font-bold text-sm"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Give
          </span>
          <Heart size={16} style={{ color: "var(--church-gold)" }} aria-hidden="true" />
        </div>
        <div className="text-white/40 text-xs">Grace Community Church</div>
      </div>

      {/* Amount selector */}
      <div className="px-4 mb-4">
        <div
          className="rounded-xl p-4 text-center mb-3"
          style={{ background: "rgba(200,150,44,0.1)", border: "1px solid rgba(200,150,44,0.2)" }}
        >
          <div className="text-white/50 text-xs mb-1">AMOUNT</div>
          <div
            className="text-3xl font-bold"
            style={{ color: "var(--church-gold-light)", fontFamily: "var(--font-display)" }}
            aria-live="polite"
            aria-label={`Selected amount: ${selectedAmount}`}
          >
            {selectedAmount}
          </div>
        </div>

        {/* Quick amounts */}
        <div className="grid grid-cols-3 gap-2 mb-3" role="group" aria-label="Quick amount selection">
          {QUICK_AMOUNTS.map((amount: string, index: number) => (
            <AmountButton
              key={amount}
              amount={amount}
              isSelected={selectedAmount === amount}
              onClick={() => handleAmountSelect(amount)}
            />
          ))}
        </div>

        {/* Fund selector */}
        <div
          className="rounded-xl p-3 mb-3"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="text-white/40 text-xs mb-1">FUND</div>
          <button
            className="flex items-center justify-between w-full text-left"
            onClick={() => {/* Handle fund selection */}}
            aria-label={`Selected fund: ${selectedFund}. Click to change`}
          >
            <span className="text-white/80 text-xs font-medium">{selectedFund}</span>
            <span className="text-white/30 text-xs" aria-hidden="true">▾</span>
          </button>
        </div>

        {/* Frequency */}
        <div className="flex gap-2 mb-4" role="group" aria-label="Giving frequency selection">
          {FREQUENCY_OPTIONS.map((frequency: string, index: number) => (
            <FrequencyButton
              key={frequency}
              label={frequency}
              isSelected={selectedFrequency === frequency}
              onClick={() => handleFrequencySelect(frequency)}
            />
          ))}
        </div>

        {/* Give button */}
        <button
          className="w-full py-3 rounded-xl font-semibold text-white text-sm transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
          style={{ background: "var(--church-gold)", boxShadow: "0 4px 16px rgba(200,150,44,0.35)" }}
          aria-label={`Give ${selectedAmount} to ${selectedFund}`}
        >
          Give {selectedAmount}
        </button>
      </div>

      {/* YTD giving */}
      <div
        className="absolute bottom-0 left-0 right-0 p-4"
        style={{ background: "rgba(0,0,0,0.3)", backdropFilter: "blur(8px)" }}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="text-white/40 text-xs">YTD Giving</div>
            <div
              className="font-bold"
              style={{ 
                color: "var(--church-gold-light)", 
                fontFamily: "var(--font-display)", 
                fontSize: 18 
              }}
              aria-label="Year to date giving: $2,150"
            >
              $2,150
            </div>
          </div>
          <div
            className="px-3 py-1.5 rounded-full text-xs font-medium"
            style={{ background: "rgba(5,150,105,0.15)", color: "#34D399" }}
          >
            ✓ Tax receipts ready
          </div>
        </div>
      </div>
    </div>
  );
};

export const GivingSection: React.FC = () => {
  return (
    <section
      id="giving"
      className="py-24 lg:py-32"
      style={{ background: "var(--background)" }}
      aria-labelledby="giving-heading"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <span id="giving-heading" className="sr-only">Giving Section</span>
        
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <div>
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-sm font-medium"
              style={{
                background: "rgba(200,150,44,0.1)",
                border: "1px solid rgba(200,150,44,0.25)",
                color: "var(--church-gold)",
              }}
              role="banner"
            >
              <Heart size={14} aria-hidden="true" />
              Generous Giving
            </div>

            <h2
              className="mb-5 leading-tight"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
                fontWeight: 700,
                color: "var(--foreground)",
              }}
            >
              Giving Made Simple,
              <br />
              <em style={{ color: "var(--church-blue)", fontStyle: "italic" }}>Transparent & Faithful</em>
            </h2>

            <p className="text-base leading-relaxed mb-10" style={{ color: "var(--muted-foreground)" }}>
              My Church's giving flow is designed for the congregation — not for fintech.
              Simple, secure, and built around the values of transparency and stewardship.
            </p>

            <div 
              className="space-y-5 mb-10"
              role="list"
              aria-label="Giving features"
            >
              {FEATURE_POINTS.map((feature: FeaturePoint) => (
                <FeaturePointItem key={feature.title} feature={feature} />
              ))}
            </div>

            <a
              href="#download"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white text-sm transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
              style={{ background: "var(--church-gold)", boxShadow: "0 4px 16px rgba(200,150,44,0.3)" }}
              aria-label="Learn about giving features"
            >
              Learn About Giving
              <ChevronRight size={16} aria-hidden="true" />
            </a>
          </div>

          {/* Phone */}
          <div className="flex justify-center">
            <GivingMockup />
          </div>
        </div>
      </div>
    </section>
  );
};

export default GivingSection;