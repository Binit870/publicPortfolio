import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";

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

import { getEventByIdApi } from "../../api/event.api";

const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await getEventByIdApi(id);
        setEvent(res.data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  // 🔄 Loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  // ❌ Error
  if (error || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center px-6">
        <div>
          <div className="text-6xl mb-4">📭</div>
          <h2 className="text-2xl font-bold mb-3">Event not found</h2>

          <button
            className="btn-primary"
            onClick={() => navigate(-1)}
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  // ✅ Main UI
  return (
    <div className="min-h-screen bg-background relative">
      <FloatingBubbles />

      <div className="relative z-10">

        {/* 🔙 BACK BUTTON */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-smooth mb-6"
          >
            <ArrowLeft size={16} /> Back to Events
          </button>
        </div>

        {/* Sections */}
        <HeroSection event={event} />
        <QuickHighlights event={event} />
        <OverviewSection event={event} />
        <AgendaSection event={event} />
        <SpeakersSection event={event} />
        <LocationSection event={event} />
        <OrganizerSection event={event} />
        <GallerySection event={event} />
        <TagsSection event={event} />
        <StatsBar event={event} />
        <FooterCTA />
      </div>

      <MobileRegisterBar />
    </div>
  );
};

export default EventDetailPage;