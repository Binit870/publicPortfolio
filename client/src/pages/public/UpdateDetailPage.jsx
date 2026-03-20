import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeft, Clock, Calendar } from "lucide-react";
// import Navbar from "@/components/blog/Navbar";
import Footer from "@/components/blog/Footer";
import NewsletterStrip from "@/components/blog/NewsletterStrip";
import SeriesCard from "@/components/blog/SeriesCard";
import TrendingCard from "@/components/blog/TrendingCard";
import PopularTags from "@/components/blog/PopularTag";
import { getBlogBySlugApi, getPublishedBlogsApi } from "@/api/blog.api";

const UpdateDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const res = await getBlogBySlugApi(slug);
        const fetchedPost = res.data;
        setPost(fetchedPost);

        // fetch related — same category
        const relatedRes = await getPublishedBlogsApi({
          category: fetchedPost.category,
          limit: 3,
        });
        const relatedPosts = (relatedRes.data.data || []).filter(
          (p) => p.slug !== slug
        ).slice(0, 2);
        setRelated(relatedPosts);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center px-6">
        <div>
          <div className="text-6xl mb-4">📭</div>
          <h2 className="text-2xl font-bold mb-3">Post not found</h2>
          <button className="btn-primary" onClick={() => navigate(-1)}>
            Back to Updates
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* <Navbar /> */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col lg:flex-row gap-10">

          {/* Main article */}
          <article className="flex-1 min-w-0">

            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-smooth mb-8"
            >
              <ArrowLeft size={16} /> Back to Updates
            </button>

            {/* Cover */}
            {post.coverImage ? (
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-64 md:h-80 object-cover rounded-2xl mb-8"
              />
            ) : (
              <div className="w-full h-64 md:h-80 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/10 flex items-center justify-center text-8xl mb-8">
                📝
              </div>
            )}

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="green-pill">{post.category}</span>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar size={12} />
                <span>{new Date(post.createdAt).toDateString()}</span>
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
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags?.map((tag) => (
                <span key={tag} className="green-pill">{tag}</span>
              ))}
            </div>

            {/* Author */}
            <div className="flex items-center gap-3 mb-8 p-4 bg-section-alt rounded-xl">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center">
                {post.author?.name?.slice(0, 2).toUpperCase() || "AU"}
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {post.author?.name || "Author"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(post.createdAt).toDateString()}
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="prose max-w-none text-foreground">
              <p className="text-muted-foreground leading-relaxed text-base mb-4">
                {post.excerpt}
              </p>
              {/* render content as plain text for now */}
              {/* TODO: use a markdown renderer like react-markdown */}
              <div className="whitespace-pre-line text-muted-foreground leading-relaxed">
                {post.content}
              </div>
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
                      {p.coverImage ? (
                        <img
                          src={p.coverImage}
                          alt={p.title}
                          className="w-full h-28 object-cover rounded-xl mb-4"
                        />
                      ) : (
                        <div className="w-full h-28 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/10 flex items-center justify-center text-4xl mb-4">
                          📄
                        </div>
                      )}
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

      {/* <NewsletterStrip /> */}
      <Footer />
    </div>
  );
};

export default UpdateDetailPage;