import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile } from 'remotion';
import { StoryScene, SceneItem } from './components/StoryScene';
import { MovingGradient, ColorGrade, GrainVignette } from './components/Layers';
import { theme } from './theme';

/**
 * Adegan disusun back-to-back (tanpa tumpang tindih TransitionSeries) sehingga
 * startFrame di timeline = frame sebenarnya di video. Transisi dibuat oleh
 * animasi masuk/keluar tiap adegan di atas lapisan dasar yang selalu tampil,
 * jadi tidak ada layar hitam dan takarir tetap sinkron dengan voiceover.
 *
 * audioMode:
 *  - "continuous": satu <Audio> utuh dari frame 0 (MainStory, ShortVertical)
 *  - "perScene":   potongan voiceover per adegan (HighlightVertical)
 */
export const StoryComposition: React.FC<{
  scenes: SceneItem[];
  audioPath?: string | null;
  audioMode?: 'continuous' | 'perScene';
}> = ({ scenes, audioPath, audioMode = 'continuous' }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: theme.colors.bgPrimary }}>
      {/* Lapis 1: gradient mesh bergerak, konstan sepanjang video */}
      <MovingGradient />

      {scenes.map((scene) => (
        <Sequence
          key={scene.id}
          from={scene.startFrame}
          durationInFrames={scene.durationInFrames}
          name={scene.id}
        >
          {/* Lapis 2 + 3: media/3D, grafis, takarir */}
          <StoryScene scene={scene} />

          {audioPath && audioMode === 'perScene' && (
            <Audio
              src={staticFile(audioPath)}
              startFrom={scene.audioStartFrame}
              endAt={scene.audioStartFrame + scene.durationInFrames}
            />
          )}
        </Sequence>
      ))}

      {audioPath && audioMode === 'continuous' && <Audio src={staticFile(audioPath)} />}

      {/* Lapis 4 + 5: color grade, grain + vignette */}
      <ColorGrade />
      <GrainVignette />
    </AbsoluteFill>
  );
};
