import { useParams, useNavigate } from "react-router-dom";
import FloatingBubbles from "../../components/event/FloatingBubbles";
import HeroSection from "../../components/event/HeroSection";
import QuickHighlights from "../../components/event/QuickHighlights";
import OverviewSection from "../../components/event/OverviewSection";
import AgendaSection from "../../components/event/AgendaSection";
import SpeakersSection from "../../components/event/SpeakerSection";
import LocationSection from "../../components/event/LocationSection";
import OrganizerSection from "../../components/event/OrganizerSection";
import GallerySection from "../../components/event/GallerySection";
import TagsSection from "../../components/event/TagSection";
import StatsBar from "../../components/event/StatsBar";
import FooterCTA from "../../components/event/FooterCTA";
import MobileRegisterBar from "../../components/event/MobileRegisterBar";

const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  // TODO: fetch event data by id from backend
  // const { data: event } = useQuery(["event", id], () => getEventById(id))

  return (
    <div className="min-h-screen bg-background relative">
      <FloatingBubbles />
      <div className="relative z-10">
        <HeroSection />
        <QuickHighlights />
        <OverviewSection />
        <AgendaSection />
        <SpeakersSection />
        <LocationSection />
        <OrganizerSection />
        <GallerySection />
        <TagsSection />
        <StatsBar />
        <FooterCTA />
      </div>
      <MobileRegisterBar />
    </div>
  );
};

export default EventDetailPage;