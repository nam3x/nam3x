import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { theme } from '../theme';

/** Lapis 1 — gradient mesh gelap yang bergerak perlahan (deterministik, berbasis frame). */
export const MovingGradient: React.FC = () => {
  const frame = useCurrentFrame();
  const x1 = 50 + Math.sin(frame / 30) * 15;
  const y1 = 35 + Math.cos(frame / 45) * 8;
  const x2 = 20 + Math.cos(frame / 38) * 10;
  const y2 = 80 + Math.sin(frame / 52) * 6;
  return (
    <AbsoluteFill
      style={{
        background: [
          `radial-gradient(circle at ${x1}% ${y1}%, ${theme.colors.bgSecondary} 0%, transparent 60%)`,
          `radial-gradient(circle at ${x2}% ${y2}%, rgba(56,189,248,0.10) 0%, transparent 50%)`,
          theme.colors.bgPrimary,
        ].join(', '),
      }}
    />
  );
};

/** Lapis 4 — color grade: menyatukan kontras teks dan warna seluruh adegan. */
export const ColorGrade: React.FC = () => (
  <AbsoluteFill
    style={{
      pointerEvents: 'none',
      background:
        'linear-gradient(180deg, rgba(56,189,248,0.06) 0%, rgba(0,0,0,0) 40%, rgba(245,158,11,0.05) 100%)',
      mixBlendMode: 'soft-light',
    }}
  />
);

/** Lapis 5 — film grain (SVG turbulence, seed berganti per frame) + vignette. */
export const GrainVignette: React.FC = () => {
  const frame = useCurrentFrame();
  const seed = frame % 12; // deterministik, bukan Math.random()
  return (
    <>
      <AbsoluteFill style={{ pointerEvents: 'none', opacity: 0.05, mixBlendMode: 'overlay' }}>
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <filter id={`grain-${seed}`}>
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={seed} stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter={`url(#grain-${seed})`} />
        </svg>
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          pointerEvents: 'none',
          background: 'radial-gradient(circle, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)',
        }}
      />
    </>
  );
};
