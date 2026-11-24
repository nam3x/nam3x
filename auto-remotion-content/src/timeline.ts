import { getAudioDurationInSeconds } from "@remotion/media-utils";
import { CalculateMetadataFunction, staticFile } from "remotion";
import type { Naskah, TimedScene, VideoProps } from "./types";

export const FPS = 30;
const DEFAULT_SCENE_SECONDS = 4;
const TAIL_SECONDS = 0.5; // ruang napas setelah kata terakhir

const estimateSeconds = (teks: string) =>
  // ±2,9 kata/detik (tempo yang dipakai skill remotion-storyteller)
  Math.max(1.5, teks.trim().split(/\s+/).length / 2.9);

/**
 * Membagi durasi total ke tiap scene secara proporsional terhadap
 * durationInSeconds (atau estimasi jumlah kata bila tidak diisi).
 */
export const buildTimeline = (
  naskah: Naskah,
  totalSeconds: number | null,
  fps: number,
): TimedScene[] => {
  const weights = naskah.scenes.map(
    (s) => s.durationInSeconds ?? estimateSeconds(s.teks ?? "") ?? DEFAULT_SCENE_SECONDS,
  );
  const sumWeights = weights.reduce((a, b) => a + b, 0) || 1;
  const target = totalSeconds ?? sumWeights;
  const totalFrames = Math.max(1, Math.round(target * fps));

  let from = 0;
  return naskah.scenes.map((scene, i) => {
    const isLast = i === naskah.scenes.length - 1;
    const frames = isLast
      ? Math.max(1, totalFrames - from)
      : Math.max(1, Math.round((weights[i] / sumWeights) * totalFrames));
    const timed = { ...scene, from, durationInFrames: frames };
    from += frames;
    return timed;
  });
};

export const calculateVideoMetadata: CalculateMetadataFunction<VideoProps> = async ({
  props,
}) => {
  const res = await fetch(staticFile(props.naskahPath));
  if (!res.ok) {
    throw new Error(`Gagal membaca public/${props.naskahPath} (HTTP ${res.status})`);
  }
  const naskah = (await res.json()) as Naskah;
  if (!Array.isArray(naskah.scenes) || naskah.scenes.length === 0) {
    throw new Error(`public/${props.naskahPath} harus berisi array "scenes" yang tidak kosong`);
  }

  let audioSeconds: number | null = null;
  try {
    audioSeconds = await getAudioDurationInSeconds(staticFile(props.audioPath));
  } catch {
    // voiceover belum ada (mis. saat preview lokal) -> pakai estimasi naskah
    audioSeconds = null;
  }

  const total = audioSeconds !== null ? audioSeconds + TAIL_SECONDS : null;
  const timeline = buildTimeline(naskah, total, FPS);
  const durationInFrames = timeline.reduce((a, s) => a + s.durationInFrames, 0);

  return {
    durationInFrames,
    fps: FPS,
    props: { ...props, naskah, timeline, hasAudio: audioSeconds !== null },
  };
};
