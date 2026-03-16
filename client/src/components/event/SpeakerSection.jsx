import { eventData } from "../../data/EventData";

const getInitials = (name) =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2);

const SpeakersSection = () => {
  return (
    <section className="bg-background relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-12 lg:py-16">
        <h2 className="text-2xl font-bold text-heading mb-8">
          Speakers
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {eventData.speakers.map((speaker) => (
            <div
              key={speaker.name}
              className="bg-card border border-border rounded-xl p-6 text-center hover:-translate-y-1 hover:shadow-lg transition-all duration-200"
            >
              <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span className="text-primary font-bold text-xl">
                  {getInitials(speaker.name)}
                </span>
              </div>

              <h3 className="font-semibold text-heading text-base">
                {speaker.name}
              </h3>

              <p className="text-primary text-xs font-medium mt-1">
                {speaker.designation}
              </p>

              <p className="text-body text-sm mt-2 line-clamp-2">
                {speaker.bio}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SpeakersSection;