export const author = {
  name: "Alex Rivera",
  username: "alexrivera",
  avatar: "AR",
  bio: "Full-stack engineer passionate about React, Node.js, and system design. Writing about building scalable web applications.",
  socialLinks: {
    github: "https://github.com",
    twitter: "https://twitter.com",
    linkedin: "https://linkedin.com",
    website: "https://example.com",
  },
  followers: 12400,
  following: 340,
  articles: 87,
};

export const categories = [
  "All",
  "JavaScript",
  "React",
  "Node.js",
  "System Design",
  "DevOps",
  "Open Source",
  "Career",
];

export const series = [
  {
    title: "Mastering React Hooks",
    description: "Deep dive into hooks",
    totalParts: 8,
    completedParts: 5,
  },
  {
    title: "System Design 101",
    description: "Fundamentals of system design",
    totalParts: 12,
    completedParts: 7,
  },
  {
    title: "Node.js Performance",
    description: "Optimize your Node apps",
    totalParts: 6,
    completedParts: 6,
  },
];

export const trendingPosts = [
  { title: "Why Server Components Change Everything", views: 24500, likes: 1820 },
  { title: "Building a Real-Time Chat with WebSockets", views: 18300, likes: 1340 },
  { title: "The Art of Writing Clean APIs", views: 15700, likes: 1120 },
  { title: "Docker Compose for Local Development", views: 12900, likes: 980 },
];

export const popularTags = [
  "TypeScript",
  "GraphQL",
  "Docker",
  "AWS",
  "PostgreSQL",
  "Redis",
  "CI/CD",
  "Testing",
  "Microservices",
  "REST API",
  "WebSockets",
  "Kubernetes",
];

const gradients = [
  "from-orange-400 to-amber-300",
  "from-emerald-400 to-teal-300",
  "from-blue-400 to-indigo-300",
  "from-pink-400 to-rose-300",
  "from-violet-400 to-purple-300",
  "from-cyan-400 to-sky-300",
];

export const featuredPost = {
  title: "Building Scalable Microservices with Node.js and Docker",
  slug: "scalable-microservices-nodejs-docker",
  excerpt:
    "Learn how to architect, build, and deploy production-ready microservices using Node.js, Docker, and Kubernetes. This comprehensive guide covers service discovery, load balancing, and monitoring.",
  coverGradient: gradients[0],
  author,
  category: "DevOps",
  tags: ["Node.js", "Docker", "Kubernetes"],
  stats: {
    views: 34200,
    likes: 2890,
    bookmarks: 1240,
    shares: 560,
  },
  readingTime: 12,
  publishedAt: "Mar 10, 2026",
  status: "published",
  featured: true,
};

export const blogPosts = [
  {
    title: "React 19: What's New and How to Migrate",
    slug: "react-19-whats-new",
    excerpt:
      "Explore the latest features in React 19 including the new compiler, server components, and improved hooks.",
    coverGradient: gradients[1],
    author,
    category: "React",
    tags: ["React", "JavaScript"],
    stats: {
      views: 18700,
      likes: 1450,
      bookmarks: 670,
      shares: 320,
    },
    readingTime: 8,
    publishedAt: "Mar 8, 2026",
    status: "published",
  },
  {
    title: "TypeScript Design Patterns You Should Know",
    slug: "typescript-design-patterns",
    excerpt:
      "Master essential design patterns implemented in TypeScript for cleaner, more maintainable code.",
    coverGradient: gradients[2],
    author,
    category: "JavaScript",
    tags: ["TypeScript", "Design Patterns"],
    stats: {
      views: 15300,
      likes: 1120,
      bookmarks: 890,
      shares: 210,
    },
    readingTime: 10,
    publishedAt: "Mar 5, 2026",
    status: "published",
  },
  {
    title: "Designing APIs That Developers Love",
    slug: "designing-developer-friendly-apis",
    excerpt:
      "Best practices for creating intuitive, well-documented REST and GraphQL APIs that delight developers.",
    coverGradient: gradients[3],
    author,
    category: "System Design",
    tags: ["API", "REST", "GraphQL"],
    stats: {
      views: 12800,
      likes: 980,
      bookmarks: 540,
      shares: 180,
    },
    readingTime: 7,
    publishedAt: "Mar 2, 2026",
    status: "published",
  },
  {
    title: "Getting Started with GitHub Actions for CI/CD",
    slug: "github-actions-cicd",
    excerpt:
      "Automate your development workflow with GitHub Actions. Set up testing, building, and deployment pipelines.",
    coverGradient: gradients[4],
    author,
    category: "DevOps",
    tags: ["CI/CD", "GitHub", "DevOps"],
    stats: {
      views: 11200,
      likes: 870,
      bookmarks: 430,
      shares: 150,
    },
    readingTime: 9,
    publishedAt: "Feb 28, 2026",
    status: "published",
  },
  {
    title: "Landing Your First Developer Job in 2026",
    slug: "first-developer-job-2026",
    excerpt:
      "A practical roadmap for breaking into tech, from building your portfolio to acing technical interviews.",
    coverGradient: gradients[5],
    author,
    category: "Career",
    tags: ["Career", "Interview"],
    stats: {
      views: 22100,
      likes: 1890,
      bookmarks: 1100,
      shares: 670,
    },
    readingTime: 6,
    publishedAt: "Feb 25, 2026",
    status: "published",
  },
  {
    title: "Understanding Event Loop in Node.js",
    slug: "nodejs-event-loop",
    excerpt:
      "Deep dive into Node.js event loop, microtasks, macrotasks, and how asynchronous operations work under the hood.",
    coverGradient: gradients[0],
    author,
    category: "Node.js",
    tags: ["Node.js", "JavaScript"],
    stats: {
      views: 9800,
      likes: 760,
      bookmarks: 380,
      shares: 120,
    },
    readingTime: 11,
    publishedAt: "Feb 22, 2026",
    status: "published",
  },
];