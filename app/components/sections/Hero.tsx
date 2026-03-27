import { useEffect, useState } from "react";
import { IsoRoom } from "~/components/iso/IsoRoom";
import { resume } from "~/data/resume";

const TITLES = [
  "Senior Software Engineer",
  "Frontend Architect",
  "Web3 Builder",
  "AI Tooling Pioneer",
  "Full-Stack Craftsman",
];

export function Hero() {
  const [titleIndex, setTitleIndex] = useState(0);
  const [displayTitle, setDisplayTitle] = useState("");
  const [typing, setTyping] = useState(true);

  useEffect(() => {
    const target = TITLES[titleIndex];
    if (typing) {
      if (displayTitle.length < target.length) {
        const t = setTimeout(
          () => setDisplayTitle(target.slice(0, displayTitle.length + 1)),
          60
        );
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setTyping(false), 2200);
        return () => clearTimeout(t);
      }
    } else {
      if (displayTitle.length > 0) {
        const t = setTimeout(
          () => setDisplayTitle(displayTitle.slice(0, -1)),
          35
        );
        return () => clearTimeout(t);
      } else {
        setTitleIndex((i) => (i + 1) % TITLES.length);
        setTyping(true);
      }
    }
  }, [displayTitle, typing, titleIndex]);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col"
      style={{ background: "var(--color-bg)" }}
    >
      {/* Desktop: isometric room as hero */}
      <div className="hidden lg:block flex-1 relative pt-16">
        <IsoRoom />

        {/* Hero text overlay */}
        <div
          className="absolute left-6 xl:left-12"
          style={{ top: "50%", transform: "translateY(-50%)" }}
        >
          <p
            style={{
              fontFamily: "var(--font-pixel)",
              fontSize: "8px",
              color: "var(--color-accent)",
              letterSpacing: "0.15em",
              marginBottom: 16,
            }}
          >
            ▶ PLAYER ONE
          </p>

          <h1
            className="glow-text"
            style={{
              fontFamily: "var(--font-pixel)",
              fontSize: "clamp(18px, 2.5vw, 28px)",
              color: "var(--color-primary)",
              lineHeight: 1.4,
              marginBottom: 8,
            }}
          >
            KYLE
            <br />
            PAPKE
          </h1>

          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "13px",
              color: "var(--color-text)",
              marginBottom: 24,
              minHeight: "1.6em",
            }}
          >
            <span style={{ color: "var(--color-text-muted)" }}>$ </span>
            {displayTitle}
            <span
              style={{
                display: "inline-block",
                width: 8,
                height: 14,
                background: "var(--color-primary)",
                marginLeft: 2,
                verticalAlign: "text-bottom",
                animation: "blink 1s step-end infinite",
              }}
            />
          </div>

          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "12px",
              color: "var(--color-text-muted)",
              maxWidth: 260,
              lineHeight: 1.7,
              marginBottom: 28,
            }}
          >
            {resume.location} · 14+ years<br />
            building things that matter
          </p>

          <div className="flex gap-3 flex-wrap">
            <a href="#experience" className="pixel-btn" style={{ fontSize: "8px" }}>
              VIEW XP
            </a>
            <a
              href="mailto:kpapke@gmail.com"
              className="pixel-btn pixel-btn-outline"
              style={{ fontSize: "8px" }}
            >
              CONTACT
            </a>
          </div>

          {/* Social links */}
          <div className="flex gap-4 mt-5">
            <a
              href={resume.linkedin}
              target="_blank"
              rel="noreferrer"
              style={{
                fontFamily: "var(--font-pixel)",
                fontSize: "7px",
                color: "var(--color-text-muted)",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--color-primary)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--color-text-muted)")}
            >
              LINKEDIN
            </a>
            <a
              href="https://github.com/kbpapke"
              target="_blank"
              rel="noreferrer"
              style={{
                fontFamily: "var(--font-pixel)",
                fontSize: "7px",
                color: "var(--color-text-muted)",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--color-primary)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--color-text-muted)")}
            >
              GITHUB
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className="absolute bottom-6 left-1/2"
          style={{
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-pixel)",
              fontSize: "7px",
              color: "var(--color-text-dim)",
              letterSpacing: "0.1em",
            }}
          >
            SCROLL
          </span>
          <div
            style={{
              width: 1,
              height: 32,
              background: "linear-gradient(to bottom, var(--color-primary-dim), transparent)",
              animation: "float 2s ease-in-out infinite",
            }}
          />
        </div>
      </div>

      {/* Mobile: pixel panel hero */}
      <div className="lg:hidden flex flex-col min-h-screen">
        {/* Mobile pixel art header banner */}
        <div
          className="w-full scanlines"
          style={{
            height: 220,
            background: "linear-gradient(135deg, #0D0F0A 0%, #141A0F 50%, #0D0F0A 100%)",
            borderBottom: "1px solid var(--color-border)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Grid background */}
          <svg
            className="absolute inset-0 w-full h-full opacity-20"
            viewBox="0 0 400 220"
            preserveAspectRatio="xMidYMid slice"
          >
            {Array.from({ length: 12 }).map((_, i) => (
              <line key={`v${i}`} x1={i * 36} y1={0} x2={i * 36} y2={220} stroke="#39FF14" strokeWidth={0.4} />
            ))}
            {Array.from({ length: 8 }).map((_, i) => (
              <line key={`h${i}`} x1={0} y1={i * 32} x2={400} y2={i * 32} stroke="#39FF14" strokeWidth={0.4} />
            ))}
            {/* Isometric diamonds decoration */}
            {[
              { x: 60, y: 110, s: 28 },
              { x: 340, y: 80, s: 20 },
              { x: 200, y: 160, s: 16 },
            ].map((d, i) => (
              <polygon
                key={i}
                points={`${d.x},${d.y - d.s} ${d.x + d.s * 1.7},${d.y} ${d.x},${d.y + d.s} ${d.x - d.s * 1.7},${d.y}`}
                fill="none"
                stroke="#39FF14"
                strokeWidth={0.6}
                opacity={0.4}
              />
            ))}
          </svg>

          <div className="relative z-10 flex flex-col items-center justify-center h-full">
            <p
              style={{
                fontFamily: "var(--font-pixel)",
                fontSize: "7px",
                color: "var(--color-accent)",
                letterSpacing: "0.2em",
                marginBottom: 10,
              }}
            >
              ▶ PLAYER ONE
            </p>
            <h1
              className="glow-text"
              style={{
                fontFamily: "var(--font-pixel)",
                fontSize: "22px",
                color: "var(--color-primary)",
                textAlign: "center",
                lineHeight: 1.5,
              }}
            >
              KYLE PAPKE
            </h1>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "12px",
                color: "var(--color-text)",
                marginTop: 8,
                minHeight: "1.5em",
              }}
            >
              <span style={{ color: "var(--color-text-muted)" }}>$ </span>
              {displayTitle}
              <span
                style={{
                  display: "inline-block",
                  width: 6,
                  height: 12,
                  background: "var(--color-primary)",
                  marginLeft: 2,
                  verticalAlign: "text-bottom",
                  animation: "blink 1s step-end infinite",
                }}
              />
            </div>
          </div>
        </div>

        {/* Mobile info panel */}
        <div className="flex-1 p-5" style={{ paddingTop: 28 }}>
          <div className="pixel-panel p-5 mb-5">
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "14px",
                color: "var(--color-text-muted)",
                lineHeight: 1.7,
              }}
            >
              {resume.summary}
            </p>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { label: "YEARS", value: "14+" },
              { label: "DOMAINS", value: "7+" },
              { label: "BRANDS", value: "2300+" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="pixel-panel p-3 text-center"
              >
                <div
                  style={{
                    fontFamily: "var(--font-pixel)",
                    fontSize: "14px",
                    color: "var(--color-primary)",
                    marginBottom: 4,
                  }}
                >
                  {stat.value}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-pixel)",
                    fontSize: "6px",
                    color: "var(--color-text-muted)",
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <a href="#experience" className="pixel-btn flex-1 text-center" style={{ fontSize: "8px" }}>
              VIEW XP
            </a>
            <a
              href="mailto:kpapke@gmail.com"
              className="pixel-btn pixel-btn-outline flex-1 text-center"
              style={{ fontSize: "8px" }}
            >
              HIRE ME
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
