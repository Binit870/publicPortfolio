import { Button } from "@/components/ui/button";
import { MapPin, Video } from "lucide-react";
import { eventData } from "@/data/eventData";

const LocationSection = () => {
  const mode = eventData.mode;
  const isHybrid = mode === "Hybrid";
  const isOnline = mode === "Online";

  return (
    <section className="bg-section-alt">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-12 lg:py-16">
        <h2 className="text-2xl font-bold text-heading mb-8">Location</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {!isOnline && (
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-start gap-3 mb-4">
                <MapPin className="h-5 w-5 text-primary" />
                <div>
                  <h3 className="font-semibold">{eventData.venue.name}</h3>
                  <p>{eventData.venue.address}</p>
                  <p>{eventData.venue.city}, {eventData.venue.country}</p>
                </div>
              </div>

              <Button className="w-full">Get Directions</Button>
            </div>
          )}

          {(isOnline || isHybrid) && (
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-start gap-3 mb-4">
                <Video className="h-5 w-5 text-primary" />
                <div>
                  <h3 className="font-semibold">Join Online</h3>
                  <p>Platform: {eventData.onlinePlatform}</p>
                </div>
              </div>

              <Button className="w-full">Join via Link</Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default LocationSection;