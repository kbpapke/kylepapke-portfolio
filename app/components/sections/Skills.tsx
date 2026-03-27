import { useEffect, useRef, useState } from "react";
import { motion, useInView, useSpring, useTransform } from "framer-motion";
import { resume } from "~/data/resume";

// Animated counter
function AnimatedNumber({ value, inView }: { value: number; inView: boolean }) {
  const spring = useSpring(0, { stiffness: 60, damping: 20 });
  const display = useTransform(spring, (v) => Math.round(v).toString());

  useEffect(() => {
    if (inView) spring.set(value);
  }, [inView, value, spring]);

  return <motion.span>{display}</motion.span>;
}

// D3-style radar chart in pure SVG + Framer Motion
function RadarChart({ data, size = 280 }: { data: typeof resume.radarSkills; size?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let frame: number;
    const start = performance.now();
    const duration = 1400;
    const animate = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      // ease-in-out cubic
      const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      setProgress(eased);
      if (t < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [inView]);

  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.38;
  const n = data.length;

  function angle(i: number) {
    return (i / n) * 2 * Math.PI - Math.PI / 2;
  }
  function pt(i: number, scale: number) {
    const a = angle(i);
    return { x: cx + scale * r * Math.cos(a), y: cy + scale * r * Math.sin(a) };
  }

  const rings = [0.25, 0.5, 0.75, 1.0];

  const dataPoints = data.map((d, i) => pt(i, (d.value / 100) * progress));
  const dataPath =
    dataPoints.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ") + " Z";

  return (
    <div ref={ref}>
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} style={{ overflow: "visible" }}>
        {/* Grid rings */}
        {rings.map((scale, ri) => {
          const pts = Array.from({ length: n }, (_, i) => pt(i, scale));
          const d = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ") + " Z";
          return <path key={ri} d={d} fill="none" stroke="rgba(57,255,20,0.12)" strokeWidth={0.8} />;
        })}

        {/* Spokes */}
        {Array.from({ length: n }, (_, i) => {
          const p = pt(i, 1.0);
          return <path key={i} d={`M${cx},${cy} L${p.x.toFixed(1)},${p.y.toFixed(1)}`} stroke="rgba(57,255,20,0.1)" strokeWidth={0.8} />;
        })}

        {/* Data polygon */}
        <path
          d={dataPath}
          fill="rgba(57,255,20,0.1)"
          stroke="#39FF14"
          strokeWidth={1.5}
          strokeLinejoin="round"
          style={{ filter: "drop-shadow(0 0 6px rgba(57,255,20,0.4))" }}
        />

        {/* Dots */}
        {dataPoints.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={3}
            fill="#39FF14"
            style={{ filter: "drop-shadow(0 0 4px #39FF14)" }}
          />
        ))}

        {/* Axis labels */}
        {data.map((d, i) => {
          const p = pt(i, 1.24);
          const align = p.x < cx - 4 ? "end" : p.x > cx + 4 ? "start" : "middle";
          return (
            <text
              key={i}
              x={p.x}
              y={p.y}
              textAnchor={align}
              dominantBaseline="middle"
              fill="rgba(200,255,150,0.65)"
              fontSize={7}
              fontFamily="'Press Start 2P', monospace"
            >
              {d.axis}
            </text>
          );
        })}

        {/* Value labels */}
        {data.map((d, i) => {
          const p = pt(i, (d.value / 100) * 0.55);
          return (
            <text
              key={i}
              x={p.x}
              y={p.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="rgba(57,255,20,0.45)"
              fontSize={5.5}
              fontFamily="'JetBrains Mono', monospace"
              opacity={progress}
            >
              {d.value}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

// Pixel progress bar with Framer Motion
function PixelBar({
  label, value, color, delay = 0,
}: { label: string; value: number; color: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <div ref={ref} className="mb-3">
      <div className="flex justify-between items-center mb-1">
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--color-text)" }}>
          {label}
        </span>
        <span style={{ fontFamily: "var(--font-pixel)", fontSize: "8px", color }}>
          {inView ? <AnimatedNumber value={value} inView={inView} /> : 0}%
        </span>
      </div>
      <div
        style={{
          height: 8,
          background: "var(--color-bg)",
          border: "1px solid rgba(57,255,20,0.15)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", inset: 0, display: "flex", gap: 1, padding: 1 }}>
          {Array.from({ length: 20 }, (_, i) => {
            const lit = i < Math.round((value / 100) * 20);
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ duration: 0.2, delay: delay / 1000 + i * 0.035 }}
                style={{
                  flex: 1,
                  background: lit ? color : "rgba(255,255,255,0.04)",
                  boxShadow: lit ? `0 0 4px ${color}60` : "none",
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

function SkillGroup({ group, index }: { group: (typeof resume.skillGroups)[number]; index: number }) {
  return (
    <motion.div
      className="pixel-panel p-4"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
      whileHover={{ borderColor: `${group.color}50` }}
    >
      <div className="flex items-center gap-2 mb-3">
        <span style={{ fontSize: "14px", color: group.color }}>{group.icon}</span>
        <span
          style={{
            fontFamily: "var(--font-pixel)",
            fontSize: "7px",
            color: group.color,
            letterSpacing: "0.08em",
          }}
        >
          {group.label}
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {group.skills.map((skill) => (
          <span
            key={skill}
            className="pixel-tag"
            style={{
              color: group.color,
              borderColor: `${group.color}30`,
              background: `${group.color}0a`,
              fontSize: "10px",
            }}
          >
            {skill}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

export function Skills() {
  return (
    <section
      id="skills"
      className="py-20 px-4 sm:px-6 lg:px-8"
      style={{
        maxWidth: 1100,
        margin: "0 auto",
        background: "linear-gradient(to bottom, transparent, rgba(20,26,15,0.5), transparent)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <h2 className="section-heading mb-2">SKILLS ARCADE</h2>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--color-text-muted)" }}>
          Stat screen — full tech stack
        </p>
      </motion.div>

      {/* Radar + bars */}
      <div className="grid lg:grid-cols-2 gap-8 mb-10">
        <motion.div
          className="pixel-panel p-6 flex flex-col items-center"
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
        >
          <p
            style={{
              fontFamily: "var(--font-pixel)",
              fontSize: "8px",
              color: "var(--color-text-muted)",
              marginBottom: 20,
              letterSpacing: "0.1em",
            }}
          >
            ◎ PROFICIENCY RADAR
          </p>
          <RadarChart data={resume.radarSkills} size={260} />
        </motion.div>

        <motion.div
          className="pixel-panel p-6"
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
        >
          <p
            style={{
              fontFamily: "var(--font-pixel)",
              fontSize: "8px",
              color: "var(--color-text-muted)",
              marginBottom: 20,
              letterSpacing: "0.1em",
            }}
          >
            ◈ LEVEL BARS
          </p>
          {resume.radarSkills.map((s, i) => (
            <PixelBar key={s.axis} label={s.axis} value={s.value} color="#39FF14" delay={i * 80} />
          ))}
        </motion.div>
      </div>

      {/* Skill groups */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {resume.skillGroups.map((group, i) => (
          <SkillGroup key={group.label} group={group} index={i} />
        ))}
      </div>
    </section>
  );
}
