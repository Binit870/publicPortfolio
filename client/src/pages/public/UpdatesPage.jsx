import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axiosInstance";
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

const BLOGS_API = "/blogs"; // public route — GET /api/blogs

const UpdatesPage = () => {
  const navigate = useNavigate();

  const [posts, setPosts]               = useState([]);
  const [featuredPost, setFeaturedPost] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [page, setPage]                 = useState(1);
  const [hasMore, setHasMore]           = useState(false);
  const [loading, setLoading]           = useState(true);
  const [loadingMore, setLoadingMore]   = useState(false);
  const [error, setError]               = useState(null);

  /* fetch a page of posts */
  const fetchPosts = useCallback(async (pageNum = 1, replace = true) => {
    pageNum === 1 ? setLoading(true) : setLoadingMore(true);
    setError(null);
    try {
      const params = { page: pageNum, limit: 6 };
      if (activeCategory !== "All") params.category = activeCategory;

      const res  = await API.get(BLOGS_API, { params });
      const data = res.data.data;
      const incoming = data.blogs ?? data.data ?? [];

      if (replace) {
        // Pin the very first post of page-1 as featured
        setFeaturedPost(incoming[0] ?? null);
        setPosts(incoming.slice(1));
      } else {
        setPosts((prev) => [...prev, ...incoming]);
      }

      setHasMore(pageNum < (data.totalPages ?? 1));
      setPage(pageNum);
    } catch (e) {
      setError(e.response?.data?.message ?? e.message);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [activeCategory]);

  /* refetch when category changes */
  useEffect(() => {
    fetchPosts(1, true);
  }, [fetchPosts]);

  const handleLoadMore = () => fetchPosts(page + 1, false);

  /* ── Loading skeleton ── */
  if (loading) {
    return (
      <div className="relative min-h-screen bg-background">
        <FloatingBubbles />
        <div className="relative z-10">
          <HeroSection />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="card-portfolio p-5 animate-pulse">
                  <div className="h-36 bg-border rounded-xl mb-4" />
                  <div className="h-3 bg-border rounded w-1/3 mb-3" />
                  <div className="h-4 bg-border rounded w-full mb-2" />
                  <div className="h-4 bg-border rounded w-2/3" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── Error state ── */
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center px-6">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold font-poppins mb-2">Failed to load posts</h2>
          <p className="text-sm text-muted-foreground mb-6">{error}</p>
          <button className="btn-primary" onClick={() => fetchPosts(1, true)}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

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

              {/* Featured post */}
              {featuredPost && (
                <div
                  className="cursor-pointer"
                  onClick={() => navigate(`/updates/${featuredPost.slug}`)}
                >
                  <FeaturedPost post={featuredPost} />
                </div>
              )}

              {posts.length > 0 && (
                <>
                  <h2 className="text-xl font-bold text-heading mb-6 mt-10">
                    Recent Posts
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-6 mb-8">
                    {posts.map((post) => (
                      <div
                        key={post._id}
                        onClick={() => navigate(`/updates/${post.slug}`)}
                        className="cursor-pointer"
                      >
                        <BlogCard post={post} />
                      </div>
                    ))}
                  </div>
                </>
              )}

              {posts.length === 0 && !featuredPost && (
                <div className="card-portfolio p-12 text-center mt-6">
                  <p className="text-4xl mb-3">📭</p>
                  <p className="text-muted-foreground">No posts in this category yet.</p>
                </div>
              )}

              {hasMore && (
                <div className="text-center mt-4">
                  <button
                    className="btn-primary"
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                  >
                    {loadingMore ? "Loading…" : "Load More Articles"}
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