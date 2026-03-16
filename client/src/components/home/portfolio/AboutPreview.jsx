const skills = [
  "React", "Node.js", "MongoDB", "TypeScript",
  "Tailwind CSS", "Next.js", "GraphQL", "AWS",
];

const AboutPreview = () => {
  return (
    <section id="about" className="py-24 bg-section-alt">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">

        <div className="flex justify-center">
          <div className="w-52 h-52 rounded-full bg-secondary border-4 border-secondary flex items-center justify-center text-8xl shadow-green">
            🧑‍💼
          </div>
        </div>

        <div>
          <span className="section-label mb-3 block">About Me</span>

          <h2 className="section-title mb-2">
            Passionate Developer &<br />Community Builder
          </h2>

          <div className="saffron-underline mb-6" />

          <p className="text-muted-foreground leading-relaxed mb-8">
            I'm a full-stack developer with over 5 years of experience
            building scalable web applications and organizing tech events
            that bring communities together.
          </p>

          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span key={skill} className="green-pill">
                {skill}
              </span>
            ))}
          </div>

          <button className="btn-primary mt-8">
            Read More
          </button>
        </div>

      </div>
    </section>
  );
};

export default AboutPreview;