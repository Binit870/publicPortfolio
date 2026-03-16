import { Button } from "@/components/ui/button";
import { Users, Calendar, ExternalLink } from "lucide-react";
import { eventData } from "@/data/eventData";

const OrganizerSection = () => {
  const org = eventData.organizer;

  return (
    <section className="bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-12 lg:py-16">
        <h2 className="text-2xl font-bold text-heading mb-8">Organizer</h2>

        <div className="bg-card border border-border rounded-xl p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <span className="text-primary font-bold text-xl">TE</span>
          </div>

          <div className="flex-1">
            <h3 className="font-bold text-heading text-lg">{org.name}</h3>
            <p className="text-body text-sm">{org.organization}</p>

            <p className="text-body text-sm mt-3 max-w-2xl">
              {org.bio}
            </p>

            <div className="flex flex-wrap gap-6 mt-4">
              <div className="flex items-center gap-2 text-sm text-body">
                <Users className="h-4 w-4 text-primary" />
                {org.followers.toLocaleString()} Followers
              </div>

              <div className="flex items-center gap-2 text-sm text-body">
                <Calendar className="h-4 w-4 text-primary" />
                {org.eventsHosted} Events Hosted
              </div>
            </div>

            <Button variant="saffron-outline" className="mt-4" size="sm">
              <ExternalLink className="mr-2 h-3 w-3" />
              Visit Website
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrganizerSection;