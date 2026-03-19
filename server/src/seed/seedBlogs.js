import connectDB from "../config/db.js";
import Blog from "../models/Blog.model.js";
import User from "../models/User.model.js";

const seed = async () => {
  await connectDB();

  const existing = await Blog.findOne();
  if (existing) {
    console.log("Blogs already seeded");
    process.exit(0);
  }

  // get superadmin as author
  const author = await User.findOne({ role: "superadmin" });
  if (!author) {
    console.error("No superadmin found. Run seedSuperAdmin.js first");
    process.exit(1);
  }

  const blogs = [
    {
      title: "Building Scalable Microservices with Node.js and Docker",
      slug: "scalable-microservices-nodejs-docker",
      excerpt: "Learn how to architect, build, and deploy production-ready microservices using Node.js, Docker, and Kubernetes.",
      content: `# Building Scalable Microservices with Node.js and Docker

Microservices architecture has become the gold standard for building large-scale applications. In this guide, we'll walk through everything you need to know to build production-ready microservices.

## What are Microservices?

Microservices are small, independent services that work together to form a complete application. Each service is responsible for a specific business function.

## Setting Up Docker

First, install Docker and create a Dockerfile for your Node.js service:

\`\`\`dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
\`\`\`

## Service Communication

Services communicate via REST APIs or message queues. Use Redis for pub/sub messaging between services.

## Deployment with Kubernetes

Kubernetes orchestrates your containers, handles scaling, and manages service discovery automatically.

## Conclusion

Building microservices requires careful planning but the benefits in scalability and maintainability are worth it.`,
      coverImage: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&h=400&fit=crop",
      category: "DevOps",
      tags: ["Node.js", "Docker", "Kubernetes", "Microservices"],
      seo: {
        metaTitle: "Building Scalable Microservices with Node.js",
        metaDescription: "Complete guide to microservices with Node.js and Docker",
        keywords: ["microservices", "nodejs", "docker"],
      },
      readingTime: 12,
      status: "published",
      allowComments: true,
      stats: { views: 34200, likes: 2890, bookmarks: 1240, shares: 560 },
    },
    {
      title: "React 19: What's New and How to Migrate",
      slug: "react-19-whats-new",
      excerpt: "Explore the latest features in React 19 including the new compiler, server components, and improved hooks.",
      content: `# React 19: What's New

React 19 brings significant improvements to performance and developer experience.

## New Features

### React Compiler
The new React compiler automatically optimizes your components, eliminating the need for manual useMemo and useCallback in most cases.

### Improved Server Components
Server components are now more stable and easier to use with better streaming support.

### New Hooks
- useFormStatus — track form submission state
- useOptimistic — optimistic UI updates
- use — read promises and context in render

## Migration Guide

Most React 18 code works without changes. The main breaking change is the new JSX transform requirement.

## Conclusion

React 19 is a significant step forward. Start migrating your apps today.`,
      coverImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop",
      category: "React",
      tags: ["React", "JavaScript", "Frontend"],
      seo: {
        metaTitle: "React 19 New Features Guide",
        metaDescription: "Everything new in React 19 and how to migrate",
        keywords: ["react", "react19", "frontend"],
      },
      readingTime: 8,
      status: "published",
      allowComments: true,
      stats: { views: 18700, likes: 1450, bookmarks: 670, shares: 320 },
    },
    {
      title: "TypeScript Design Patterns You Should Know",
      slug: "typescript-design-patterns",
      excerpt: "Master essential design patterns implemented in TypeScript for cleaner, more maintainable code.",
      content: `# TypeScript Design Patterns

Design patterns solve recurring software design problems. Here are the most useful ones in TypeScript.

## Singleton Pattern

\`\`\`typescript
class Database {
  private static instance: Database;
  
  private constructor() {}
  
  static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}
\`\`\`

## Observer Pattern

The observer pattern is perfect for event systems and state management.

## Factory Pattern

Use factories to create objects without specifying the exact class.

## Repository Pattern

Abstracts data access logic behind a clean interface — perfect for APIs.

## Conclusion

These patterns will make your TypeScript code cleaner and more maintainable.`,
      coverImage: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=400&fit=crop",
      category: "JavaScript",
      tags: ["TypeScript", "Design Patterns", "Architecture"],
      readingTime: 10,
      status: "published",
      allowComments: true,
      stats: { views: 15300, likes: 1120, bookmarks: 890, shares: 210 },
    },
    {
      title: "Designing APIs That Developers Love",
      slug: "designing-developer-friendly-apis",
      excerpt: "Best practices for creating intuitive, well-documented REST and GraphQL APIs that delight developers.",
      content: `# Designing APIs That Developers Love

A great API is a joy to use. Here's how to design one.

## RESTful Principles

Follow REST conventions consistently. Use nouns for resources, HTTP verbs for actions.

## Consistent Error Responses

Always return errors in the same format:

\`\`\`json
{
  "success": false,
  "message": "Resource not found",
  "errors": []
}
\`\`\`

## Versioning

Always version your API from day one: /api/v1/users

## Documentation

Use OpenAPI/Swagger to auto-generate documentation. Good docs cut support requests in half.

## Pagination

Always paginate list endpoints. Return total count and pagination metadata.

## Conclusion

A well-designed API is your best developer relations tool.`,
      coverImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop",
      category: "System Design",
      tags: ["API", "REST", "GraphQL", "Backend"],
      readingTime: 7,
      status: "published",
      allowComments: true,
      stats: { views: 12800, likes: 980, bookmarks: 540, shares: 180 },
    },
    {
      title: "Getting Started with GitHub Actions for CI/CD",
      slug: "github-actions-cicd",
      excerpt: "Automate your development workflow with GitHub Actions. Set up testing, building, and deployment pipelines.",
      content: `# GitHub Actions for CI/CD

GitHub Actions makes CI/CD accessible to every developer.

## Your First Workflow

Create .github/workflows/ci.yml:

\`\`\`yaml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install
      - run: npm test
\`\`\`

## Deployment Pipeline

Add a deploy job that runs after tests pass. Use secrets for credentials.

## Caching Dependencies

Use actions/cache to speed up workflows by caching node_modules.

## Conclusion

GitHub Actions removes the complexity from CI/CD. Start automating today.`,
      coverImage: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&h=400&fit=crop",
      category: "DevOps",
      tags: ["CI/CD", "GitHub", "DevOps", "Automation"],
      readingTime: 9,
      status: "published",
      allowComments: true,
      stats: { views: 11200, likes: 870, bookmarks: 430, shares: 150 },
    },
    {
      title: "Landing Your First Developer Job in 2026",
      slug: "first-developer-job-2026",
      excerpt: "A practical roadmap for breaking into tech, from building your portfolio to acing technical interviews.",
      content: `# Landing Your First Developer Job in 2026

Breaking into tech is challenging but very achievable with the right approach.

## Build a Strong Portfolio

Your portfolio is your resume. Build 3-5 projects that demonstrate real skills:
- A full-stack web app
- An API with documentation
- A contribution to open source

## The Job Search Strategy

Apply broadly but apply smart. Tailor each application. Aim for 10 applications per week.

## Technical Interviews

Practice data structures and algorithms on LeetCode. Do at least 50 easy problems before interviewing.

## Negotiating Your Offer

Always negotiate. Research market rates on Levels.fyi and Glassdoor.

## Conclusion

Your first job is the hardest to get. Stay consistent and it will happen.`,
      coverImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=400&fit=crop",
      category: "Career",
      tags: ["Career", "Interview", "Jobs", "Portfolio"],
      readingTime: 6,
      status: "published",
      allowComments: true,
      stats: { views: 22100, likes: 1890, bookmarks: 1100, shares: 670 },
    },
    {
      title: "Understanding Event Loop in Node.js",
      slug: "nodejs-event-loop",
      excerpt: "Deep dive into Node.js event loop, microtasks, macrotasks, and how asynchronous operations work under the hood.",
      content: `# Understanding Event Loop in Node.js

The event loop is the heart of Node.js. Understanding it makes you a better developer.

## What is the Event Loop?

Node.js is single-threaded but handles concurrency through the event loop — a mechanism that processes callbacks asynchronously.

## The Call Stack

Synchronous code runs on the call stack. When a function is called it's pushed onto the stack, when it returns it's popped off.

## Microtasks vs Macrotasks

Microtasks (Promises) run before macrotasks (setTimeout, setInterval).

\`\`\`javascript
console.log('1');
setTimeout(() => console.log('2'), 0);
Promise.resolve().then(() => console.log('3'));
console.log('4');
// Output: 1, 4, 3, 2
\`\`\`

## libuv and the Thread Pool

I/O operations run in libuv's thread pool, allowing Node.js to handle many concurrent operations.

## Conclusion

Master the event loop and you'll write more efficient Node.js code.`,
      coverImage: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=800&h=400&fit=crop",
      category: "Node.js",
      tags: ["Node.js", "JavaScript", "Async", "Performance"],
      readingTime: 11,
      status: "published",
      allowComments: true,
      stats: { views: 9800, likes: 760, bookmarks: 380, shares: 120 },
    },
    {
      title: "CSS Grid vs Flexbox: When to Use Which",
      slug: "css-grid-vs-flexbox",
      excerpt: "A practical guide to choosing between CSS Grid and Flexbox for your layouts.",
      content: `# CSS Grid vs Flexbox

Both are powerful layout tools. Knowing when to use each is the key.

## Flexbox — One Dimension

Flexbox is for one-dimensional layouts — either a row OR a column.

Perfect for: navigation bars, button groups, centering content.

\`\`\`css
.nav {
  display: flex;
  align-items: center;
  gap: 1rem;
}
\`\`\`

## CSS Grid — Two Dimensions

Grid is for two-dimensional layouts — rows AND columns simultaneously.

Perfect for: page layouts, card grids, complex UI structures.

\`\`\`css
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}
\`\`\`

## The Simple Rule

Use Flexbox for components. Use Grid for layouts.

## Conclusion

You don't have to choose — use both. Flex inside Grid cells is a common and powerful pattern.`,
      coverImage: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=800&h=400&fit=crop",
      category: "CSS",
      tags: ["CSS", "Frontend", "Layout", "Web Design"],
      readingTime: 5,
      status: "published",
      allowComments: true,
      stats: { views: 16400, likes: 1280, bookmarks: 620, shares: 290 },
    },
  ];

  // insert all blogs with author
  const inserted = await Blog.insertMany(
    blogs.map((b) => ({ ...b, author: author._id }))
  );

  console.log(`${inserted.length} blogs seeded successfully`);
  process.exit(0);
};

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});