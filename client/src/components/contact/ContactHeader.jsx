import { motion } from "framer-motion";

const ContactHeader = () => (
  <header className="relative pt-20 pb-16 px-6 text-center gradient-header">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center max-w-3xl mx-auto"
    >
      <div className="flex items-center gap-2 bg-secondary/20 px-4 py-1.5 rounded-full mb-6">
        <div className="w-2 h-2 rounded-full bg-green-text animate-pulse" />
        <span className="text-[12px] font-bold text-green-text uppercase tracking-wider">
          We'd love to hear from you
        </span>
      </div>

      <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-4 text-text-main">
        Contact Us
      </h1>

      <div className="w-10 h-[3px] bg-primary rounded-full mb-6" />

      <p className="text-text-body text-lg leading-relaxed text-pretty">
        Get in touch with us to discuss your needs and explore collaboration
        opportunities. We're here to assist you and value your input.
      </p>
    </motion.div>
  </header>
);

export default ContactHeader;