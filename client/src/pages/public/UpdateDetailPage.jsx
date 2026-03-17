import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/axiosInstance";
import { ArrowLeft, Eye, Heart, Bookmark, Share2, Clock, Calendar } from "lucide-react";
import Footer from "@/components/blog/Footer";
import NewsletterStrip from "@/components/blog/NewsletterStrip";
import TrendingCard from "@/components/blog/TrendingCard";
import SeriesCard from "@/components/blog/SeriesCard";
import PopularTags from "@/components/blog/PopularTag";

const BLOGS_API = "/blogs"; // public route — GET /api/blogs/:slug

const UpdateDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [post, setPost]       = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  /* like / bookmark local UI state */
  const [liked, setLiked]         = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    if (!slug) return;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res  = await API.get(`${BLOGS_API}/${slug}`);
        const data = res.data.data;
        setPost(data);

        // Fetch related posts — same category, exclude current
        if (data.category) {
          const relRes  = await API.get(BLOGS_API, {
            params: { category: data.category, limit: 3 },
          });
          const relData = relRes.data.data;
          const all     = relData.blogs ?? relData.data ?? [];
          setRelated(all.filter((p) => p.slug !== slug).slice(0, 2));
        }
      } catch (e) {
        setError(e.response?.data?.message ?? e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  /* ── Loading skeleton ── */
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex flex-col lg:flex-row gap-10">
            <div className="flex-1 min-w-0 animate-pulse space-y-5">
              <div className="h-4 bg-border rounded w-24" />
              <div className="h-64 bg-border rounded-2xl" />
              <div className="h-5 bg-border rounded w-1/3" />
              <div className="h-8 bg-border rounded w-3/4" />
              <div className="space-y-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-4 bg-border rounded" />
                ))}
              </div>
            </div>
            <div className="w-full lg:w-[300px] space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="card-portfolio p-5 animate-pulse h-40" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── Error / not found ── */
  if (error || !post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center px-6">
          <div className="text-6xl mb-4">📭</div>
          <h2 className="text-2xl font-bold font-poppins mb-3">Post not found</h2>
          <p className="text-muted-foreground mb-6 text-sm">
            {error ?? "This post may have been moved or deleted."}
          </p>
          <button className="btn-primary" onClick={() => navigate("/updates")}>
            Back to Updates
          </button>
        </div>
      </div>
    );
  }

  const authorName = post.author?.name ?? "Author";
  const authorInitial = authorName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-background">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col lg:flex-row gap-10">

          {/* Main article */}
          <article className="flex-1 min-w-0">

            {/* Back button */}
            <button
              onClick={() => navigate("/updates")}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-smooth mb-8"
            >
              <ArrowLeft size={16} />
              Back to Updates
            </button>

            {/* Cover image */}
            {post.coverImage ? (
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-64 md:h-80 rounded-2xl object-cover mb-8"
              />
            ) : (
              <div className="w-full h-64 md:h-80 rounded-2xl bg-primary/10 flex items-center justify-center text-8xl mb-8">
                📝
              </div>
            )}

            {/* Category + meta */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              {post.category && <span className="green-pill">{post.category}</span>}
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar size={12} />
                <span>
                  {new Date(post.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric", month: "short", year: "numeric",
                  })}
                </span>
              </div>
              {post.readingTime && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock size={12} />
                  <span>{post.readingTime} min read</span>
                </div>
              )}
            </div>

            {/* Title */}
            <h1 className="font-poppins font-bold text-foreground leading-tight mb-4 text-2xl md:text-3xl">
              {post.title}
            </h1>

            {/* Tags */}
            {post.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {post.tags.map((tag) => (
                  <span key={tag} className="green-pill">{tag}</span>
                ))}
              </div>
            )}

            {/* Author row */}
            <div className="flex items-center gap-3 mb-8 p-4 bg-section-alt rounded-xl">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center">
                {post.author?.avatar
                  ? <img src={post.author.avatar} alt={authorName} className="w-full h-full rounded-full object-cover" />
                  : authorInitial}
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{authorName}</p>
              </div>
            </div>

            {/* Article body */}
            <div
              className="prose prose-invert max-w-none text-muted-foreground leading-relaxed"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Stats bar */}
            <div className="flex gap-6 text-sm text-muted-foreground border-t border-border pt-6 mt-10">
              <span className="flex items-center gap-1.5">
                <Eye size={14} /> {(post.stats?.views ?? 0).toLocaleString()}
              </span>
              <span className="flex items-center gap-1.5">
                <Heart size={14} /> {(post.stats?.likes ?? 0).toLocaleString()}
              </span>
              <span className="flex items-center gap-1.5">
                <Bookmark size={14} /> {(post.stats?.bookmarks ?? 0).toLocaleString()}
              </span>
              <span className="flex items-center gap-1.5">
                <Share2 size={14} /> {(post.stats?.shares ?? 0).toLocaleString()}
              </span>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setLiked((p) => !p)}
                className={`gap-2 flex items-center px-4 py-2 rounded-xl text-sm font-semibold border transition-smooth
                  ${liked ? "bg-primary text-white border-primary" : "btn-outline-primary"}`}
              >
                <Heart size={16} fill={liked ? "currentColor" : "none"} />
                {liked ? "Liked" : "Like"}
              </button>
              <button
                onClick={() => setBookmarked((p) => !p)}
                className={`gap-2 flex items-center px-4 py-2 rounded-xl text-sm font-semibold border transition-smooth
                  ${bookmarked ? "bg-primary text-white border-primary" : "btn-outline-primary"}`}
              >
                <Bookmark size={16} fill={bookmarked ? "currentColor" : "none"} />
                {bookmarked ? "Saved" : "Bookmark"}
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                }}
                className="btn-outline-primary gap-2 flex items-center"
              >
                <Share2 size={16} /> Share
              </button>
            </div>

            {/* Related posts */}
            {related.length > 0 && (
              <div className="mt-12">
                <h3 className="text-lg font-bold font-poppins text-foreground mb-6">
                  Related Posts
                </h3>
                <div className="grid sm:grid-cols-2 gap-5">
                  {related.map((p) => (
                    <div
                      key={p._id}
                      className="card-portfolio p-5 cursor-pointer group"
                      onClick={() => navigate(`/updates/${p.slug}`)}
                    >
                      {p.coverImage ? (
                        <img
                          src={p.coverImage}
                          alt={p.title}
                          className="w-full h-28 rounded-xl object-cover mb-4"
                        />
                      ) : (
                        <div className="w-full h-28 rounded-xl bg-primary/10 flex items-center justify-center text-4xl mb-4">
                          📄
                        </div>
                      )}
                      {p.category && (
                        <span className="green-pill mb-2 inline-block">{p.category}</span>
                      )}
                      <h4 className="font-bold text-sm text-foreground leading-snug group-hover:text-primary transition-smooth">
                        {p.title}
                      </h4>
                      {p.readingTime && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                          <Clock size={11} /> {p.readingTime} min read
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

          </article>

          {/* Sidebar */}
          <aside className="w-full lg:w-[300px] shrink-0 space-y-6">
            <SeriesCard />
            <TrendingCard />
            <PopularTags />
          </aside>

        </div>
      </div>

      <NewsletterStrip />
      <Footer />
    </div>
  );
};

export default UpdateDetailPage;