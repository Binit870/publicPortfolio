import { Eye, Heart, Bookmark, Image } from "lucide-react";

const mediaTypeStyle = {
  image: "bg-primary",
  video: "bg-blue-500",
  gif: "bg-purple-500",
};

const GalleryItemCard = ({ item, onClick, className = "" }) => {
  return (
    <div
      onClick={() => onClick(item)}
      className={`rounded-xl overflow-hidden bg-card cursor-pointer group border border-border hover:-translate-y-1 hover:shadow-md transition-all duration-200 ${className}`}
    >
      <div className="relative aspect-[4/3] bg-gradient-to-br from-primary/10 via-secondary/10 to-muted overflow-hidden">
        {item.mediaUrl ? (
          <img
            src={item.thumbnail || item.mediaUrl}
            alt={item.altText || item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : item.emoji ? (
          <div className="absolute inset-0 flex items-center justify-center text-5xl">
            {item.emoji}
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Image size={32} className="text-muted-foreground" />
          </div>
        )}

        <span className={`absolute top-3 left-3 px-2 py-0.5 rounded text-[10px] text-white ${mediaTypeStyle[item.mediaType] || "bg-primary"}`}>
          {item.mediaType}
        </span>

        

        {item.hoverText && (
          <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/70 transition-colors duration-300 flex items-center justify-center">
            <span className="text-primary-foreground font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {item.hoverText}
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <span className="text-[11px] font-semibold text-primary uppercase">{item.category}</span>
        <h3 className="text-sm font-bold mt-1 mb-2">{item.title}</h3>
        
      </div>
    </div>
  );
};

export default GalleryItemCard;