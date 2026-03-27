import { useState } from "react";
import { resume } from "~/data/resume";

export function Contact() {
  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText(resume.email).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <section
      id="contact"
      className="py-20 px-4 sm:px-6 lg:px-8"
      style={{ maxWidth: 800, margin: "0 auto" }}
    >
      <div className="mb-10">
        <h2 className="section-heading mb-2">CONTACT DESK</h2>
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "12px",
            color: "var(--color-text-muted)",
          }}
        >
          Open to senior roles &amp; interesting problems
        </p>
      </div>

      {/* Pixel mailbox illustration */}
      <div className="flex justify-center mb-10">
        <svg viewBox="0 0 200 120" width={200} height={120} style={{ overflow: "visible" }}>
          {/* Mailbox post */}
          <rect x={94} y={70} width={12} height={40} fill="#2a3d1f" />
          {/* Mailbox body */}
          <rect x={50} y={30} width={100} height={50} fill="#1C2B16" stroke="#39FF14" strokeWidth={1} />
          {/* Mailbox top (rounded using path) */}
          <path d="M50,30 Q100,5 150,30" fill="#1C2B16" stroke="#39FF14" strokeWidth={1} />
          {/* Mail slot */}
          <rect x={65} y={52} width={70} height={6} fill="#0D0F0A" stroke="rgba(57,255,20,0.4)" strokeWidth={0.8} />
          {/* Flag */}
          <rect x={150} y={35} width={4} height={30} fill="#2a3d1f" />
          <rect x={154} y={35} width={14} height={10} fill="#FF6B35" />
          {/* Letter peeking out */}
          <rect x={80} y={44} width={40} height={14} fill="#C8FF96" opacity={0.85} />
          <rect x={83} y={47} width={24} height={2} fill="rgba(13,15,10,0.4)" />
          <rect x={83} y={51} width={18} height={2} fill="rgba(13,15,10,0.4)" />
          {/* Glow */}
          <rect x={50} y={30} width={100} height={50} fill="none" style={{ filter: "drop-shadow(0 0 8px rgba(57,255,20,0.3))" }} />
          {/* Label */}
          <text x={100} y={95} textAnchor="middle" fill="rgba(200,255,150,0.5)" fontSize={7} fontFamily="'Press Start 2P', monospace">
            INBOX
          </text>
        </svg>
      </div>

      {/* Contact options */}
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {/* Email */}
        <div
          className="pixel-panel p-5"
          style={{ borderColor: "rgba(57,255,20,0.3)" }}
        >
          <p
            style={{
              fontFamily: "var(--font-pixel)",
              fontSize: "7px",
              color: "var(--color-text-dim)",
              marginBottom: 8,
              letterSpacing: "0.1em",
            }}
          >
            ◎ EMAIL
          </p>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "13px",
              color: "var(--color-text)",
              marginBottom: 14,
              wordBreak: "break-all",
            }}
          >
            {resume.email}
          </p>
          <div className="flex gap-2">
            <button onClick={copyEmail} className="pixel-btn" style={{ fontSize: "7px", padding: "6px 10px" }}>
              {copied ? "COPIED!" : "COPY ◈"}
            </button>
            <a
              href={`mailto:${resume.email}`}
              className="pixel-btn pixel-btn-outline"
              style={{ fontSize: "7px", padding: "6px 10px" }}
            >
              SEND ↗
            </a>
          </div>
        </div>

        {/* LinkedIn */}
        <div
          className="pixel-panel p-5"
          style={{ borderColor: "rgba(78,201,225,0.3)" }}
        >
          <p
            style={{
              fontFamily: "var(--font-pixel)",
              fontSize: "7px",
              color: "var(--color-text-dim)",
              marginBottom: 8,
              letterSpacing: "0.1em",
            }}
          >
            ◆ LINKEDIN
          </p>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "12px",
              color: "var(--color-text)",
              marginBottom: 14,
            }}
          >
            linkedin.com/in/kylepapke
          </p>
          <a
            href={resume.linkedin}
            target="_blank"
            rel="noreferrer"
            className="pixel-btn pixel-btn-outline"
            style={{
              fontSize: "7px",
              padding: "6px 10px",
              color: "var(--color-cyan)",
              borderColor: "var(--color-cyan)",
            }}
          >
            VIEW PROFILE ↗
          </a>
        </div>
      </div>

      {/* Location */}
      <div
        className="pixel-panel p-5 text-center"
        style={{ borderColor: "rgba(57,255,20,0.15)" }}
      >
        <p
          style={{
            fontFamily: "var(--font-pixel)",
            fontSize: "8px",
            color: "var(--color-text-dim)",
            letterSpacing: "0.1em",
            marginBottom: 8,
          }}
        >
          ◈ LOCATION
        </p>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "14px",
            color: "var(--color-text-muted)",
          }}
        >
          {resume.location} · Available for remote &amp; hybrid roles
        </p>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--color-border)",
        padding: "24px 24px",
        background: "var(--color-bg)",
      }}
    >
      <div
        className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4"
      >
        <span
          style={{
            fontFamily: "var(--font-pixel)",
            fontSize: "7px",
            color: "var(--color-text-dim)",
            letterSpacing: "0.1em",
          }}
        >
          KYLE PAPKE · {new Date().getFullYear()}
        </span>

        <span
          style={{
            fontFamily: "var(--font-pixel)",
            fontSize: "7px",
            color: "var(--color-text-dim)",
            letterSpacing: "0.08em",
          }}
        >
          MADE WITH{" "}
          <a
            href="https://claude.ai/code"
            target="_blank"
            rel="noreferrer"
            style={{
              color: "var(--color-primary)",
              textDecoration: "none",
            }}
          >
            CLAUDE
          </a>
          {" "}+{" "}
          <a
            href="https://remix.run"
            target="_blank"
            rel="noreferrer"
            style={{ color: "var(--color-accent)", textDecoration: "none" }}
          >
            REMIX
          </a>
        </span>

        <div className="flex gap-4">
          {[
            { label: "GITHUB", href: "https://github.com/kbpapke" },
            { label: "LINKEDIN", href: resume.linkedin },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              style={{
                fontFamily: "var(--font-pixel)",
                fontSize: "7px",
                color: "var(--color-text-dim)",
                textDecoration: "none",
                letterSpacing: "0.08em",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--color-primary)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--color-text-dim)")}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
