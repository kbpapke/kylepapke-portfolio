import type { MetaFunction } from "@remix-run/node";
import { NavBar } from "~/components/ui/NavBar";
import { Hero } from "~/components/sections/Hero";
import { Experience } from "~/components/sections/Experience";
import { Skills } from "~/components/sections/Skills";
import { Projects } from "~/components/sections/Projects";
import { Contact, Footer } from "~/components/sections/Contact";

export const meta: MetaFunction = () => {
  return [
    { title: "Kyle Papke — Senior Software Engineer" },
    {
      name: "description",
      content:
        "Senior Software Engineer with 14+ years building across Web3, AdTech, FinTech, and Cybersecurity. Based in Ann Arbor, MI.",
    },
  ];
};

export default function Index() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--color-bg)",
        color: "var(--color-text)",
      }}
    >
      <NavBar />
      <Hero />

      {/* Separator */}
      <div
        className="neon-line"
        style={{ margin: "0 24px", opacity: 0.4 }}
      />

      <Experience />

      <div
        className="neon-line"
        style={{ margin: "0 24px", opacity: 0.2 }}
      />

      <Skills />

      <div
        className="neon-line"
        style={{ margin: "0 24px", opacity: 0.2 }}
      />

      <Projects />

      <div
        className="neon-line"
        style={{ margin: "0 24px", opacity: 0.2 }}
      />

      <Contact />

      <Footer />
    </div>
  );
}
