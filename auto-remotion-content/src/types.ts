export type Scene = {
  id: string;
  judul?: string;
  teks: string;
  /** Durasi perkiraan (detik). Akan diskalakan agar total = durasi voiceover. */
  durationInSeconds?: number;
};

export type Gaya = {
  background?: string;
  aksen?: string;
  teks?: string;
  font?: string;
};

export type Naskah = {
  judul?: string;
  gaya?: Gaya;
  scenes: Scene[];
};

export type TimedScene = Scene & { from: number; durationInFrames: number };

export type VideoFormat = "short" | "long";

export type VideoProps = {
  format: VideoFormat;
  naskahPath: string;
  audioPath: string;
  naskah: Naskah | null;
  timeline: TimedScene[];
  hasAudio: boolean;
};
