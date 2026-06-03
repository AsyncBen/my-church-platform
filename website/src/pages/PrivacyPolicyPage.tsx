import { FC } from 'react'
import { Link } from 'react-router'
import { PageLayout, PageHero } from '../components/Layout'

// Types
interface PolicySection {
  title: string
  content: string
}

// Constants
const sections: PolicySection[] = [
  {
    title: '1. Information We Collect',
    content: `We collect information you provide directly to us when you create a church account, register as a congregation member, or contact our support team. This may include:

• Church and administrator details: church name, denomination, contact name, email address, phone number, and billing information.
• Congregation member data: name, email address, profile photo, ministry affiliation, and giving history (if giving is enabled).
• Usage data: how you interact with the My Church platform, including features accessed, sermon notes taken, and app session data.
• Device information: device type, operating system, app version, and unique device identifiers used for push notification delivery.

We do not collect financial account information directly. All payment data is processed by our PCI-DSS certified payment partners and is not stored on My Church servers.`,
  },
  {
    title: '2. How We Use Your Information',
    content: `We use the information we collect to:

• Operate and maintain the My Church platform and congregation app.
• Process giving transactions and generate tax receipts on behalf of your church.
• Send push notifications, announcements, and service updates as directed by your church leadership.
• Provide technical support and respond to your requests.
• Improve the platform through aggregated, anonymized usage analytics.
• Send product updates, changelog notices, and service communications.

We do not use your congregation's personal data for advertising purposes. We do not sell congregation data to any third party.`,
  },
  {
    title: '3. Data Sharing',
    content: `We share information only in the following limited circumstances:

• With your church: congregation member data is visible to church administrators and ministry leaders you have designated, as controlled by your church's privacy settings.
• With service providers: we work with third-party providers (payment processors, cloud hosting, analytics) who process data on our behalf under strict data processing agreements.
• For legal compliance: we may disclose information if required by law, court order, or to protect the safety and rights of our users.
• With your consent: we will ask your permission before sharing data in any way not described here.`,
  },
  {
    title: '4. Data Retention',
    content: `We retain your data for as long as your church account remains active. If you cancel your My Church subscription, we will retain your data for 90 days to allow for account recovery, after which it is permanently deleted from our systems.

Giving records may be retained for longer periods as required by applicable tax and financial reporting regulations. We will notify you of any extended retention requirements.`,
  },
  {
    title: '5. Security',
    content: `We take the security of your data seriously. My Church uses industry-standard security practices including:

• TLS encryption for all data in transit.
• AES-256 encryption for sensitive data at rest.
• Role-based access controls to limit data access to authorized personnel.
• Regular third-party security audits and penetration testing.
• PCI-DSS compliant payment processing through certified partners.

While we implement strong security measures, no method of transmission over the internet is completely secure. We encourage you to use strong, unique passwords and to contact us immediately if you suspect unauthorized access.`,
  },
  {
    title: '6. Children\'s Privacy',
    content: `My Church is not intended for use by children under the age of 13. We do not knowingly collect personal information from children under 13. If you believe a child under 13 has provided us with personal information, please contact us immediately and we will take steps to delete such information.

For youth ministry features, we recommend that churches obtain appropriate parental consent before registering minors on the platform.`,
  },
  {
    title: '7. Your Rights',
    content: `Depending on your location, you may have the right to:

• Access: request a copy of the personal data we hold about you.
• Correction: request that we correct inaccurate or incomplete data.
• Deletion: request that we delete your personal data, subject to legal retention requirements.
• Portability: request your data in a machine-readable format.
• Objection: object to certain uses of your personal data.

To exercise any of these rights, please contact us at privacy@mychurch.app.`,
  },
  {
    title: '8. Changes to This Policy',
    content: `We may update this Privacy Policy from time to time. We will notify church administrators of material changes via email and in-app notification at least 30 days before the changes take effect. Your continued use of My Church after the effective date of any changes constitutes your acceptance of the updated policy.`,
  },
  {
    title: '9. Contact Us',
    content: `If you have questions or concerns about this Privacy Policy, please contact us:

My Church Platform
privacy@mychurch.app
+1 (800) 555-0198
Atlanta, Georgia, USA`,
  },
]

// Component
export const PrivacyPolicyPage: FC = () => {
  return (
    <PageLayout>
      <PageHero
        badge="Privacy Policy"
        title="Your Privacy, Our Commitment"
        subtitle="Last updated: June 1, 2026"
        dark={false}
      />

      <section className="pb-24" style={{ background: 'var(--background)' }}>
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          {/* Intro */}
          <div
            className="rounded-2xl p-6 mb-10"
            style={{
              background: 'rgba(27,58,122,0.06)',
              border: '1px solid rgba(27,58,122,0.15)',
            }}
          >
            <p
              className="text-sm leading-relaxed"
              style={{ color: 'var(--foreground)' }}
            >
              My Church ("we", "our", or "us") is committed to protecting the privacy of every
              church and congregation member that uses our platform. This Privacy Policy explains
              what information we collect, how we use it, and the choices you have regarding your
              data. If you have questions, please{' '}
              <Link to="/contact" style={{ color: 'var(--church-blue)' }}>
                contact us
              </Link>
              .
            </p>
          </div>

          {/* Sections */}
          <div className="space-y-10">
            {sections.map((s: PolicySection) => (
              <div key={s.title}>
                <h2
                  className="mb-4"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    fontSize: '1.15rem',
                    color: 'var(--foreground)',
                  }}
                >
                  {s.title}
                </h2>
                <div
                  className="text-sm leading-loose whitespace-pre-line"
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  {s.content}
                </div>
                <div
                  style={{
                    height: 1,
                    background: 'var(--border)',
                    marginTop: '2rem',
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  )
}

export default PrivacyPolicyPage
