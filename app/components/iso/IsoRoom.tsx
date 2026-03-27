// Isometric room — Habbo Hotel style hero scene

const TILE_W = 64;
const TILE_H = 32;
const WALL_H = 72;
const COLS = 9;
const ROWS = 7;
const OX = 440; // isometric origin x
const OY = 210; // isometric origin y

function ix(col: number, row: number) {
  return OX + (col - row) * (TILE_W / 2);
}
function iy(col: number, row: number) {
  return OY + (col + row) * (TILE_H / 2);
}

// Diamond floor tile
function Tile({
  col, row, fill = "#1C2B16", stroke = "rgba(57,255,20,0.18)", strokeWidth = 0.8,
}: { col: number; row: number; fill?: string; stroke?: string; strokeWidth?: number }) {
  const x = ix(col, row), y = iy(col, row);
  const hw = TILE_W / 2, hh = TILE_H / 2;
  return (
    <polygon
      points={`${x},${y - hh} ${x + hw},${y} ${x},${y + hh} ${x - hw},${y}`}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
    />
  );
}

// Back wall face (along row=0, left-top edge of each tile)
function BackWallFace({ col, tileColor = "#0E1A0C", topColor = "#0A120A" }: { col: number; tileColor?: string; topColor?: string }) {
  const x = ix(col, 0), y = iy(col, 0);
  const hw = TILE_W / 2, hh = TILE_H / 2;
  // Face: left-vertex → top-vertex → top-vertex-up → left-vertex-up
  return (
    <polygon
      points={`${x - hw},${y} ${x},${y - hh} ${x},${y - hh - WALL_H} ${x - hw},${y - WALL_H}`}
      fill={tileColor}
      stroke="none"
    />
  );
}

// Left wall face (along col=0, right-front edge of each tile)
function LeftWallFace({ row, tileColor = "#111a0e" }: { row: number; tileColor?: string }) {
  const x = ix(0, row), y = iy(0, row);
  const hw = TILE_W / 2, hh = TILE_H / 2;
  // Face: top-vertex → right-vertex → right-vertex-up → top-vertex-up
  return (
    <polygon
      points={`${x},${y - hh} ${x + hw},${y} ${x + hw},${y - WALL_H} ${x},${y - hh - WALL_H}`}
      fill={tileColor}
      stroke="none"
    />
  );
}

// Isometric box (floor tile + left face + right face going upward)
function IsoBox({
  col, row, height = 1,
  topColor = "#2a3d1f",
  leftColor = "#1a2a14",
  rightColor = "#1f3318",
}: {
  col: number; row: number; height?: number;
  topColor?: string; leftColor?: string; rightColor?: string;
}) {
  const h = height * TILE_H;
  const x = ix(col, row), y = iy(col, row);
  const hw = TILE_W / 2, hh = TILE_H / 2;

  return (
    <g>
      {/* Left face */}
      <polygon
        points={`${x - hw},${y - h} ${x},${y + hh - h} ${x},${y + hh} ${x - hw},${y}`}
        fill={leftColor}
      />
      {/* Right face */}
      <polygon
        points={`${x},${y + hh - h} ${x + hw},${y - h} ${x + hw},${y} ${x},${y + hh}`}
        fill={rightColor}
      />
      {/* Top face */}
      <polygon
        points={`${x},${y - hh - h} ${x + hw},${y - h} ${x},${y + hh - h} ${x - hw},${y - h}`}
        fill={topColor}
        stroke="rgba(57,255,20,0.15)"
        strokeWidth={0.5}
      />
    </g>
  );
}

// Habbo-style pixel character (simplified, isometric)
function KyleCharacter({ col, row }: { col: number; row: number }) {
  const x = ix(col, row);
  const y = iy(col, row) - TILE_H / 2;
  const S = 3; // pixel scale

  // Character is drawn relative to (x, y) = feet position
  const px = (cx: number, cy: number, w: number, h: number, fill: string) => (
    <rect x={x + cx * S} y={y + cy * S} width={w * S} height={h * S} fill={fill} />
  );

  return (
    <g className="char-idle" style={{ transformOrigin: `${x}px ${y}px` }}>
      {/* Shadow */}
      <ellipse cx={x} cy={y + 4} rx={12} ry={4} fill="rgba(0,0,0,0.35)" />
      {/* Legs */}
      {px(-3, -8, 3, 5, "#1a3a6b")}
      {px(0, -8, 3, 5, "#1a3a6b")}
      {/* Shoes */}
      {px(-4, -4, 4, 2, "#222")}
      {px(0, -4, 4, 2, "#222")}
      {/* Body */}
      {px(-4, -18, 8, 10, "#1C6B0A")}
      {/* Arms */}
      {px(-6, -17, 2, 8, "#F5C5A0")}
      {px(4, -17, 2, 8, "#F5C5A0")}
      {/* Neck */}
      {px(-1, -20, 2, 2, "#F5C5A0")}
      {/* Head */}
      {px(-4, -30, 8, 10, "#F5C5A0")}
      {/* Hair */}
      {px(-4, -30, 8, 3, "#2a1a0a")}
      {px(-4, -27, 1, 2, "#2a1a0a")}
      {/* Eyes */}
      {px(-2, -25, 1, 1, "#1a0a05")}
      {px(1, -25, 1, 1, "#1a0a05")}
      {/* Mouth / smile */}
      {px(-1, -22, 2, 1, "#c07060")}
      {/* Name tag above head */}
      <text
        x={x}
        y={y - 36}
        textAnchor="middle"
        fill="#39FF14"
        fontSize={7}
        fontFamily="'Press Start 2P', monospace"
        style={{ filter: "drop-shadow(0 0 4px #39FF14)" }}
      >
        KYLE
      </text>
      <rect
        x={x - 17}
        y={y - 44}
        width={34}
        height={9}
        fill="rgba(0,0,0,0.5)"
        stroke="rgba(57,255,20,0.3)"
        strokeWidth={0.5}
      />
    </g>
  );
}

// Pixel computer monitor
function Monitor({ col, row }: { col: number; row: number }) {
  const x = ix(col, row);
  const y = iy(col, row) - TILE_H / 2;

  return (
    <g>
      <IsoBox col={col} row={row} height={0.8} topColor="#2a2a2a" leftColor="#1a1a1a" rightColor="#222" />
      {/* Screen */}
      <rect x={x - 14} y={y - 42} width={28} height={20} fill="#0D0F0A" stroke="#39FF14" strokeWidth={1} rx={1} />
      {/* Code lines on screen */}
      <rect x={x - 11} y={y - 39} width={14} height={1.5} fill="#39FF14" opacity={0.7} />
      <rect x={x - 11} y={y - 36} width={10} height={1.5} fill="#4EC9E1" opacity={0.7} />
      <rect x={x - 11} y={y - 33} width={16} height={1.5} fill="#A855F7" opacity={0.7} />
      <rect x={x - 11} y={y - 30} width={8} height={1.5} fill="#FF6B35" opacity={0.6} />
      {/* Monitor stand */}
      <rect x={x - 2} y={y - 22} width={4} height={4} fill="#333" />
      {/* Screen glow */}
      <rect x={x - 14} y={y - 42} width={28} height={20} fill="rgba(57,255,20,0.03)" rx={1} />
    </g>
  );
}

// Pixel bookshelf on back wall
function Bookshelf({ col }: { col: number }) {
  const x = ix(col, 0);
  const y = iy(col, 0) - TILE_H / 2;
  const books = ["#FF6B35", "#4EC9E1", "#A855F7", "#F59E0B", "#39FF14", "#FF6B35", "#4EC9E1"];

  return (
    <g>
      {/* Shelf backing */}
      <rect x={x - 18} y={y - WALL_H + 6} width={36} height={50} fill="#1a2a14" stroke="rgba(57,255,20,0.2)" strokeWidth={0.5} />
      {/* Books */}
      {books.map((color, i) => (
        <rect key={i} x={x - 16 + i * 5} y={y - WALL_H + 8} width={4} height={20} fill={color} opacity={0.85} />
      ))}
      {/* Second shelf */}
      {books.slice(0, 5).map((color, i) => (
        <rect key={i} x={x - 12 + i * 5} y={y - WALL_H + 32} width={4} height={16} fill={color} opacity={0.7} />
      ))}
      {/* Shelf planks */}
      <rect x={x - 18} y={y - WALL_H + 28} width={36} height={2} fill="#2a3d1f" />
      <rect x={x - 18} y={y - WALL_H + 48} width={36} height={2} fill="#2a3d1f" />
    </g>
  );
}

// Neon sign on back wall
function NeonSign({ col }: { col: number }) {
  const x = ix(col, 0);
  const y = iy(col, 0) - WALL_H + 10;

  return (
    <g>
      <rect x={x - 30} y={y} width={60} height={18} fill="rgba(0,0,0,0.5)" stroke="rgba(57,255,20,0.4)" strokeWidth={0.8} />
      <text
        x={x}
        y={y + 12}
        textAnchor="middle"
        fill="#39FF14"
        fontSize={7}
        fontFamily="'Press Start 2P', monospace"
        className="flicker"
        style={{ filter: "drop-shadow(0 0 6px #39FF14)" }}
      >
        DEV.EXE
      </text>
    </g>
  );
}

// Pixel plant
function Plant({ col, row }: { col: number; row: number }) {
  const x = ix(col, row);
  const y = iy(col, row) - TILE_H / 2;

  return (
    <g className="float-slow">
      <IsoBox col={col} row={row} height={0.4} topColor="#3a2010" leftColor="#2a1808" rightColor="#2f1c0c" />
      {/* Stem */}
      <rect x={x - 1} y={y - 24} width={2} height={12} fill="#2a5a0a" />
      {/* Leaves */}
      <ellipse cx={x - 5} cy={y - 22} rx={5} ry={3} fill="#39FF14" opacity={0.85} transform={`rotate(-30, ${x - 5}, ${y - 22})`} />
      <ellipse cx={x + 5} cy={y - 26} rx={5} ry={3} fill="#2a9a00" opacity={0.85} transform={`rotate(20, ${x + 5}, ${y - 26})`} />
      <ellipse cx={x} cy={y - 30} rx={4} ry={6} fill="#39FF14" opacity={0.8} />
    </g>
  );
}

// Trophy / award object
function Trophy({ col, row }: { col: number; row: number }) {
  const x = ix(col, row);
  const y = iy(col, row) - TILE_H / 2;

  return (
    <g className="float-slow" style={{ animationDelay: "1s" }}>
      {/* Base */}
      <rect x={x - 5} y={y - 4} width={10} height={3} fill="#5a3a00" />
      {/* Stem */}
      <rect x={x - 2} y={y - 10} width={4} height={6} fill="#8a6a00" />
      {/* Cup */}
      <path d={`M${x - 7},${y - 24} L${x - 5},${y - 10} L${x + 5},${y - 10} L${x + 7},${y - 24} Z`} fill="#F59E0B" />
      {/* Cup top */}
      <ellipse cx={x} cy={y - 24} rx={7} ry={2} fill="#FFD700" />
      {/* Star */}
      <text x={x} y={y - 18} textAnchor="middle" fontSize={8} fill="#FFD700">★</text>
    </g>
  );
}

// Pixel rug on floor
function Rug({ col, row, w = 3, h = 2 }: { col: number; row: number; w?: number; h?: number }) {
  // Draw a rectangular rug spanning w×h tiles
  const points = [
    `${ix(col, row) - TILE_W / 2},${iy(col, row)}`,
    `${ix(col + w - 1, row)},${iy(col + w - 1, row) - TILE_H / 2}`,
    `${ix(col + w - 1, row + h - 1)},${iy(col + w - 1, row + h - 1) + TILE_H / 2}`,
    `${ix(col, row + h - 1)},${iy(col, row + h - 1)}`,
  ].join(" ");

  return (
    <polygon
      points={points}
      fill="rgba(57,255,20,0.06)"
      stroke="rgba(57,255,20,0.25)"
      strokeWidth={0.8}
      strokeDasharray="3,3"
    />
  );
}

// Stat bubble (floating info card)
function StatBubble({
  x, y, label, value, color = "#39FF14",
}: {
  x: number; y: number; label: string; value: string; color?: string;
}) {
  return (
    <g className="float" style={{ animationDelay: `${Math.random() * 2}s` }}>
      <rect x={x - 36} y={y - 18} width={72} height={22} fill="rgba(13,15,10,0.9)" stroke={color} strokeWidth={0.8} rx={1} />
      <text x={x} y={y - 7} textAnchor="middle" fill={color} fontSize={6} fontFamily="'Press Start 2P', monospace">
        {value}
      </text>
      <text x={x} y={y + 1} textAnchor="middle" fill="rgba(200,255,150,0.6)" fontSize={5} fontFamily="'Press Start 2P', monospace">
        {label}
      </text>
    </g>
  );
}

export function IsoRoom() {
  return (
    <div className="relative w-full overflow-hidden" style={{ height: 500 }}>
      {/* Background gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at 50% 40%, rgba(57,255,20,0.06) 0%, transparent 70%)",
        }}
      />

      <svg
        viewBox="0 0 900 520"
        className="w-full h-full iso-room"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <filter id="glow-green">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glow-soft">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ── Back wall faces (row=0) ── */}
        {Array.from({ length: COLS }).map((_, col) => (
          <BackWallFace key={`bw-${col}`} col={col} />
        ))}

        {/* ── Left wall faces (col=0) ── */}
        {Array.from({ length: ROWS }).map((_, row) => (
          <LeftWallFace key={`lw-${row}`} row={row} />
        ))}

        {/* ── Floor tiles ── */}
        {Array.from({ length: COLS }).map((_, col) =>
          Array.from({ length: ROWS }).map((_, row) => {
            // Alternate subtle tile shading
            const shade = (col + row) % 2 === 0 ? "#1C2B16" : "#192815";
            return (
              <Tile key={`t-${col}-${row}`} col={col} row={row} fill={shade} />
            );
          })
        )}

        {/* ── Rug in center ── */}
        <Rug col={2} row={2} w={4} h={3} />

        {/* ── Back wall decorations ── */}
        <Bookshelf col={1} />
        <NeonSign col={4} />
        <NeonSign col={5} />

        {/* ── Furniture ── */}
        {/* Desk (2 wide) */}
        <IsoBox col={6} row={1} height={0.7} topColor="#3a2a10" leftColor="#2a1c08" rightColor="#2f2010" />
        <IsoBox col={7} row={1} height={0.7} topColor="#3a2a10" leftColor="#2a1c08" rightColor="#2f2010" />
        <Monitor col={7} row={1} />

        {/* Couch */}
        <IsoBox col={1} row={3} height={0.8} topColor="#1a3a6b" leftColor="#0f2550" rightColor="#152e60" />
        <IsoBox col={2} row={3} height={0.8} topColor="#1a3a6b" leftColor="#0f2550" rightColor="#152e60" />
        <IsoBox col={1} row={2} height={1.2} topColor="#1a3a6b" leftColor="#0f2550" rightColor="#152e60" />

        {/* Plants */}
        <Plant col={8} row={0} />
        <Plant col={0} row={6} />

        {/* Trophy */}
        <Trophy col={2} row={0} />
        <Trophy col={3} row={0} />

        {/* ── Kyle character ── */}
        <KyleCharacter col={4} row={4} />

        {/* ── Floating stat bubbles ── */}
        <StatBubble
          x={ix(7, 4)}
          y={iy(7, 4) - 20}
          label="YEARS EXP"
          value="14+"
          color="#39FF14"
        />
        <StatBubble
          x={ix(2, 6)}
          y={iy(2, 6) - 20}
          label="COMPANIES"
          value="7"
          color="#FF6B35"
        />
        <StatBubble
          x={ix(5, 0) + 30}
          y={iy(5, 0) - WALL_H - 10}
          label="STACK"
          value="TS+GO"
          color="#4EC9E1"
        />

        {/* ── Floating pixels (decoration) ── */}
        {[
          { x: 80, y: 90, size: 4, color: "#39FF14", delay: 0 },
          { x: 820, y: 80, size: 3, color: "#FF6B35", delay: 1 },
          { x: 50, y: 300, size: 5, color: "#A855F7", delay: 0.5 },
          { x: 850, y: 350, size: 4, color: "#4EC9E1", delay: 1.5 },
          { x: 120, y: 440, size: 3, color: "#39FF14", delay: 2 },
          { x: 780, y: 460, size: 4, color: "#FF6B35", delay: 0.8 },
        ].map((p, i) => (
          <rect
            key={i}
            x={p.x}
            y={p.y}
            width={p.size}
            height={p.size}
            fill={p.color}
            opacity={0.6}
            style={{
              animation: `float ${3 + p.delay}s ease-in-out infinite`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </svg>
    </div>
  );
}
