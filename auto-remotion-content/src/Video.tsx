import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { SceneView } from "./components/SceneView";
import type { Gaya, VideoProps } from "./types";

const DEFAULT_GAYA: Required<Gaya> = {
  background: "#0F172A",
  aksen: "#FACC15",
  teks: "#F8FAFC",
  font: "Poppins, Inter, sans-serif",
};

export const Video: React.FC<VideoProps> = ({ format, naskah, timeline, audioPath, hasAudio }) => {
  const gaya = { ...DEFAULT_GAYA, ...(naskah?.gaya ?? {}) };
  return (
    <AbsoluteFill style={{ backgroundColor: gaya.background }}>
      {timeline.map((scene, i) => (
        <Sequence key={scene.id} from={scene.from} durationInFrames={scene.durationInFrames} name={scene.id}>
          <SceneView scene={scene} index={i} gaya={gaya} format={format} />
        </Sequence>
      ))}
      {hasAudio ? <Audio src={staticFile(audioPath)} /> : null}
    </AbsoluteFill>
  );
};
