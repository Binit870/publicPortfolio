import { eventData } from "@/data/eventData";

const TagsSection = () => {
  return (
    <section className="bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-8">
        <h2 className="text-lg font-bold text-heading mb-4">
          Tags
        </h2>

        <div className="flex flex-wrap gap-2">
          {eventData.tags.map((tag) => (
            <span
              key={tag}
              className="bg-highlight text-highlight px-3 py-1.5 rounded-full text-xs font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TagsSection;