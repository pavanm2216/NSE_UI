import React, { useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';

const FintechIcon3D: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-80, 80], [18, -18]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-80, 80], [-18, 18]), { stiffness: 200, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const bars = [
    { x: 82,  y: 195, h: 60,  capId: 'cap1', barId: 'bar1', delay: 0   },
    { x: 122, y: 170, h: 85,  capId: 'cap2', barId: 'bar2', delay: 0.2 },
    { x: 162, y: 145, h: 110, capId: 'cap3', barId: 'bar3', delay: 0.4 },
    { x: 202, y: 115, h: 140, capId: 'cap4', barId: 'bar4', delay: 0.6 },
  ];

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 800, width: '100%', height: '100%' }}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d', width: '100%', height: '100%' }}
        whileHover={{ scale: 1.06 }}
        transition={{ type: 'spring', stiffness: 200, damping: 18 }}
      >
        <svg
          viewBox="0 0 320 320"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          style={{ filter: 'drop-shadow(0 12px 48px rgba(0,200,255,0.4))' }}
        >
          <defs>
            <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#040c28" />
              <stop offset="60%" stopColor="#071840" />
              <stop offset="100%" stopColor="#091d55" />
            </linearGradient>
            <linearGradient id="glassOverlay" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.01" />
            </linearGradient>

            {/* Metallic bar gradients */}
            {[['bar1','#c8d6f0'],['bar2','#d0dff5'],['bar3','#d8e6fa'],['bar4','#e8f0ff']].map(([id, mid]) => (
              <linearGradient key={id} id={id} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#5a6f98" />
                <stop offset="28%" stopColor={mid} />
                <stop offset="62%" stopColor="#8fa3cc" />
                <stop offset="100%" stopColor="#3a5080" />
              </linearGradient>
            ))}

            {/* Cap gradients */}
            {[['cap1','#ddeaff'],['cap2','#e5eeff'],['cap3','#eef4ff'],['cap4','#f8fbff']].map(([id, c]) => (
              <radialGradient key={id} id={id} cx="50%" cy="38%" r="55%">
                <stop offset="0%" stopColor={c} />
                <stop offset="100%" stopColor="#6a80b0" />
              </radialGradient>
            ))}

            <filter id="arrowGlow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="5" result="b1" />
              <feGaussianBlur stdDeviation="2" result="b2" />
              <feMerge><feMergeNode in="b1" /><feMergeNode in="b2" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="coinShadow" x="-25%" y="-25%" width="150%" height="150%">
              <feDropShadow dx="2" dy="8" stdDeviation="6" floodColor="#000820" floodOpacity="0.55" />
            </filter>
            <filter id="glowBlue" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>

            <radialGradient id="coinGrad" cx="38%" cy="32%" r="62%">
              <stop offset="0%" stopColor="#f4f8ff" />
              <stop offset="50%" stopColor="#c4d0e8" />
              <stop offset="100%" stopColor="#8090b0" />
            </radialGradient>
            <radialGradient id="coinEdge" cx="50%" cy="50%" r="50%">
              <stop offset="68%" stopColor="transparent" />
              <stop offset="100%" stopColor="#4a5a78" stopOpacity="0.7" />
            </radialGradient>
            <radialGradient id="centerGlow" cx="55%" cy="62%" r="50%">
              <stop offset="0%" stopColor="#0a3a8a" stopOpacity="0.55" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
            <linearGradient id="rimLight" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00c8ff" stopOpacity="0.3" />
              <stop offset="50%" stopColor="transparent" />
              <stop offset="100%" stopColor="#0050ff" stopOpacity="0.18" />
            </linearGradient>
            <radialGradient id="floorShadow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#000820" stopOpacity="0.55" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
            <linearGradient id="arrowGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00e5ff" />
              <stop offset="100%" stopColor="#00ffcc" />
            </linearGradient>
            <linearGradient id="growthGrad" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#00e5ff" stopOpacity="0" />
              <stop offset="40%" stopColor="#00e5ff" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#00ffcc" stopOpacity="0.3" />
            </linearGradient>
            <clipPath id="roundedClip">
              <rect x="10" y="10" width="300" height="300" rx="52" ry="52" />
            </clipPath>
          </defs>

          {/* Background */}
          <rect x="10" y="10" width="300" height="300" rx="52" ry="52" fill="url(#bgGrad)" />
          <ellipse cx="175" cy="200" rx="125" ry="95" fill="url(#centerGlow)" clipPath="url(#roundedClip)" />
          <rect x="10" y="10" width="300" height="300" rx="52" ry="52" fill="none" stroke="url(#rimLight)" strokeWidth="2.5" />
          <ellipse cx="88" cy="68" rx="82" ry="42" fill="url(#glassOverlay)" clipPath="url(#roundedClip)" />

          {/* ── BARS with growth animation ── */}
          {bars.map(({ x: bx, y: by, h, capId, barId, delay }) => (
            <g key={barId}>
              {/* Growth glow line behind bar */}
              <line
                x1={bx + 14} y1={255} x2={bx + 14} y2={by}
                stroke="url(#growthGrad)" strokeWidth="3" opacity="0.7"
              >
                <animate attributeName="y2" values={`255;${by}`} dur="1.6s" begin={`${delay}s`} fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1" />
                <animate attributeName="opacity" values="0;0.7" dur="0.4s" begin={`${delay}s`} fill="freeze" />
              </line>

              {/* Bar body */}
              <rect x={bx} y={by} width="28" height={h} rx="5" fill={`url(#${barId})`}>
                <animate attributeName="height" values={`0;${h}`} dur="1.6s" begin={`${delay}s`} fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1" />
                <animate attributeName="y" values={`255;${by}`} dur="1.6s" begin={`${delay}s`} fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1" />
              </rect>

              {/* Reflection streak */}
              <rect x={bx + 5} y={by + 6} width="5" height={h - 10} rx="2" fill="white" opacity="0.13">
                <animate attributeName="height" values={`0;${h - 10}`} dur="1.6s" begin={`${delay}s`} fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1" />
                <animate attributeName="y" values={`255;${by + 6}`} dur="1.6s" begin={`${delay}s`} fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1" />
              </rect>

              {/* Cap ellipse */}
              <ellipse cx={bx + 14} cy={by} rx="14" ry="5" fill={`url(#${capId})`}>
                <animate attributeName="opacity" values="0;1" dur="0.4s" begin={`${delay + 1.4}s`} fill="freeze" />
              </ellipse>

              {/* Cap highlight */}
              <ellipse cx={bx + 10} cy={by - 1} rx="6" ry="2" fill="white" opacity="0.35">
                <animate attributeName="opacity" values="0;0.35" dur="0.4s" begin={`${delay + 1.4}s`} fill="freeze" />
              </ellipse>

              {/* Pulse dot on top */}
              <circle cx={bx + 14} cy={by} r="3" fill="#00e5ff" opacity="0.9" filter="url(#glowBlue)">
                <animate attributeName="opacity" values="0;0;0.9;0.4;0.9" dur="2.5s" begin={`${delay + 1.6}s`} repeatCount="indefinite" />
                <animate attributeName="r" values="3;5;3" dur="2.5s" begin={`${delay + 1.6}s`} repeatCount="indefinite" />
              </circle>
            </g>
          ))}

          {/* Floor shadow */}
          <ellipse cx="160" cy="258" rx="92" ry="8" fill="url(#floorShadow)" />

          {/* ── NEON ARROW ── */}
          <g filter="url(#arrowGlow)" opacity="0.5">
            <polyline points="72,248 212,106" stroke="#00e5ff" strokeWidth="9" strokeLinecap="round" fill="none" />
          </g>
          <polyline points="72,248 212,106" stroke="url(#arrowGrad)" strokeWidth="3.5" strokeLinecap="round" fill="none" filter="url(#arrowGlow)">
            <animate attributeName="stroke-dasharray" values="0,300;300,0" dur="1.8s" begin="0.5s" fill="freeze" />
            <animate attributeName="stroke-dashoffset" values="0;0" dur="1.8s" begin="0.5s" fill="freeze" />
          </polyline>
          <polygon points="212,106 194,116 202,132" fill="url(#arrowGrad)" filter="url(#arrowGlow)">
            <animate attributeName="opacity" values="0;1" dur="0.3s" begin="2.1s" fill="freeze" />
          </polygon>
          <circle cx="72" cy="248" r="5" fill="#00e5ff" opacity="0.85" filter="url(#arrowGlow)">
            <animate attributeName="r" values="5;8;5" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.85;0.4;0.85" dur="2s" repeatCount="indefinite" />
          </circle>

          {/* ── FLOATING COIN ── */}
          <g filter="url(#coinShadow)">
            <g>
              <animateTransform attributeName="transform" type="translate" values="78,38; 78,32; 78,38" dur="3.2s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1;0.4 0 0.6 1" />
              {/* Coin body */}
              <circle cx="0" cy="0" r="28" fill="url(#coinGrad)" />
              <circle cx="0" cy="0" r="28" fill="none" stroke="#6070a0" strokeWidth="2.5" />
              <circle cx="0" cy="0" r="28" fill="url(#coinEdge)" />
              {/* Rotating ₹ symbol */}
              <g>
                <animateTransform attributeName="transform" type="rotate" values="0;360" dur="5s" repeatCount="indefinite" />
                <text x="0" y="9" textAnchor="middle" fontSize="24" fontWeight="bold" fontFamily="Georgia, serif" fill="#2a3a58" opacity="0.6">₹</text>
              </g>
              {/* Sheen */}
              <ellipse cx="-10" cy="-12" rx="10" ry="6" fill="white" opacity="0.28" transform="rotate(-20)" />
              {/* Rim glow */}
              <circle cx="0" cy="0" r="28" fill="none" stroke="#00c8ff" strokeWidth="1" opacity="0.3" />
            </g>
          </g>

          {/* Glass border */}
          <rect x="10" y="10" width="300" height="300" rx="52" ry="52" fill="none" stroke="white" strokeWidth="1" strokeOpacity="0.07" />
          <path d="M62,10 Q10,10 10,62" fill="none" stroke="white" strokeWidth="2" strokeOpacity="0.2" />
          <path d="M258,310 Q310,310 310,258" fill="none" stroke="#00c8ff" strokeWidth="1.5" strokeOpacity="0.12" />
        </svg>
      </motion.div>
    </div>
  );
};

export default FintechIcon3D;
