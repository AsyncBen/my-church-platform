import React, { useState, useCallback, useMemo } from "react";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  MessageSquare, 
  ArrowRight, 
  LucideIcon 
} from "lucide-react";
import { PageLayout, PageHero } from "../components/Layout";

// Types
interface ContactReason {
  value: string;
  label: string;
}

interface ContactInfo {
  icon: LucideIcon;
  label: string;
  value: string;
  sub: string;
  color: string;
  bg: string;
}

interface ContactFormData {
  name: string;
  email: string;
  church: string;
  reason: string;
  message: string;
}

interface FormField {
  id: keyof ContactFormData;
  label: string;
  placeholder: string;
  type: "text" | "email" | "select" | "textarea";
  required?: boolean;
  options?: string[];
}

interface ContactInfoCardProps {
  info: ContactInfo;
}

interface FormInputFieldProps {
  field: FormField;
  value: string;
  onChange: (fieldId: keyof ContactFormData, value: string) => void;
}

interface SuccessMessageProps {
  onReset: () => void;
}

interface LiveChatCardProps {
  onOpenChat: () => void;
}

type FormStatus = "idle" | "submitting" | "submitted" | "error";

// Constants
const CONTACT_REASONS: string[] = [
  "General inquiry",
  "Sales / pricing",
  "Church onboarding",
  "Technical support",
  "Media team setup",
  "Partnership",
  "Press inquiry",
  "Other",
];

const CONTACT_INFO: ContactInfo[] = [
  {
    icon: Mail,
    label: "Email Us",
    value: "hello@mychurch.app",
    sub: "We respond within 4 hours on business days",
    color: "var(--church-blue)",
    bg: "rgba(27,58,122,0.08)",
  },
  {
    icon: Phone,
    label: "Call Us",
    value: "+1 (800) 555-0198",
    sub: "Mon–Fri, 9am–6pm Eastern",
    color: "#7C3AED",
    bg: "rgba(124,58,237,0.08)",
  },
  {
    icon: MapPin,
    label: "Our Office",
    value: "Atlanta, Georgia",
    sub: "Serving churches worldwide",
    color: "var(--church-gold)",
    bg: "rgba(200,150,44,0.08)",
  },
  {
    icon: Clock,
    label: "Support Hours",
    value: "Mon–Fri, 9am–6pm EST",
    sub: "Emergency support available for Pro plans",
    color: "#059669",
    bg: "rgba(5,150,105,0.08)",
  },
];

const FORM_FIELDS: FormField[] = [
  { 
    id: "name", 
    label: "Your Name", 
    placeholder: "Pastor John Smith", 
    type: "text", 
    required: true 
  },
  { 
    id: "email", 
    label: "Email Address", 
    placeholder: "john@gracecc.org", 
    type: "email", 
    required: true 
  },
  { 
    id: "church", 
    label: "Church Name", 
    placeholder: "Grace Community Church", 
    type: "text" 
  },
  { 
    id: "reason", 
    label: "Reason for Contact", 
    placeholder: "Select a reason...", 
    type: "select", 
    required: true,
    options: CONTACT_REASONS
  },
  { 
    id: "message", 
    label: "Your Message", 
    placeholder: "Tell us about your church and how we can help...", 
    type: "textarea", 
    required: true 
  },
];

const INITIAL_FORM_DATA: ContactFormData = {
  name: "",
  email: "",
  church: "",
  reason: "",
  message: "",
};

// Custom hooks
const useContactForm = () => {
  const [formData, setFormData] = useState<ContactFormData>(INITIAL_FORM_DATA);
  const [status, setStatus] = useState<FormStatus>("idle");

  const handleFieldChange = useCallback((fieldId: keyof ContactFormData, value: string): void => {
    setFormData((prev: ContactFormData) => ({
      ...prev,
      [fieldId]: value,
    }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setStatus("submitting");

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Add your actual API call here
      // await fetch('/api/contact', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData),
      // });

      setStatus("submitted");
      console.log("Form submitted:", formData);
    } catch (error) {
      console.error("Form submission error:", error);
      setStatus("error");
    }
  }, [formData]);

  const handleReset = useCallback((): void => {
    setFormData(INITIAL_FORM_DATA);
    setStatus("idle");
  }, []);

  const isValid = useMemo((): boolean => {
    const requiredFields = FORM_FIELDS.filter(f => f.required);
    return requiredFields.every(field => formData[field.id].trim() !== "");
  }, [formData]);

  return {
    formData,
    status,
    isValid,
    handleFieldChange,
    handleSubmit,
    handleReset,
  };
};

// Sub-components
const ContactInfoCard: React.FC<ContactInfoCardProps> = React.memo(({ info }) => {
  const Icon: LucideIcon = info.icon;

  return (
    <div
      className="flex gap-4 p-4 rounded-2xl"
      style={{ background: "var(--card)", border: "1px solid var(--border)" }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: info.bg }}
        aria-hidden="true"
      >
        <Icon size={18} style={{ color: info.color }} />
      </div>
      <div>
        <div 
          className="text-xs font-semibold mb-0.5 uppercase tracking-wide" 
          style={{ color: "var(--muted-foreground)" }}
        >
          {info.label}
        </div>
        <div className="font-semibold text-sm" style={{ color: "var(--foreground)" }}>
          {info.value}
        </div>
        <div className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
          {info.sub}
        </div>
      </div>
    </div>
  );
});

ContactInfoCard.displayName = "ContactInfoCard";

const FormInputField: React.FC<FormInputFieldProps> = React.memo(({ field, value, onChange }) => {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
      onChange(field.id, e.target.value);
    },
    [field.id, onChange]
  );

  const handleFocus = useCallback((e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
    e.target.style.borderColor = "var(--church-blue)";
  }, []);

  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
    e.target.style.borderColor = "var(--border)";
  }, []);

  const baseInputStyles: React.CSSProperties = {
    background: "var(--background)",
    border: "1.5px solid var(--border)",
    color: "var(--foreground)",
  };

  const renderInput = (): React.ReactNode => {
    switch (field.type) {
      case "textarea":
        return (
          <textarea
            rows={5}
            required={field.required}
            placeholder={field.placeholder}
            value={value}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all resize-none"
            style={baseInputStyles}
            aria-label={field.label}
          />
        );

      case "select":
        return (
          <select
            required={field.required}
            value={value}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all appearance-none"
            style={baseInputStyles}
            aria-label={field.label}
          >
            <option value="">{field.placeholder}</option>
            {field.options?.map((option: string) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      default:
        return (
          <input
            type={field.type}
            placeholder={field.placeholder}
            required={field.required}
            value={value}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
            style={baseInputStyles}
            aria-label={field.label}
          />
        );
    }
  };

  return (
    <div>
      <label 
        className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" 
        style={{ color: "var(--muted-foreground)" }}
        htmlFor={`form-${field.id}`}
      >
        {field.label}
      </label>
      {renderInput()}
    </div>
  );
});

FormInputField.displayName = "FormInputField";

const SuccessMessage: React.FC<SuccessMessageProps> = React.memo(({ onReset }) => {
  return (
    <div
      className="h-full flex flex-col items-center justify-center text-center p-12 rounded-2xl"
      style={{ background: "var(--card)", border: "1px solid var(--border)" }}
      role="alert"
      aria-live="polite"
    >
      <div className="text-5xl mb-4" aria-hidden="true">
        🙏
      </div>
      <h3
        className="mb-2"
        style={{ 
          fontFamily: "var(--font-display)", 
          fontWeight: 700, 
          fontSize: "1.5rem", 
          color: "var(--foreground)" 
        }}
      >
        Message Received!
      </h3>
      <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--muted-foreground)" }}>
        Thank you for reaching out. A member of our team will respond within 4 business hours.
      </p>
      <button
        onClick={onReset}
        className="px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        style={{ background: "var(--church-blue)" }}
        aria-label="Send another message"
      >
        Send Another Message
      </button>
    </div>
  );
});

SuccessMessage.displayName = "SuccessMessage";

const LiveChatCard: React.FC<LiveChatCardProps> = React.memo(({ onOpenChat }) => {
  return (
    <div
      className="p-5 rounded-2xl"
      style={{ background: "linear-gradient(135deg, #1B3A7A, #2A4F9E)" }}
    >
      <div className="flex items-center gap-2 mb-2">
        <MessageSquare size={16} className="text-white" aria-hidden="true" />
        <span className="text-white font-semibold text-sm">
          Prefer Live Chat?
        </span>
      </div>
      <p className="text-white/60 text-xs mb-3">
        Start a live chat conversation with our support team directly in the platform.
      </p>
      <button
        onClick={onOpenChat}
        className="px-4 py-2 rounded-xl text-xs font-semibold text-white transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
        style={{ background: "var(--church-gold)" }}
        aria-label="Open live chat support"
      >
        Open Live Chat →
      </button>
    </div>
  );
});

LiveChatCard.displayName = "LiveChatCard";

const ContactForm: React.FC = () => {
  const {
    formData,
    status,
    isValid,
    handleFieldChange,
    handleSubmit,
    handleReset,
  } = useContactForm();

  const handleOpenChat = useCallback((): void => {
    // Implement your live chat integration here
    console.log("Opening live chat...");
    // Example: Intercom, Zendesk, or custom chat widget
    if (typeof window !== 'undefined') {
      // window.Intercom('show');
    }
  }, []);

  if (status === "submitted") {
    return <SuccessMessage onReset={handleReset} />;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl p-8 space-y-5"
      style={{ background: "var(--card)", border: "1px solid var(--border)" }}
      noValidate
      aria-label="Contact form"
    >
      <h2
        className="mb-2"
        style={{ 
          fontFamily: "var(--font-display)", 
          fontWeight: 700, 
          fontSize: "1.4rem", 
          color: "var(--foreground)" 
        }}
      >
        Send Us a Message
      </h2>

      <div className="grid sm:grid-cols-2 gap-4">
        {FORM_FIELDS.filter(f => f.type === "text" || f.type === "email").map((field: FormField) => (
          <FormInputField
            key={field.id}
            field={field}
            value={formData[field.id]}
            onChange={handleFieldChange}
          />
        ))}
      </div>

      {FORM_FIELDS.filter(f => f.type !== "text" && f.type !== "email" && f.id !== "message").map((field: FormField) => (
        <FormInputField
          key={field.id}
          field={field}
          value={formData[field.id]}
          onChange={handleFieldChange}
        />
      ))}

      {FORM_FIELDS.filter(f => f.id === "message").map((field: FormField) => (
        <FormInputField
          key={field.id}
          field={field}
          value={formData[field.id]}
          onChange={handleFieldChange}
        />
      ))}

      {status === "error" && (
        <div 
          className="p-3 rounded-lg text-sm" 
          style={{ background: "rgba(239,68,68,0.1)", color: "#EF4444" }}
          role="alert"
        >
          There was an error sending your message. Please try again.
        </div>
      )}

      <button
        type="submit"
        disabled={!isValid || status === "submitting"}
        className="w-full py-3.5 rounded-xl font-semibold text-white transition-all hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        style={{ 
          background: "var(--church-blue)", 
          boxShadow: "0 4px 16px rgba(27,58,122,0.3)" 
        }}
        aria-label={status === "submitting" ? "Sending message..." : "Send message"}
      >
        {status === "submitting" ? (
          <>
            <div 
              className="w-4 h-4 rounded-full animate-spin" 
              style={{ border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff" }}
            />
            Sending...
          </>
        ) : (
          <>
            Send Message <ArrowRight size={18} aria-hidden="true" />
          </>
        )}
      </button>
    </form>
  );
};

// Main Component
const ContactPage: React.FC = () => {
  return (
    <PageLayout>
      <PageHero
        badge="Get in Touch"
        title={
          <>
            We'd Love to
            <br />
            <em style={{ color: "var(--church-gold-light)" }}>Hear from You</em>
          </>
        }
        subtitle="Whether you're ready to get started or just have a question — our team is here for you."
      />

      <section 
        className="py-20" 
        style={{ background: "var(--background)" }}
        aria-labelledby="contact-heading"
      >
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <span id="contact-heading" className="sr-only">Contact Information and Form</span>
          
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Contact info */}
            <div className="lg:col-span-2 space-y-4">
              <h2
                className="mb-6"
                style={{ 
                  fontFamily: "var(--font-display)", 
                  fontWeight: 700, 
                  fontSize: "1.6rem", 
                  color: "var(--foreground)" 
                }}
              >
                Contact Information
              </h2>
              <div role="list" aria-label="Contact details">
                {CONTACT_INFO.map((info: ContactInfo) => (
                  <div key={info.label} role="listitem" className="mb-4 last:mb-0">
                    <ContactInfoCard info={info} />
                  </div>
                ))}
              </div>

              <LiveChatCard 
                onOpenChat={() => {
                  console.log("Opening live chat...");
                }} 
              />
            </div>

            {/* Form */}
            <div className="lg:col-span-3">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default React.memo(ContactPage);

// Export types for reuse
export type { 
  ContactFormData, 
  ContactInfo, 
  FormField, 
  FormStatus 
};

// Export constants if needed elsewhere
export { CONTACT_INFO, CONTACT_REASONS, FORM_FIELDS, INITIAL_FORM_DATA };