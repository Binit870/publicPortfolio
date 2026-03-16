import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FloatingBubbles from "@/components/blog/FloatingBubbles";
import HeroSection from "@/components/blog/HeroSection";
import CategoryChips from "@/components/blog/CategoryChips";
import FeaturedPost from "@/components/blog/FeaturedPost";
import BlogCard from "@/components/blog/BlogCard";
import AuthorSidebar from "@/components/blog/AuthorSidebar";
import SeriesCard from "@/components/blog/SeriesCard";
import TrendingCard from "@/components/blog/TrendingCard";
import PopularTags from "@/components/blog/PopularTag";
import NewsletterStrip from "@/components/blog/NewsletterStrip";
import Footer from "@/components/blog/Footer";
import { blogPosts, featuredPost } from "@/data/BlogData";

const UpdatesPage = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const navigate = useNavigate();

  const filtered =
    activeCategory === "All"
      ? blogPosts
      : blogPosts.filter((post) => post.category === activeCategory);

  return (
    <div className="relative min-h-screen bg-background">
      <FloatingBubbles />
      <div className="relative z-10">
        <HeroSection />
        <CategoryChips active={activeCategory} onSelect={setActiveCategory} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex flex-col lg:flex-row gap-10">

            {/* Main content */}
            <div className="flex-1 min-w-0">

              {/* Featured post — clicking goes to detail */}
              <div
                className="cursor-pointer"
                onClick={() => navigate(`/updates/${featuredPost.slug}`)}
              >
                <FeaturedPost />
              </div>

              <h2 className="text-xl font-bold text-heading mb-6 mt-10">
                Recent Posts
              </h2>

              <div className="grid sm:grid-cols-2 gap-6 mb-8">
                {filtered.map((post) => (
                  <div
                    key={post.slug}
                    onClick={() => navigate(`/updates/${post.slug}`)}
                    className="cursor-pointer"
                  >
                    <BlogCard post={post} />
                  </div>
                ))}
              </div>

              {filtered.length > 0 && (
                <div className="text-center">
                  <button className="btn-primary">
                    Load More Articles
                  </button>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="w-full lg:w-[300px] shrink-0 space-y-6">
              <AuthorSidebar />
              <SeriesCard />
              <TrendingCard />
              <PopularTags />
            </aside>

          </div>
        </div>

        <NewsletterStrip />
        <Footer />
      </div>
    </div>
  );
};

export default UpdatesPage;