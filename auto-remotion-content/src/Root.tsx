import React from "react";
import { Composition } from "remotion";
import { Video } from "./Video";
import { FPS, calculateVideoMetadata } from "./timeline";
import type { VideoProps } from "./types";

const baseProps = {
  naskahPath: "naskah.json", // public/naskah.json
  audioPath: "voiceover.mp3", // public/voiceover.mp3
  naskah: null,
  timeline: [],
  hasAudio: false,
} satisfies Omit<VideoProps, "format">;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* YouTube Shorts, TikTok, IG Reels */}
      <Composition
        id="ShortVideo"
        component={Video}
        width={1080}
        height={1920}
        fps={FPS}
        durationInFrames={FPS * 30}
        defaultProps={{ ...baseProps, format: "short" } as VideoProps}
        calculateMetadata={calculateVideoMetadata}
      />
      {/* YouTube reguler */}
      <Composition
        id="LongVideo"
        component={Video}
        width={1920}
        height={1080}
        fps={FPS}
        durationInFrames={FPS * 60}
        defaultProps={{ ...baseProps, format: "long" } as VideoProps}
        calculateMetadata={calculateVideoMetadata}
      />
    </>
  );
};
