import { motion } from "framer-motion";
import { resume } from "~/data/resume";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut", delay: i * 0.1 },
  }),
};

function InitiativeCard({
  item,
  index,
}: {
  item: (typeof resume.initiatives)[number];
  index: number;
}) {
  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      className="pixel-panel relative overflow-hidden"
      whileHover={{
        y: -3,
        borderColor: `${item.color}60`,
        boxShadow: `0 0 16px ${item.color}20`,
        transition: { duration: 0.2 },
      }}
    >
      <div style={{ height: 2, background: item.color, boxShadow: `0 0 6px ${item.color}` }} />

      <div className="p-5">
        <span
          style={{
            fontFamily: "var(--font-pixel)",
            fontSize: "7px",
            color: "var(--color-text-dim)",
            marginBottom: 8,
            display: "block",
          }}
        >
          #{String(index + 1).padStart(2, "0")}
        </span>

        <h3
          style={{
            fontFamily: "var(--font-pixel)",
            fontSize: "9px",
            color: item.color,
            lineHeight: 1.6,
            marginBottom: 10,
          }}
        >
          {item.name}
        </h3>

        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "12px",
            color: "var(--color-text-muted)",
            lineHeight: 1.65,
            marginBottom: 12,
          }}
        >
          {item.description}
        </p>

        <div className="flex flex-wrap gap-1.5">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="pixel-tag"
              style={{ fontSize: "9px", color: item.color, borderColor: `${item.color}30`, background: `${item.color}08` }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function ClaudeProjectCard({
  project,
  index,
}: {
  project: (typeof resume.claudeProjects)[number];
  index: number;
}) {
  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      className="pixel-panel relative overflow-hidden"
      whileHover={{
        y: -4,
        borderColor: `${project.color}80`,
        boxShadow: `0 0 20px ${project.color}25`,
        transition: { duration: 0.2 },
      }}
    >
      {/* Screen header */}
      <div
        style={{
          height: 60,
          background: `linear-gradient(135deg, ${project.color}0a, ${project.color}05)`,
          borderBottom: `1px solid ${project.color}20`,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 60" preserveAspectRatio="xMidYMid slice">
          {Array.from({ length: 7 }, (_, i) => (
            <line key={`v${i}`} x1={i * 30} y1={0} x2={i * 30} y2={60} stroke={project.color} strokeWidth={0.3} opacity={0.3} />
          ))}
          {Array.from({ length: 4 }, (_, i) => (
            <line key={`h${i}`} x1={0} y1={i * 20} x2={200} y2={i * 20} stroke={project.color} strokeWidth={0.3} opacity={0.3} />
          ))}
          <polygon points="100,10 130,30 100,50 70,30" fill="none" stroke={project.color} strokeWidth={0.8} opacity={0.4} />
        </svg>

        <span
          style={{
            position: "absolute",
            top: 8,
            left: 12,
            fontFamily: "var(--font-pixel)",
            fontSize: "8px",
            color: project.color,
            opacity: 0.6,
          }}
        >
          PROJ_{String(index + 1).padStart(2, "0")}
        </span>
        <span
          style={{
            position: "absolute",
            top: 8,
            right: 12,
            fontFamily: "var(--font-pixel)",
            fontSize: "6px",
            color: "var(--color-bg)",
            background: project.color,
            padding: "2px 6px",
          }}
        >
          CLAUDE
        </span>
      </div>

      <div className="p-5">
        <h3
          style={{
            fontFamily: "var(--font-pixel)",
            fontSize: "10px",
            color: project.color,
            marginBottom: 10,
            lineHeight: 1.5,
          }}
        >
          {project.name}
        </h3>

        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "13px",
            color: "var(--color-text-muted)",
            lineHeight: 1.65,
            marginBottom: 14,
          }}
        >
          {project.description}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="pixel-tag"
              style={{ fontSize: "9px", color: project.color, borderColor: `${project.color}30`, background: `${project.color}08` }}
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex gap-2 flex-wrap">
          <a
            href={project.url}
            target="_blank"
            rel="noreferrer"
            className="pixel-btn pixel-btn-outline"
            style={{ fontSize: "7px", padding: "6px 10px" }}
          >
            GITHUB ↗
          </a>
          {"demo" in project && (project as { demo?: string }).demo && (
            <a
              href={(project as { demo?: string }).demo}
              target="_blank"
              rel="noreferrer"
              className="pixel-btn"
              style={{ fontSize: "7px", padding: "6px 10px" }}
            >
              LIVE DEMO ↗
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function Projects() {
  return (
    <section
      id="projects"
      className="py-20 px-4 sm:px-6 lg:px-8"
      style={{ maxWidth: 1100, margin: "0 auto" }}
    >
      {/* Initiatives */}
      <div className="mb-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h2 className="section-heading mb-2">INITIATIVES</h2>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--color-text-muted)" }}>
            Personal research &amp; trading systems
          </p>
        </motion.div>

        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {resume.initiatives.map((item, i) => (
            <InitiativeCard key={item.name} item={item} index={i} />
          ))}
        </motion.div>
      </div>

      {/* Claude Lab */}
      <div id="lab">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h2 className="section-heading mb-2">CLAUDE LAB</h2>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--color-text-muted)" }}>
            Built with Claude Code · experiments &amp; tools
          </p>
        </motion.div>

        <motion.div
          className="grid sm:grid-cols-2 gap-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {resume.claudeProjects.map((project, i) => (
            <ClaudeProjectCard key={project.name} project={project} index={i} />
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-6 pixel-panel p-4 text-center"
          style={{ borderStyle: "dashed", borderColor: "rgba(57,255,20,0.2)" }}
        >
          <p
            style={{
              fontFamily: "var(--font-pixel)",
              fontSize: "7px",
              color: "var(--color-text-dim)",
              letterSpacing: "0.1em",
            }}
          >
            ▷ MORE EXPERIMENTS ON GITHUB
          </p>
          <a
            href="https://github.com/kbpapke"
            target="_blank"
            rel="noreferrer"
            className="pixel-btn pixel-btn-outline"
            style={{ fontSize: "7px", padding: "6px 12px", marginTop: 12, display: "inline-block" }}
          >
            GITHUB/KBPAPKE ↗
          </a>
        </motion.div>
      </div>
    </section>
  );
}
