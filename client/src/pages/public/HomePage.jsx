import React from "react";

import FloatingBubbles from "../../components/event/FloatingBubbles";
import HeroSection from "../../components/home/portfolio/HeroSection";
import AboutPreview from "../../components/home/portfolio/AboutPreview";
import LatestUpdates from "../../components/home/portfolio/LatestUpdates";
import GalleryPreview from "../../components/home/portfolio/GalleryPreview";
import EventsPreview from "../../components/home/portfolio/EventPreview";
import Footer from "../../components/home/portfolio/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative">
      <FloatingBubbles />

      <div className="relative z-10">
        <HeroSection />
        <AboutPreview />
        <LatestUpdates />
        <GalleryPreview />
        <EventsPreview />
        <Footer />
      </div>
    </div>
  );
};

export default Index;