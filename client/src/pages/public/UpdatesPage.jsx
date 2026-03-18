import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FloatingBubbles from "@/components/blog/FloatingBubbles";
import Navbar from "@/components/blog/Navbar";
import HeroSection from "@/components/blog/HeroSection";
import FeaturedPost from "@/components/blog/FeaturedPost";
import BlogCard from "@/components/blog/BlogCard";
import AuthorSidebar from "@/components/blog/AuthorSidebar";
import SeriesCard from "@/components/blog/SeriesCard";
import TrendingCard from "@/components/blog/TrendingCard";
import PopularTags from "@/components/blog/PopularTag";
import NewsletterStrip from "@/components/blog/NewsletterStrip";
import Footer from "@/components/blog/Footer";
import { getPublishedBlogsApi } from "@/api/blog.api";

const CATEGORIES = ["All", "React", "Node.js", "JavaScript", "DevOps", "System Design", "Career", "CSS"];

const UpdatesPage = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("All");
  const [blogs, setBlogs] = useState([]);
  const [featuredPost, setFeaturedPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await getPublishedBlogsApi({ limit: 20 });
        const allBlogs = res.data.data || [];

        // first blog is featured
        if (allBlogs.length > 0) {
          setFeaturedPost(allBlogs[0]);
          setBlogs(allBlogs.slice(1));
        } else {
          setBlogs([]);
        }
      } catch {
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const filtered = activeCategory === "All"
    ? blogs
    : blogs.filter((post) => post.category === activeCategory);

  return (
    <div className="relative min-h-screen bg-background">
      <FloatingBubbles />
      <div className="relative z-10">
        {/* <Navbar /> */}
        <HeroSection />

        {/* Category chips */}
        <section className="py-6 border-b">
          <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center gap-3">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-smooth ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-muted-foreground hover:border-primary hover:text-primary"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex flex-col lg:flex-row gap-10">

            {/* Main content */}
            <div className="flex-1 min-w-0">
              {loading ? (
                <div className="flex justify-center py-20">
                  <div className="w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                </div>
              ) : (
                <>
                  {featuredPost && (
                    <div
                      className="cursor-pointer mb-10"
                      onClick={() => navigate(`/updates/${featuredPost.slug}`)}
                    >
                      <FeaturedPost post={featuredPost} />
                    </div>
                  )}

                  <h2 className="text-xl font-bold text-foreground mb-6">
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

                  {filtered.length === 0 && (
                    <div className="text-center py-16">
                      <div className="text-4xl mb-3">📭</div>
                      <p className="text-muted-foreground">No posts found in this category.</p>
                    </div>
                  )}
                </>
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