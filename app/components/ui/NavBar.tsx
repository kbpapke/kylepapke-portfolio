import { useState, useEffect } from "react";

const NAV_ITEMS = [
  { label: "LOBBY", href: "#hero", key: "01" },
  { label: "XP", href: "#experience", key: "02" },
  { label: "SKILLS", href: "#skills", key: "03" },
  { label: "PROJECTS", href: "#projects", key: "04" },
  { label: "LAB", href: "#lab", key: "05" },
  { label: "CONTACT", href: "#contact", key: "06" },
];

export function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("hero");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const sections = NAV_ITEMS.map((item) => item.href.replace("#", ""));
      for (const id of sections.reverse()) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 80) {
          setActive(id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled
          ? "rgba(13,15,10,0.95)"
          : "transparent",
        backdropFilter: scrolled ? "blur(8px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(57,255,20,0.15)" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <a
          href="#hero"
          className="flex items-center gap-2 group"
          style={{ textDecoration: "none" }}
        >
          <span
            className="text-xs glow-text-subtle"
            style={{
              fontFamily: "var(--font-pixel)",
              color: "var(--color-primary)",
              fontSize: "9px",
              letterSpacing: "0.05em",
            }}
          >
            KP
          </span>
          <span
            style={{
              width: 6,
              height: 6,
              background: "var(--color-accent)",
              display: "inline-block",
              animation: "char-idle 1.2s steps(2) infinite",
            }}
          />
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive = active === item.href.replace("#", "");
            return (
              <a
                key={item.key}
                href={item.href}
                style={{
                  fontFamily: "var(--font-pixel)",
                  fontSize: "8px",
                  letterSpacing: "0.08em",
                  padding: "6px 12px",
                  color: isActive ? "var(--color-bg)" : "var(--color-text-muted)",
                  background: isActive ? "var(--color-primary)" : "transparent",
                  textDecoration: "none",
                  transition: "all 0.15s",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.color = "var(--color-primary)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.color = "var(--color-text-muted)";
                  }
                }}
              >
                <span style={{ color: isActive ? "var(--color-bg)" : "var(--color-text-dim)", fontSize: "7px" }}>
                  {item.key}
                </span>
                {item.label}
              </a>
            );
          })}
        </div>

        {/* Desktop CTA */}
        <a
          href="mailto:kpapke@gmail.com"
          className="hidden md:inline-block pixel-btn"
          style={{ fontSize: "8px", padding: "8px 14px" }}
        >
          HIRE ME
        </a>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{
                display: "block",
                width: 20,
                height: 2,
                background: "var(--color-primary)",
                transition: "all 0.2s",
                transformOrigin: "center",
                transform:
                  menuOpen && i === 0
                    ? "translateY(6px) rotate(45deg)"
                    : menuOpen && i === 1
                    ? "scaleX(0)"
                    : menuOpen && i === 2
                    ? "translateY(-6px) rotate(-45deg)"
                    : "none",
              }}
            />
          ))}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          style={{
            background: "var(--color-bg)",
            borderTop: "1px solid var(--color-border)",
            borderBottom: "1px solid var(--color-border)",
          }}
        >
          {NAV_ITEMS.map((item) => (
            <a
              key={item.key}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              style={{
                fontFamily: "var(--font-pixel)",
                fontSize: "9px",
                letterSpacing: "0.08em",
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "14px 24px",
                color: "var(--color-text)",
                textDecoration: "none",
                borderBottom: "1px solid rgba(57,255,20,0.08)",
              }}
            >
              <span style={{ color: "var(--color-primary)", fontSize: "8px" }}>{item.key}</span>
              {item.label}
            </a>
          ))}
          <div className="p-4">
            <a href="mailto:kpapke@gmail.com" className="pixel-btn" style={{ display: "block", textAlign: "center", fontSize: "9px" }}>
              HIRE ME
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
