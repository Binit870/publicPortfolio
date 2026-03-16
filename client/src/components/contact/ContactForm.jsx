import { motion } from "framer-motion";

const ContactForm = () => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    className="bg-card border border-border rounded-card-lg shadow-card overflow-hidden"
  >
    <div className="h-1 w-full bg-primary" />

    <div className="p-8">
      <form className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="First Name" placeholder="Angel" />
          <FormField label="Last Name" placeholder="Philips" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Work Email"
            placeholder="name@company.com"
            type="email"
          />
          <FormField label="Company" placeholder="Acme Corp." />
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-primary tracking-[0.15em] uppercase">
            How can we help you?
          </label>

          <textarea
            placeholder="Share your requirements"
            className="w-full min-h-[120px] px-4 py-3 rounded-lg border border-border text-[13px] bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all resize-none"
          />
        </div>

        <div className="flex items-start gap-3 py-2">
          <input type="checkbox" className="mt-1 accent-secondary w-4 h-4" />
          <span className="text-[13px] text-text-body">
            Yes, I'd like to receive news and updates by email
          </span>
        </div>

        <p className="text-[12px] text-text-light">
          By submitting this form you agree with our{" "}
          <a href="#" className="text-primary font-semibold hover:underline">
            Privacy Policy
          </a>
        </p>

        <button
          type="submit"
          className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-lg text-[15px] hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 active:scale-[0.98]"
        >
          Send Message
        </button>
      </form>
    </div>
  </motion.div>
);

const FormField = ({ label, placeholder, type = "text" }) => (
  <div className="space-y-1.5">
    <label className="text-[11px] font-bold text-primary tracking-[0.15em] uppercase">
      {label}
    </label>

    <input
      type={type}
      placeholder={placeholder}
      className="w-full px-4 py-3 rounded-lg border border-border text-[13px] bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
    />
  </div>
);

export default ContactForm;