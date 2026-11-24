import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { Gaya, TimedScene, VideoFormat } from "../types";

type Props = { scene: TimedScene; index: number; gaya: Required<Gaya>; format: VideoFormat };

export const SceneView: React.FC<Props> = ({ scene, index, gaya, format }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const isShort = format === "short";

  const enter = spring({ frame, fps, config: { damping: 200 } });
  const exit = interpolate(
    frame,
    [scene.durationInFrames - 8, scene.durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // takarir per kata (karaoke sederhana, dibagi rata sepanjang scene)
  const words = scene.teks.split(/\s+/).filter(Boolean);
  const framesPerWord = Math.max(1, (scene.durationInFrames - 10) / Math.max(1, words.length));

  return (
    <AbsoluteFill
      style={{
        backgroundColor: gaya.background,
        fontFamily: gaya.font,
        justifyContent: "center",
        alignItems: "center",
        padding: isShort ? 90 : 140,
        opacity: exit,
      }}
    >
      {scene.judul ? (
        <div
          style={{
            position: "absolute",
            top: isShort ? "14%" : "12%",
            color: gaya.aksen,
            fontSize: isShort ? 64 : 56,
            fontWeight: 800,
            letterSpacing: 2,
            textTransform: "uppercase",
            transform: `translateY(${(1 - enter) * -40}px)`,
            opacity: enter,
          }}
        >
          {String(index + 1).padStart(2, "0")} · {scene.judul}
        </div>
      ) : null}

      <div
        style={{
          color: gaya.teks,
          fontSize: isShort ? 78 : 72,
          fontWeight: 700,
          lineHeight: 1.25,
          textAlign: "center",
          maxWidth: isShort ? 900 : 1500,
          transform: `scale(${0.92 + enter * 0.08})`,
        }}
      >
        {words.map((w, i) => {
          const active = frame >= i * framesPerWord;
          return (
            <span
              key={i}
              style={{
                color: active ? gaya.aksen : gaya.teks,
                opacity: active ? 1 : 0.55,
                marginRight: "0.28em",
                display: "inline-block",
              }}
            >
              {w}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
