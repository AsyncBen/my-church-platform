import React, { useState, useCallback, useMemo } from "react";
import { CheckCircle, ArrowRight, Clock } from "lucide-react";
import { Link } from "react-router";
import { PageLayout, PageHero } from "../components/Layout";

// Types
interface OnboardingStep {
  number: string;
  title: string;
  duration: string;
  color: string;
  tasks: string[];
  tip: string;
}

interface OnboardingResource {
  emoji: string;
  title: string;
  desc: string;
}

interface StepButtonProps {
  step: OnboardingStep;
  index: number;
  isActive: boolean;
  onClick: (index: number) => void;
}

interface StepDetailProps {
  step: OnboardingStep;
  isFirst: boolean;
  isLast: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

interface ResourceCardProps {
  resource: OnboardingResource;
  onClick?: () => void;
}

interface TaskItemProps {
  task: string;
  color: string;
}

interface NavigationButtonsProps {
  onPrevious: () => void;
  onNext: () => void;
  isFirst: boolean;
  isLast: boolean;
  color: string;
}

// Constants
const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    number: "01",
    title: "Create Your Church Account",
    duration: "5 minutes",
    color: "var(--church-gold)",
    tasks: [
      "Enter your church name and denomination",
      "Set up your administrator profile",
      "Verify your church email address",
      "Choose your subscription plan",
    ],
    tip: "You can invite additional admins after setup is complete.",
  },
  {
    number: "02",
    title: "Customize Your Church Profile",
    duration: "15 minutes",
    color: "var(--church-blue-light)",
    tasks: [
      "Upload your church logo and banner",
      "Set your brand colors",
      "Add your service times and location",
      "Write a short church description",
    ],
    tip: "Your church branding appears across all member-facing screens.",
  },
  {
    number: "03",
    title: "Set Up Ministry Communities",
    duration: "20 minutes",
    color: "#7C3AED",
    tasks: [
      "Create ministry groups (Youth, Worship, Media, etc.)",
      "Assign ministry leaders as channel admins",
      "Set visibility and access permissions",
      "Invite initial ministry members",
    ],
    tip: "Start with your top 3 most active ministries and expand later.",
  },
  {
    number: "04",
    title: "Configure the Media Dashboard",
    duration: "30 minutes",
    color: "#0891B2",
    tasks: [
      "Invite your media team members",
      "Test the scripture synchronization system",
      "Create your first sermon scripture queue",
      "Run a practice sync before Sunday",
    ],
    tip: "Run a full test sync on Saturday to ensure a smooth Sunday experience.",
  },
  {
    number: "05",
    title: "Launch to Your Congregation",
    duration: "Ongoing",
    color: "#059669",
    tasks: [
      "Share the download link with your congregation",
      "Post onboarding QR codes in your bulletin",
      "Send a welcome announcement in the church feed",
      "Go live on Sunday!",
    ],
    tip: "Most churches see 60–80% app adoption within the first three Sundays.",
  },
];

const ONBOARDING_RESOURCES: OnboardingResource[] = [
  { emoji: "📖", title: "Setup Guide PDF", desc: "A printable step-by-step guide for your setup team." },
  { emoji: "🎬", title: "Video Walkthroughs", desc: "Screen-recorded tutorials for every onboarding step." },
  { emoji: "💬", title: "Live Chat Support", desc: "Talk to our onboarding team in real time during setup." },
  { emoji: "📞", title: "Onboarding Call", desc: "Book a free 30-minute call with a My Church specialist." },
];

// Custom hooks
const useOnboardingNavigation = (totalSteps: number) => {
  const [activeStep, setActiveStep] = useState<number>(0);

  const handleStepClick = useCallback((index: number): void => {
    setActiveStep(index);
  }, []);

  const handlePrevious = useCallback((): void => {
    setActiveStep((prev: number) => Math.max(0, prev - 1));
  }, []);

  const handleNext = useCallback((): void => {
    setActiveStep((prev: number) => Math.min(totalSteps - 1, prev + 1));
  }, [totalSteps]);

  return {
    activeStep,
    handleStepClick,
    handlePrevious,
    handleNext,
    isFirst: activeStep === 0,
    isLast: activeStep === totalSteps - 1,
  };
};

// Sub-components
const StepButton: React.FC<StepButtonProps> = React.memo(({ step, index, isActive, onClick }) => {
  const handleClick = useCallback((): void => {
    onClick(index);
  }, [onClick, index]);

  return (
    <button
      onClick={handleClick}
      className="flex flex-col items-center text-center p-4 rounded-2xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
      style={{
        background: isActive ? step.color : "var(--card)",
        border: `2px solid ${isActive ? step.color : "var(--border)"}`,
        "--tw-ring-color": step.color,
      } as React.CSSProperties}
      aria-pressed={isActive}
      aria-label={`Step ${step.number}: ${step.title}`}
    >
      <div
        className="text-2xl font-bold mb-1"
        style={{
          fontFamily: "var(--font-display)",
          color: isActive ? "#fff" : step.color,
        }}
      >
        {step.number}
      </div>
      <div
        className="text-xs font-semibold leading-snug"
        style={{ color: isActive ? "rgba(255,255,255,0.9)" : "var(--foreground)" }}
      >
        {step.title}
      </div>
    </button>
  );
});

StepButton.displayName = "StepButton";

const TaskItem: React.FC<TaskItemProps> = React.memo(({ task, color }) => {
  return (
    <div className="flex items-start gap-3">
      <CheckCircle 
        size={17} 
        style={{ color, flexShrink: 0, marginTop: 1 }} 
        aria-hidden="true" 
      />
      <span className="text-sm" style={{ color: "var(--foreground)" }}>
        {task}
      </span>
    </div>
  );
});

TaskItem.displayName = "TaskItem";

const NavigationButtons: React.FC<NavigationButtonsProps> = ({ 
  onPrevious, 
  onNext, 
  isFirst, 
  isLast, 
  color 
}) => {
  return (
    <div className="mt-6 flex gap-2" role="group" aria-label="Step navigation">
      <button
        onClick={onPrevious}
        disabled={isFirst}
        className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-30 focus:outline-none focus:ring-2 focus:ring-offset-1"
        style={{ 
          background: "rgba(0,0,0,0.06)", 
          color: "var(--foreground)",
          "--tw-ring-color": color,
        } as React.CSSProperties}
        aria-label="Previous step"
      >
        ← Back
      </button>
      
      {!isLast ? (
        <button
          onClick={onNext}
          className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-1"
          style={{ 
            background: color,
            "--tw-ring-color": color,
          } as React.CSSProperties}
          aria-label="Next step"
        >
          Next Step →
        </button>
      ) : (
        <Link
          to="/contact"
          className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white text-center transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-1"
          style={{ 
            background: color,
            "--tw-ring-color": color,
          } as React.CSSProperties}
          aria-label="Contact support for final step"
        >
          Talk to Support
        </Link>
      )}
    </div>
  );
};

const StepDetail: React.FC<StepDetailProps> = React.memo(({ 
  step, 
  isFirst, 
  isLast, 
  onPrevious, 
  onNext 
}) => {
  return (
    <div
      className="rounded-2xl p-8 grid md:grid-cols-2 gap-8"
      style={{ background: "var(--card)", border: "1px solid var(--border)" }}
      role="region"
      aria-label={`Step ${step.number} details`}
      aria-live="polite"
    >
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div
            className="px-3 py-1 rounded-full text-xs font-bold"
            style={{ background: `${step.color}20`, color: step.color }}
            aria-label={`Step ${step.number}`}
          >
            STEP {step.number}
          </div>
          <div 
            className="flex items-center gap-1.5 text-xs" 
            style={{ color: "var(--muted-foreground)" }}
          >
            <Clock size={12} aria-hidden="true" /> 
            <span>{step.duration}</span>
          </div>
        </div>
        <h3
          className="mb-5"
          style={{ 
            fontFamily: "var(--font-display)", 
            fontSize: "1.5rem", 
            fontWeight: 700, 
            color: "var(--foreground)" 
          }}
        >
          {step.title}
        </h3>
        <div className="space-y-3" role="list" aria-label="Step tasks">
          {step.tasks.map((task: string) => (
            <div key={task} role="listitem">
              <TaskItem task={task} color={step.color} />
            </div>
          ))}
        </div>
      </div>
      
      <div
        className="rounded-xl p-6 flex flex-col justify-between"
        style={{ 
          background: `${step.color}08`, 
          border: `1px solid ${step.color}25` 
        }}
      >
        <div>
          <div 
            className="text-xs font-semibold mb-2 uppercase tracking-wide" 
            style={{ color: step.color }}
          >
            Pro Tip
          </div>
          <p className="text-sm leading-relaxed" style={{ color: "var(--foreground)" }}>
            {step.tip}
          </p>
        </div>
        <NavigationButtons
          onPrevious={onPrevious}
          onNext={onNext}
          isFirst={isFirst}
          isLast={isLast}
          color={step.color}
        />
      </div>
    </div>
  );
});

StepDetail.displayName = "StepDetail";

const ResourceCard: React.FC<ResourceCardProps> = React.memo(({ resource, onClick }) => {
  return (
    <div
      className="p-5 rounded-2xl text-center transition-all hover:-translate-y-1 hover:shadow-md cursor-pointer"
      style={{ background: "var(--card)", border: "1px solid var(--border)" }}
      onClick={onClick}
      onKeyDown={(e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`${resource.title}: ${resource.desc}`}
    >
      <div className="text-3xl mb-3" aria-hidden="true">
        {resource.emoji}
      </div>
      <div 
        className="font-semibold text-sm mb-2" 
        style={{ color: "var(--foreground)", fontFamily: "var(--font-display)" }}
      >
        {resource.title}
      </div>
      <div className="text-xs leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
        {resource.desc}
      </div>
    </div>
  );
});

ResourceCard.displayName = "ResourceCard";

const TimelineSteps: React.FC<{
  steps: OnboardingStep[];
  activeStep: number;
  onStepClick: (index: number) => void;
}> = React.memo(({ steps, activeStep, onStepClick }) => {
  return (
    <div 
      className="grid lg:grid-cols-5 gap-4 mb-10"
      role="tablist"
      aria-label="Onboarding steps"
    >
      {steps.map((step: OnboardingStep, index: number) => (
        <div key={step.number} role="tab" aria-selected={activeStep === index}>
          <StepButton
            step={step}
            index={index}
            isActive={activeStep === index}
            onClick={onStepClick}
          />
        </div>
      ))}
    </div>
  );
});

TimelineSteps.displayName = "TimelineSteps";

const OnboardingResources: React.FC = () => {
  const handleResourceClick = useCallback((resource: OnboardingResource): void => {
    // Handle resource click - could open modal, download, or navigate
    console.log(`Resource clicked: ${resource.title}`);
  }, []);

  return (
    <section 
      className="py-20" 
      style={{ background: "linear-gradient(180deg, #EEF2FB, #F8F9FC)" }}
      aria-labelledby="resources-heading"
    >
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        <h2
          id="resources-heading"
          className="text-center mb-10"
          style={{ 
            fontFamily: "var(--font-display)", 
            fontSize: "clamp(1.6rem,3vw,2.2rem)", 
            fontWeight: 700, 
            color: "var(--foreground)" 
          }}
        >
          Onboarding Resources
        </h2>
        <div 
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5"
          role="list"
          aria-label="Available resources"
        >
          {ONBOARDING_RESOURCES.map((resource: OnboardingResource) => (
            <div key={resource.title} role="listitem">
              <ResourceCard 
                resource={resource} 
                onClick={() => handleResourceClick(resource)} 
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CTASection: React.FC = () => {
  return (
    <section
      className="py-20"
      style={{ background: "linear-gradient(135deg, #0B1A40, #1B3A7A)" }}
      aria-labelledby="onboarding-cta-heading"
    >
      <div className="max-w-2xl mx-auto px-6 text-center">
        <span id="onboarding-cta-heading" className="sr-only">
          Get started with onboarding
        </span>
        
        <h2
          className="text-white mb-4"
          style={{ 
            fontFamily: "var(--font-display)", 
            fontSize: "clamp(1.8rem,3.5vw,2.4rem)", 
            fontWeight: 700 
          }}
        >
          Ready to Begin?
        </h2>
        <p className="text-white/60 mb-8">
          Book a free 30-minute onboarding call and we'll guide your team through the entire setup.
        </p>
        <Link
          to="/contact"
          className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-white transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
          style={{ 
            background: "var(--church-gold)", 
            boxShadow: "0 4px 20px rgba(200,150,44,0.4)" 
          }}
          aria-label="Book a free onboarding call"
        >
          Book Onboarding Call <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
};

// Main Component
const ChurchOnboardingPage: React.FC = () => {
  const {
    activeStep,
    handleStepClick,
    handlePrevious,
    handleNext,
    isFirst,
    isLast,
  } = useOnboardingNavigation(ONBOARDING_STEPS.length);

  const currentStep: OnboardingStep = useMemo(
    () => ONBOARDING_STEPS[activeStep],
    [activeStep]
  );

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrevious();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePrevious, handleNext]);

  return (
    <PageLayout>
      <PageHero
        badge="Church Onboarding"
        title={
          <>
            Up and Running
            <br />
            <em style={{ color: "var(--church-gold-light)" }}>in Under 48 Hours</em>
          </>
        }
        subtitle="Our guided onboarding process is designed to get your church fully live on My Church with minimal effort and maximum confidence."
      />

      {/* Timeline & step detail */}
      <section 
        className="py-20" 
        style={{ background: "var(--background)" }}
        aria-labelledby="onboarding-timeline-heading"
      >
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <span id="onboarding-timeline-heading" className="sr-only">
            Onboarding timeline
          </span>
          
          <TimelineSteps
            steps={ONBOARDING_STEPS}
            activeStep={activeStep}
            onStepClick={handleStepClick}
          />

          <StepDetail
            step={currentStep}
            isFirst={isFirst}
            isLast={isLast}
            onPrevious={handlePrevious}
            onNext={handleNext}
          />
        </div>
      </section>

      <OnboardingResources />
      <CTASection />
    </PageLayout>
  );
};

// Export with memo for performance
export default React.memo(ChurchOnboardingPage);

// Export types for reuse
export type { 
  OnboardingStep, 
  OnboardingResource, 
  StepButtonProps, 
  StepDetailProps,
  ResourceCardProps 
};

// Export constants if needed elsewhere
export { ONBOARDING_STEPS, ONBOARDING_RESOURCES };