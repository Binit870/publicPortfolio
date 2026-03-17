import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import API from "../../api/axiosInstance";
import toast, { Toaster } from "react-hot-toast";

const CONTACT_API = "/contact";

// ─── Sub-components ───────────────────────────────────────────────────────────

const FormField = ({ label, placeholder, type = "text", value, onChange, name, required }) => (
  <div className="space-y-1.5">
    <label className="text-[11px] font-bold text-primary tracking-[0.15em] uppercase flex items-center gap-1">
      {label}
      {required && <span className="text-red-400">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full px-4 py-3 rounded-lg border border-border text-[13px] bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-text-light"
    />
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const ContactForm = () => {
  const [pageData, setPageData] = useState(null);
  const [loadingPage, setLoadingPage] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    message: "",
    newsletterOptIn: false,
  });

  // Fetch ContactPage config on mount
  useEffect(() => {
    const fetchPage = async () => {
      try {
        const { data } = await API.get(CONTACT_API);
        setPageData(data.data);
      } catch {
        // Fallback to defaults — form still works
        setPageData(null);
      } finally {
        setLoadingPage(false);
      }
    };
    fetchPage();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    if (!formData.firstName.trim()) return toast.error("First name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!formData.message.trim()) return toast.error("Message is required");

    setSubmitting(true);
    try {
      await API.post(`${CONTACT_API}/submit`, {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        company: formData.company.trim(),
        message: formData.message.trim(),
        newsletterOptIn: formData.newsletterOptIn,
      });

      toast.success("Message sent! We'll get back to you soon.");
      setSubmitted(true);

      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        company: "",
        message: "",
        newsletterOptIn: false,
      });
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.status === 429
          ? "Too many requests. Please try again later."
          : "Failed to send message. Please try again.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Derive labels/placeholders from CMS or fall back to defaults ──
  const f = pageData?.contactForm?.fields ?? {};
  const fields = {
    firstName: {
      label: f.firstName?.label || "First Name",
      placeholder: f.firstName?.placeholder || "Angel",
      required: f.firstName?.required ?? true,
    },
    lastName: {
      label: f.lastName?.label || "Last Name",
      placeholder: f.lastName?.placeholder || "Philips",
      required: f.lastName?.required ?? false,
    },
    workEmail: {
      label: f.workEmail?.label || "Work Email",
      placeholder: f.workEmail?.placeholder || "name@company.com",
      required: f.workEmail?.required ?? true,
    },
    company: {
      label: f.company?.label || "Company",
      placeholder: f.company?.placeholder || "Acme Corp.",
      required: false,
    },
    message: {
      label: f.message?.label || "How can we help you?",
      placeholder: f.message?.placeholder || "Share your requirements",
    },
  };

  const newsletterLabel =
    pageData?.contactForm?.newsletterCheckbox?.label ||
    "Yes, I'd like to receive news and updates by email";

  const submitButtonText =
    pageData?.contactForm?.submitButtonText || "Send Message";

  const privacyText =
    pageData?.contactForm?.privacyPolicyText ||
    "By submitting this form you agree with our";

  const privacyLink =
    pageData?.contactForm?.privacyPolicyLink || "#";

  const pageTitle =
    pageData?.pageHeader?.title || "Contact Us";

  const pageSubtitle =
    pageData?.pageHeader?.subtitle ||
    "Fill out the form below and we'll get back to you as soon as possible.";

  // ── Success state ──
  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-card border border-border rounded-card-lg shadow-card overflow-hidden"
      >
        <div className="h-1 w-full bg-primary" />
        <div className="p-12 flex flex-col items-center text-center gap-5">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-3xl">
            ✓
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground mb-2">Message Sent!</h3>
            <p className="text-text-body text-sm leading-relaxed">
              Thanks for reaching out. We'll get back to you at{" "}
              <span className="text-primary font-semibold">{formData.email || "your email"}</span> soon.
            </p>
          </div>
          <button
            onClick={() => setSubmitted(false)}
            className="mt-2 text-[12px] text-primary font-semibold hover:underline"
          >
            Send another message
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            fontFamily: "inherit",
            fontSize: "13px",
            borderRadius: "10px",
            border: "1px solid",
          },
          success: {
            style: {
              background: "#f0fdf4",
              borderColor: "#86efac",
              color: "#15803d",
            },
            iconTheme: { primary: "#16a34a", secondary: "#f0fdf4" },
          },
          error: {
            style: {
              background: "#fef2f2",
              borderColor: "#fca5a5",
              color: "#dc2626",
            },
            iconTheme: { primary: "#dc2626", secondary: "#fef2f2" },
          },
        }}
      />

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="bg-card border border-border rounded-card-lg shadow-card overflow-hidden"
      >
        <div className="h-1 w-full bg-primary" />

        <div className="p-8">
          {/* Header */}
          {!loadingPage && (
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground">{pageTitle}</h2>
              {pageSubtitle && (
                <p className="text-text-body text-sm mt-1 leading-relaxed">{pageSubtitle}</p>
              )}
            </div>
          )}

          {/* Skeleton while loading CMS */}
          {loadingPage ? (
            <div className="space-y-4 animate-pulse">
              <div className="grid grid-cols-2 gap-4">
                <div className="h-16 bg-border rounded-lg" />
                <div className="h-16 bg-border rounded-lg" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-16 bg-border rounded-lg" />
                <div className="h-16 bg-border rounded-lg" />
              </div>
              <div className="h-32 bg-border rounded-lg" />
              <div className="h-12 bg-border rounded-lg" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>

              {/* Row 1: Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  name="firstName"
                  label={fields.firstName.label}
                  placeholder={fields.firstName.placeholder}
                  required={fields.firstName.required}
                  value={formData.firstName}
                  onChange={handleChange}
                />
                <FormField
                  name="lastName"
                  label={fields.lastName.label}
                  placeholder={fields.lastName.placeholder}
                  required={fields.lastName.required}
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>

              {/* Row 2: Email + Company */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  name="email"
                  label={fields.workEmail.label}
                  placeholder={fields.workEmail.placeholder}
                  type="email"
                  required={fields.workEmail.required}
                  value={formData.email}
                  onChange={handleChange}
                />
                <FormField
                  name="company"
                  label={fields.company.label}
                  placeholder={fields.company.placeholder}
                  value={formData.company}
                  onChange={handleChange}
                />
              </div>

              {/* Phone (optional, model supports it) */}
              <FormField
                name="phone"
                label="Phone"
                placeholder="+1 (555) 000-0000"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
              />

              {/* Message */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-primary tracking-[0.15em] uppercase flex items-center gap-1">
                  {fields.message.label}
                  <span className="text-red-400">*</span>
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder={fields.message.placeholder}
                  required
                  className="w-full min-h-[120px] px-4 py-3 rounded-lg border border-border text-[13px] bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all resize-none placeholder:text-text-light"
                />
              </div>

              {/* Newsletter opt-in */}
              <div className="flex items-start gap-3 py-2">
                <input
                  type="checkbox"
                  name="newsletterOptIn"
                  id="newsletterOptIn"
                  checked={formData.newsletterOptIn}
                  onChange={handleChange}
                  className="mt-1 accent-secondary w-4 h-4 cursor-pointer"
                />
                <label
                  htmlFor="newsletterOptIn"
                  className="text-[13px] text-text-body cursor-pointer select-none"
                >
                  {newsletterLabel}
                </label>
              </div>

              {/* Privacy policy */}
              <p className="text-[12px] text-text-light">
                {privacyText}{" "}
                <a
                  href={privacyLink}
                  className="text-primary font-semibold hover:underline"
                >
                  Privacy Policy
                </a>
              </p>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-lg text-[15px] hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Sending…
                  </>
                ) : (
                  submitButtonText
                )}
              </button>

            </form>
          )}
        </div>
      </motion.div>
    </>
  );
};

export default ContactForm;