import { motion } from "framer-motion";
import { BookOpen, LifeBuoy, Info, Users, Mail, ArrowRight } from "lucide-react";

const links = [
  {
    title: "Documentation",
    desc: "Explore our documentation for valuable insights about our products and services.",
    icon: <BookOpen size={20} />,
  },
  {
    title: "Contact Support",
    desc: "Our support engineers provide expert assistance. Visit our customer portal.",
    icon: <LifeBuoy size={20} />,
  },
  {
    title: "About Us",
    desc: "Learn more about our mission, values, and commitment to delivering exceptional products.",
    icon: <Info size={20} />,
  },
  {
    title: "Join Our Team",
    desc: "Interested in joining us? Check our Careers page to see if it's a good fit.",
    icon: <Users size={20} />,
  },
  {
    title: "General Contact",
    desc: "For general questions or feedback, contact info@observiq.com",
    icon: <Mail size={20} />,
    isEmail: true,
  },
];

const springConfig = { type: "spring", stiffness: 300, damping: 30 };

const PopularLinks = () => (
  <section className="bg-surface-alt py-24 px-6 relative overflow-hidden">
    
    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32" />
    <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary/10 rounded-full -ml-24 -mb-24" />

    <div className="max-w-7xl mx-auto relative z-10 text-center mb-16">
      <div className="inline-block bg-secondary/20 px-4 py-1 rounded-full text-[12px] font-bold text-green-text mb-4">
        Popular Links
      </div>

      <h2 className="text-3xl font-bold mb-2 text-text-main">
        Looking for something else?
      </h2>

      <div className="w-10 h-[3px] bg-primary rounded-full mx-auto mb-4" />

      <p className="text-text-light max-w-xl mx-auto text-[14px]">
        Explore more options — our site offers resources, products, and solutions
        to meet your needs.
      </p>
    </div>

    <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 relative z-10">
      {links.map((link, i) => (
        <motion.div
          key={i}
          whileHover={{ y: -6 }}
          transition={springConfig}
          className="bg-card p-6 rounded-card border border-border hover:shadow-card-hover transition-all group"
        >
          <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
            {link.icon}
          </div>

          <h4 className="text-[14px] font-bold text-text-main mb-2">
            {link.title}
          </h4>

          <p className="text-[12px] text-text-light mb-6 leading-relaxed">
            {link.desc}
          </p>

          
        </motion.div>
      ))}
    </div>
  </section>
);

export default PopularLinks;