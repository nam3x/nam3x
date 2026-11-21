import React from 'react';
import { Composition } from 'remotion';
import timelineData from './timeline.generated.json';
import { StoryComposition } from './StoryComposition';
import type { SceneItem } from './components/StoryScene';

const fps = timelineData.fps || 30;
const audioPath = (timelineData as { audioPath?: string | null }).audioPath ?? null;
const fullScenes = timelineData.fullScenes as unknown as SceneItem[];
const highlightScenes = timelineData.highlightScenes as unknown as SceneItem[];
const fullDuration = Math.max(1, timelineData.fullDurationInFrames || 120);
const highlightDuration = Math.max(1, timelineData.highlightDurationInFrames || 1);

export const RemotionRoot: React.FC = () => (
  <>
    {/* Mode B / C — video panjang 16:9 */}
    <Composition
      id="MainStory"
      component={StoryComposition}
      durationInFrames={fullDuration}
      fps={fps}
      width={1920}
      height={1080}
      defaultProps={{ scenes: fullScenes, audioPath, audioMode: 'continuous' as const }}
    />

    {/* Mode A — video pendek 9:16 utuh (semua adegan) */}
    <Composition
      id="ShortVertical"
      component={StoryComposition}
      durationInFrames={fullDuration}
      fps={fps}
      width={1080}
      height={1920}
      defaultProps={{ scenes: fullScenes, audioPath, audioMode: 'continuous' as const }}
    />

    {/* Mode C — highlight 9:16, voiceover dipotong per adegan */}
    <Composition
      id="HighlightVertical"
      component={StoryComposition}
      durationInFrames={highlightDuration}
      fps={fps}
      width={1080}
      height={1920}
      defaultProps={{ scenes: highlightScenes, audioPath, audioMode: 'perScene' as const }}
    />
  </>
);
