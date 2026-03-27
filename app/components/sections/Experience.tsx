import { motion } from "framer-motion";
import { resume } from "~/data/resume";

const cardVariants = {
  hidden: { opacity: 0, x: -24 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.45, ease: "easeOut", delay: i * 0.07 },
  }),
};

const sectionVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

function ExperienceCard({
  job,
  index,
}: {
  job: (typeof resume.experience)[number];
  index: number;
}) {
  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      className="pixel-panel relative"
      whileHover={{ x: 2 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
    >
      {/* Left accent bar */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 3,
          background: job.color,
          boxShadow: `0 0 8px ${job.color}60`,
        }}
      />

      <div className="p-5 pl-7">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3
                style={{
                  fontFamily: "var(--font-pixel)",
                  fontSize: "11px",
                  color: job.color,
                  letterSpacing: "0.05em",
                }}
              >
                {job.company}
              </h3>
              {job.current && (
                <span
                  style={{
                    fontFamily: "var(--font-pixel)",
                    fontSize: "6px",
                    color: "var(--color-bg)",
                    background: "var(--color-primary)",
                    padding: "2px 6px",
                  }}
                >
                  CURRENT
                </span>
              )}
            </div>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "13px",
                color: "var(--color-text)",
                fontWeight: 500,
                marginBottom: 2,
              }}
            >
              {job.title}
            </p>
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                color: "var(--color-text-muted)",
              }}
            >
              {job.location}
            </p>
          </div>

          <div className="text-right">
            <span
              style={{
                fontFamily: "var(--font-pixel)",
                fontSize: "7px",
                color: "var(--color-text-dim)",
                letterSpacing: "0.08em",
                display: "block",
                marginBottom: 4,
              }}
            >
              {job.period}
            </span>
            <span
              className="pixel-tag"
              style={{
                color: job.color,
                borderColor: `${job.color}40`,
                background: `${job.color}0d`,
                fontSize: "9px",
              }}
            >
              {job.domain}
            </span>
          </div>
        </div>

        <ul className="mb-4" style={{ listStyle: "none", padding: 0 }}>
          {job.highlights.map((h, i) => (
            <li
              key={i}
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "13px",
                color: "var(--color-text-muted)",
                lineHeight: 1.6,
                paddingLeft: 16,
                position: "relative",
                marginBottom: 4,
              }}
            >
              <span
                style={{
                  position: "absolute",
                  left: 0,
                  color: job.color,
                  fontSize: "10px",
                  top: 3,
                }}
              >
                ▸
              </span>
              {h}
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap gap-2">
          {job.tags.map((tag) => (
            <span key={tag} className="pixel-tag" style={{ fontSize: "9px" }}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function TimelineDot({ color, active }: { color: string; active?: boolean }) {
  return (
    <motion.div
      initial={{ scale: 0 }}
      whileInView={{ scale: 1 }}
      viewport={{ once: true }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{
        width: 12,
        height: 12,
        background: active ? color : "var(--color-bg-2)",
        border: `2px solid ${color}`,
        boxShadow: active ? `0 0 8px ${color}80` : "none",
        flexShrink: 0,
      }}
    />
  );
}

export function Experience() {
  return (
    <section
      id="experience"
      className="py-20 px-4 sm:px-6 lg:px-8"
      style={{ maxWidth: 900, margin: "0 auto" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <h2 className="section-heading mb-2" style={{ marginBottom: 12 }}>
          EXPERIENCE WING
        </h2>
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "12px",
            color: "var(--color-text-muted)",
          }}
        >
          {resume.yearsExperience}+ years across 7 industries
        </p>
      </motion.div>

      {/* Desktop: timeline layout */}
      <motion.div
        className="hidden md:grid"
        style={{ gridTemplateColumns: "auto 1fr", gap: "0 24px" }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.05 }}
        variants={sectionVariants}
      >
        {resume.experience.map((job, i) => (
          <div key={i} style={{ display: "contents" }}>
            <div className="flex flex-col items-center" style={{ paddingTop: 20 }}>
              <TimelineDot color={job.color} active={job.current} />
              {i < resume.experience.length - 1 && (
                <motion.div
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.07 + 0.2 }}
                  style={{
                    flex: 1,
                    width: 1,
                    background: `linear-gradient(to bottom, ${job.color}60, ${resume.experience[i + 1].color}30)`,
                    minHeight: 24,
                    marginTop: 4,
                    transformOrigin: "top",
                  }}
                />
              )}
            </div>
            <div style={{ paddingBottom: 12 }}>
              <ExperienceCard job={job} index={i} />
            </div>
          </div>
        ))}
      </motion.div>

      {/* Mobile: stacked cards */}
      <motion.div
        className="md:hidden flex flex-col gap-3"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.05 }}
        variants={sectionVariants}
      >
        {resume.experience.map((job, i) => (
          <ExperienceCard key={i} job={job} index={i} />
        ))}
      </motion.div>

      {/* Education */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-12 pixel-panel p-5"
        style={{ borderColor: "rgba(245,158,11,0.3)" }}
      >
        <div className="flex items-center gap-3 mb-2">
          <span
            style={{
              fontFamily: "var(--font-pixel)",
              fontSize: "8px",
              color: "var(--color-amber)",
              letterSpacing: "0.1em",
            }}
          >
            ◆ EDUCATION
          </span>
          <div style={{ flex: 1, height: 1, background: "rgba(245,158,11,0.2)" }} />
        </div>
        <p
          style={{
            fontFamily: "var(--font-pixel)",
            fontSize: "9px",
            color: "var(--color-text)",
            marginBottom: 4,
          }}
        >
          {resume.education.school}
        </p>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "13px",
            color: "var(--color-text-muted)",
          }}
        >
          {resume.education.degree} · {resume.education.distinction}
        </p>
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "11px",
            color: "var(--color-text-dim)",
            marginTop: 4,
          }}
        >
          {resume.education.period}
        </p>
      </motion.div>
    </section>
  );
}
