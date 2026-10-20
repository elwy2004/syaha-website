import type { Motif, Tone } from "@/content/images";

// Original illustrated scenes used wherever a verified photograph is not yet
// available. They are deliberately stylised so they never pass for a photo of
// the named monument. Drawn on a 1600×1000 canvas and cropped with `slice`.

type Palette = {
  sky: [string, string, string];
  sun: string;
  glow: string;
  far: string;
  mid: string;
  ground: [string, string];
  lit: string;
  shade: string;
  water: [string, string];
  accent: string;
  stars?: boolean;
};

const palettes: Record<Tone, Palette> = {
  dawn: {
    sky: ["#E6D6BF", "#EFCFA8", "#F4DFC1"],
    sun: "#FBEBCB",
    glow: "#F7D7A6",
    far: "#D7B993",
    mid: "#C9A277",
    ground: ["#D8B88C", "#B99068"],
    lit: "#D6AF7E",
    shade: "#A77D55",
    water: ["#7FA3A0", "#4E7774"],
    accent: "#B58B50",
  },
  day: {
    sky: ["#C9DAD6", "#E2E6DC", "#F2EADB"],
    sun: "#FFF8E8",
    glow: "#F6EAD0",
    far: "#DCC7A3",
    mid: "#CDB085",
    ground: ["#E3CCA2", "#C9A877"],
    lit: "#E0C394",
    shade: "#B08B5E",
    water: ["#5F8F8E", "#2F5F60"],
    accent: "#B58B50",
  },
  dusk: {
    sky: ["#1D474A", "#9B6B4E", "#E2A86E"],
    sun: "#F6D39A",
    glow: "#EDB678",
    far: "#8A5E45",
    mid: "#6B4A36",
    ground: ["#5A3F2E", "#3A2A20"],
    lit: "#7B5338",
    shade: "#3E2C21",
    water: ["#3D6466", "#183A3C"],
    accent: "#E3B678",
  },
  night: {
    sky: ["#0B2225", "#123F43", "#2A4F4D"],
    sun: "#EFE4CC",
    glow: "#45625C",
    far: "#1E3A3B",
    mid: "#173031",
    ground: ["#142827", "#0C1B1B"],
    lit: "#2B4644",
    shade: "#10201F",
    water: ["#1F4446", "#0B2224"],
    accent: "#D9A85E",
    stars: true,
  },
};

const H = 720; // horizon line

function Pyramid({ x, w, h, p }: { x: number; w: number; h: number; p: Palette }) {
  const apex = x + w / 2;
  return (
    <g>
      <polygon points={`${x},${H} ${apex},${H - h} ${apex + w * 0.08},${H}`} fill={p.lit} />
      <polygon points={`${apex},${H - h} ${x + w},${H} ${apex + w * 0.08},${H}`} fill={p.shade} />
    </g>
  );
}

function Column({ x, top, w, p, capital = true }: { x: number; top: number; w: number; p: Palette; capital?: boolean }) {
  return (
    <g>
      <rect x={x} y={top + 40} width={w} height={H - top - 40} fill={p.shade} />
      <rect x={x} y={top + 40} width={w * 0.35} height={H - top - 40} fill={p.lit} opacity={0.55} />
      {capital && <path d={`M${x - w * 0.25},${top + 40} Q${x + w / 2},${top - 10} ${x + w * 1.25},${top + 40} Z`} fill={p.shade} />}
      {[0.3, 0.5, 0.7].map((f) => (
        <rect key={f} x={x} y={top + 40 + (H - top - 40) * f} width={w} height={4} fill={p.lit} opacity={0.35} />
      ))}
    </g>
  );
}

function Palm({ x, y, s = 1, color }: { x: number; y: number; s?: number; color: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill={color}>
      <path d="M-4,0 C-2,-60 4,-120 10,-170 L16,-170 C10,-120 6,-60 6,0 Z" />
      <path d="M13,-170 C-20,-185 -55,-175 -80,-150 C-50,-165 -20,-168 13,-165 Z" />
      <path d="M13,-170 C40,-190 80,-185 105,-160 C75,-172 45,-172 13,-165 Z" />
      <path d="M13,-172 C0,-205 -30,-215 -55,-205 C-25,-200 -5,-190 13,-168 Z" />
      <path d="M13,-172 C30,-210 60,-218 80,-205 C55,-200 35,-190 13,-168 Z" />
      <path d="M13,-170 C-10,-160 -30,-130 -35,-105 C-20,-135 -5,-152 13,-165 Z" />
    </g>
  );
}

function Sail({ x, y, s = 1, p }: { x: number; y: number; s?: number; p: Palette }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-70,0 Q0,22 80,0 L70,-6 L-60,-6 Z" fill={p.shade} />
      <path d="M2,-8 L6,-230 L10,-230 L8,-8 Z" fill={p.shade} />
      <path d="M8,-226 C70,-170 95,-90 92,-14 L10,-14 Z" fill="#F7F3EB" opacity={0.92} />
      <path d="M-48,-30 L118,-262" stroke={p.shade} strokeWidth={4} />
    </g>
  );
}

function SeatedFigure({ x, w, h, p }: { x: number; w: number; h: number; p: Palette }) {
  // A blocky seated colossus: throne, legs, torso, head with headdress.
  const b = H;
  return (
    <g>
      <rect x={x} y={b - h * 0.55} width={w} height={h * 0.55} fill={p.shade} />
      <rect x={x + w * 0.12} y={b - h * 0.55} width={w * 0.76} height={h * 0.08} fill={p.lit} opacity={0.6} />
      <rect x={x + w * 0.2} y={b - h * 0.86} width={w * 0.6} height={h * 0.34} fill={p.lit} />
      <path
        d={`M${x + w * 0.3},${b - h * 0.86} L${x + w * 0.24},${b - h * 0.98} Q${x + w * 0.5},${b - h * 1.06} ${x + w * 0.76},${b - h * 0.98} L${x + w * 0.7},${b - h * 0.86} Z`}
        fill={p.lit}
      />
      <rect x={x + w * 0.2} y={b - h * 0.55} width={w * 0.6} height={h * 0.55} fill={p.lit} opacity={0.5} />
    </g>
  );
}

function Dome({ cx, base, r, p, fill }: { cx: number; base: number; r: number; p: Palette; fill?: string }) {
  return <path d={`M${cx - r},${base} A${r},${r * 1.05} 0 0 1 ${cx + r},${base} Z`} fill={fill ?? p.shade} />;
}

function Minaret({ x, top, p }: { x: number; top: number; p: Palette }) {
  return (
    <g fill={p.shade}>
      <rect x={x} y={top + 30} width={14} height={H - top - 30} />
      <polygon points={`${x},${top + 30} ${x + 7},${top - 40} ${x + 14},${top + 30}`} />
      <rect x={x - 5} y={top + 110} width={24} height={6} />
      <rect x={x - 5} y={top + 220} width={24} height={6} />
    </g>
  );
}

function Motif({ motif, p }: { motif: Motif; p: Palette }) {
  switch (motif) {
    case "pyramids":
      return (
        <g>
          <Pyramid x={1060} w={420} h={300} p={p} />
          <Pyramid x={430} w={640} h={430} p={p} />
          <Pyramid x={1360} w={200} h={130} p={p} />
        </g>
      );
    case "sphinx":
      return (
        <g>
          <Pyramid x={820} w={620} h={400} p={{ ...p, lit: p.far, shade: p.mid }} />
          <g fill={p.shade}>
            <path d="M300,720 L300,650 Q330,610 420,606 L760,600 Q800,590 812,560 L830,470 Q840,440 880,436 L940,440 Q975,450 980,490 L984,560 Q1000,600 990,640 L1000,720 Z" />
            {/* nemes headdress flaring to the shoulders, face in shadow */}
            <path d="M836,560 L848,486 Q860,430 905,424 Q950,430 962,486 L976,560 Z" fill={p.lit} />
            <path d="M878,452 Q905,440 932,452 L930,520 Q905,536 880,520 Z" fill={p.shade} />
            {[470, 490, 510, 530].map((y) => (
              <rect key={y} x={846} y={y} width={22} height={4} fill={p.shade} opacity={0.35} />
            ))}
            <path d="M995,690 L1180,690 Q1200,700 1190,720 L995,720 Z" />
          </g>
        </g>
      );
    case "steppyramid":
      return (
        <g>
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const w = 760 - i * 110;
            const x = 800 - w / 2;
            const y = H - (i + 1) * 62;
            return (
              <g key={i}>
                <rect x={x} y={y} width={w} height={62} fill={p.lit} />
                <rect x={x + w * 0.55} y={y} width={w * 0.45} height={62} fill={p.shade} />
                <rect x={x} y={y} width={w} height={5} fill={p.shade} opacity={0.4} />
              </g>
            );
          })}
        </g>
      );
    case "bentpyramid":
      return (
        <g>
          <polygon points="440,720 640,470 800,330 800,720" fill={p.lit} />
          <polygon points="800,330 960,470 1160,720 800,720" fill={p.shade} />
          <Pyramid x={1240} w={300} h={170} p={{ ...p, lit: p.far, shade: p.mid }} />
        </g>
      );
    case "temple":
      return (
        <g>
          <polygon points="420,720 460,380 760,380 790,720" fill={p.lit} />
          <polygon points="810,720 840,380 1140,380 1180,720" fill={p.shade} />
          <rect x="760" y="440" width="80" height="280" fill={p.shade} />
          <rect x="770" y="520" width="60" height="200" fill={p.sky[2]} opacity={0.5} />
          <rect x="452" y="372" width="316" height="16" fill={p.shade} />
          <rect x="832" y="372" width="316" height="16" fill={p.shade} />
          {[500, 560, 620, 680, 880, 940, 1000, 1060].map((x) => (
            <rect key={x} x={x} y={430} width={14} height={240} fill={p.shade} opacity={0.18} />
          ))}
          {[1220, 1300, 1380].map((x) => (
            <Column key={x} x={x} top={460} w={46} p={p} />
          ))}
        </g>
      );
    case "colonnade":
      return (
        <g>
          <rect x="260" y="250" width="1180" height="56" fill={p.shade} />
          {[300, 470, 640, 810, 980, 1150, 1320].map((x, i) => (
            <Column key={x} x={x} top={260} w={i % 2 ? 92 : 100} p={p} />
          ))}
          <rect x="260" y="300" width="1180" height="10" fill={p.lit} opacity={0.4} />
        </g>
      );
    case "colossi":
      return (
        <g>
          <SeatedFigure x={430} w={250} h={470} p={p} />
          <SeatedFigure x={900} w={250} h={450} p={p} />
        </g>
      );
    case "terrace":
      return (
        <g>
          <path d="M0,720 L0,280 Q200,200 420,240 Q640,170 900,210 Q1150,160 1380,230 Q1500,250 1600,240 L1600,720 Z" fill={p.mid} />
          <path d="M0,720 L0,330 Q300,300 600,320 L1000,300 Q1300,320 1600,300 L1600,720 Z" fill={p.far} opacity={0.6} />
          {[0, 1, 2].map((i) => {
            const y = 470 + i * 80;
            const w = 560 + i * 200;
            const x = 800 - w / 2;
            return (
              <g key={i}>
                <rect x={x} y={y} width={w} height={70} fill={p.lit} />
                {Array.from({ length: Math.floor(w / 44) }).map((_, j) => (
                  <rect key={j} x={x + 14 + j * 44} y={y + 14} width={18} height={56} fill={p.shade} />
                ))}
                <rect x={x} y={y} width={w} height={12} fill={p.shade} opacity={0.5} />
              </g>
            );
          })}
          <polygon points="770,720 830,720 820,550 780,550" fill={p.lit} />
        </g>
      );
    case "avenue":
      return (
        <g>
          <polygon points="1050,720 1080,440 1260,440 1280,720" fill={p.shade} />
          <polygon points="1290,720 1300,440 1480,440 1510,720" fill={p.shade} />
          {Array.from({ length: 9 }).map((_, i) => {
            const s = 1 - i * 0.09;
            const xl = 120 + i * 110;
            return (
              <g key={i}>
                <path
                  transform={`translate(${xl} ${730 - i * 6}) scale(${s})`}
                  d="M0,0 L0,-40 Q10,-60 40,-60 L120,-62 L130,-110 Q140,-130 160,-128 L175,-110 L178,-60 L190,0 Z"
                  fill={p.shade}
                />
                <path
                  transform={`translate(${xl + 40} ${800 + i * 4}) scale(${s * 1.1})`}
                  d="M0,0 L0,-40 Q10,-60 40,-60 L120,-62 L130,-110 Q140,-130 160,-128 L175,-110 L178,-60 L190,0 Z"
                  fill={p.shade}
                  opacity={0.9}
                />
              </g>
            );
          })}
        </g>
      );
    case "obelisk":
      return (
        <g>
          <path d="M140,720 L260,560 L1440,560 L1520,720 Z" fill={p.shade} />
          <polygon points="300,610 1260,590 1340,620 1260,650 300,640" fill={p.lit} />
          <polygon points="300,640 1260,650 1340,620 1340,650 1260,680 300,672" fill={p.shade} opacity={0.6} />
          {[420, 640, 860, 1080].map((x) => (
            <rect key={x} x={x} y={570} width={3} height={14} fill={p.lit} opacity={0.5} />
          ))}
        </g>
      );
    case "mosque":
      return (
        <g>
          <rect x="520" y="560" width="560" height="160" fill={p.shade} />
          <rect x="560" y="520" width="480" height="50" fill={p.shade} />
          <Dome cx={800} base={520} r={170} p={p} />
          <rect x="795" y="300" width="10" height="40" fill={p.accent} />
          <Dome cx={620} base={560} r={70} p={p} />
          <Dome cx={980} base={560} r={70} p={p} />
          <Dome cx={540} base={600} r={40} p={p} />
          <Dome cx={1060} base={600} r={40} p={p} />
          <Minaret x={470} top={190} p={p} />
          <Minaret x={1116} top={190} p={p} />
          {[600, 680, 760, 840, 920, 1000].map((x) => (
            <path key={x} d={`M${x},720 L${x},640 Q${x + 20},610 ${x + 40},640 L${x + 40},720 Z`} fill={p.glow} opacity={0.35} />
          ))}
        </g>
      );
    case "citadel":
      return (
        <g>
          <path d="M200,720 L240,560 L1400,560 L1440,720 Z" fill={p.mid} />
          {[260, 520, 1080, 1340].map((x) => (
            <g key={x} fill={p.shade}>
              <rect x={x} y={470} width={80} height={110} />
              {[0, 1, 2, 3].map((j) => (
                <rect key={j} x={x + j * 22} y={455} width={14} height={16} />
              ))}
            </g>
          ))}
          <rect x="300" y="510" width="1080" height="60" fill={p.shade} />
          <Dome cx={800} base={470} r={120} p={p} />
          <rect x="680" y="470" width="240" height="60" fill={p.shade} />
          <Minaret x={640} top={200} p={p} />
          <Minaret x={946} top={200} p={p} />
        </g>
      );
    case "church":
      return (
        <g fill={p.shade}>
          <rect x="560" y="400" width="480" height="320" />
          <rect x="520" y="300" width="110" height="420" />
          <rect x="970" y="300" width="110" height="420" />
          <polygon points="520,300 575,240 630,300" />
          <polygon points="970,300 1025,240 1080,300" />
          <rect x="571" y="190" width="8" height="56" fill={p.accent} />
          <rect x="559" y="208" width="32" height="7" fill={p.accent} />
          <rect x="1021" y="190" width="8" height="56" fill={p.accent} />
          <rect x="1009" y="208" width="32" height="7" fill={p.accent} />
          {[640, 740, 840, 940].map((x) => (
            <path key={x} d={`M${x},720 L${x},560 Q${x + 30},515 ${x + 60},560 L${x + 60},720 Z`} fill={p.glow} opacity={0.4} />
          ))}
          {[548, 998].map((x) => (
            <path key={x} d={`M${x},400 L${x},340 Q${x + 27},312 ${x + 54},340 L${x + 54},400 Z`} fill={p.glow} opacity={0.4} />
          ))}
          <rect x="420" y="660" width="760" height="60" fill={p.mid} />
        </g>
      );
    case "street":
      return (
        <g>
          <polygon points="0,120 560,330 560,720 0,720" fill={p.shade} />
          <polygon points="1600,120 1040,330 1040,720 1600,720" fill={p.shade} />
          {[0, 1, 2].map((i) => (
            <g key={i} fill={p.lit} opacity={0.5}>
              <polygon points={`${120 + i * 150},${260 + i * 30} ${220 + i * 150},${290 + i * 28} ${220 + i * 150},${400 + i * 20} ${120 + i * 150},${390 + i * 20}`} />
              <polygon points={`${1480 - i * 150},${260 + i * 30} ${1380 - i * 150},${290 + i * 28} ${1380 - i * 150},${400 + i * 20} ${1480 - i * 150},${390 + i * 20}`} />
            </g>
          ))}
          <Minaret x={790} top={150} p={p} />
          <Dome cx={700} base={470} r={60} p={p} />
          <rect x="600" y="470" width="400" height="250" fill={p.mid} />
          <path d="M760,720 L760,560 Q800,510 840,560 L840,720 Z" fill={p.glow} opacity={0.6} />
        </g>
      );
    case "market":
      return (
        <g>
          <rect x="0" y="560" width="1600" height="160" fill={p.shade} />
          {[0, 1, 2, 3, 4].map((i) => (
            <path key={i} d={`M${100 + i * 300},720 L${100 + i * 300},600 Q${200 + i * 300},500 ${300 + i * 300},600 L${300 + i * 300},720 Z`} fill={p.glow} opacity={0.3} />
          ))}
          <path d="M0,140 Q800,260 1600,140" stroke={p.shade} strokeWidth={3} fill="none" />
          {[180, 360, 540, 720, 900, 1080, 1260, 1440].map((x, i) => {
            const y = 140 + Math.sin((x / 1600) * Math.PI) * 120 + 40;
            return (
              <g key={x}>
                <line x1={x} y1={y - 40} x2={x} y2={y} stroke={p.shade} strokeWidth={2} />
                <circle cx={x} cy={y + 30} r={70} fill={p.accent} opacity={0.12} />
                <path d={`M${x - 26},${y} L${x + 26},${y} L${x + 18},${y + 54} Q${x},${y + 72} ${x - 18},${y + 54} Z`} fill={i % 2 ? p.accent : "#C9753D"} opacity={0.95} />
              </g>
            );
          })}
        </g>
      );
    case "museum":
      return (
        <g>
          <polygon points="160,720 160,420 1440,300 1440,720" fill={p.shade} />
          {Array.from({ length: 12 }).map((_, i) => (
            <polygon
              key={i}
              points={`${200 + i * 100},${720} ${250 + i * 100},${410 - i * 9} ${300 + i * 100},${720}`}
              fill={p.lit}
              opacity={0.18}
            />
          ))}
          <rect x="640" y="520" width="320" height="200" fill={p.glow} opacity={0.45} />
          <g fill={p.shade}>
            <rect x="770" y="600" width="60" height="120" />
            <rect x="780" y="520" width="40" height="80" />
            <path d="M776,520 L770,488 Q800,470 830,488 L824,520 Z" />
          </g>
        </g>
      );
    case "palace":
      return (
        <g>
          <rect x="240" y="480" width="1120" height="240" fill={p.shade} />
          <rect x="620" y="400" width="360" height="320" fill={p.shade} />
          <Dome cx={800} base={400} r={110} p={p} />
          <rect x="220" y="470" width="1160" height="16" fill={p.lit} opacity={0.5} />
          {Array.from({ length: 13 }).map((_, i) => (
            <path key={i} d={`M${270 + i * 82},640 L${270 + i * 82},560 Q${295 + i * 82},530 ${320 + i * 82},560 L${320 + i * 82},640 Z`} fill={p.glow} opacity={0.4} />
          ))}
          <Palm x={160} y={720} s={1.3} color={p.shade} />
          <Palm x={1440} y={720} s={1.5} color={p.shade} />
        </g>
      );
    case "tomb":
      return (
        <g>
          <rect x="0" y="0" width="1600" height="1000" fill={p.shade} />
          <polygon points="0,0 1600,0 1000,360 600,360" fill={p.mid} />
          <polygon points="0,1000 1600,1000 1000,640 600,640" fill={p.lit} opacity={0.6} />
          <polygon points="0,0 600,360 600,640 0,1000" fill={p.lit} />
          <polygon points="1600,0 1000,360 1000,640 1600,1000" fill={p.lit} opacity={0.85} />
          <rect x="600" y="360" width="400" height="280" fill={p.glow} opacity={0.75} />
          {Array.from({ length: 40 }).map((_, i) => (
            <path
              key={i}
              d="M0,-6 L1.8,-1.8 L6,0 L1.8,1.8 L0,6 L-1.8,1.8 L-6,0 L-1.8,-1.8 Z"
              transform={`translate(${200 + ((i * 137) % 1200)} ${40 + ((i * 53) % 250)})`}
              fill={p.accent}
              opacity={0.8}
            />
          ))}
          {[0, 1, 2, 3].map((i) => (
            <g key={i} opacity={0.55}>
              <polygon points={`${i * 140},${i * 84 + 300} ${i * 140 + 120},${i * 84 + 372} ${i * 140 + 120},${i * 84 + 420} ${i * 140},${i * 84 + 360}`} fill={p.accent} />
              <polygon points={`${1600 - i * 140},${i * 84 + 300} ${1480 - i * 140},${i * 84 + 372} ${1480 - i * 140},${i * 84 + 420} ${1600 - i * 140},${i * 84 + 360}`} fill={p.water[0]} />
            </g>
          ))}
        </g>
      );
    case "valley":
      return (
        <g>
          <path d="M0,720 L0,330 L180,250 L340,320 L520,210 L700,300 L760,720 Z" fill={p.lit} />
          <path d="M840,720 L900,290 L1080,200 L1250,280 L1420,230 L1600,300 L1600,720 Z" fill={p.shade} />
          <path d="M0,720 L0,500 L300,470 L600,560 L760,720 Z" fill={p.shade} opacity={0.5} />
          {[220, 470, 1000, 1300].map((x, i) => (
            <rect key={x} x={x} y={560 - i * 20} width={36} height={52} fill="#20211F" opacity={0.75} />
          ))}
          <path d="M700,720 Q800,640 860,720 Z" fill={p.ground[0]} />
        </g>
      );
    case "nile":
      return (
        <g>
          <Palm x={160} y={620} s={1.1} color={p.shade} />
          <Palm x={280} y={630} s={0.8} color={p.shade} />
          <Palm x={1420} y={612} s={1} color={p.shade} />
          <Sail x={620} y={800} s={1.05} p={p} />
          <Sail x={1100} y={760} s={0.7} p={p} />
        </g>
      );
    case "island":
      return (
        <g>
          <path d="M120,700 Q260,560 420,640 Q520,600 600,700 Z" fill={p.shade} />
          <path d="M980,700 Q1100,600 1260,640 Q1380,590 1500,700 Z" fill={p.shade} />
          <Palm x={300} y={640} s={0.9} color={p.shade} />
          <Palm x={1200} y={640} s={0.8} color={p.shade} />
          <Palm x={1320} y={630} s={1} color={p.shade} />
          <Sail x={760} y={800} s={0.75} p={p} />
        </g>
      );
    case "garden":
      return (
        <g>
          {[120, 330, 560, 1000, 1220, 1440].map((x, i) => (
            <Palm key={x} x={x} y={740} s={1.4 + (i % 3) * 0.3} color={i % 2 ? p.shade : p.mid} />
          ))}
          {[760, 860].map((x) => (
            <circle key={x} cx={x} cy={600} r={130} fill={p.shade} />
          ))}
          <rect x="0" y="700" width="1600" height="60" fill={p.shade} />
        </g>
      );
    case "village":
      return (
        <g>
          {[
            [140, 520, 240, "#B88B5A"],
            [400, 470, 260, "#4F7F86"],
            [690, 500, 230, "#D2A564"],
            [950, 460, 280, "#C27C55"],
            [1260, 510, 240, "#6E8C78"],
          ].map(([x, top, w, c]) => (
            <g key={x as number}>
              <rect x={x as number} y={top as number} width={w as number} height={H - (top as number)} fill={c as string} opacity={0.85} />
              <Dome cx={(x as number) + (w as number) / 2} base={top as number} r={(w as number) * 0.32} p={p} fill={c as string} />
              <path
                d={`M${(x as number) + (w as number) / 2 - 30},${H} L${(x as number) + (w as number) / 2 - 30},${H - 110} Q${(x as number) + (w as number) / 2},${H - 150} ${(x as number) + (w as number) / 2 + 30},${H - 110} L${(x as number) + (w as number) / 2 + 30},${H} Z`}
                fill="#F7F3EB"
                opacity={0.85}
              />
              {[0, 1, 2, 3].map((j) => (
                <rect key={j} x={(x as number) + 20 + j * ((w as number) - 40) / 4} y={(top as number) + 30} width={14} height={14} fill="#F7F3EB" opacity={0.7} transform={`rotate(45 ${(x as number) + 27 + j * ((w as number) - 40) / 4} ${(top as number) + 37})`} />
              ))}
            </g>
          ))}
        </g>
      );
    case "dam":
      return (
        <g>
          <polygon points="0,560 1600,520 1600,620 0,640" fill={p.shade} />
          <rect x="0" y="540" width="1600" height="12" fill={p.lit} opacity={0.6} />
          <g fill={p.shade}>
            <path d="M1180,540 L1196,300 L1230,250 L1264,300 L1280,540 Z" />
            <path d="M1230,250 L1180,200 L1214,262 Z" />
            <path d="M1230,250 L1280,200 L1246,262 Z" />
          </g>
        </g>
      );
    case "abusimbel":
      return (
        <g>
          <path d="M120,720 L180,240 Q800,150 1420,240 L1480,720 Z" fill={p.lit} />
          <path d="M120,720 L180,240 L300,250 L260,720 Z" fill={p.shade} opacity={0.5} />
          {[230, 520, 900, 1190].map((x) => (
            <SeatedFigure key={x} x={x} w={190} h={420} p={{ ...p, lit: p.mid, shade: p.shade }} />
          ))}
          <rect x="752" y="440" width="96" height="280" fill="#1E1A16" opacity={0.85} />
          <rect x="250" y="250" width="1100" height="20" fill={p.shade} opacity={0.4} />
        </g>
      );
    case "desert":
      return (
        <g>
          <path d="M0,720 L0,200 L220,240 L300,380 L420,420 L520,720 Z" fill={p.lit} />
          <path d="M1600,720 L1600,180 L1380,230 L1300,360 L1160,430 L1060,720 Z" fill={p.shade} />
          {[260, 320, 380].map((y) => (
            <path key={y} d={`M0,${y} L${280 + (y - 260)},${y + 40}`} stroke={p.shade} strokeWidth={3} opacity={0.4} />
          ))}
          {[300, 360, 420].map((y) => (
            <path key={y} d={`M1600,${y} L${1300 - (y - 300)},${y + 50}`} stroke={p.lit} strokeWidth={3} opacity={0.3} />
          ))}
        </g>
      );
    case "monastery":
      return (
        <g>
          <path d="M100,720 Q500,520 900,560 Q1200,500 1500,720 Z" fill={p.mid} />
          <polygon points="420,600 450,400 1140,400 1170,600" fill={p.lit} />
          <polygon points="800,600 820,400 1140,400 1170,600" fill={p.shade} opacity={0.5} />
          {[460, 560, 660, 860, 960, 1060].map((x) => (
            <path key={x} d={`M${x},560 L${x},480 Q${x + 25},450 ${x + 50},480 L${x + 50},560 Z`} fill={p.shade} opacity={0.6} />
          ))}
          <rect x="700" y="330" width="120" height="80" fill={p.lit} />
          <Dome cx={760} base={330} r={46} p={p} fill={p.lit} />
        </g>
      );
    case "lake":
      return (
        <g>
          <path d="M1060,640 L1090,520 L1260,520 L1290,640 Z" fill={p.shade} />
          <rect x="1120" y="560" width="110" height="80" fill={p.lit} opacity={0.5} />
          <path d="M900,660 Q1150,600 1500,650 L1500,680 L900,680 Z" fill={p.shade} />
          <Sail x={500} y={790} s={0.5} p={p} />
        </g>
      );
  }
}

function hasWater(m: Motif) {
  return m === "nile" || m === "island" || m === "dam" || m === "lake";
}

export function Scene({
  motif,
  tone,
  className,
  title,
}: {
  motif: Motif;
  tone: Tone;
  className?: string;
  title?: string;
}) {
  const p = palettes[tone];
  const uid = `${motif}-${tone}`;
  const enclosed = motif === "tomb";
  const water = hasWater(motif);
  return (
    <svg
      viewBox="0 0 1600 1000"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <defs>
        <linearGradient id={`sky-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={p.sky[0]} />
          <stop offset="0.55" stopColor={p.sky[1]} />
          <stop offset="1" stopColor={p.sky[2]} />
        </linearGradient>
        <linearGradient id={`ground-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={p.ground[0]} />
          <stop offset="1" stopColor={p.ground[1]} />
        </linearGradient>
        <linearGradient id={`water-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={p.water[0]} />
          <stop offset="1" stopColor={p.water[1]} />
        </linearGradient>
        <radialGradient id={`glow-${uid}`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={p.glow} stopOpacity="0.9" />
          <stop offset="1" stopColor={p.glow} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`vignette-${uid}`} cx="0.5" cy="0.45" r="0.75">
          <stop offset="0.6" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.28" />
        </radialGradient>
        <filter id={`grain-${uid}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix values="0 0 0 0 0.5  0 0 0 0 0.45  0 0 0 0 0.4  0 0 0 0.09 0" />
        </filter>
      </defs>

      {!enclosed && (
        <>
          <rect width="1600" height="1000" fill={`url(#sky-${uid})`} />
          {p.stars &&
            Array.from({ length: 60 }).map((_, i) => (
              <circle key={i} cx={(i * 263) % 1600} cy={(i * 97) % 420} r={i % 5 === 0 ? 2 : 1.1} fill="#F7F3EB" opacity={0.6} />
            ))}
          <circle cx="1180" cy={tone === "day" ? 200 : 470} r="300" fill={`url(#glow-${uid})`} />
          <circle cx="1180" cy={tone === "day" ? 200 : 470} r={tone === "night" ? 38 : 70} fill={p.sun} opacity={0.95} />
          <path d="M0,620 Q260,560 520,600 T1040,590 T1600,600 L1600,760 L0,760 Z" fill={p.far} opacity={0.7} />
          <path d="M0,680 Q340,630 700,670 T1600,650 L1600,780 L0,780 Z" fill={p.mid} opacity={0.6} />
        </>
      )}

      <Motif motif={motif} p={p} />

      {!enclosed &&
        (water ? (
          <>
            <rect y={H} width="1600" height={1000 - H} fill={`url(#water-${uid})`} />
            {Array.from({ length: 14 }).map((_, i) => (
              <rect key={i} x={(i * 211) % 1500} y={H + 30 + ((i * 37) % 220)} width={80 + (i % 4) * 40} height={3} fill={p.sun} opacity={0.25} />
            ))}
          </>
        ) : (
          <>
            <path d={`M0,${H} Q400,${H - 20} 800,${H} T1600,${H} L1600,1000 L0,1000 Z`} fill={`url(#ground-${uid})`} />
            <path d={`M0,860 Q500,800 1000,850 T1600,830 L1600,1000 L0,1000 Z`} fill={p.ground[1]} opacity={0.6} />
          </>
        ))}

      <rect width="1600" height="1000" filter={`url(#grain-${uid})`} opacity={0.7} />
      <rect width="1600" height="1000" fill={`url(#vignette-${uid})`} />
    </svg>
  );
}
