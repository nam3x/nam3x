# auto-remotion-content

Pipeline otomatis: `public/naskah.json` → TTS Gemini (Playwright) → Claude Code (skill `remotion-storyteller`) → render Remotion → kirim ke webhook n8n.

## Struktur
| Path | Isi |
|---|---|
| `src/Root.tsx` | Komposisi `ShortVideo` (1080x1920) & `LongVideo` (1920x1080), 30 fps |
| `src/timeline.ts` | Membaca `public/naskah.json` + durasi `public/voiceover.mp3`, membagi durasi ke tiap scene |
| `scripts/generate-tts.js` | Playwright → Gemini → `public/voiceover.mp3` |
| `.claude/skills/remotion-storyteller/` | Skill yang dibaca Claude Code di CI |
| `.github/workflows/pipeline-video.yml` | Workflow `workflow_dispatch` |

## Format `public/naskah.json`
```json
{
  "judul": "…",
  "voiceover": "(opsional) teks lengkap untuk TTS; default = gabungan scenes[].teks",
  "gaya": { "background": "#0F172A", "aksen": "#FACC15", "teks": "#F8FAFC", "font": "Poppins" },
  "scenes": [{ "id": "s1", "judul": "Pembuka", "teks": "…", "durationInSeconds": 4 }]
}
```
`durationInSeconds` hanya bobot; total durasi selalu mengikuti panjang voiceover (+0,5 dtk).

## Secrets GitHub yang wajib
- `ANTHROPIC_API_KEY` — untuk `claude -p`.
- `GEMINI_AUTH_JSON` — storageState Playwright sesi login Google (JSON mentah atau base64). Buat secara lokal:
  ```bash
  npx playwright codegen --save-storage=gemini-auth.json https://gemini.google.com
  # login, tutup browser, lalu:
  base64 -w0 gemini-auth.json   # tempel sebagai secret GEMINI_AUTH_JSON
  ```

## Lokal
```bash
npm ci
npm run dev            # Remotion Studio
npm run tts            # butuh GEMINI_AUTH_JSON
npm run render:short   # atau render:long
```

## Webhook n8n
Workflow mengirim `multipart/form-data`: field `file` (video/mp4), `video_format`, `run_id`, `repository`.
