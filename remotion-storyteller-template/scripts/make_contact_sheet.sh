#!/usr/bin/env bash
# Pratinjau ringan + contact sheet yang mencakup SELURUH video.
# Per adegan diambil 2 frame: setelah animasi masuk selesai (~0.6s) dan menjelang transisi keluar.
# Pemakaian: bash scripts/make_contact_sheet.sh [MainStory|ShortVertical|HighlightVertical]
set -euo pipefail

COMP_ID="${1:-MainStory}"
mkdir -p out/frames
rm -f out/frames/*.jpg

echo "[1/3] Merender pratinjau ringan (skala 0.5) untuk $COMP_ID..."
npx remotion render src/index.ts "$COMP_ID" out/preview.mp4 --scale=0.5 --gl=angle --log=error

echo "[2/3] Menentukan frame inspeksi dari timeline..."
FRAMES=$(python3 - "$COMP_ID" <<'PY'
import json, sys
comp = sys.argv[1]
d = json.load(open("src/timeline.generated.json", encoding="utf-8"))
scenes = d["highlightScenes"] if comp == "HighlightVertical" else d["fullScenes"]
fps = d.get("fps", 30)
picks = []
for s in scenes:
    st, dur = s["startFrame"], s["durationInFrames"]
    picks.append(st + min(dur - 1, round(0.6 * fps)))   # setelah entrance
    picks.append(st + max(0, dur - 14))                  # sebelum exit
print(" ".join(str(f) for f in sorted(set(picks))))
PY
)

i=0
for f in $FRAMES; do
  ffmpeg -y -loglevel error -i out/preview.mp4 -vf "select=eq(n\,$f),scale=480:-2" -frames:v 1 "out/frames/$(printf '%03d' $i).jpg"
  i=$((i+1))
done

COLS=4
ROWS=$(( (i + COLS - 1) / COLS ))
echo "[3/3] Menyusun contact sheet ${COLS}x${ROWS} dari $i frame..."
ffmpeg -y -loglevel error -framerate 1 -i out/frames/%03d.jpg -vf "tile=${COLS}x${ROWS}:padding=6:color=black" -frames:v 1 out/contact_sheet.jpg

echo "Selesai! Periksa out/contact_sheet.jpg (urutan: per adegan [setelah masuk, sebelum keluar])"
