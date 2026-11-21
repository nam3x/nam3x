import React from 'react';
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { theme } from '../theme';
import { KaraokeCaption, WordTiming } from './KaraokeCaption';
import { ThreeStage } from './ThreeStage';

export interface SceneItem {
  id: string;
  beat: string;
  energy: string;
  highlight?: boolean;
  visualType?: '2d-kinetic' | '3d-showcase';
  modelPath?: string;
  headline: string;
  subtext?: string;
  captionText?: string;
  wordTimings?: WordTiming[];
  assetPath?: string;
  startFrame: number;
  audioStartFrame: number;
  durationInFrames: number;
}

// Masuk 15 frame, keluar 10 frame (keluar 1.5x lebih cepat dari masuk).
const ENTER_FRAMES = 15;
const EXIT_FRAMES = 10;

export const StoryScene: React.FC<{ scene: SceneItem }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  // Pakai durasi adegan dari timeline (bukan durasi komposisi).
  const durationInFrames = scene.durationInFrames;

  const isVertical = height > width;
  const is3D = scene.visualType === '3d-showcase';

  const enterProgress = spring({
    frame,
    fps,
    config: theme.springs.snappy,
    durationInFrames: ENTER_FRAMES,
  });

  const exitStart = Math.max(0, durationInFrames - EXIT_FRAMES);
  const exitProgress = interpolate(frame, [exitStart, durationInFrames], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const masterOpacity = Math.min(enterProgress, exitProgress);
  const translateY = interpolate(enterProgress, [0, 1], [32, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const scaleIn = interpolate(enterProgress, [0, 1], [0.94, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const floatY = Math.sin(frame / 15) * 4;
  const kenBurnsScale = interpolate(frame, [0, durationInFrames], [1.0, 1.08], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const words = scene.headline.split(' ');

  return (
    // Latar transparan: lapis 1 (gradient), 4 (color grade) dan 5 (grain+vignette)
    // dirender sekali di StoryComposition agar tidak berkedip di pergantian adegan.
    <AbsoluteFill style={{ overflow: 'hidden' }}>

      {is3D ? (
        <AbsoluteFill style={{ opacity: masterOpacity }}>
          <ThreeStage
            modelPath={scene.modelPath}
            isVertical={isVertical}
            durationInFrames={durationInFrames}
          />
        </AbsoluteFill>
      ) : (
        scene.assetPath && (
          <AbsoluteFill style={{ opacity: 0.35 * exitProgress }}>
            <Img
              src={staticFile(scene.assetPath)}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transform: `scale(${kenBurnsScale})`,
              }}
            />
          </AbsoluteFill>
        )
      )}

      <AbsoluteFill
        style={{
          justifyContent: isVertical && is3D ? 'flex-end' : 'center',
          alignItems: isVertical ? 'center' : 'flex-start',
          paddingTop: isVertical ? '10%' : '6%',
          paddingBottom: isVertical ? '30%' : '12%',
          paddingLeft: isVertical ? 56 : 120,
          paddingRight: isVertical ? 56 : 120,
          opacity: masterOpacity,
          transform: `translateY(${translateY + floatY}px) scale(${scaleIn})`,
        }}
      >
        <div
          style={{
            backgroundColor: theme.colors.surfaceGlass,
            border: `1px solid ${theme.colors.surfaceBorder}`,
            borderRadius: 24,
            padding: isVertical ? '32px 32px' : '42px 48px',
            maxWidth: isVertical ? '100%' : is3D ? '52%' : '68%',
            backdropFilter: 'blur(12px)',
          }}
        >
          <div
            style={{
              fontFamily: theme.typography.fontMono,
              fontSize: isVertical ? 20 : 18,
              color: theme.colors.accentPrimary,
              textTransform: 'uppercase',
              letterSpacing: 2,
              marginBottom: 14,
            }}
          >
            {scene.beat} • {scene.energy} {is3D ? '• 3D' : ''}
          </div>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: isVertical ? 'center' : 'flex-start',
              gap: isVertical ? 12 : 14,
              fontFamily: theme.typography.fontHeading,
              fontSize: isVertical ? 54 : 64,
              fontWeight: 800,
              lineHeight: 1.15,
              color: theme.colors.textPrimary,
              textAlign: isVertical ? 'center' : 'left',
            }}
          >
            {words.map((word, wIdx) => {
              const wordSpring = spring({
                frame: Math.max(0, frame - wIdx * 4),
                fps,
                config: theme.springs.snappy,
              });
              const wordY = interpolate(wordSpring, [0, 1], [18, 0], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              });
              return (
                <span
                  key={`${word}-${wIdx}`}
                  style={{
                    display: 'inline-block',
                    opacity: wordSpring,
                    transform: `translateY(${wordY}px)`,
                  }}
                >
                  {word}
                </span>
              );
            })}
          </div>

          {scene.subtext && (
            <p
              style={{
                marginTop: 18,
                fontFamily: theme.typography.fontBody,
                fontSize: isVertical ? 28 : 26,
                lineHeight: 1.45,
                color: theme.colors.textSecondary,
                textAlign: isVertical ? 'center' : 'left',
              }}
            >
              {scene.subtext}
            </p>
          )}
        </div>
      </AbsoluteFill>

      <KaraokeCaption
        words={scene.wordTimings || []}
        isVertical={isVertical}
      />
    </AbsoluteFill>
  );
};
