import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import API from "../../../api/axiosInstance";

const AboutPreview = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    API.get("/profile")
      .then((res) => setProfile(res.data.data))
      .catch(() => {});
  }, []);

  const about        = profile?.about || {};
  const home         = profile?.home  || {};
  const shortIntro   = home?.aboutPreview?.shortIntro || about.biography || "";
  const name         = about.name  || home.name  || "Developer";
  const title        = about.title || home.title || "";
  const profileImage = about.profileImage || null;

  return (
    <section
      id="about"
      style={{ background: "#f6fdf6", padding: "clamp(60px,10vw,100px) 0", fontFamily: "'Poppins', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

        /* ── Card ── */
        .ap-card {
          background: white;
          border-radius: 20px;
          padding: clamp(20px, 5vw, 44px);
          box-shadow: 0 4px 28px rgba(19,136,8,.06);
          border: 1px solid #e4f0e2;
        }

        /* ── Image frame wrapper ── */
        .ap-img-wrap {
          position: relative;
          width: clamp(200px, 28vw, 280px);
          flex-shrink: 0;
          padding-bottom: 14px;
          padding-left: 14px;
        }

        /* Orange border — bottom-left offset */
        .ap-img-wrap::before {
          content: '';
          position: absolute;
          bottom: 0; left: 0;
          width: calc(100% - 14px);
          height: calc(100% - 14px);
          border-radius: 16px;
          border: 3px solid #FF9933;
          z-index: 0;
        }

        /* Green corner accent — top-right */
        .ap-img-wrap::after {
          content: '';
          position: absolute;
          top: -12px; right: -12px;
          width: 52%; height: 52%;
          border-radius: 12px;
          border: 3px solid #138808;
          z-index: 0;
        }

        /* Portrait image box — 3:4 */
        .ap-img-inner {
          position: relative;
          z-index: 1;
          width: 100%;
          aspect-ratio: 3 / 4;
          border-radius: 16px;
          overflow: hidden;
          background: #f0faf0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: clamp(48px, 6vw, 80px);
        }
        .ap-img-inner img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        /* ── "About Me" chip ── */
        .ap-chip {
          display: inline-block;
          background: #fff3e6; color: #FF9933;
          border: 1px solid #ffd9a8; border-radius: 100px;
          font-size: 11px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase;
          padding: 4px 14px;
          font-family: 'Poppins', sans-serif;
        }

        /* ── Gradient accent line ── */
        .ap-grad-line {
          width: 52px; height: 4px; border-radius: 2px;
          margin: 14px 0 22px;
          background: linear-gradient(90deg, #FF9933, #138808);
        }

        /* ── Skill tags ── */
        .skill-tag {
          display: inline-block;
          background: #edf7ed; color: #138808;
          border: 1.5px solid #c0e0bc;
          padding: 5px 13px; border-radius: 100px;
          font-size: 12px; font-weight: 600;
          font-family: 'Poppins', sans-serif;
          letter-spacing: .01em;
          transition: background .2s, color .2s, border-color .2s;
        }
        .skill-tag:hover { background: #138808; color: white; border-color: #138808; }

        /* ── Read More button ── */
        .btn-ap {
          display: inline-flex; align-items: center; gap: 8px;
          background: #FF9933; color: white;
          font-family: 'Poppins', sans-serif; font-weight: 700;
          font-size: 12px; letter-spacing: .06em; text-transform: uppercase;
          padding: 11px 22px; border-radius: 9px; border: none; cursor: pointer;
          transition: background .2s, transform .15s;
          box-shadow: 0 4px 14px rgba(255,153,51,.25);
        }
        .btn-ap:hover { background: #e07d1a; transform: translateY(-1px); }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="ap-card">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start lg:items-center">

            {/* ── Image — centered on mobile ── */}
            <div className="flex justify-center w-full lg:w-auto">
              <div className="ap-img-wrap">
                <div className="ap-img-inner">
                  {profileImage
                    ? <img src={profileImage} alt={name} />
                    : <span>🧑‍💼</span>
                  }
                </div>
              </div>
            </div>

            {/* ── Text ── */}
            <div className="flex-1 min-w-0">
              <span className="ap-chip mb-4 block w-fit">About Me</span>

              {/* Name + title — Poppins 800 */}
              <h2
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 800,
                  fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
                  color: "#111",
                  lineHeight: 1.2,
                }}
              >
                {name}
                {title && (
                  <>
                    <br />
                    <span style={{ color: "#FF9933" }}>{title}</span>
                  </>
                )}
              </h2>

              <div className="ap-grad-line" />

              {/* Bio — Poppins 400 */}
              <p
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 400,
                  color: "#666",
                  lineHeight: 1.85,
                  marginBottom: 24,
                  maxWidth: 540,
                  fontSize: "clamp(0.9rem, 1.5vw, 0.97rem)",
                }}
              >
                {shortIntro || "Full-stack developer with a passion for building scalable web applications and organizing tech events that bring communities together."}
              </p>

              {/* Skill tags */}
              <div className="flex flex-wrap gap-2 mb-8">
                {["React", "Node.js", "MongoDB", "TypeScript", "Tailwind CSS", "Next.js"].map((skill) => (
                  <span key={skill} className="skill-tag">{skill}</span>
                ))}
              </div>

              
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutPreview;