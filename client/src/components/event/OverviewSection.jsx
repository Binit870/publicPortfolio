import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

const OverviewSection = ({ event }) => {
  const [expanded, setExpanded] = useState(false);
  if (!event) return null;

  const overview = event.overview || "";
  const shortText = overview.length > 300 ? overview.slice(0, 300) + "..." : overview;
  const spotsRemaining = (event.registration?.maxAttendees || 0) - (event.stats?.registrations || 0);

  return (
    <section className="bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-12 lg:py-16">
        <div className="flex flex-col lg:flex-row gap-10">
          <div className="lg:w-[70%]">
            <h2 className="text-2xl font-bold text-heading mb-4">About This Event</h2>
            <div className="text-body leading-relaxed whitespace-pre-line">
              {expanded ? overview : shortText}
            </div>
            {overview.length > 300 && (
              <button onClick={() => setExpanded(!expanded)} className="text-primary font-medium mt-3 hover:underline">
                {expanded ? "Read Less" : "Read More"}
              </button>
            )}
          </div>
          <div className="lg:w-[30%]">
            <div className="lg:sticky lg:top-6 bg-card border border-border rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-heading mb-4">Register</h3>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-body">Price</span>
                  <span className="font-semibold text-heading">
                    {event.registration?.isFree ? "Free" : `${event.registration?.currency} ${event.registration?.price}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-body">Deadline</span>
                  <span className="font-semibold text-heading">
                    {event.registration?.registrationDeadline ? new Date(event.registration.registrationDeadline).toDateString() : "TBA"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-body">Max Attendees</span>
                  <span className="font-semibold text-heading">
                    {event.registration?.maxAttendees?.toLocaleString() || "Unlimited"}
                  </span>
                </div>
              </div>
              <Button variant="saffron" className="w-full mb-3" size="lg">Register Now</Button>
              {spotsRemaining > 0 && (
                <div className="flex items-center gap-2 justify-center">
                  <CheckCircle className="h-4 w-4 text-highlight" />
                  <span className="text-sm font-medium text-highlight">{spotsRemaining} spots remaining</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OverviewSection;