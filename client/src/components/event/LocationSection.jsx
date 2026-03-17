import { Button } from "@/components/ui/button";
import { MapPin, Video } from "lucide-react";

const LocationSection = ({ event }) => {
  if (!event) return null;
  const isOnline = event.eventMode === "Online";
  const isHybrid = event.eventMode === "Hybrid";

  return (
    <section className="bg-section-alt">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-12 lg:py-16">
        <h2 className="text-2xl font-bold text-heading mb-8">Location</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {!isOnline && event.location?.venue && (
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-start gap-3 mb-4">
                <MapPin className="h-5 w-5 text-primary" />
                <div>
                  <h3 className="font-semibold">{event.location.venue}</h3>
                  <p>{event.location.address}</p>
                  <p>{event.location.city}, {event.location.country}</p>
                </div>
              </div>
              {event.location.mapLink && (
                <Button className="w-full" onClick={() => window.open(event.location.mapLink, "_blank")}>
                  Get Directions
                </Button>
              )}
            </div>
          )}
          {(isOnline || isHybrid) && event.location?.meetingLink && (
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-start gap-3 mb-4">
                <Video className="h-5 w-5 text-primary" />
                <div>
                  <h3 className="font-semibold">Join Online</h3>
                  <p>Virtual Event</p>
                </div>
              </div>
              <Button className="w-full" onClick={() => window.open(event.location.meetingLink, "_blank")}>
                Join via Link
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default LocationSection;