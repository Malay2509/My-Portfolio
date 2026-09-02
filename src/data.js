// ============================================================
//  data.js — All portfolio content lives here.
//  Edit this file to update your portfolio — no code knowledge needed.
// ============================================================

export const personal = {
  name: "Malay Singh Bisht",
  shortName: "Malay",
  initials: "MSB",
  tagline: "Full-Stack & Backend Developer",
  status: "Open to Opportunities",
  location: "Indore, Madhya Pradesh, India",
  email: "malaysinghbisht@gmail.com",           // ← your real email
  phone: "8770763944",
  college: "SGSITS, Indore",
  degree: "B.Tech Information Technology",
  year: "2022 – 2026",

  // Drop your photo in /public folder and set the filename here
  photo: "/photo.jpg",               // ← e.g. "/myPhoto.jpg"
  photoAlt: "Malay Singh Bisht",

  social: {
    github: "https://github.com/Malay2509",
    linkedin: "https://www.linkedin.com/in/malay-singh-bisht-1b53a91b5/",
    twitter: "",
  },
  //resumeFile: "/resume.pdf",
  resumeFile: "https://drive.google.com/file/d/1pvzbLDD513IB1R4VXvmNbfX6q5jNG2bd/view?usp=sharing",

  about: [
    "I'm a passionate and detail-oriented software developer who recently completed my B.Tech in Information Technology from <strong>SGSITS, Indore</strong>. I thrive at the intersection of clean code and great user experience.",
    "My expertise spans the full development spectrum — from responsive React frontends to scalable REST APIs with Node.js and Java Spring Boot, with cloud deployments on AWS and containerization using Docker.",
    "I'm currently <strong>actively seeking opportunities</strong> in Full-Stack and Backend Engineering. Let's build something great together!",
  ],

  highlights: [
    "Full-Stack Web Development",
    "Backend API Engineering",
    "Cloud & DevOps (AWS, Docker)",
    "Database Design (SQL & NoSQL)",
  ],

  typewriterPhrases: [
    "Full-Stack Web Apps",
    "Scalable REST APIs",
    "Backend Microservices",
    "Cloud-Ready Systems",
    "Great User Experiences",
  ],
};

export const stats = [
  { count: 10, suffix: "+", label: "Projects Built" },
  { count: 16, suffix: "+", label: "Technologies" },
  { count: 6, suffix: "+", label: "Certifications" },
  { count: 2026, suffix: "", label: "Graduating Year" },
];

export const skills = {
  frontend: [
    { name: "React.js", emoji: "⚛", color: "#61DAFB", level: 90 },
    { name: "TypeScript", emoji: "TS", color: "#3178C6", level: 82 },
    { name: "Next.js", emoji: "▲", color: "#A8A8A8", level: 78 },
    { name: "JavaScript", emoji: "JS", color: "#F7DF1E", level: 88 },
    { name: "HTML / CSS", emoji: "H5", color: "#E44D26", level: 92 },
  ],
  backend: [
    { name: "Node.js", emoji: "⬡", color: "#8CC84B", level: 85 },
    { name: "Express.js", emoji: "Ex", color: "#888", level: 83 },
    { name: "Java", emoji: "☕", color: "#F89820", level: 80 },
    { name: "Spring Boot", emoji: "🍃", color: "#6DB33F", level: 72 },
    { name: "Python", emoji: "🐍", color: "#3776AB", level: 75 },
    { name: "REST APIs", emoji: "⚡", color: "#6366F1", level: 88 },
  ],
  database: [
    { name: "MySQL", emoji: "🐬", color: "#336791", level: 80 },
    { name: "PostgreSQL", emoji: "🐘", color: "#336791", level: 80 },
    { name: "MongoDB", emoji: "🍃", color: "#47A248", level: 78 },
    { name: "Supabase", emoji: "⚡", color: "#3ECF8E", level: 70 },
  ],
  devops: [
    { name: "Docker", emoji: "🐳", color: "#2496ED", level: 72 },
    { name: "AWS", emoji: "☁", color: "#FF9900", level: 65 },
    { name: "Git / GitHub", emoji: "⑂", color: "#F05032", level: 90 },
    { name: "Postman", emoji: "🚀", color: "#FF6C37", level: 85 },
  ],
};

export const projects = [
  {
    icon: "🛒",
    title: "E-Commerce Platform",
    description: "Full-stack e-commerce app with real-time inventory, secure Stripe payments, JWT auth, and admin dashboard. Optimized PostgreSQL queries for sub-100ms responses.",
    tags: ["React", "Node.js", "PostgreSQL", "Stripe", "Docker"],
    category: "fullstack",
    github: "https://github.com/malay-singh-bisht",
    demo: "#",
    featured: false,
  },
  {
    icon: "🔐",
    title: "Auth Microservice",
    description: "Production-grade authentication microservice with JWT + refresh tokens, OAuth2 (Google/GitHub), role-based access control, and rate limiting. Containerized with Docker.",
    tags: ["Java", "Spring Boot", "PostgreSQL", "Docker", "OAuth2"],
    category: "backend",
    github: "https://github.com/malay-singh-bisht",
    demo: "#",
    featured: true,
  },
  {
    icon: "💬",
    title: "Real-Time Chat App",
    description: "Scalable real-time messaging with WebSocket (Socket.io), group chats, file sharing, and read receipts. Backed by MongoDB for flexible message storage.",
    tags: ["React", "Socket.io", "Node.js", "MongoDB"],
    category: "fullstack",
    github: "https://github.com/malay-singh-bisht",
    demo: "#",
    featured: false,
  },
  {
    icon: "📊",
    title: "Analytics Dashboard",
    description: "Modern analytics dashboard with dynamic charts and real-time data. Built with React + TypeScript, integrated with Supabase for live backend data.",
    tags: ["React", "TypeScript", "Supabase", "Chart.js"],
    category: "frontend",
    github: "https://github.com/malay-singh-bisht",
    demo: "#",
    featured: false,
  },
];

export const experience = [
  {
    role: "Full-Stack Developer Intern",
    company: "TechStartup Pvt. Ltd.",
    location: "Indore",
    period: "Jun 2025 – Aug 2025",
    current: true,
    bullets: [
      "Built RESTful APIs using Node.js & Express serving 10k+ daily active users",
      "Redesigned React.js frontend components, improving load time by 35%",
      "Integrated Stripe payment gateway handling ₹5L+ monthly transactions",
      "Containerized services with Docker, reducing deployment time by 60%",
    ],
    tags: ["React", "Node.js", "MongoDB", "Docker"],
  },
  {
    role: "Backend Engineering Intern",
    company: "Open Source Project",
    location: "Remote",
    period: "Jan 2025 – Apr 2025",
    current: false,
    bullets: [
      "Contributed to Java Spring Boot microservice architecture",
      "Optimized PostgreSQL queries, improving read performance by 40%",
      "Implemented Redis caching layer, reducing API response time by 50%",
    ],
    tags: ["Java", "Spring Boot", "PostgreSQL", "Redis"],
  },
];

export const education = [
  {
    icon: "🎓",
    degree: "B.Tech — Information Technology",
    institution: "Shri Govindram Seksaria Institute of Technology & Science (SGSITS), Indore",
    period: "2022 – 2026",
    //gpa: "",
    detail: "DSA, DBMS, OS, Computer Networks, Software Engineering, Web Technologies.",
  },
  {
    icon: "🏫",
    degree: "Senior Secondary (12th) — PCM + PE",
    institution: "Colonel's Academy, Mhow",
    period: "2007 – 2022",
    //gpa: "",
    detail: "Physics, Chemistry, Mathematics, Physical Education & Computer Science.",
  },
];

export const certifications = [
  { name: "AWS Cloud Practitioner", issuer: "Amazon Web Services", year: "2025", ribbon: "AWS", link: "#" },
  { name: "The Complete Node.js Developer", issuer: "Andrew Mead · Udemy", year: "2024", ribbon: "Udemy", link: "#" },
  { name: "React — The Complete Guide", issuer: "Maximilian Schwarzmüller", year: "2024", ribbon: "Udemy", link: "#" },
  { name: "Spring Boot & Microservices", issuer: "Duke University · Coursera", year: "2025", ribbon: "Coursera", link: "#" },
  { name: "Docker & Kubernetes Masterclass", issuer: "TechWorld with Nana · Udemy", year: "2025", ribbon: "Udemy", link: "#" },
  { name: "PostgreSQL for Everybody", issuer: "Univ. of Michigan · Coursera", year: "2024", ribbon: "Coursera", link: "#" },
];

export const blog = [
  {
    category: "Backend",
    categoryColor: "bg-sky-500/10 text-sky-400 border-sky-500/20",
    title: "Building Scalable REST APIs with Node.js and Express",
    excerpt: "Learn how to architect production-ready APIs with proper error handling, middleware patterns, and rate limiting for high-traffic apps.",
    date: "Aug 10, 2025",
    readTime: "8 min read",
    link: "#",
  },
  {
    category: "DevOps",
    categoryColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    title: "Dockerizing a Full-Stack App: From Dev to Production",
    excerpt: "Step-by-step guide to containerizing React + Node.js and deploying to AWS with zero downtime rolling deployments.",
    date: "Jul 22, 2025",
    readTime: "12 min read",
    link: "#",
  },
  {
    category: "Database",
    categoryColor: "bg-violet-500/10 text-violet-400 border-violet-500/20",
    title: "PostgreSQL Performance Tuning: Indexing Strategies",
    excerpt: "Deep dive into composite indexes, partial indexes, and EXPLAIN ANALYZE to dramatically speed up your queries.",
    date: "Jun 15, 2025",
    readTime: "10 min read",
    link: "#",
  },
];
