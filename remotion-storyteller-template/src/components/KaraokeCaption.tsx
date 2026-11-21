import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { theme } from '../theme';

export interface WordTiming {
  word: string;
  startFrame: number;
  endFrame: number;
}

export const KaraokeCaption: React.FC<{
  words: WordTiming[];
  isVertical: boolean;
}> = ({ words, isVertical }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (!words || words.length === 0) return null;

  const chunkSize = isVertical ? 5 : 8;
  const activeWordIdx = words.findIndex(
    (w) => frame >= w.startFrame && frame <= w.endFrame
  );
  const currentIdx =
    activeWordIdx !== -1
      ? activeWordIdx
      : frame < words[0].startFrame
      ? 0
      : words.length - 1;

  const chunkIndex = Math.floor(currentIdx / chunkSize);
  const visibleWords = words.slice(
    chunkIndex * chunkSize,
    (chunkIndex + 1) * chunkSize
  );

  return (
    <div
      style={{
        position: 'absolute',
        bottom: isVertical ? '18%' : '7%',
        left: isVertical ? 48 : 120,
        right: isVertical ? 48 : 120,
        display: 'flex',
        justifyContent: 'center',
        pointerEvents: 'none',
        zIndex: 20,
      }}
    >
      <div
        style={{
          display: 'inline-flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: isVertical ? '8px 12px' : '8px 14px',
          backgroundColor: 'rgba(11, 15, 25, 0.84)',
          border: `1px solid ${theme.colors.surfaceBorder}`,
          borderRadius: 18,
          padding: isVertical ? '14px 24px' : '12px 28px',
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.45)',
        }}
      >
        {visibleWords.map((item, idx) => {
          const isActive = frame >= item.startFrame && frame <= item.endFrame;
          const isPast = frame > item.endFrame;

          const pop = spring({
            frame: Math.max(0, frame - item.startFrame),
            fps,
            config: theme.springs.bouncy,
          });

          const scale = isActive
            ? interpolate(pop, [0, 1], [1.0, 1.12], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              })
            : 1;

          return (
            <span
              key={`${item.word}-${idx}`}
              style={{
                fontFamily: theme.typography.fontHeading,
                fontSize: isVertical ? 36 : 32,
                fontWeight: 800,
                color: isActive
                  ? theme.colors.accentHighlight
                  : isPast
                  ? theme.colors.textPrimary
                  : theme.colors.textSecondary,
                transform: `scale(${scale})`,
                display: 'inline-block',
                textShadow: isActive
                  ? '0 0 18px rgba(245, 158, 11, 0.45)'
                  : 'none',
              }}
            >
              {item.word}
            </span>
          );
        })}
      </div>
    </div>
  );
};
