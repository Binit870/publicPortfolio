import React from "react";
import { Helmet } from 'react-helmet-async'
import FloatingBubbles from "../../components/event/FloatingBubbles";
import HeroSection from "../../components/home/portfolio/HeroSection";
import AboutPreview from "../../components/home/portfolio/AboutPreview";
import LatestUpdates from "../../components/home/portfolio/LatestUpdates";
import GalleryPreview from "../../components/home/portfolio/GalleryPreview";
import EventsPreview from "../../components/home/portfolio/EventPreview";
import Footer from "../../components/home/portfolio/Footer";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Dev.Folio | React Developer & Designer</title>
        <meta name="description" content="Portfolio of [Your Name] – a React developer building modern, fast, and beautiful web apps." />
        <meta name="author" content="[Your Name]" />
        <meta name="keywords" content="react developer, frontend developer, portfolio, web design" />

        {/* Open Graph */}
        <meta property="og:title" content="Dev.Folio | React Developer & Designer" />
        <meta property="og:description" content="Portfolio of [Your Name] – React developer building modern web apps." />
        <meta property="og:url" content="https://yoursite.com/" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://yoursite.com/og-image.png" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Dev.Folio | React Developer" />
        <meta name="twitter:description" content="Portfolio of [Your Name] – React developer." />
        <meta name="twitter:image" content="https://yoursite.com/og-image.png" />

        <link rel="canonical" href="https://yoursite.com/" />
      </Helmet>

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
    </>
  );
};

export default Index;