import { motion } from "framer-motion";
import { Zap, Route, ShieldCheck } from "lucide-react";

const features = [
  {
    title: "Reduce log and metric volume",
    desc: "Effectively handle log data overload. We trim logs efficiently, aiding resource management and enhancing system performance.",
    icon: <Zap size={18} />,
  },
  {
    title: "Route data to the right destination",
    desc: "Easily route all your metrics, logs, and traces to any destination with no risk of lock-in.",
    icon: <Route size={18} />,
  },
  {
    title: "Edit, mask & encrypt sensitive data",
    desc: "Safeguard sensitive data on your servers. Simplify compliance by removing sensitive info before it leaves.",
    icon: <ShieldCheck size={18} />,
  },
];

const clients = ["Shopify", "TELUS", "Banque de France"];

const FeatureHighlights = () => (
  <div className="flex flex-col justify-between h-full">
    <div className="space-y-4">
      {features.map((feature, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1, duration: 0.4 }}
          viewport={{ once: true }}
          className="flex items-start gap-4 p-5 bg-card border border-border border-l-[4px] border-l-primary rounded-r-[12px] hover:shadow-md transition-shadow"
        >
          <div className="flex-shrink-0 w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            {feature.icon}
          </div>

          <div>
            <h4 className="text-[14px] font-bold text-text-main mb-1">
              {feature.title}
            </h4>
            <p className="text-[12px] text-text-light leading-relaxed">
              {feature.desc}
            </p>
          </div>
        </motion.div>
      ))}
    </div>

    <div className="mt-12">
      <span className="text-[11px] font-bold text-primary tracking-[0.2em] uppercase mb-4 block">
        Our Clients
      </span>

      <div className="flex flex-wrap gap-3">
        {clients.map((client) => (
          <div
            key={client}
            className="px-4 py-2 bg-card border border-border rounded-lg text-[12px] font-semibold text-text-light grayscale hover:grayscale-0 transition-all cursor-default"
          >
            {client}
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default FeatureHighlights;