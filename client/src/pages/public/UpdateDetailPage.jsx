import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, Heart, Bookmark, Share2, Clock, Calendar } from "lucide-react";
import Footer from "@/components/blog/Footer";
import NewsletterStrip from "@/components/blog/NewsletterStrip";
import TrendingCard from "@/components/blog/TrendingCard";
import SeriesCard from "@/components/blog/SeriesCard";
import PopularTags from "@/components/blog/PopularTag";
import { blogPosts, featuredPost } from "@/data/BlogData";

const UpdateDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  // find post from local data
  // TODO: replace with API fetch when backend is ready
  // useEffect(() => { fetchBlogBySlug(slug) }, [slug])
  const allPosts = [featuredPost, ...blogPosts];
  const post = allPosts.find((p) => p.slug === slug);

  // related posts — same category, exclude current
  const related = blogPosts
    .filter((p) => p.category === post?.category && p.slug !== slug)
    .slice(0, 2);

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center px-6">
          <div className="text-6xl mb-4">📭</div>
          <h2 className="text-2xl font-bold font-poppins mb-3">Post not found</h2>
          <p className="text-muted-foreground mb-6 text-sm">
            This post may have been moved or deleted.
          </p>
          <button className="btn-primary" onClick={() => navigate("/updates")}>
            Back to Updates
          </button>
        </div>
      </div>
    );
  }

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

            {/* Cover */}
            <div className={`w-full h-64 md:h-80 rounded-2xl bg-gradient-to-br ${post.coverGradient} flex items-center justify-center text-8xl mb-8`}>
              📝
            </div>

            {/* Category + meta */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="green-pill">{post.category}</span>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar size={12} />
                <span>{post.publishedAt}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock size={12} />
                <span>{post.readingTime} min read</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="font-poppins font-bold text-foreground leading-tight mb-4">
              {post.title}
            </h1>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map((tag) => (
                <span key={tag} className="green-pill">{tag}</span>
              ))}
            </div>

            {/* Author row */}
            <div className="flex items-center gap-3 mb-8 p-4 bg-section-alt rounded-xl">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center">
                {post.author.avatar}
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{post.author.name}</p>
                <p className="text-xs text-muted-foreground">@{post.author.username}</p>
              </div>
            </div>

            {/* Article body — excerpt as placeholder */}
            {/* TODO: replace with full content from backend */}
            <div className="prose max-w-none">
              <p className="text-muted-foreground leading-relaxed text-base mb-6">
                {post.excerpt}
              </p>
              <p className="text-muted-foreground leading-relaxed text-base mb-6">
                This is where the full article content will be rendered once connected to the backend. The content field from the Blog model will be displayed here using a rich text renderer.
              </p>
              <p className="text-muted-foreground leading-relaxed text-base">
                Stay tuned for the complete article. In the meantime, explore other posts in the {post.category} category.
              </p>
            </div>

            {/* Stats bar */}
            <div className="flex gap-6 text-sm text-muted-foreground border-t border-border pt-6 mt-10">
              <span className="flex items-center gap-1.5">
                <Eye size={14} /> {post.stats.views.toLocaleString()}
              </span>
              <span className="flex items-center gap-1.5">
                <Heart size={14} /> {post.stats.likes.toLocaleString()}
              </span>
              <span className="flex items-center gap-1.5">
                <Bookmark size={14} /> {post.stats.bookmarks.toLocaleString()}
              </span>
              <span className="flex items-center gap-1.5">
                <Share2 size={14} /> {post.stats.shares.toLocaleString()}
              </span>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 mt-6">
              <button className="btn-primary gap-2 flex items-center">
                <Heart size={16} /> Like
              </button>
              <button className="btn-outline-primary gap-2 flex items-center">
                <Bookmark size={16} /> Bookmark
              </button>
              <button className="btn-outline-primary gap-2 flex items-center">
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
                      key={p.slug}
                      className="card-portfolio p-5 cursor-pointer group"
                      onClick={() => navigate(`/updates/${p.slug}`)}
                    >
                      <div className={`w-full h-28 rounded-xl bg-gradient-to-br ${p.coverGradient} flex items-center justify-center text-4xl mb-4`}>
                        📄
                      </div>
                      <span className="green-pill mb-2 inline-block">{p.category}</span>
                      <h4 className="font-bold text-sm text-foreground leading-snug group-hover:text-primary transition-smooth">
                        {p.title}
                      </h4>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                        <Clock size={11} /> {p.readingTime} min read
                      </div>
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