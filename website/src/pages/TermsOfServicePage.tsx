import React, { useMemo, useState, useCallback } from "react";
import { Link } from "react-router";
import { PageLayout, PageHero } from "../components/Layout";

// Types
interface TermsSection {
  id: string;
  title: string;
  content: string;
  lastModified?: string;
}

interface TermsOfServiceProps {
  lastUpdated?: string;
  companyName?: string;
  contactEmail?: string;
  showTableOfContents?: boolean;
}

interface TableOfContentsProps {
  sections: TermsSection[];
  activeSection?: string;
  onSectionClick?: (sectionId: string) => void;
}

interface TermsSectionProps {
  section: TermsSection;
  index: number;
}

interface DisclaimerBannerProps {
  companyName: string;
  contactPath: string;
}

interface LastModifiedBadgeProps {
  date: string;
}

// Constants
const COMPANY_NAME: string = "My Church Platform LLC";
const CONTACT_EMAIL: string = "legal@mychurch.app";
const LAST_UPDATED_DATE: string = "June 1, 2026";
const GOVERNING_STATE: string = "Georgia";
const GOVERNING_COUNTY: string = "Fulton County";

const TERMS_SECTIONS: TermsSection[] = [
  {
    id: "acceptance",
    title: "1. Acceptance of Terms",
    content: `By creating a My Church account, accessing the My Church platform, or downloading the My Church congregation app, you agree to be bound by these Terms of Service ("Terms"). If you are entering into these Terms on behalf of a church or organization, you represent that you have the authority to bind that organization.

If you do not agree to these Terms, please do not access or use the My Church platform.`,
  },
  {
    id: "description",
    title: "2. Description of Service",
    content: `My Church provides a digital church engagement platform including a congregation mobile application, realtime scripture synchronization tools, ministry community channels, sermon notes, church feed, announcements, giving management, and a media team dashboard (collectively, the "Service").

The Service is designed for use by registered churches ("Church Accounts") and their congregation members ("Members"). Access levels, features, and limits vary based on your subscription plan.`,
  },
  {
    id: "registration",
    title: "3. Account Registration",
    content: `To access the Service, you must register for a church account using accurate and complete information. You are responsible for:

• Maintaining the confidentiality of your account credentials.
• All activities that occur under your account.
• Promptly notifying us of any unauthorized use of your account.
• Ensuring that all administrators and ministry leaders you invite agree to these Terms.

My Church reserves the right to suspend or terminate accounts that provide false information or violate these Terms.`,
  },
  {
    id: "acceptable-use",
    title: "4. Acceptable Use",
    content: `You agree to use the Service only for lawful purposes and in accordance with these Terms. You may not:

• Use the Service to distribute illegal content, harassment, hate speech, or material that violates any applicable law.
• Attempt to reverse engineer, decompile, or access the underlying source code of the platform.
• Use automated tools to scrape, collect, or extract data from the platform without written permission.
• Interfere with or disrupt the integrity or performance of the Service.
• Share account credentials with unauthorized users.
• Use the giving feature for purposes other than legitimate charitable giving.

My Church reserves the right to remove content and suspend accounts that violate this policy without prior notice.`,
  },
  {
    id: "billing",
    title: "5. Subscription and Billing",
    content: `My Church offers subscription plans as described on our Pricing page. By selecting a paid plan, you agree to pay the applicable fees.

• Billing: subscriptions are billed monthly or annually, in advance.
• Cancellation: you may cancel at any time. Cancellation takes effect at the end of your current billing period. No pro-rated refunds are issued for the remaining period.
• Price changes: we will provide 30 days' notice of any price increases. Your continued use of the Service after the notice period constitutes acceptance of the new pricing.
• Giving transaction fees: separate transaction fees apply to congregation giving, as listed on the Pricing page. These fees are deducted at the time of transaction.`,
  },
  {
    id: "intellectual-property",
    title: "6. Intellectual Property",
    content: `My Church and its licensors own all intellectual property rights in the platform, including software, design, trademarks, and documentation. You are granted a limited, non-exclusive, non-transferable license to access and use the Service solely in accordance with these Terms.

Your church retains all ownership rights to content you upload, including sermons, announcements, and church media. By uploading content to the platform, you grant My Church a limited license to host, display, and transmit that content for the purpose of providing the Service.`,
  },
  {
    id: "privacy",
    title: "7. Privacy",
    content: `Our collection and use of personal information is governed by our Privacy Policy, which is incorporated into these Terms by reference. By using the Service, you agree to our Privacy Policy.`,
  },
  {
    id: "liability",
    title: "8. Limitation of Liability",
    content: `To the maximum extent permitted by law, My Church shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of the Service, even if we have been advised of the possibility of such damages.

Our total liability to you for any claims arising under these Terms shall not exceed the total fees paid by you to My Church in the 12 months preceding the claim.`,
  },
  {
    id: "disclaimers",
    title: "9. Disclaimers",
    content: `The Service is provided "as is" and "as available" without warranties of any kind, either express or implied, including warranties of merchantability, fitness for a particular purpose, or non-infringement. We do not guarantee that the Service will be error-free, uninterrupted, or meet your specific requirements.`,
  },
  {
    id: "termination",
    title: "10. Termination",
    content: `We may terminate or suspend your access to the Service at any time, without prior notice, if you violate these Terms or if we determine that continued access poses a risk to the platform or other users.

Upon termination, your right to use the Service will immediately cease. Sections of these Terms that by their nature should survive termination will survive.`,
  },
  {
    id: "changes",
    title: "11. Changes to Terms",
    content: `We may update these Terms from time to time. We will notify church administrators of material changes via email at least 30 days before the changes take effect. Continued use of the Service after the effective date of changes constitutes acceptance.`,
  },
  {
    id: "governing-law",
    title: "12. Governing Law",
    content: `These Terms are governed by the laws of the State of ${GOVERNING_STATE}, United States, without regard to conflict of law principles. Any disputes arising under these Terms shall be resolved exclusively in the courts of ${GOVERNING_COUNTY}, ${GOVERNING_STATE}.`,
  },
  {
    id: "contact",
    title: "13. Contact",
    content: `For questions about these Terms, please contact us at ${CONTACT_EMAIL} or write to us at ${COMPANY_NAME}, Atlanta, ${GOVERNING_STATE}, USA.`,
  },
];

// Helper functions
const generateSectionId = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

const getReadingTime = (sections: TermsSection[]): number => {
  const totalWords = sections.reduce((count: number, section: TermsSection) => {
    return count + section.content.split(/\s+/).length;
  }, 0);
  
  return Math.ceil(totalWords / 200); // Average reading speed: 200 words per minute
};

// Custom hooks
const useTermsNavigation = (sections: TermsSection[]) => {
  const [activeSection, setActiveSection] = useState<string>("");

  const handleSectionClick = useCallback((sectionId: string): void => {
    setActiveSection(sectionId);
    
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  return {
    activeSection,
    handleSectionClick,
  };
};

// Sub-components
const LastModifiedBadge: React.FC<LastModifiedBadgeProps> = React.memo(({ date }) => {
  return (
    <div
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium mb-8"
      style={{
        background: "rgba(27,58,122,0.08)",
        border: "1px solid rgba(27,58,122,0.15)",
        color: "var(--church-blue)",
      }}
      role="note"
      aria-label={`Last updated on ${date}`}
    >
      📅 Last updated: {date}
    </div>
  );
});

LastModifiedBadge.displayName = "LastModifiedBadge";

const DisclaimerBanner: React.FC<DisclaimerBannerProps> = React.memo(({ companyName, contactPath }) => {
  return (
    <div
      className="rounded-2xl p-6 mb-10"
      style={{
        background: "rgba(27,58,122,0.06)",
        border: "1px solid rgba(27,58,122,0.15)",
      }}
      role="note"
      aria-label="Important notice"
    >
      <p className="text-sm leading-relaxed" style={{ color: "var(--foreground)" }}>
        Please read these Terms of Service carefully before using the My Church platform.
        These Terms constitute a legally binding agreement between you and {companyName}.
        If you have questions, please{" "}
        <Link
          to={contactPath}
          style={{ color: "var(--church-blue)" }}
          className="hover:underline focus:outline-none focus:underline"
          aria-label="Contact us about terms"
        >
          contact us
        </Link>.
      </p>
    </div>
  );
});

DisclaimerBanner.displayName = "DisclaimerBanner";

const TableOfContents: React.FC<TableOfContentsProps> = React.memo(({ 
  sections, 
  activeSection, 
  onSectionClick 
}) => {
  return (
    <nav
      className="mb-10 p-6 rounded-2xl"
      style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
      }}
      aria-label="Table of contents"
    >
      <h2
        className="font-semibold mb-4 text-sm"
        style={{
          fontFamily: "var(--font-display)",
          color: "var(--foreground)",
        }}
      >
        Contents
      </h2>
      <ul className="space-y-2" role="list">
        {sections.map((section: TermsSection) => (
          <li key={section.id}>
            <button
              onClick={() => onSectionClick?.(section.id)}
              className={`text-sm text-left w-full hover:text-foreground transition-colors focus:outline-none focus:underline ${
                activeSection === section.id ? 'font-semibold' : ''
              }`}
              style={{
                color: activeSection === section.id
                  ? "var(--church-blue)"
                  : "var(--muted-foreground)",
              }}
              aria-label={`Go to ${section.title}`}
            >
              {section.title}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
});

TableOfContents.displayName = "TableOfContents";

const TermsSectionBlock: React.FC<TermsSectionProps> = React.memo(({ section, index }) => {
  return (
    <div id={section.id} className="scroll-mt-24">
      <h2
        className="mb-4"
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontSize: "1.15rem",
          color: "var(--foreground)",
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
  );
});

TermsSectionBlock.displayName = "TermsSectionBlock";

const ReadingTimeEstimate: React.FC<{ minutes: number }> = React.memo(({ minutes }) => {
  return (
    <div
      className="flex items-center gap-2 text-xs mb-6"
      style={{ color: "var(--muted-foreground)" }}
      aria-label={`Estimated reading time: ${minutes} minutes`}
    >
      ⏱️ Estimated reading time: {minutes} min
    </div>
  );
});

ReadingTimeEstimate.displayName = "ReadingTimeEstimate";

// Main Component
const TermsOfServicePage: React.FC<TermsOfServiceProps> = ({
  lastUpdated = LAST_UPDATED_DATE,
  companyName = COMPANY_NAME,
  contactEmail = CONTACT_EMAIL,
  showTableOfContents = true,
}) => {
  const { activeSection, handleSectionClick } = useTermsNavigation(TERMS_SECTIONS);
  const readingTime = useMemo(() => getReadingTime(TERMS_SECTIONS), []);

  // Track page view
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      console.log(`Terms of Service page viewed - ${new Date().toISOString()}`);
      // Add analytics tracking here
    }
  }, []);

  return (
    <PageLayout>
      <PageHero
        badge="Terms of Service"
        title="Terms of Service"
        subtitle={`Last updated: ${lastUpdated}`}
        dark={false}
      />

      <section
        className="pb-24"
        style={{ background: "var(--background)" }}
        aria-labelledby="terms-heading"
      >
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <span id="terms-heading" className="sr-only">
            Terms of Service
          </span>

          <LastModifiedBadge date={lastUpdated} />
          <ReadingTimeEstimate minutes={readingTime} />

          <DisclaimerBanner
            companyName={companyName}
            contactPath="/contact"
          />

          {showTableOfContents && (
            <TableOfContents
              sections={TERMS_SECTIONS}
              activeSection={activeSection}
              onSectionClick={handleSectionClick}
            />
          )}

          <div className="space-y-10">
            {TERMS_SECTIONS.map((section: TermsSection, index: number) => (
              <TermsSectionBlock
                key={section.id}
                section={section}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

// Export with memo for performance
export default React.memo(TermsOfServicePage);

// Export types for reuse
export type {
  TermsSection,
  TermsOfServiceProps,
  TableOfContentsProps,
  TermsSectionProps,
  DisclaimerBannerProps,
  LastModifiedBadgeProps,
};

// Export constants if needed elsewhere
export {
  TERMS_SECTIONS,
  COMPANY_NAME,
  CONTACT_EMAIL,
  LAST_UPDATED_DATE,
};