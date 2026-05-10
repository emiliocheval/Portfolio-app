export type Project = {
  title: string;
  description: string;
  href: string;
  imageSeed: string;
  tags: string[];
  badge?: string;
};

export type EducationItem = {
  degree: string;
  institution: string;
  period: string;
  description: string;
  href?: string;
  tags: string[];
};

export type ExperienceItem = {
  role: string;
  company: string;
  href?: string;
  period: string;
  bullets: string[];
  tags: string[];
};

export const featuredProjects: Project[] = [
  {
    title: "chatos.chat",
    description:
      "Personal SaaS product — live with active users. Built and shipped a full-stack TypeScript app in React and Next.js, owning the product end to end from architecture to deployment. Created a complete design system in code with thoughtful interaction states and a strong visual language. Worked closely across design and implementation. UX focus throughout: draggable window system, contextual navigation, and a modern, intuitive interface.",
    href: "https://chatos.chat",
    imageSeed: "chatos",
    badge: "Personal project · 2024 – present",
    tags: [
      "React",
      "Next.js",
      "TypeScript",
      "Tailwind",
      "Supabase",
      "PostgreSQL",
      "Prisma",
    ],
  },
  {
    title: "Headless e-commerce platform",
    description:
      "Full-stack e-commerce platform in Next.js and TypeScript with Sanity as a headless CMS and Tailwind CSS, focused on usability and scalability.",
    href: "#",
    imageSeed: "ecomheadless",
    badge: "Personal project · 2024 – 2025",
    tags: ["React", "Next.js", "TypeScript", "Tailwind", "Sanity"],
  },
];

export const education: EducationItem[] = [
  {
    degree: "Front-end developer",
    institution: "KYH Vocational College",
    period: "2023 – 2025",
    description:
      "Two-year higher vocational programme covering React, Next.js, TypeScript, HTML/CSS and JavaScript, plus applied backend training.",
    href: "https://www.kyh.se",
    tags: ["React", "Next.js", "TypeScript", "JavaScript", "HTML", "CSS", "Tailwind", "Node.js", "SQL", "PostgreSQL", "BaaS", "Supabase", "Firebase"],
  },
  {
    degree: "Business and administration",
    institution: "Jensen Södra Gymnasium",
    period: "2013 – 2016",
    description:
      "Upper secondary education with a focus on business and administration.",
    href: "https://www.jensengymnasium.se",
    tags: [],
  },
];

export const coreSkills = [
  "React",
  "Next.js",
  "TypeScript",
  "Tailwind",
  "PostgreSQL",
  "Node.js",
] as const;

export const experience: ExperienceItem[] = [
  {
    role: "Freelance consultant, AI assistant",
    company: "External client (via referral)",
    period: "2024 – 2025",
    bullets: [
      "Referred by Invest Viable AB. Delivered a technical engagement tailored to the client’s needs.",
      "Completed in parallel with full-time studies at KYH.",
      "Reference available on request.",
    ],
    tags: [
      "Next.js 15",
      "React",
      "TypeScript",
      "Supabase",
      "Upstash Redis",
      "Gemini AI",
      "Google APIs",
      "Telegram Bot API",
      "Vercel",
      "Render",
    ],
  },
  {
    role: "UI/UX designer (freelance consultant)",
    company: "Invest Viable AB",
    period: "2024 – 2025",
    bullets: [
      "Responsible for UI/UX design in Figma for a stock analysis and valuation platform.",
      "Close collaboration with product on component structure and visual language.",
      "Reference available on request.",
    ],
    tags: ["Figma"],
  },
];
