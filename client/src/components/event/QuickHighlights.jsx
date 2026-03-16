import { Calendar, Globe, Timer, MapPin, DollarSign } from "lucide-react";
import { eventData } from "@/data/eventData";

const highlights = [
  { icon: Calendar, label: "Start Date", value: eventData.startDate },
  { icon: Calendar, label: "End Date", value: eventData.endDate },
  { icon: Globe, label: "Timezone", value: eventData.timezone },
  { icon: Timer, label: "Duration", value: eventData.duration },
  { icon: MapPin, label: "Mode", value: eventData.mode },
  { icon: DollarSign, label: "Price", value: eventData.price },
];

const QuickHighlights = () => {
  return (
    <section className="bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {highlights.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-3 p-3 rounded-lg bg-secondary"
            >
              <item.icon className="h-5 w-5 text-primary flex-shrink-0" />

              <div>
                <p className="text-xs text-body">{item.label}</p>
                <p className="text-sm font-semibold text-heading">
                  {item.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuickHighlights;