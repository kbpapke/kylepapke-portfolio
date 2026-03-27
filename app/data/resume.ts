export const resume = {
  name: "Kyle Papke",
  title: "Senior Software Engineer",
  location: "Ann Arbor, MI",
  email: "kpapke@gmail.com",
  linkedin: "https://linkedin.com/in/kylepapke/",
  website: "https://kylepapke.xyz",
  yearsExperience: 14,

  summary:
    "Senior Software Engineer with experience across E-commerce, Fintech, AdTech, Blockchain, Web3, and Cybersecurity. Specialized in rapid prototyping and building cutting-edge, high-fidelity user interfaces that translate complex data into actionable intelligence — with a focus on speed, scalability, and consistent delivery.",

  skillGroups: [
    {
      label: "Languages & Frameworks",
      icon: "⌨",
      skills: ["TypeScript", "Golang", "Node.js", "React", "Next.js", "GraphQL", "Remix", "Vite"],
      color: "#39FF14",
    },
    {
      label: "Infrastructure & Cloud",
      icon: "☁",
      skills: ["Docker", "Kubernetes", "Google Cloud", "Supabase", "Vercel", "GitHub Actions", "Jenkins"],
      color: "#4EC9E1",
    },
    {
      label: "UI/UX & Design",
      icon: "◈",
      skills: ["Figma", "Tailwind CSS", "D3.js", "Looker", "Responsive Design", "Accessibility", "Material Design"],
      color: "#FF6B35",
    },
    {
      label: "Web3 & Blockchain",
      icon: "◆",
      skills: ["Web3", "Ethers.js", "Wagmi.js", "Thirdweb", "Smart Contracts", "Dapps"],
      color: "#A855F7",
    },
    {
      label: "Testing",
      icon: "✓",
      skills: ["Cypress", "Playwright", "Puppeteer", "Vitest"],
      color: "#F59E0B",
    },
    {
      label: "AI & Tooling",
      icon: "◎",
      skills: ["Claude Code", "Cursor", "Codex", "ChatGPT", "MCP"],
      color: "#39FF14",
    },
    {
      label: "Leadership",
      icon: "♟",
      skills: ["Agile Methodologies", "Technical Roadmaps", "Team Leadership"],
      color: "#FF6B35",
    },
  ],

  // Radar chart data — proficiency 0-100
  radarSkills: [
    { axis: "Frontend", value: 97 },
    { axis: "TypeScript", value: 95 },
    { axis: "Backend", value: 72 },
    { axis: "Web3", value: 80 },
    { axis: "Cloud/Infra", value: 70 },
    { axis: "AI/Tooling", value: 85 },
    { axis: "Leadership", value: 78 },
    { axis: "Data Viz", value: 82 },
  ],

  experience: [
    {
      company: "Censys",
      location: "Ann Arbor, MI",
      title: "Senior Software Engineer",
      period: "Mar 2025 – Present",
      current: true,
      domain: "Cybersecurity",
      color: "#39FF14",
      highlights: [
        "Built and maintained the Censys Attack Surface Management platform — React/TypeScript frontend, Golang/GraphQL backend, GCP infrastructure",
        "Enhanced data visualization dashboards with AI workflows using Codex, Cursor, and Claude Code",
        "Prototyped and shipped efficient agentic workflows, accelerating internal tooling and feature velocity",
        "Engineered Cloud Connector integrations and CSV export pipelines for enterprise customers at scale",
      ],
      tags: ["React", "TypeScript", "Golang", "GraphQL", "GCP", "AI Workflows"],
    },
    {
      company: "Treasure",
      location: "Remote, USA",
      title: "Senior Frontend Engineer",
      period: "Sept 2023 – Nov 2024",
      current: false,
      domain: "Web3 / Gaming",
      color: "#A855F7",
      highlights: [
        "Designed interface for a decentralized Web3 gaming ecosystem — led Platform App and NFT Marketplace",
        "Established the Chain Quests framework; integrated fiat-to-crypto solutions via Thirdweb",
        "Built scalable dApps with Next.js, TypeScript, Tailwind CSS, and GraphQL",
        "Improved ecosystem performance via the Treasure Developer Kit in cross-functional collaboration",
      ],
      tags: ["Next.js", "TypeScript", "Web3", "GraphQL", "Thirdweb", "NFT"],
    },
    {
      company: "Criteo",
      location: "Ann Arbor, MI",
      title: "Senior Developer Lead",
      period: "Dec 2017 – Sept 2023",
      current: false,
      domain: "AdTech",
      color: "#FF6B35",
      highlights: [
        "Managed 8 frontend engineers delivering self-service advertising platform for 2,300+ global brands",
        "Spearheaded organizational adoption of GraphQL, improving API efficiency across teams",
        "Led quarterly R&D planning, aligning technical roadmap with key business objectives",
      ],
      tags: ["React", "GraphQL", "Team Leadership", "AdTech", "R&D"],
    },
    {
      company: "TD Ameritrade",
      location: "Ann Arbor, MI",
      title: "Senior Software Developer",
      period: "Apr 2015 – Dec 2017",
      current: false,
      domain: "FinTech",
      color: "#4EC9E1",
      highlights: [
        "Developed first-generation robo-advisor and AI chatbot interfaces for millennial wealth engagement",
        "Delivered scalable React web applications and contributed to cross-platform mobile app",
        "Championed Agile best practices to improve development workflows",
      ],
      tags: ["React", "FinTech", "Robo-Advisor", "AI Chatbot", "Mobile"],
    },
    {
      company: "Thomson Reuters",
      location: "Dexter, MI",
      title: "Frontend Web Developer",
      period: "Mar 2014 – Apr 2015",
      current: false,
      domain: "Tax & Accounting",
      color: "#F59E0B",
      highlights: [
        "Translated complex tax and accounting data into visually coherent dashboards using D3.js",
        "Modernized WordPress CMS with dynamic frontend for search and navigation across accounting data",
      ],
      tags: ["D3.js", "JavaScript", "Dashboards"],
    },
    {
      company: "CANVAS United",
      location: "New York, NY",
      title: "Full-Stack Developer",
      period: "Jan 2013 – Apr 2013",
      current: false,
      domain: "Games & Web",
      color: "#39FF14",
      highlights: [
        "Developed full-stack web applications and interactive game experiences collaborating with UX and backend teams",
      ],
      tags: ["Full-Stack", "Games"],
    },
    {
      company: "Coach",
      location: "New York, NY",
      title: "Web Developer",
      period: "Nov 2011 – Oct 2012",
      current: false,
      domain: "E-commerce",
      color: "#FF6B35",
      highlights: [
        "Developed and maintained JavaScript SPAs for U.S., China, and Japan e-commerce markets",
        "Focused on performance optimization and UX enhancements improving conversion rates",
      ],
      tags: ["JavaScript", "SPA", "E-commerce"],
    },
  ],

  initiatives: [
    {
      name: "America Guild – Project Saturn",
      description:
        "Automated research, scanning, investment analysis, and trade execution platform for Polymarket prediction markets.",
      tags: ["AI", "FinTech", "Automation"],
      color: "#39FF14",
    },
    {
      name: "AI Trading Camera",
      description:
        "AI-powered Android camera tool that analyzes memecoin trading charts, providing actionable take-profit and stop-loss targets.",
      tags: ["Android", "AI", "Computer Vision"],
      color: "#FF6B35",
    },
    {
      name: "Dynamic Wealth Solutions",
      description:
        "Custom automated fintech solution for client portfolio strategy optimization.",
      tags: ["FinTech", "Automation"],
      color: "#4EC9E1",
    },
    {
      name: "Consortium Key Trading Tools",
      description:
        "Interactive dashboard for Web3 portfolio management and high-stakes trading utilities.",
      tags: ["Web3", "Dashboard", "DeFi"],
      color: "#A855F7",
    },
  ],

  claudeProjects: [
    {
      name: ".the.product",
      description:
        "Browser-based tribute to the iconic demoscene production fr-08. Six procedurally generated 3D scenes with synthesized audio — all in 64KB of code.",
      url: "https://github.com/kbpapke/.the.product",
      demo: "https://the-product-lime.vercel.app",
      tags: ["Three.js", "Web Audio API", "Procedural", "Demoscene"],
      color: "#A855F7",
    },
    {
      name: "Clankersmith",
      description:
        "Autonomous agent framework with Hive delivery system, skills scaffolding, and agentic coding principles for Claude Code.",
      url: "https://github.com/kbpapke/clankersmith",
      tags: ["Claude Code", "AI Agents", "Tooling"],
      color: "#39FF14",
    },
  ],

  education: {
    school: "University of Michigan-Dearborn",
    degree: "B.A. in Digital Media Production",
    distinction: "High Distinction",
    period: "Jan 2007 – May 2011",
  },
} as const;
