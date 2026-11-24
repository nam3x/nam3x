---
name: "remotion-storyteller"
description: "Membuat video motion graphic storytelling 2D/3D berbasis Remotion (Shorts 9:16, YouTube 16:9, atau hybrid highlight) dengan takarir karaoke per kata yang sinkron voiceover, termasuk preset stick-figure \"kok bisa\" Cetakinds, 15 preset stickman A1–A8/B1–B7, dan sumber fakta yang tampil di video."
---

# Remotion Storyteller — Director & Production Skill

> **Catatan file pendukung:** Semua file pendukung (`references/`, `assets/theme.ts`, `scripts/`) dilampirkan lengkap di bagian **Lampiran** di bawah. Saat memulai proyek, tulis ulang setiap file lampiran ke path yang sama di root proyek Remotion (mis. `scripts/sync_timeline.py`, `src/theme.ts` dari `assets/theme.ts`) sebelum menjalankan perintah apa pun. Untuk referensi, cukup baca lampirannya — tidak perlu ditulis ke disk.

Skill ini mengatur alur kerja pembuatan video motion graphic storytelling yang padat, natural, sinkron dengan audio/takarir, mendukung objek 3D, dan hemat token.

## ATURAN KERAS: Gerbang Aset Sebelum Render (tidak boleh dilanggar)
Dilarang menjalankan render dalam bentuk APA PUN — pratinjau skala 0.5, `make_contact_sheet.sh`, `npx remotion render`, `npm run render:*`, maupun render frame tunggal (`npx remotion still`) — sebelum KEDUA syarat berikut terpenuhi:

1. **Acuan visual** — salah satu dari:
   - **a. Referensi gambar dari pengguna:** minimal 1 file gambar (foto produk, gambar pendukung, atau referensi gaya), disimpan di `public/images/`. Video referensi dari pengguna juga dihitung: ambil 10–12 frame merata dengan ffmpeg, simpan sebagai `public/images/ref_*.jpg`, lalu ringkas gayanya (dunia, tokoh, palet, posisi takarir, ritme potongan) sebagai style brief; ATAU
   - **b. Style yang disepakati (jika pengguna tidak punya gambar):**
     - Jika pengguna sudah menjelaskan gaya visual di inputnya (mis. "minimalis hitam-emas", "neon futuristik", "kartun flat cerah"), jadikan deskripsi itu acuan. Ringkas kembali menjadi *style brief* singkat dan minta pengguna mengonfirmasinya.
     - Jika pengguna belum menyebut gaya, TAWARKAN 3–4 pilihan style yang cocok dengan topik video (gunakan AskUserQuestion bila tersedia). Tiap pilihan berisi: nama style, palet warna (3–5 hex), tipografi, gaya grafis/ilustrasi, dan nuansa gerak (mis. tenang/cepat/memantul). Pengguna boleh memilih salah satu atau menulis gayanya sendiri.
     - Jika topik berupa fakta unik, sains, "kok bisa", cerita tokoh lucu dengan pelajaran, skenario "bayangkan kalau…", atau tips (umumnya Shorts 9:16), salah satu pilihan WAJIB preset **Stick-figure Kok Bisa (Cetakinds)** (lihat `references/style-stickfigure.md`). Preset ini juga dipakai bila pengguna menyebut "stickman", "animasi doodle", "kepala bulat", atau "seperti video Cetakinds".
     - Jika topik berupa sejarah, peristiwa, konflik, geopolitik, biografi, atau "kenapa/kok bisa X terjadi", salah satu pilihan WAJIB preset **Explainer Sejarah Chibi** (lihat `references/style-explainer-sejarah.md`). Preset ini juga dipakai bila pengguna menyebut "gaya Kok Bisa", "chibi", "countryball", atau "seperti video referensi sejarah".
     - Jika pengguna menyebut kode gaya **A1–A8 atau B1–B7**, "stickman director", atau gaya seperti "pixel theater", "rubber hose", "TV retro", "amber noir", "hitam putih klasik", tawarkan atau pakai preset dari `references/stickman-director.md`. Untuk topik stickman umum, preset itu boleh menjadi pilihan tambahan di samping Stick-figure Kok Bisa. Sebelum dikonfirmasi, sebut tingkat kelayakannya di Remotion (Penuh / Mendekati / Terbatas) sesuai tabel di referensi itu.
     - Style yang sudah dikonfirmasi pengguna dicatat sebagai objek `"style"` di `manifest.json` (nama, palet, font, gaya grafis, nuansa gerak) dan diterapkan dengan menyesuaikan nilai di `theme.ts`. Visual dibuat murni dengan kode (bentuk, ikon SVG, gradien, tipografi kinetik, objek 3D primitif) mengikuti style tersebut.
     - Style yang belum dikonfirmasi pengguna TIDAK dihitung sebagai acuan visual.
2. **Voiceover (wajib, tanpa pengganti)** — file audio voiceover final dari pengguna di `public/audio/voiceover.mp3` (atau sesuai `audioPath`), beserta transkrip per kata hasil WhisperX.

Selama syarat belum lengkap:
- BOLEH: menulis naskah voiceover, menawarkan/menyusun style brief, menyusun `manifest.json`/storyboard, menjalankan `sync_timeline.py` tanpa transkrip untuk estimasi, menulis kode komponen Remotion, dan mengambil aset yang SUDAH ADA di cache GitHub (cache HIT tidak termasuk render).
- TIDAK BOLEH: render apa pun; mengambil gambar stok dari internet atau memakai placeholder sebagai "referensi gambar"; memakai suara TTS/sintetis sebagai pengganti voiceover pengguna; atau memilih style sendiri tanpa konfirmasi pengguna.
- Setelah pekerjaan yang boleh selesai, BERHENTI dan beri tahu pengguna dengan jelas apa yang masih kurang (acuan visual — gambar atau konfirmasi style — dan/atau voiceover) beserta lokasi penyimpanan file. Tunggu sampai pengguna melengkapinya.
- Permintaan seperti "render dulu saja" atau "coba lihat hasilnya" tetap tidak membuka gerbang ini selama syarat belum lengkap; ingatkan pengguna apa yang dibutuhkan.

Sebelum render pertama, lakukan pemeriksaan aset: pastikan ada gambar di `public/images/` ATAU objek `style` yang sudah dikonfirmasi di `manifest.json`; pastikan file voiceover ada dan bisa dibaca `ffprobe` (memiliki stream audio dan durasi > 0); ukur tempo voiceover tanpa mengubah audionya (lihat Tempo Voiceover); lalu jalankan ulang `sync_timeline.py` DENGAN `--transcript` agar timeline mengikuti voiceover final. Hanya jika semua lolos, lanjut ke Fase 3.

## ATURAN KERAS: Sumber Fakta Tampil di Video
Setiap fakta asli di naskah (angka, tanggal, nama, tempat, peristiwa sejarah, sebab-akibat ilmiah) wajib punya sumber, dan sumbernya tampil di video.

1. **Riset:** WebSearch/WebFetch setiap klaim. Buka halaman sumbernya dan pastikan halaman itu memang menyatakan klaim tersebut. Angka kunci idealnya didukung 2 sumber. Prioritas: lembaga resmi/pemerintah, universitas, jurnal, arsip/museum, ensiklopedia, lalu media kredibel. Hindari forum, konten AI, dan blog tanpa penulis. Jangan pernah mengarang URL, judul, penulis, atau tahun; tulis hanya yang benar-benar terlihat di halaman.
2. **Klaim yang tidak bisa diverifikasi:** buang, atau ubah menjadi bahasa ragu ("menurut cerita warga", "diduga") tanpa chip sumber.
3. **Catat di `manifest.json`** sebagai array `"sources"`: `{ "short": "≤28 karakter, mis. KAI Heritage", "year": "", "full": "judul lengkap + penerbit", "url": "...", "claim": "klaim yang didukung", "scenes": ["id adegan saat klaim diucapkan"] }`.
4. **Tampil otomatis di tiga tempat:** (a) komponen `SourceChip`, yaitu pil gelap transparan "Sumber: X · Y" (Poppins 700 ±30 px, fade 0,25 dtk) tepat di bawah takarir selama adegan di `scenes` (vertikal y ≈ 74,8%; 16:9 di atas karaoke); (b) daftar "Sumber:" di end card (maksimal 4, yang terpenting dulu, format "short (year)"); (c) `out/caption.txt` untuk deskripsi unggahan berisi judul, deskripsi, sumber bernomor (`full` + `url`), dan hashtag.
5. **Tokoh/tempat rekaan** (cerita ilustrasi yang memuat fakta asli): isi `"disclaimer": "Tokoh & tempat ilustrasi"` di manifest. Label kecil ini tampil di atas (y ≈ 12,5%) pada 0–3 detik pertama.
6. Topik tanpa fakta (tips perasaan, skenario fiksi) tidak butuh sumber, kecuali bagian yang berupa fakta (mis. "olahraga melepas endorfin" tetap diberi sumber).
7. Naskah diserahkan bersama tabel **klaim → sumber**. Saat pengecekan contact sheet, chip sumber harus muncul tepat saat klaimnya diucapkan.

## Tempo Voiceover: Diatur Lewat Naskah, Audio Tidak Diubah
**ATURAN KERAS: voiceover dari pengguna dipakai apa adanya.** DILARANG mempercepat atau memperlambat VO dengan cara apa pun (`atempo`, `rubberband`, `asetrate`, time-stretch, atau setara), dan DILARANG memangkas jeda/hening di dalamnya (`silenceremove`, potong-sambung `atrim`/`concat`). Durasi video mengikuti durasi VO asli. Trek VO sendiri tidak diolah; yang boleh hanya menambahkan musik dan efek suara DI BAWAH VO (lihat Musik & Efek Suara) dan normalisasi loudness pada mix akhir (Fase 3), karena keduanya tidak mengubah kecepatan maupun timing VO.

Tempo yang enak didengar (**2,7–3,2 kata/detik**; konten energik/Shorts di sisi atas, penjelasan teknis di sisi bawah, tidak di bawah 2,5) dicapai lewat naskah dan arahan pengisi suara, bukan dengan mengolah audio.

1. **Saat menulis naskah (sebelum voiceover direkam):**
   - Kalimat pendek, 6–12 kata per kalimat; buang kata pengisi ("jadi", "nah", "seperti yang kita ketahui", pengulangan).
   - Anggaran kata = durasi target (detik) × 2,9. Contoh: video 45 detik ≈ 130 kata. Jika naskah melebihi anggaran, padatkan — jangan memperpanjang video.
   - Sertakan catatan untuk pengisi suara di atas naskah: "Baca dengan tempo sedang-cepat dan bersemangat, jeda singkat antar kalimat, tanpa jeda panjang."
2. **Setelah voiceover diterima, ukur temponya saja** dari transkrip: kata/detik = jumlah kata ÷ (waktu kata terakhir − waktu kata pertama), serta catat jeda antar kata yang lebih dari 0,6 detik. Saat menghitung kata, angka dihitung sesuai jumlah kata yang diucapkan ("1864" = 4 kata), bukan satu token. Salin file pengguna ke `public/audio/voiceover.mp3` tanpa diolah.
3. **Jika tempo di bawah 2,6 kata/detik atau banyak jeda panjang**, JANGAN mengubah audio. Laporkan ke pengguna dalam satu kalimat (tempo terukur dan durasi VO), lalu tawarkan dua pilihan: lanjut dengan VO apa adanya (video mengikuti durasinya), atau rekam ulang dengan arahan tempo lebih cepat. Jika pengguna tidak ada untuk ditanya, lanjut dengan VO apa adanya.
4. Untuk mengisi jeda panjang secara visual, jaga layar tetap hidup (micro-motion, kamera bergerak, elemen pop-in) — bukan dengan memotong audio.

## Musik & Efek Suara (boleh ditambahkan, tidak boleh lebih keras dari VO)
Skill boleh menambahkan musik latar dan efek suara (SFX) sesuai kebutuhan adegan, tanpa perlu ditanyakan dulu.
- **Sumber:** pakai file musik/SFX dari pengguna bila ada. Jika tidak ada, buat sendiri secara prosedural dengan kode (ffmpeg `sine`/`anoisesrc`/`aevalsrc` atau numpy → WAV), misalnya whoosh dari noise yang di-sweep, pop/klik dari sinus pendek dengan envelope, ding, langkah kaki, detak jam, dan bed musik sederhana (pad akor + ketukan lembut). Jangan mengunduh musik/SFX dari internet dan jangan meniru lagu yang ada.
- **Kapan dipakai:** SFX untuk momen yang terlihat di layar, misalnya pop-in label, centang, coretan, notifikasi HP, pintu, langkah, transisi, dan tombol ikuti. Paling banyak ±1 SFX per 1–2 detik, supaya tidak ramai. Musik mengikuti suasana (tegang, hangat, lucu) dan boleh berganti di pergantian babak.
- **Sinkron:** waktu SFX diambil dari frame yang sama dengan animasinya (`wf()`/`startFrame` adegan + offset), lalu dipasang sebagai `<Sequence from><Audio src volume/></Sequence>` di Remotion, atau di-mix dengan ffmpeg `adelay`.
- **ATURAN KERAS loudness:** musik dan SFX tidak boleh lebih keras dari VO.
  - Musik di bawah VO dengan selisih ±18–22 LU, dan diturunkan lagi (ducking, mis. `sidechaincompress` dengan VO sebagai sidechain, atau volume rendah statis) selama ada ucapan.
  - Puncak SFX minimal 6 dB di bawah puncak VO di sekitarnya.
  - Fade-in/out musik 0,5–1 detik.
  - Setelah mix, cek dengan `ebur128`/`astats` pada trek terpisah: loudness musik dan SFX harus jelas di bawah loudness VO. Kalau tidak, turunkan musik/SFX, bukan menaikkan atau mengubah VO.
- Laporkan singkat di akhir musik/SFX apa yang dipakai, dan tawarkan versi tanpa musik bila pengguna mau.

## Cache Aset PNG di GitHub (pakai ulang, jangan render ulang)
**Repo cache aset:** `nam3x/remotion-story-template`, branch `asset-cache`, folder `asset-cache/` — tambahkan `--branch asset-cache --subdir asset-cache` di setiap perintah `asset_cache.py` (get/put/init). Jika repo belum terhubung ke sesi, hubungkan dengan akses push lalu clone dangkal sebelum get/put. Versi `asset_cache.py` di Lampiran sudah mendukung `--branch`, `--subdir`, dan `deps` (teruji: branch dibuat otomatis bila belum ada, perubahan file `deps` mengubah kunci cache). Jika `scripts/asset_cache.py` di repo tersebut lebih baru, pakai versi repo; jika repo tidak terjangkau, pakai versi Lampiran.

- **Yang di-cache:** aset PNG statis yang dibuat skill — background, ilustrasi, kartu grafis, frame objek 3D, logo/teks yang dirender sebagai gambar. Video MP4 final TIDAK di-cache dan tetap dirender tiap proyek (animasi dihitung per frame).
- **Bukan untuk file pengguna:** referensi gambar, voiceover, dan transkrip dari pengguna TIDAK diunggah ke repo kecuali pengguna secara eksplisit memintanya.
- **Repo wajib private.** Saat pertama kali dipakai jalankan `python3 scripts/asset_cache.py init --repo <REPO>`: membuat repo private jika belum ada, atau memperingatkan jika repo ternyata public (jika public, berhenti dan tanyakan pengguna sebelum mengunggah apa pun).
- **Alur per aset** (tulis `spec.json` per aset: `name`, `project`, `component`, `props`, `style`, `width`, `height`, dan `deps` = daftar file kode lain yang ikut menentukan tampilan, mis. `src/components/Art.tsx`, agar perubahan gambar ikut mengubah kunci cache):
  1. `python3 scripts/asset_cache.py get --repo <REPO> --spec spec.json --dest public/cache/`
  2. **HIT (exit 0):** pakai file di `public/cache/<name>.png` lewat `staticFile()`; JANGAN render ulang aset itu.
  3. **MISS (exit 3):** jika Gerbang Aset sudah terbuka, render dengan `npx remotion still`, lalu langsung simpan otomatis: `python3 scripts/asset_cache.py put --repo <REPO> --spec spec.json --file <png>`.
- Kunci cache dihitung otomatis dari komponen + isi file kodenya + props + style + ukuran; jika salah satu berubah, aset dianggap baru. Jangan menghitung atau mengarang kunci sendiri.
- Jika repo tidak bisa diakses atau push gagal: lanjutkan dengan aset lokal, jangan berhenti, dan laporkan ke pengguna di akhir bahwa aset belum tersimpan ke GitHub.
- Di akhir proyek laporkan singkat: berapa aset diambil dari cache (HIT) dan berapa yang baru dirender lalu disimpan.

## Fase 0: Gerbang Konfirmasi (WAJIB DIJALANKAN PERTAMA)
Sebelum menyusun naskah, storyboard, atau menulis satu baris pun kode, ajukan pertanyaan konfirmasi singkat kepada pengguna untuk memilih mode output:
1. **Mode A — Video Pendek Saja (9:16 | 1080x1920 | 15–60 detik):** Ritme cepat untuk YouTube Shorts / Reels / TikTok.
2. **Mode B — Video Panjang Saja (16:9 | 1920x1080):** Alur narasi penuh untuk YouTube reguler.
3. **Mode C — Hybrid (9:16 Full 8–10 menit + 9:16 Short 60 detik–3 menit):** 
   - **ATURAN TERKUNCI (ditetapkan pengguna; jangan diubah, dilonggarkan, atau ditafsirkan ulang tanpa permintaan eksplisit pengguna):**
     - **Full:** vertikal 9:16 (1080x1920), durasi **8–10 menit**. Anggaran naskah ±1.400–1.750 kata (durasi × 2,9). Dirender dengan komposisi `ShortVertical` (timeline penuh).
     - **Short:** vertikal 9:16 (1080x1920), durasi **minimal 60 detik, maksimal 3 menit**, diambil dari adegan `"highlight": true` dengan basis komponen yang sama (komposisi `HighlightVertical`).
     - Hybrid TIDAK memakai 16:9 kecuali pengguna memintanya.

*(Tanyakan juga apakah pengguna sudah menyiapkan file voiceover/audio atau ingin dibuatkan naskah terlebih dahulu, dan apakah pengguna punya referensi gambar. Jika tidak punya gambar, pakai gaya yang disebut pengguna di inputnya sebagai style brief untuk dikonfirmasi, atau tawarkan 3–4 pilihan style. Jika **Repo cache aset** masih `BELUM DIATUR`, tanyakan juga nama repo GitHub untuk cache. Sampaikan sejak awal bahwa video baru akan dirender setelah acuan visual (gambar atau style yang dikonfirmasi) DAN voiceover diterima — lihat Aturan Keras: Gerbang Aset Sebelum Render).*

---

## Fase 1: Perencanaan, Storyboard & Sinkronisasi Takarir (`manifest.json`)
- Baca `references/story-beats.md` untuk pola babak narasi dan aturan *safe zone*.
- **Larangan Matematika Token:** Jangan pernah menghitung nomor *frame* atau milidetik secara manual di dalam penalaran, dan **jangan menulis `durationInFrames`** di manifest. Tulis `captionText` (kalimat voiceover adegan itu), `anchor` opsional (2–4 kata pertama yang diucapkan di adegan itu; default = 3 kata pertama `captionText`), dan tingkat energi (`T1` tenang, `T2` transisi/penekanan, `T3` klimaks).
- **Audio:** simpan voiceover di `public/audio/voiceover.mp3` dan isi `"audioPath": "audio/voiceover.mp3"` di manifest. Transkrip per kata dibuat dengan WhisperX (`segments[].words[]` atau `word_segments[]`). Jika WhisperX atau unduhan model diblokir jaringan, pakai `faster-whisper` (`word_timestamps=True`, `language="id"`) dengan output format `segments[].words[]` yang sama; decode audio lewat ffmpeg ke array 16 kHz jika `av.open` error. Jika unduhan model Whisper juga diblokir (HuggingFace/OpenAI tidak bisa diakses), buat transkrip dengan menyelaraskan teks `captionText` ke audio: deteksi jeda (`silencedetect`), pasangkan setiap batas kalimat ke jeda yang paling cocok durasinya (dynamic programming berdasarkan jumlah suku kata), lalu bagikan waktu kata per suku kata di dalam kalimat. Tulis hasilnya dalam format `segments[].words[]` dan beri tahu pengguna bahwa waktu per kata adalah perkiraan. Selaraskan dua tingkat: batas kalimat dicocokkan ke jeda ≥0,25 detik, lalu batas koma ke jeda ≥0,12 detik di dalam kalimat (jika jeda kurang, bagi waktu per suku kata). Hitung suku kata sesuai ucapan, bukan tulisan: angka digit ("2025" = dua-ri-bu-dua-pu-luh-li-ma = 8), singkatan ("AI" = 2), dan kata Inggris ("scroll" = 1) diberi override. Setelah selaras, cek laju suku kata per kalimat (biasanya 5–6 suku/detik). Kalimat yang lajunya menyimpang jauh dari kalimat lain berarti batasnya tergeser ke jeda yang salah; pindahkan batas ke jeda yang membuat laju kalimat-kalimat di sekitarnya konsisten. **Jika pengguna mengirim file SRT**, jangan menyelaraskan ulang per jeda frasa (cara itu bisa memampatkan kata sampai durasinya hampir nol): pakai waktu tiap baris SRT sebagai batas kalimat, rapikan tepinya dengan jeda ≥0,12 detik, lalu bagi waktu kata secara proporsional per suku kata (koma/titik dua diberi bobot jeda ±1,5 suku). Jika setelah tepi dirapikan laju baris itu melebihi ±6,3 suku/detik, berarti jeda yang terdeteksi keliru (biasanya awal kalimat yang diucapkan pelan), jadi pakai waktu asli SRT. Satu baris SRT cocok dijadikan satu adegan (±3–5 detik) agar ritme potongan mengikuti video referensi.
- **Perbaikan transkrip:** Whisper sering memecah kata berulang ("Tiba" + "-tiba") sehingga anchor gagal ditemukan; gabungkan potongan berawalan `-` sebelum `sync_timeline.py`. Setelah sync, pakai ejaan `captionText` untuk teks takarir (waktu tetap dari transkrip) agar salah dengar (mis. "berfikir", "print kipia") tidak tampil di layar. Segera setelah transkrip ada, jalankan pemeriksaan **Tempo Voiceover** (hanya mengukur dan melaporkan; audio tidak diubah).
- **Verifikasi sinkron takarir:** setelah sync, pilih 4–6 kata kunci yang tersebar (tahun, nama, angka) dan cocokkan ke audio dengan mentranskripsi potongan 2 detik di sekitar waktu kata itu (Whisper apa pun yang tersedia). Kata itu harus terdengar di potongan tersebut. Pemeriksaan ini pernah menemukan takarir video "stasiun-pertama" muncul 1–3,5 detik lebih awal dari suaranya, sementara penyelarasan jeda + suku kata justru tepat. Jika HuggingFace diblokir, model Whisper ONNX bisa diambil dari rilis GitHub `k2-fsa/sherpa-onnx` (tag `asr-models`, mis. `sherpa-onnx-whisper-small.tar.bz2`) lalu dijalankan dengan `pip install sherpa-onnx`. Model ini tidak memberi waktu per kata, jadi dipakai untuk verifikasi potongan pendek; waktu kata tetap dari penyelarasan jeda.
- **Naskah:** ikuti anggaran kata dan aturan kalimat pendek di bagian **Tempo Voiceover** agar voiceover tidak bertele-tele, dan tulis dengan **Gaya Naskah Retensi** di bawah.

### Gaya Naskah Retensi (bikin penasaran sampai habis)
Setiap naskah ditulis supaya penonton tidak swipe dan menonton sampai akhir.
1. **Hook di kalimat pertama (≤12 kata, 0–3 detik):** langsung ke kontradiksi, klaim mengejutkan, atau pertanyaan yang taruhannya jelas. Contoh: "Mantan paling menyesal bukan saat kamu marah, tapi saat kamu melakukan ini." Dilarang membuka dengan salam, perkenalan, atau "di video ini kita akan…".
2. **Buka loop:** di 5 detik pertama, janjikan sesuatu yang baru dijawab di akhir ("…dan langkah terakhir paling sering gagal"). Jangan bocorkan jawabannya di tengah.
3. **Re-hook tiap 8–12 detik:** pakai kalimat pemancing seperti "Tapi ini belum cukup.", "Nah, di sinilah kebanyakan orang salah.", atau penanda progres ("Langkah kedua…"). Video 60 detik minimal punya 3 re-hook. Tandai re-hook dengan `*` di naskah agar pengisi suara membacanya lebih pelan dan menekan.
4. **Naik bertahap:** urutkan poin dari yang paling ringan ke yang paling kuat. Twist atau fakta terbesar ditaruh di sekitar 75–85% durasi, sebelum CTA.
5. **Konkret dan personal:** pakai angka, nama, tempat, dan detail spesifik. Sapa penonton langsung ("kamu"/"lo", sesuai gaya pengguna). Tunjukkan konflik atau taruhannya.
6. **Payoff jujur:** semua yang dijanjikan hook harus terjawab di video. Jangan pakai clickbait palsu, karena penonton yang merasa tertipu langsung swipe dan itu merusak retensi.
7. **Ending yang memutar ulang:** kalimat terakhir sebelum CTA menutup loop dan menggemakan kata kunci hook, supaya replay terasa mulus. CTA pengguna ditaruh setelah payoff, bukan di tengah.
8. **Pancing komentar (opsional):** satu pertanyaan opini dua pilihan tepat sebelum CTA ("Kamu tim move on diam-diam, atau tim pamer?").
9. **Teks layar di frame pertama** mengulang inti hook (3–6 kata), supaya penonton yang menonton tanpa suara tetap tertahan.

**Kerangka naskah dari video referensi** (pilih satu sesuai topik dan sebut pilihannya ke pengguna, tidak perlu ditanyakan):
- **A. Paradoks / "kok bisa"** (survivorship bias pesawat, Tembok Besar Cina, koboi "never draw first", SPBU): hook berupa paradoks yang dinyatakan sebagai fakta ("[Subjek] ini [melakukan hal mustahil] tanpa [syarat wajar]") dengan aksi di frame 0 → penempatan waktu/tempat dalam satu kalimat pendek ("Perang Dunia Kedua, tahun 1943.") → logika umum yang terdengar benar, ditutup "Masuk akal, kan?" → tokoh aneh/ahli membantah, orang lain menganggapnya gila, kata kunci diulang sebagai pertanyaan ("Tunggu… tidak pernah kena?") → mekanisme dengan "Nah, begini masalahnya." + analogi sehari-hari (HP jatuh dari meja tertangkap refleks); ini shot penjelas terpanjang → nama konsep + angka konkret → payoff yang menggemakan kata kunci hook, kalimat terakhir pendek bertenaga ("Cukup satu kunci.").
- **B. Cerita tokoh dengan running gag** (SPBU "mulai dari nol", desa yang mematikan lampu saat hujan): tokoh lokal (pengawas, ojol, Pak RT, warga baru dari kota), dialog dalam kutip, satu kalimat khas diulang 3–4 kali lalu dipakai lagi sebagai punchline, boleh ditutup twist komedi. Fakta ilmiahnya bersumber, tokohnya rekaan, jadi isi `disclaimer`.
- **C. Skenario "Bayangkan…"** (internet mati sebulan): "Bayangkan besok pagi kamu…" → tahapan waktu ("Hari pertama… Hari kedua… Minggu pertama… Tapi di minggu kedua…") dengan perubahan nada di tengah (kacau → hangat), ditutup pertanyaan dua pilihan.
- **D. Fakta bertahap / tips** (stasiun pertama, Italian brainrot, mantan): penanda urutan ("Pertama/Kedua/Ketiga", "Jam pertama/Sore/Malam", tanggal), nama, tempat, dan angka spesifik, lalu satu kalimat moral singkat sebelum CTA.
- **E. Lima tahap retensi** (cocok untuk sains, psikologi, bisnis, dan pengembangan diri; dari stickman-video-director): hook berupa pertanyaan berlawanan intuisi atau paradoks visual → patahkan anggapan umum dalam satu kalimat → buka mekanisme tersembunyi → kebenaran inti (momen "aha") → punchline dan satu pertanyaan diskusi. Untuk preset A3, A7, dan B4 pakai setup → eskalasi → payoff ironis tanpa pertanyaan diskusi; untuk B7 tutup dengan renungan.
- Untuk semua kerangka: fragmen boleh dipakai untuk menekan ("Bukan sejam. Sebulan penuh."); kata re-hook yang terbukti dipakai referensi adalah "Tapi…", "Tunggu…", "Nah…", "Masalahnya…", "Sampai suatu pagi…"; setiap angka, tahun, dan nama tempat adalah momen visual (cap tahun, angka bergulir, papan nama). Register dipilih satu dan konsisten: santai-gaul untuk cerita lucu, baku-ringan untuk sejarah/sains. Untuk brand Cetakinds, CTA ditulis persis **"Pencet tombol ikuti buat tambah wawasan bareng Cetakinds."**, dan kata "Pencet" menjadi jangkar end card.

Sebelum menyerahkan naskah, cek juga bahwa setiap klaim fakta punya sumber terverifikasi (lihat Aturan Keras: Sumber Fakta Tampil di Video), lalu sertakan tabel klaim → sumber. Sebelum menyerahkan naskah, cek dulu: hook ≤12 kata di kalimat pertama; ada loop yang dibuka di awal dan ditutup di akhir; ada ≥3 re-hook untuk 60 detik; twist di 75–85%; semua janji hook terpenuhi; dan naskah masih dalam anggaran kata. Saat menyerahkan, jelaskan singkat letak hook, loop, re-hook, dan twist-nya.
- **Penandaan Hybrid & 3D:**
  - Jika pengguna memilih **Mode C**, tandai adegan paling kuat dengan `"highlight": true` sampai total durasi highlight 60–180 detik (cek `highlightDurationInFrames` dari `sync_timeline.py`). Pilihan highlight wajib membentuk cerita utuh yang berdiri sendiri: hook, buildup inti, twist/payoff, dan penutup. Jika total di luar 60–180 detik, tambah/kurangi adegan highlight; jangan mengubah audio.
  - Jika adegan menggunakan objek 3D, set `"visualType": "3d-showcase"` dan isi `"modelPath": "models/nama-file.glb"`.
- Jalankan skrip lokal (0 token penalaran). Skrip mencocokkan anchor ke transkrip: adegan mulai tepat saat anchor-nya diucapkan dan berakhir saat adegan berikutnya mulai, lalu memetakan takarir karaoke per kata dan `audioStartFrame` untuk potongan highlight:
  `python3 scripts/sync_timeline.py --manifest manifest.json --transcript transcript.json`
  Tanpa voiceover (naskah dulu): hilangkan `--transcript`; durasi diperkirakan dari jumlah kata `captionText`. Jalankan ulang dengan transkrip setelah audio jadi.
- Baca baris `[WARN]` dari skrip: anchor tidak ditemukan berarti teks manifest berbeda dari ucapan — perbaiki `anchor`, jangan menghitung frame sendiri.

## Fase 2: Implementasi Kode Remotion (2D, 3D & Karaoke Captions)
- Baca `references/motion-2d.md` sebelum menulis komponen 2D, dan baca `references/motion-3d.md` hanya jika ada adegan `"visualType": "3d-showcase"`.
- Jika style yang dikonfirmasi adalah **Explainer Sejarah Chibi**, baca `references/style-explainer-sejarah.md` sebelum menyusun manifest dan sebelum menulis komponen; aturan di sana (struktur babak, kartu teks, grading per suasana, pustaka aset) berlaku di atas aturan umum, kecuali aturan timeline back-to-back dan Gerbang Aset yang tetap tidak boleh dilanggar.
- Jika style yang dikonfirmasi adalah **Stick-figure Kok Bisa (Cetakinds)**, baca `references/style-stickfigure.md` sebelum menyusun manifest dan menulis komponen. Aturan di sana berlaku di atas aturan umum, kecuali timeline back-to-back, Gerbang Aset, dan aturan loudness yang tetap tidak boleh dilanggar.
- Jika style yang dikonfirmasi adalah preset **stickman A1–A8 / B1–B7** (`style.preset` diawali `stickman-`), baca `references/stickman-director.md` sebelum menyusun manifest dan menulis komponen. Aturan sutradara bersama dan aturan preset di sana berlaku di atas aturan umum, kecuali Gerbang Aset, voiceover pengguna tanpa TTS, timeline back-to-back, Sumber Fakta, dan aturan loudness yang tetap tidak boleh dilanggar.
- Komponen sumber selalu dibuat bila manifest punya `sources`: `SourceChip` (dirender di `StoryComposition` di atas lapis 3, membaca `scenes` dari timeline sehingga ikut terpotong benar di HighlightVertical), daftar sumber di end card, dan `Disclaimer` bila `disclaimer` diisi. Setelah render final, tulis `out/caption.txt` dari `sources`.
- Gunakan `assets/theme.ts` sebagai satu-satunya sumber variabel warna, tipografi, *easing*, dan *spring presets*.
- **Timeline back-to-back, tanpa `TransitionSeries`:** adegan dipasang dengan `<Sequence from={scene.startFrame}>`. Transisi tumpang tindih memendekkan video dan membuat takarir tertinggal dari suara; transisi dibuat oleh animasi masuk/keluar tiap adegan di atas lapis dasar yang konstan.
- **Audio:** `MainStory`/`ShortVertical` memakai satu `<Audio>` utuh; `HighlightVertical` memakai `<Audio startFrom={audioStartFrame} endAt={...}>` per adegan. Jangan hapus logika ini.
- Di dalam adegan, pakai `scene.durationInFrames` (bukan `useVideoConfig().durationInFrames`) untuk exit, Ken Burns, dan rotasi 3D.
- **Single Source, Dual Aspect Ratio:** Gunakan `useVideoConfig()` (`const isVertical = height > width;`) di dalam komponen adegan agar proyeksi 16:9 dan 9:16 berbagi komponen yang sama.
- **Takarir Karaoke (`KaraokeCaption.tsx`):** Render sorotan kata aktif di atas *safe zone* bawah (minimal 18% dari bawah pada mode vertikal). Kelompokkan kata per baris berdasarkan jumlah karakter (±22), bukan jumlah kata tetap, agar tidak ada kata yatim di baris kedua.
- **Takarir ikut video referensi:** jika pengguna mengirim video referensi, tiru gaya takarirnya dari frame referensi: jumlah kata per tampilan (mis. satu kata), font, huruf kapital atau apa adanya, tanda baca ikut tampil atau tidak, dan posisinya. Jangan pakai gaya takarir proyek sebelumnya. Takarir tetap di atas watermark dan di luar 15% area bawah.
- **Kartu overlay HTML** yang diposisikan dengan `left` + `translate(-50%)` wajib diberi `width` tetap (dengan `boxSizing: border-box`), karena tanpa itu lebarnya menyusut dan teks terlipat. Di adegan 3D, jangan taruh label overlay di atas papan nama di dalam adegan; geser papannya lebih jauh atau hilangkan tulisannya di adegan close-up.
- **Improvisasi set dan model:** skill boleh menambahkan dekor pendukung supaya dunia terasa hidup dan masuk akal, tanpa perlu ditanyakan dulu. Contoh:
  - Ruang kantor: meja dengan monitor dan keyboard, kursi, tanaman pot, rak arsip, papan tulis, jam dinding, dispenser air, lampu, poster.
  - Kamar: kasur, meja belajar, rak buku, karpet.
  - Jalan: tiang listrik, pohon, motor parkir, warung.
  Syaratnya, dekor sesuai naskah dan suasana, tidak menutupi tokoh atau label utama, area tengah tetap lega untuk subjek, tidak memakai logo atau merek nyata, dan tetap ringan untuk dirender (primitif low-poly, tanpa model berat).
- **Logika fisik tokoh dan benda (tidak menabrak, tidak tembus):**
  - Setiap benda padat di adegan dicatat footprint-nya (kotak XZ: pusat + setengah lebar/dalam). Tokoh punya radius ±0,35 unit.
  - Posisi diam tokoh harus berjarak ≥ radius + setengah ukuran benda + 0,1 dari setiap benda. Kalau di depan meja, tokoh berdiri atau duduk di sisi yang benar, bukan di dalam mejanya.
  - Jalur jalan tokoh direncanakan memutari benda (titik belok/waypoint), dan diperiksa dengan fungsi sederhana sebelum render: sampling posisi tiap ±5 frame lalu pastikan tidak ada yang masuk ke footprint benda atau ke tokoh lain (jarak antar tokoh ≥ 0,7). Kalau ada yang bentrok, ubah jalur atau geser bendanya; jangan dibiarkan tembus.
  - Pose berinteraksi harus menempel dengan wajar: duduk tepat di kursi (pinggul di tinggi dudukan), tangan di permukaan meja, barang yang dipegang ikut bergerak bersama tangan, dan barang yang diletakkan berada tepat di atas permukaan (y = tinggi permukaan + setengah tinggi barang), tidak melayang atau terbenam.
  - Benda yang ada di depan tokoh dari sudut kamera boleh menutupi sebagian tubuhnya (oklusi alami), tetapi tidak boleh menembus atau menyatu dengan tubuhnya.
  - Di contact sheet, tambahkan 1 frame di tengah setiap gerakan jalan untuk memeriksa tabrakan.
- **Headline vertikal:** maksimal ±90px agar headline 3–4 kata muat satu baris; headline 2 baris di 104px menabrak ilustrasi di area tengah.
- **Aturan Keras Anti-Kosong:**
  - Wajib komposisi 5 lapis. Lapis 1, 4, 5 (`MovingGradient`, `ColorGrade`, `GrainVignette` di `components/Layers.tsx`) dirender sekali di `StoryComposition`; lapis 2–3 (media/`<ThreeStage>`, grafis + karaoke) ada di `StoryScene`.
  - Masuk multi-properti (`opacity` + geser posisi + `scale`) dengan `spring()`, *staggered* 3–6 frame antar elemen/kata.
  - Wajib *micro-motion* gelombang sinus saat elemen diam dan efek *Ken Burns* pada foto statis.

## Fase 3: Inspeksi Visual & Render Hemat Token
- **Prasyarat wajib:** Fase ini hanya boleh dimulai jika acuan visual (referensi gambar atau style yang dikonfirmasi pengguna) dan voiceover dari pengguna sudah lolos pemeriksaan aset (lihat Aturan Keras: Gerbang Aset Sebelum Render). Jika belum, jangan jalankan satu pun perintah di bawah ini; minta yang kurang kepada pengguna.
- Sebelum render apa pun, cek dulu setiap aset PNG statis ke cache GitHub (lihat Cache Aset PNG di GitHub); hanya aset yang MISS yang dirender, lalu disimpan ke cache.
- Saat memeriksa contact sheet, pastikan juga chip sumber muncul di adegan yang berisi klaim, teksnya tidak terpotong, dan daftar sumber di end card terbaca (≥ 34 px di 1080 px).
- Saat memeriksa contact sheet, cocokkan juga hasilnya dengan acuan visual (gambar referensi atau style brief): palet, tipografi, dan nuansa gerak harus sesuai.
- Jalankan pratinjau ringan (skala 0.5) + 1 gambar *contact sheet* yang mencakup **seluruh** video (2 frame per adegan: setelah animasi masuk, dan menjelang keluar):
  `bash scripts/make_contact_sheet.sh MainStory` (atau `ShortVertical` / `HighlightVertical`)
- Periksa satu gambar `out/contact_sheet.jpg` untuk memastikan tidak ada teks terpotong, elemen bertabrakan, atau *safe zone* bawah yang tertutup (maksimal 2 kali siklus perbaikan).
- Render final 1080p 30fps sesuai mode:
  - Mode A: `npm run render:vertical` (komposisi `ShortVertical`)
  - Mode B: `npm run render:full` (komposisi `MainStory`)
  - Mode C: `npm run render:vertical` (Full 9:16, komposisi `ShortVertical`, 8–10 menit) lalu `npm run render:short` (Short 9:16, komposisi `HighlightVertical`, 60 detik–3 menit). Verifikasi kedua durasi dengan `ffprobe`.
- Verifikasi hasil dengan `ffprobe`: durasi file = `fullDurationInFrames / fps` dan ada stream audio jika `audioPath` diisi.
- Adegan `@remotion/three` di mesin tanpa GPU (2 CPU) butuh ±1,5 detik per frame 1080x1920: jalankan render final di latar belakang dan pantau lognya; untuk contact sheet, bundle sekali (`npx remotion bundle`) lalu render frame inspeksi dengan `npx remotion still <folder-bundle>` (3 paralel) alih-alih pratinjau video penuh. Simpan frame inspeksi di folder baru tiap siklus, jangan menghapus isi folder dengan wildcard.
- Di adegan 3D, jaga kamera minimal ±3 unit dari tokoh terdekat dan di luar deretan rumah; tokoh yang berjalan/antre jangan sampai melintas di depan lensa (kepala raksasa menutup layar).
- Jika unduhan Chrome headless atau font dari internet diblokir: arahkan Remotion ke Chrome lokal lewat `Config.setBrowserExecutable(...)` di `remotion.config.ts` (cari `chrome-headless-shell` di sistem), dan ambil file font dari paket npm `@fontsource/*` ke `public/fonts/`, lalu muat dengan `FontFace` + `delayRender`.
- Setelah render final, ukur loudness dan normalkan ke −14 LUFS (`loudnorm=I=-14:TP=-1:LRA=11`, video di-copy) bila meleset lebih dari 1 LU.
- Semua paket `remotion` dan `@remotion/*` wajib versi yang persis sama; untuk naik versi pakai `npx remotion upgrade`, jangan edit satu per satu.

## Fase 4: Evaluasi & Usulan Upgrade Skill (setelah video final diserahkan)
Skill ini tidak boleh mengubah dirinya sendiri secara diam-diam. Perbaikan skill hanya lewat usulan yang disetujui pengguna.

1. **Catat evaluasi proyek** (singkat, maksimal 5 poin) setelah render final diserahkan:
   - Masalah teknis yang muncul dan cara memperbaikinya (mis. teks terpotong, takarir tidak sinkron, anchor tidak ditemukan, render gagal, versi paket bentrok, cache gagal push).
   - Revisi yang diminta pengguna, terutama yang diminta lebih dari sekali atau yang kemungkinan berulang di proyek lain.
   - Preferensi yang dinyatakan pengguna (style favorit, kecepatan gerak, tempo voiceover, posisi takarir, panjang video, gaya naskah).
   - Langkah dalam skill ini yang ternyata salah, tidak jelas, atau membuang waktu.
2. **Saring:** hanya jadikan usulan hal yang (a) berlaku umum untuk proyek video berikutnya, bukan khusus satu video, dan (b) bersumber dari kejadian nyata di proyek ini atau ucapan pengguna — bukan tebakan. Jika tidak ada yang layak, cukup sampaikan evaluasi singkatnya dan jangan buat usulan.
3. **Usulkan upgrade:** jika ada yang layak, tampilkan usulan perubahan skill ini dengan tool `propose_skills` (kind `improvement`, target `remotion-storyteller`) berisi `edits` yang tepat sasaran — menambah atau mengubah aturan di bagian yang relevan, bukan menulis ulang seluruh skill. Jelaskan ke pengguna dalam 1–3 kalimat apa yang diubah dan alasannya.
4. **Batasan usulan:**
   - JANGAN mengusulkan pelonggaran atau penghapusan *Aturan Keras: Gerbang Aset Sebelum Render* kecuali pengguna sendiri yang secara eksplisit memintanya.
   - JANGAN mengusulkan perubahan apa pun pada *ATURAN TERKUNCI* Mode C (format 9:16, Full 8–10 menit, Short 60 detik–3 menit) kecuali pengguna sendiri yang secara eksplisit memintanya.
   - JANGAN memasukkan data pribadi, kredensial, token, atau isi aset pengguna (naskah lengkap, file audio) ke dalam skill.
   - Maksimal 1 kartu usulan per proyek; gabungkan semua perubahan ke dalam satu kartu.
5. Keputusan sepenuhnya di tangan pengguna: jika pengguna tidak menyimpan kartu, jangan ulangi usulan yang sama kecuali pengguna mengangkatnya lagi.

---

# Lampiran

## Lampiran: `references/story-beats.md`

````markdown
# Panduan Pola Adegan Storytelling & Safe Zone

## 1. Struktur 4 Babak Narasi
1. **Hook (0–3 detik pertama):** Pertanyaan memancing, fakta mengejutkan, atau visual kontras. Wajib langsung bergerak di frame 0 tanpa layar kosong.
2. **Setup / Konteks:** Penjelasan latar belakang masalah atau sejarah singkat dengan diagram bertahap / B-roll / objek 3D.
3. **Puncak Informasi (Climax):** Data utama, perbandingan skala, atau demonstrasi inti (energi `T3`).
4. **Resolusi / CTA:** Kesimpulan ringkas dan ajakan bertindak yang bersih.

## 2. Batas Kepadatan & Safe Zone
- **Aturan 7 Kata:** Headline utama maksimal 7 kata per adegan; teks pendukung maksimal 15–20 kata.
- **Mode Vertikal (9:16 — 1080x1920):**
  - Pusatkan teks utama dan objek 3D di area tengah (Y: 22% hingga 68%).
  - Letakkan **Takarir Karaoke** pada posisi `bottom: 18%` agar tidak pernah tertutup tombol UI Shorts/Reels/TikTok di **15% area terbawah**.
- **Mode Horizontal (16:9 — 1920x1080):**
  - Gunakan aturan sepertiga (*rule of thirds*) atau *split-screen* (kiri untuk teks/data, kanan untuk objek 3D/B-roll), dengan takarir karaoke di `bottom: 7%`.

## 3. Struktur Skema `manifest.json`
```json
{
  "projectTitle": "Judul Proyek",
  "mode": "hybrid",
  "fps": 30,
  "audioPath": "audio/voiceover.mp3",
  "scenes": [
    {
      "id": "scene-01-hook",
      "beat": "hook",
      "energy": "T3",
      "highlight": true,
      "visualType": "3d-showcase",
      "modelPath": "models/box.glb",
      "headline": "Maksimal Tujuh Kata Utama",
      "subtext": "Penjelasan singkat maksimal lima belas kata.",
      "anchor": "Tahukah kamu kemasan",
      "captionText": "Tahukah kamu, kemasan kertas jauh lebih ramah lingkungan?"
    }
  ]
}
```
- `captionText` wajib: kalimat voiceover persis seperti yang diucapkan di adegan itu.
- `anchor` opsional: 2–4 kata pertama yang diucapkan di adegan itu (default 3 kata pertama `captionText`). Adegan pertama selalu mulai di frame 0.
- **Jangan isi `durationInFrames`.** Durasi dihitung `sync_timeline.py` dari transkrip. Hanya boleh diisi sebagai override jika tidak ada voiceover sama sekali.
- `audioPath` relatif terhadap folder `public/`. Jika file belum ada, video dirender tanpa suara (skrip memberi peringatan).
````

## Lampiran: `references/motion-2d.md`

```markdown
# Standar Koreografi & Gerak 2D Remotion

## 1. Kurva & Fisika Gerak
- **Dilarang** menggunakan `Math.random()`, `Date.now()`, atau CSS `transition` / `animation`.
- Gunakan `spring()` untuk masuknya elemen dengan konfigurasi snappy (`mass: 0.8, damping: 14, stiffness: 180`).
- Seluruh `interpolate()` wajib menyertakan `{ extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }`.
- Animasi keluar (*exit*) harus **1.5x lebih cepat** daripada animasi masuk (*entrance*): masuk 15 frame (`spring({..., durationInFrames: 15})`), keluar 10 frame.
- Jangan pakai `TransitionSeries` dengan transisi tumpang tindih: durasi video jadi lebih pendek dari timeline dan takarir tertinggal dari voiceover.

## 2. Koreografi & Stagger
- Terapkan *stagger* 3–6 frame antar elemen atau antar kata pada tipografi kinetik.
- Gunakan masuk multi-properti sekaligus: `opacity` (0 -> 1), `translateY` (24px -> 0), dan `scale` (0.94 -> 1).
- Tambahkan *micro-motion* halus pada elemen yang sedang diam agar layar tidak pernah membeku:
  `const floatY = Math.sin(frame / 15) * 4;`

## 3. Komposisi 5 Lapis Wajib
Susunan dari bawah ke atas. Lapis 1, 4, 5 sudah tersedia di `components/Layers.tsx` dan dirender sekali di `StoryComposition` (konstan, tidak berkedip saat ganti adegan); `StoryScene` hanya mengisi lapis 2–3 dengan latar transparan:
1. **Lapisan 1 (Base):** Gradient mesh gelap/bertekstur yang bergerak perlahan.
2. **Lapisan 2 (Media / 3D):** `<OffthreadVideo>`, gambar dengan *Ken Burns* (`scale` 1.0 -> 1.08), atau `<ThreeStage>`.
3. **Lapisan 3 (Grafis, Tipografi & Takarir):** Kartu kaca (*glassmorphism*), teks utama, dan `<KaraokeCaption>`.
4. **Lapisan 4 (Color Grade):** Overlay gradien halus untuk menyatukan kontras teks.
5. **Lapisan 5 (Tekstur & Vignette):** *Film grain* tipis (SVG `feTurbulence` dengan `seed = frame % 12`, `opacity` ±0.05) + vignette tepi layar (`pointerEvents: 'none'`).
```

## Lampiran: `references/motion-3d.md`

```markdown
# Aturan Wajib Adegan 3D (`@remotion/three`)

## 1. Tiga Hukum Deterministik
1. **Dilarang keras memakai `useFrame()`** dari `@react-three/fiber`. Semua posisi, rotasi, dan pergerakan kamera wajib dihitung murni dari `useCurrentFrame()` dan `spring()`.
2. **Wajib `layout="none"` pada `<Sequence>`:** Di dalam `<ThreeCanvas>`, setiap `<Sequence>` harus ditulis `<Sequence layout="none">` agar tidak menyisipkan tag `<div>` ke dalam graf WebGL.
3. **Renderer ANGLE:** Pastikan konfigurasi render menyertakan `--gl=angle` (atau `Config.setChromiumOpenGlRenderer('angle')` di `remotion.config.ts`).

## 2. Optimasi Aset 3D
- Gunakan format `.glb` terkompresi di folder `public/models/` dan muat dengan `useGLTF()`.
- Pasang pencahayaan lingkungan dari file HDRI ringan atau kombinasi `ambientLight` + `directionalLight` dengan `castShadow` terukur agar waktu render tetap cepat.
```

## Lampiran: `references/style-explainer-sejarah.md`

````markdown
# Preset Style: Explainer Sejarah Chibi (2D flat-shaded, 16:9)

Diturunkan dari analisis video referensi explainer sejarah berbahasa Indonesia (4:12, 1920x1080, 30 fps, −14 LUFS). Yang ditiru adalah GAYA dan TEKNIK, bukan aset. DILARANG memakai logo, nama kanal, desain karakter persis, atau end card studio mana pun; kartu logo dan end card memakai brand pengguna (tanyakan nama brand jika belum ada).

## 1. Format & audio
- Default Mode B (16:9, 1920x1080, 30 fps); Mode C boleh, highlight = adegan hook + angka statistik + klimaks.
- Durasi wajar 2–5 menit. Shot rata-rata 4–6 detik, satu ide per shot.
- Audio bersambung tanpa jeda (VO + musik + SFX); satu-satunya jeda yang disengaja ±0,8 detik di sting logo. Mix akhir −14 LUFS, puncak ≤ −1 dB: `ffmpeg -i in.mp4 -af loudnorm=I=-14:TP=-1:LRA=11 -c:v copy out.mp4`.
- SFX diegetik bila pengguna menyediakan (ledakan, helikopter, hujan, langkah). Jangan mengunduh SFX/musik dari internet tanpa izin pengguna.

## 2. Struktur babak (isi `beat` di manifest)
| Urutan | beat | Isi | Energi |
|---|---|---|---|
| 1 | `cold-open` | Tanggal/tempat di objek (kalender, surat, papan) + suasana tegang | T2 |
| 2 | `hook-action` | 20–35 dtk aksi dramatis tanpa konteks, kekerasan distilasi | T3 |
| 3 | `logo-sting` | Kartu brand 3–4 dtk, latar warna aksen solid | T2 |
| 4 | `human-impact` | Sudut pandang orang biasa (warga, keluarga) | T1–T2 |
| 5 | `stat-punch` | Montase polaroid + kartu statistik angka besar | T3 |
| 6 | `map-context` | Peta ilustrasi + bola-bendera bergerak | T2 |
| 7 | `flashback-cause` | Kartu tahun mundur, tokoh, konferensi, sebab | T1–T2 |
| 8 | `escalation` | Klimaks konflik | T3 |
| 9 | `explain-how` | Diagram potongan melintang/berlabel (cara/taktik/mekanisme) | T2 |
| 10 | `turning-point` | Opini publik, berita, protes | T2 |
| 11 | `resolution` | Dokumen/perjanjian, pesan penutup | T1 |
| 12 | `end-card` | Panel warna aksen kiri + kredit/CTA kanan, frame terakhir digelapkan | T1 |
Babak boleh digabung untuk video pendek, tetapi urutan hook → logo → isi → resolusi → end card dipertahankan.

## 3. Bahasa visual
- **Ilustrasi flat dengan shading lembut**: gradien halus, rim light 1–2 px warna terang, bayangan lunak (`filter: blur`), bukan flat datar.
- **Kedalaman 2.5D**: 3–4 lapis parallax (latar jauh blur 6–10 px, tengah tajam, latar depan gelap blur besar yang melintas). Kamera selalu bergerak: push-in `scale` 1.0→1.06 sepanjang adegan, atau pan 40–120 px.
- **Manusia = chibi** (SVG primitif): kepala bulat ±45% tinggi badan, badan kapsul kecil, tangan bulat tanpa jari, mata titik/garis, tanpa hidung/mulut detail. Identitas lewat atribut: helm (tentara), caping/topi khas (warga), jas+dasi (politisi), rambut putih+janggut (tokoh tua). Ekspresi lewat bentuk mata (`> <`), alis miring, tetes keringat, ikon "!" pop-in.
- **Negara/organisasi = bola-bendera**: lingkaran dengan pola bendera (SVG `clipPath`), highlight specular di kiri atas, bayangan elips di bawah, mata/aksesori penanda (kacamata hitam, topi, kumis). Gambar bendera sebagai bentuk sederhana dari kode, bukan mengunduh.
- **Massa = siluet** hitam/gelap dengan rim light tipis (penonton, demonstran, wartawan).
- **Kekerasan distilasi**: siluet di latar merah dengan speed lines, percikan merah abstrak, darah hanya bentuk merah sederhana. Tidak ada luka realistis.
- **Partikel ambien** selalu ada (debu, daun, abu, hujan diagonal, bintik cahaya), deterministik dari `frame` dan `random(seed)` Remotion.
- **Vignette kuat** di hampir semua adegan (lapis 5), lebih tebal di adegan gelap.

## 4. Grading per suasana (`mood` per adegan → lapis 4 `ColorGrade`)
| mood | Palet acuan | Perlakuan |
|---|---|---|
| `past-sepia` | `#463C2F` `#7B6750` `#302A23` | sepia, kontras rendah, vignette kuat |
| `danger` | `#000000` `#952E2E` `#46191A` | siluet hitam + merah tua, speed lines |
| `village` | `#60574E` `#736D62` `#867E6F` | hangat redup |
| `fire` | `#261A18` `#61372A` `#AB7350` + oranye api | glow oranye, asap |
| `grief` | `#3C3E3C` `#616662` `#79807E` | desaturasi ±80%, sedikit blur tepi |
| `map-calm` | `#949445` `#8CB9B0` `#B1D6D5` | cerah, zaitun + toska |
| `map-war` | `#9D413A` `#7F392F` glow `#BFA44F` | merah bata, garis pantai menyala |
| `jungle` | `#4E3710` `#573E0F` hijau daun | hangat lembap |
| `archive-tv` | abu + scanline | desaturasi, scanline, vignette bulat |
Warna aksen brand (default merah coral `#EE3048`, boleh diganti brand pengguna) hanya dipakai di kartu logo, label diagram, dan end card.

## 5. Kartu teks (isi `onScreenText` di manifest; teks layar minimal, sisanya dibawa VO)
- `yearCard`: tahun besar putih pojok kiri bawah, fade + geser 12 px. Wajib di setiap lompatan waktu.
- `statCard`: dua baris — angka besar (mis. "2.000.000") + label kapital pendek — di atas foto/polaroid. Wajib untuk setiap angka penting.
- `nameLabel`: nama tokoh diketik per huruf (2 frame/huruf) di samping tokoh.
- `diagramLabel`: kotak warna aksen, teks putih kapital, pop-in overshoot (`springs.bouncy`), dipakai di diagram potongan melintang.
- `objectText`: tulisan di objek (kalender, papan protes, dokumen), ikut bergerak bersama objek.
- Font: sans geometris sangat tebal (Poppins/Montserrat 800), putih, bayangan lembut `0 4px 16px rgba(0,0,0,.35)`.
- Takarir karaoke: tetap tersedia, tetapi untuk preset ini tanyakan pengguna apakah ingin ditampilkan (video referensi tidak memakai takarir terbakar). Jika ya, gaya kecil di `bottom: 7%` agar tidak bersaing dengan kartu teks.

## 6. Transisi (isi `transitionIn`; dibuat sebagai animasi masuk adegan, TANPA tumpang tindih)
`foreground-wipe` (objek gelap latar depan menyapu layar) · `whip-flash` (blur geser 6 frame + flash warna solid 2 frame) · `zoom-through` (zoom menembus objek) · `split-panel` (panel bergeser dengan garis pemisah putih) · `splatter` (percikan merah membesar menutup layar) · `map-morph` (warna peta berubah di tempat) · `tv-static` (scanline + desaturasi) · `polaroid-pin` (foto jatuh dan tertempel) · `logo-assemble` (garis-garis menyatu jadi logo). Variasikan: jangan pakai transisi yang sama dua kali berturut-turut.

## 7. Gerak & animasi
- Karakter gaya puppet/cut-out: rig sederhana (kepala, badan, 2 tangan, 2 kaki) dengan rotasi sendi dari `Math.sin(frame/…)`; jalan memantul `translateY = |sin|·6px`.
- Getar kamera saat ledakan: offset 4–10 px meluruh 12 frame, deterministik.
- Elemen ikon/label masuk dengan overshoot (`springs.bouncy`); teks tahun dan statistik dengan `springs.smooth`.
- Speed lines radial dan motion blur (`filter: blur` horizontal) untuk aksi T3.

## 8. Pustaka komponen yang disarankan
`Chibi` (props: role, outfit, headwear, expression, pose) · `FlagBall` (props: flag pattern, accessory, expression) · `SilhouetteCrowd` · `ParallaxScene` (layers[]) · `IllustratedMap` (region, mode calm/war, glowCoast) · `CrossSection` (tunnels/rooms + diagramLabel) · `PolaroidBoard` · `Calendar` · `Document` · `ProtestSign` · `RetroTV` · `Explosion`/`Fire`/`Smoke`/`Rain`/`Leaves` · `YearCard` · `StatCard` · `NameLabel` · `LogoSting` · `EndCard`. Semua dibuat dari SVG/CSS di kode; aset statis yang berat (latar parallax) masuk alur Cache Aset PNG.

## 9. Tambahan skema manifest untuk preset ini
```json
{
  "style": { "preset": "explainer-sejarah-chibi", "accent": "#EE3048", "brandName": "<brand pengguna>" },
  "scenes": [
    {
      "id": "scene-05-stat",
      "beat": "stat-punch",
      "energy": "T3",
      "mood": "grief",
      "transitionIn": "polaroid-pin",
      "onScreenText": [{ "type": "statCard", "value": "2.000.000", "label": "WARGA TEWAS" }],
      "captionText": "..."
    }
  ]
}
```

## 10. Contoh override `theme.ts`
```ts
colors: {
  bgPrimary: '#1E1A17', bgSecondary: '#2B2420',
  surfaceGlass: 'rgba(20,16,14,0.6)', surfaceBorder: 'rgba(255,255,255,0.14)',
  textPrimary: '#FFFFFF', textSecondary: '#D9D2C7',
  accentPrimary: '#EE3048', accentHighlight: '#F2B84B',
},
typography: { fontHeading: 'Poppins, sans-serif', fontBody: 'Poppins, sans-serif', fontMono: 'JetBrains Mono, monospace' },
```
Lapis 1 `MovingGradient` diganti latar ilustrasi adegan; glassmorphism tidak dipakai di preset ini.

## 11. Pemeriksaan contact sheet khusus preset
- Setiap lompatan waktu punya `yearCard`; setiap angka penting punya `statCard`.
- Tidak ada frame yang kamera/elemennya benar-benar diam.
- Grading berubah sesuai `mood`; adegan duka benar-benar desaturasi.
- Tidak ada logo/nama kanal pihak lain; kekerasan tetap distilasi.
````

## Lampiran: `references/style-stickfigure.md`

````markdown
# Preset Style: Stick-figure Kok Bisa (Cetakinds), 3D toon, 9:16

Diturunkan dari 10 video referensi Shorts (survivorship bias pesawat ×2, Tembok Besar Cina, SPBU "mulai dari nol", desa petir, koboi "never draw first", serta video Cetakinds: internet mati sebulan, Italian brainrot, mantan, stasiun pertama). Yang ditiru adalah GAYA dan TEKNIK, bukan aset. DILARANG memakai logo, nama kanal, watermark, atau desain tokoh persis milik kanal lain; brand yang tampil hanya milik pengguna (Cetakinds).

## 1. Format & audio
- Default Mode A (9:16, 1080x1920, 30 fps), durasi 55–100 dtk (umumnya 60–75).
- Tempo VO bahasa Indonesia di semua referensi 2,3–2,7 kata/dtk. Untuk preset ini, **anggaran kata = durasi × 2,5** (60 dtk ≈ 150 kata), dan tempo terukur 2,2–2,6 kata/dtk dianggap normal (tidak perlu ditawari rekam ulang). Audio tetap tidak diubah.
- Musik dari kode: pizzicato + glockenspiel ceria (D minor untuk misteri, D mayor untuk payoff), string pad + denyut rendah untuk tegang, string + pizz jarang untuk malam, reed "jinjit" untuk mengendap. Mood berganti per babak. Musik ±20 LU di bawah VO dengan ducking. Puncak SFX dibuat −7 dB dari puncak VO agar tumpukan SFX tetap ≥ 6 dB di bawah VO.
- SFX standar: whoosh di setiap whip, pop/bubble untuk label, stamp untuk cap, boing untuk bingung, riser sebelum reveal, thud + sparkle untuk angka besar, scribble untuk coretan, klik + ding saat tombol ikuti ditekan.

## 2. Bahasa visual
- **Dunia:** 3D low-poly dengan shading toon 3 tingkat, garis tinta gelap (#1e1a22) di semua benda, langit gradasi, awan kotak-kotak, umbul-umbul warna-warni khas kampung, rumah atap pelana, jalan aspal dengan marka.
- **Tokoh:** kepala bulat besar putih (#fbf8f1) dengan wajah sederhana (mata titik, alis, mulut), badan kapsul berwarna, celana setengah bola, kaki-tangan tongkat hitam tipis, bayangan bulat di kaki. Identitas lewat atribut: peci, caping, helm, topi pet, topi tinggi, topi koboi, helm proyek, hijab, rambut mangkuk hitam, kacamata, kumis, dasi. Ekspresi: neutral, happy, laugh, shock, scared, smug, sad, angry, worried, confused, squint, sleep, plus tetes keringat dan pipi merah.
- **Gerak tokoh:** selalu idle (napas + kepala miring halus), mulut buka-tutup tiap 1/8 detik saat ia yang bicara, pose menunjuk/melambai/bersorak/melompat, jalan dengan kaki berayun + badan memantul.
- **Ritme:** 10–16 shot per 60 detik (rata-rata 3–4 dtk). Ide baru mendapat setup baru. Shot pertama sudah bergerak di frame 0. Kamera selalu bergerak (push-in + drift tangan). Close-up wajah untuk reaksi. Mekanisme dijelaskan di papan tulis/poster/layar HP dengan titik merah, lingkaran merah yang digambar perlahan, dan panah.
- **Mood per babak:** day, sunset, night (biru gelap, jendela menyala), indoor (hangat), past (sepia untuk kilas balik), danger (merah), dark.
- **Transisi** (sebagai animasi masuk/keluar, tanpa tumpang tindih): whip (blur geser 0,16 dtk di akhir adegan lama dan awal adegan baru) untuk pindah tempat, cut di lokasi sama, flash putih 0,1 dtk untuk benturan/angka besar. Jangan flash dua kali berturut-turut.

## 3. Implementasi di @remotion/three (sudah diuji)
- `MeshToonMaterial` dengan `gradientMap` 3 tingkat (`DataTexture` 3x1, nilai 90/175/255, `NearestFilter`).
- **Garis tinta (inverted hull):** clone geometri, hapus atribut `uv` dan `normal`, `mergeVertices` lalu `computeVertexNormals` (agar sudut kotak tidak bolong), material `MeshBasicMaterial` `BackSide` warna tinta, vertex digeser sepanjang normal 0,02–0,03 unit lewat `onBeforeCompile`.
- **Wajah:** digambar di `CanvasTexture` 1024x512 yang membungkus bola kepala (equirect). Titik depan (+z) ada di u = 0,25, v = 0,5. Cache tekstur per kombinasi ekspresi/bicara/keringat.
- **Rambut:** `SphereGeometry(r, 24, 12, 0.27π, 1.46π, 0, 0.52π)` diputar y = π/2 agar celah wajah ada di depan, ditambah poni penuh `thetaLength 0.27π`. Celah yang lebih sempit akan menutupi mata.
- **Kamera:** fov vertikal 50°. Tinggi yang terlihat ≈ 0,93 × jarak, lebar ≈ 0,52 × jarak. Tiga tokoh berdiri butuh jarak 7–8 unit; close-up wajah 3–3,6 unit. **Papan diagram di 9:16 harus tegak** (lebar ≤ 0,5 × jarak kamera), karena papan lebar akan terpotong.
- Papan diagram = plane `MeshBasicMaterial` (`fog: false`) dengan `CanvasTexture` yang digambar ulang dari `useCurrentFrame()` lalu `needsUpdate = true`.
- Benda khusus (gerobak, mesin, pompa bensin, pesawat) dirakit dari primitif box/silinder/kerucut/torus bertinta. Jangan memakai model berat.
- Tanpa GPU (2 core) render sekitar 1 frame/dtk per proses di 1080x1920: jalankan render final di latar belakang dan pantau log.

## 4. Elemen layar (isi `onScreenText`)
`tag` (label pil berwarna bergaris tinta, pop pegas, bisa dicoret) · `yearCard` (tahun Montserrat 900 bergaris + chip tanggal merah, pojok kiri atas) · `calendar` ("HARI KE / 30 / tanpa internet") · `counter` (angka bergulir format id-ID "64.600", awalan Rp, akhiran °C) · `checklist` (centang hijau satu per satu) · `bubble` (balon kata/chat) · `stamp` ("MITOS!", "MASIH CAIR") · `ring`/`cross`/`arrow` (anotasi merah) · `mark` (? atau ! melayang di atas kepala).

## 5. Zona layar 1080x1920
- Area aman Shorts/Reels: x 90–990, y 200–1500. Label/judul di y 250–500; wajah dan objek penting di y 350–1200.
- **Takarir karaoke di y ≈ 1305 (68%)**, sesuai semua referensi. Untuk preset ini ini menggantikan posisi bawah 18%, dan tetap di luar 15% area terbawah.
- Chip sumber di y ≈ 1436 (74,8%), watermark di y ≈ 1545 (80,5%). Jangan menaruh info di bawah y 1600.

## 6. Takarir
Satu kata per tampilan dengan pop kecil, Poppins ExtraBold (800) putih bergaris gelap tebal (±22% ukuran huruf), ±96 px, titik/koma dibuang, ? dan ! tetap tampil. Untuk sejarah, opsinya huruf kapital Montserrat 900 ±104 px. Frasa angka ditukar ke bentuk layar ("nol derajat" → "0°C", "dua puluh lima" → "25").

## 7. Brand Cetakinds
- File: `public/brand/watermark.png` (logo kecil transparan) dan `public/brand/logo.png` (logo lengkap). Jika belum ada, minta ke pengguna. Fallback-nya wordmark "cetak" navy #1d3a5f + "inds" oranye #f08a24.
- Watermark ±118 px lebar, opacity 0,9, di tengah bawah takarir. Disembunyikan saat end card.
- **End card mulai kata "Pencet":** layar digelapkan 50% → kartu logo putih bersudut bulat (±330 px, garis navy) di y ≈ 23% → tombol oranye "+ IKUTI" di y ≈ 37,5%, ditekan jari kartun di detik ke-1 lalu berubah navy "DIIKUTI ✓" (SFX klik + ding) → daftar "Sumber:" di y ≈ 43,5%. Takarir tetap jalan.

## 8. Tambahan skema manifest
```json
{
  "style": { "preset": "stickfigure-kokbisa", "brand": "Cetakinds", "caption": "poppins" },
  "disclaimer": "",
  "sources": [{ "short": "Frostburg State Univ.", "year": "", "full": "Frostburg State University, General Chemistry Online — Why isn't 0°F the lowest possible temperature for a salt/ice/water mixture?", "url": "https://antoine.frostburg.edu/chem/senese/101/solutions/faq/print-zero-fahrenheit.shtml", "claim": "Larutan garam tetap cair sampai -21,1 °C", "scenes": ["scene-09-minus21"] }],
  "scenes": [
    { "id": "scene-09-minus21", "beat": "climax", "energy": "T3", "mood": "night", "transitionIn": "flash",
      "onScreenText": [{ "type": "counter", "from": 0, "to": -21, "suffix": "°C" }, { "type": "stamp", "text": "MASIH CAIR" }],
      "captionText": "Air garam bisa tetap cair sampai minus dua puluh satu derajat." }
  ]
}
```

## 9. Pemeriksaan contact sheet khusus preset
- Tidak ada tokoh, label, atau papan yang terpotong tepi layar. Wajah tidak tertutup takarir.
- Setiap angka/tahun penting punya elemen layar (counter/yearCard/tag).
- Chip sumber muncul di adegan klaim; end card menampilkan logo, tombol DIIKUTI, dan daftar sumber.
- Tidak ada logo/watermark/nama kanal lain.
````

## Lampiran: `references/stickman-director.md`

````markdown
# Preset Stickman Director (A1–A8, B1–B7) untuk Remotion

Diadaptasi dari repo `kaomei/stickman-video-director` (lisensi MIT, © 2026 Stickman Video Director contributors). Yang diambil hanya aturan gaya, cara menyutradarai, dan gerbang kualitas. DILARANG memakai gambar/video contoh repo itu sebagai aset video, meniru tokoh persis kanal inspirasinya, atau menampilkan nama kanal lain. Brand yang tampil tetap milik pengguna.

Di repo asli, A (Model Engine) menghasilkan prompt untuk model video (Google Flow/Omni/Veo) dan B (Code Engine) merender animasi lewat kode. Di skill ini semua preset dirender dengan Remotion, jadi dari A yang dipakai adalah **gaya dan cara menyutradarainya**, bukan alur pembuatan prompt-nya.

## 0. Kelayakan di Remotion (sebutkan ke pengguna sebelum konfirmasi)
| Tingkat | Preset | Artinya |
|---|---|---|
| **Penuh** | A1, A2, B1, B3, B7 | Bisa dibuat murni dengan kode (SVG/canvas) mendekati contoh aslinya. |
| **Mendekati** | A3, A4, A5, B2, B4, B5 | Bisa dengan kode, tetapi latar lukis/tekstur lebih sederhana dari aslinya. B5 butuh gambar avatar dari pengguna. |
| **Terbatas** | A6, A7, A8, B6 | Aslinya bergantung pada lukisan/model video. Tanpa gambar latar/tokoh dari pengguna, hasil kode hanya tafsiran gaya; katakan itu dengan jujur. |

Catat pilihan sebagai `"style": { "preset": "stickman-a1-dark" }` (pola: `stickman-a1-light`, `stickman-a1-dark`, `stickman-a2-tech`, `stickman-a2-story`, `stickman-a3` … `stickman-b7`).

## 1. Aturan sutradara bersama (berlaku untuk semua preset)
1. **Gaya tetap, cerita berubah.** Kunci tokoh di `style.cast` (kartu tokoh: peran, proporsi kepala-badan, rambut, wajah, busana, satu aksesori khas). Setiap tokoh berulang punya ≥2 pembeda yang bukan warna. Lokasi, properti, akting, dan kamera berubah mengikuti cerita; cara menggambar tidak berubah dalam satu video.
2. **Rantai aksi sebab-akibat.** Setiap adegan punya `action`: pemicu → kontak → respons benda/lingkungan → reaksi tokoh → `exitState`. Contoh: dorong slab tidak bergeser → ambil tuas → slab rebah jadi jembatan → tokoh melangkah di atasnya. Bacalah urutan adegan sebagai storyboard bisu: penonton tanpa suara harus tahu apa yang dilakukan tokoh dan apa akibatnya.
3. **Sambungan antar adegan.** Adegan berikutnya mewarisi `exitState` adegan sebelumnya (pose, pegangan, posisi/kondisi properti, arah gerak, arah kamera), ATAU ada potongan lokasi/waktu yang disengaja dan terbaca. Jangan mengulang ancang-ancang aksi yang sudah selesai.
4. **Penutup aktif.** Adegan terakhir harus punya satu aksi/perubahan grafis dengan akibat terlihat sebelum ditahan; bukan tokoh berdiri diam.
5. **Gerbang diam 2,5 detik.** Subjek utama (tokoh atau benda fokus) wajib mengalami perubahan bermakna paling lambat tiap 2,5 detik. Zoom seluruh layar, ganti takarir, partikel latar, dan micro-motion sinus TIDAK dihitung. Pengecualian: jeda reaksi bermotivasi (A3, A4, A5) dan aturan B4 (setiap shot ≤3 detik).
6. **Satu fokus per beat.** Satu aksi utama terbaca dalam satu waktu; aksi sekunder mengikuti gaya/kejadian yang sama dengan sedikit tunda.
7. **Anatomi dan kontak.** Tepat 2 lengan dan 2 kaki per tokoh. Lengan yang bergerak MENGGANTIKAN pose lamanya (tidak ada lengan tertinggal). Panjang tulang tetap (IK 2 tulang: bahu–siku–tangan, pinggul–lutut–kaki); hitung kontinu dulu, baru dibulatkan. Kaki menapak saat berjalan (bukan meluncur), tangan benar-benar menyentuh benda yang dipegang, benda ikut tangan. Jejak gerak hanya pada properti/grafis, bukan duplikat tungkai.
8. **Kepemilikan properti.** Catat posisi awal, siapa memegang, kapan berpindah, dan posisi akhir. Benda tidak muncul tiba-tiba, berlipat ganda, atau kembali ke tempat semula setelah dipindah.
9. **Dua rasio, dua tata letak.** 16:9 memakai staging kiri-tengah-kanan, gerak lateral, match cut horizontal. 9:16 memakai kedalaman depan-belakang, reveal vertikal, dan elemen bertumpuk. Ganti rasio = susun ulang adegan, bukan crop.
10. **Warna dan teks.** Warna aksen diberi makna cerita (cemas, bahaya, berhasil). Teks di dalam ilustrasi hanya lewat `onScreenText`; ikon pesan/kartu/notifikasi dibuat tanpa tulisan kecuali diperlukan.
11. **Suara.** SFX dipasang di kontak, perubahan, dan pendaratan yang terlihat (tetap mengikuti aturan loudness skill). Musik adalah bed utuh per film/babak, bukan potongan per adegan.

## 2. Preset

### A1 · Hitam Putih Klasik (Light / Dark) — Penuh
- **Kanvas:** Light = putih murni datar; Dark = hitam pekat datar. Tanpa gradien, grain, bayangan, vignette, atau kedalaman 3D.
- **Tokoh:** kepala lingkaran kosong, badan dan tungkai satu garis, ketebalan garis medium seragam, tanpa baju dan tanpa isian. Default boleh ekspresi garis sederhana di kepala (tanpa mata detail); jika pengguna minta tanpa wajah, kepala kosong total. Tokoh tetap monokrom (hitam di Light, putih di Dark).
- **Warna:** maksimal 3 aksen jenuh, hanya pada properti dan efek grafis (mis. merah = usaha sia-sia/bahaya, biru = titik ungkit, emas = aksi/berhasil, ungu = pikiran cemas).
- **Properti:** kontur datar dengan sedikit garis (mis. kertas terlipat satu lipatan). Pilih properti yang bentuk/perilakunya menyampaikan ide dan bisa disentuh tokoh. Ruang kosong luas.
- **Remotion:** SVG `stroke` dengan `strokeLinecap/strokeLinejoin: round`, rig sendi + IK 2 tulang. Lapis 1, 4, 5 diganti kanvas datar.
- **Cek:** tidak ada tungkai ganda, ketebalan garis sama di semua adegan, aksen tidak mengenai tokoh, kanvas tetap murni.

### A2 · Pop Modern (kupluk merah) — Penuh
- **Tokoh (sama untuk A2.1 dan A2.2):** stickman 2D, kupluk merah cerah membulat tanpa pompom, kaus kuning, celana pendek, kaki-tangan tongkat hitam. Kepala tanpa mata detail (titik sederhana saja). Kupluk dan kaus selalu ada.
- **A2.1 Teknologi Minimalis:** studio putih high-key, grid lantai perspektif abu sangat samar, panel UI kaca sian/biru menyala. DILARANG tekstur papan sirkuit, panel sci-fi, lorong pesawat, beton retak. Aksi fisik: melompat menabrak langit-langit kaca lalu memantul lucu, ketukan sepatu memunculkan riak sian di grid, pena cahaya menggambar jembatan, menyentuh panel kaca memunculkan ikon gembok, mendorong pintu brankas ke cahaya.
- **A2.2 Cerita Berwarna:** latar penuh warna (kamar lampu hangat, jalan senja, puncak di atas awan), cahaya sinematik, latar diblur ringan; tokoh tetap datar 2D.
- Hindari morph cair abstrak (tangga meleleh jadi jam); pakai interaksi fisik.

### A3 · Gua Prasejarah (komedi gelap) — Mendekati
- **Tampilan:** kontur hitam kasar (SVG `feTurbulence` + `feDisplacementMap` kecil, seed berganti tiap 3–4 frame), kepala putih terisi, wajah kartun ekspresif (mata, alis, mulut), tungkai tongkat hitam, baju kulit binatang, palet tanah oker/cokelat + aksen api hangat, tekstur kertas halus.
- **Cerita:** masalah modern diterjemahkan jadi tugas fisik prasejarah (rekomendasi tanpa henti = kepala suku terus menyodorkan camilan; beban kerja = ikatan tombak yang terus bertambah). Alur premis → solusi menggoda/eskalasi → pembalikan/callback. Tatapan datar atau jeda reaksi boleh.
- Ini analogi fiksi, bukan sejarah: isi `disclaimer`. Cast card wajib; penampilan tidak berubah antar adegan.

### A4 · Cerita Hangat — Mendekati
- **Tokoh default:** kepala bulat putih terisi, dua mata oval kecil gelap, alis garis, mulut lengkung pendek; torso ramping tertutup isian putih berkontur gelap; lengan dan kaki satu garis gelap medium; tangan bulat kecil, kaki pendek membulat; tanpa rambut/aksesori.
- **Latar:** kartun 2D penuh warna dengan cahaya lembut dan kedalaman; bukan sketsa, bukan bingkai kertas.
- **Aturan lokasi:** setiap segmen naratif baru = lokasi baru yang mudah dikenali (kantor → peron stasiun → taman), kecuali pengguna minta satu lokasi atau callback disengaja. Variasikan wide, close-up aksi, tracking, dan foreground lewat.
- "Hangat" adalah perlakuan visual; topik cemas/serius tetap dijaga maknanya.

### A5 · Kartun Sejarah — Mendekati
- **Tokoh:** kepala putih bulat menyatu dengan leher putih pendek yang masuk ke kerah baju (siluet putih kontinu, kontur hitam hanya di sisi); mata oval vertikal hitam pejal tanpa pupil; hidung satu lengkung kecil; alis dan mulut per tokoh; tungkai terbuka garis hitam ramping; telapak tangan hitam pejal bentuk sarung tangan bulat (±18% diameter kepala panjangnya, ±10% lebarnya) dengan satu benjolan jempol, tanpa jari.
- **Era pack (catat di manifest):** zaman/tempat dan premis faktual; busana + aksesori tiap peran; lokasi dan landmark; palet 4–6 warna dengan perannya.
- Latar lukis penuh warna dengan cel shading; busana boleh berbayang lembut. Fakta sejarah wajib bersumber (chip sumber); adegan komedi rekaan ditandai `disclaimer`.
- Berbeda dari Explainer Sejarah Chibi: A5 berpusat pada tokoh yang mengalami keseharian zaman itu.

### A6 · Amber Noir — Terbatas
- **Tokoh:** kepala hitam matte bulat dengan leher hitam pendek, tanda mata putih krem kecil, mulut garis; protagonis berhoodie merah-oranye dengan tudung turun; tangan dan tungkai hitam sederhana.
- **Dunia:** cahaya ambar keemasan + bayangan ungu plum tua, kota berlapis, kontur bersudut, cel shading tertahan.
- **Cerita:** pengandaian ("Bagaimana jika semua barang 10.000× lebih murah?") → godaan → akibat tak terduga. Takarir huruf kapital dinamis; judul putih kecil di kiri atas.
- Tanpa gambar dari pengguna: siluet vektor + gradien ambar-plum; sebutkan bahwa ini tafsiran.

### A7 · Rubber Hose (1930-an) — Terbatas
- **Tokoh:** wajah bulat putih kertas, dua helai rambut tipis melengkung, mata oval hitam, alis dan mulut kecil; leher, tulang belakang, dan tungkai garis tinta sempit (tidak ada dada terisi); tangan kecil, kaki lengkung hitam pendek.
- **Dunia:** latar era lawas berkontur pena dengan detail engsel/sambungan; sage-abu, abu mutiara, taupe, gading, aksen merah bata pudar (bukan monokrom, bukan sepia).
- **Gerak:** antisipasi → gerak lentur → benturan/overshoot → pulih, kedip dan reaksi wajah; tulang belakang tetap garis saat melengkung. Di Remotion, tungkai = path Bezier kuadrat dengan titik kontrol pegas (`spring` damping rendah).
- Narasi/lirik tidak wajib; cocok untuk video mengikuti musik.

### A8 · Terinspirasi Ghibli — Terbatas
- **Tokoh:** wajah bulat, mata titik, lengan-kaki garis tipis, pewarnaan datar cel.
- **Dunia:** latar seperti cat guas, langit-laut biru pekat, awan kumulus tinggi, bayangan matahari tegas. Pilih 1–2 detail yang ikut aksi (angin mengangkat kanopi → surat terbang → tokoh menangkapnya); semua kain/benda ringan mengikuti satu arah angin.
- **Gerak:** satu aksi utama per shot: pemicu → tenaga → kontak → hasil → reda.
- Kode hanya bisa mendekati (lapisan gradien + noise + bayangan tegas); hasil terbaik butuh latar lukisan dari pengguna. Jangan menyebut nama studio di video.

### B1 · Seni Garis Minimalis — Penuh
- **Kertas:** #FDFDFC dengan grid persegi sangat samar (garis 0,8 px, rgba(76,90,105,0.036), jarak 64 px pada lebar 1280; skalakan proporsional), tanpa grain.
- **Tokoh:** ramping, ±4–4,5 kepala tingginya; garis pena hitam halus agak tidak rata; mata oval hitam, alis yang jelas naik/turun/miring, mulut yang berubah besar (kaget, frustrasi, menyipit, senyum lebar); tangan dan kaki oval kecil. Seluruh tubuh ikut berakting (condong, menoleh, berat badan).
- **Properti:** gambar tangan berwarna (kuning/merah/hijau hangat + tinta navy), panah melengkung, coretan marker. Screenshot nyata boleh sebentar di bingkai membulat bergaris halus.
- **Teks:** teks pendek besar tulisan tangan (Caveat) sebagai fokus adegan; takarir frasa pendek Noto Sans 600 lebih kecil di bawah.
- **Ritme:** tokoh tampil ±60–70% waktu; sisanya close-up benda/teks. Elemen muncul berurutan sesuai urutan ucapan (bukan semua sekaligus lalu bergoyang).

### B2 · Gambar Tangan Berwarna — Mendekati
- Kertas hangat, kontur tinta halus tidak rata, properti berwarna redup tetapi beragam, lingkungan sehari-hari yang mudah dikenali. Tokoh kepala bulat, mata titik, mulut garis.
- Judul adegan tulisan tangan; takarir sans-serif tinta gelap di label kertas gading membulat (40 unit pada lebar 1280 untuk 16:9, 72 untuk 9:16).
- Tokoh tidak perlu terus melambai; ritme datang dari perubahan fokus, sudut, dan informasi. Cerita baru harus memakai lokasi/komposisi berbeda dari video sebelumnya (catat peta adegan).

### B3 · TV Retro — Penuh
- Layar gelap, tokoh dan gambar putih-abu bercahaya tipis, teks putih bersih, scanline halus, sesekali gangguan sinyal ringan. Efek TV dipasang sebagai satu lapis akhir; uji dulu tanpa efek, baru nyalakan.
- Setiap garis penghubung/panah terikat ke objek asal dan tujuan, dan punya fungsi sebelum → proses → sesudah. Geser global atau noise CRT bukan bukti gerak.
- Cocok: sains sehari-hari, perilaku hewan, misteri pendek.

### B4 · Thriller Bertahan Hidup — Mendekati
- Kontur hitam sedikit organik, bidang warna lukis lebar, cel shadow; kepala putih bulat, wajah hitam minimal, badan dan tungkai tongkat hitam tanpa baju, sarung tangan kartun putih membulat dengan jempol terbaca.
- Pembuka setengah berbayang, eskalasi visual di 3 detik pertama, ancaman muncul dari gelap. **Setiap shot ≤3 detik**; crop, zoom kecil, atau ganti takarir tidak mereset hitungan.
- Ambiens pelan terus mengalir + SFX sesuai cerita, di bawah VO. Jangan pakai efek mengilap 3D atau hitam pekat total.

### B5 · Penjelasan dengan Avatar — Mendekati (butuh gambar avatar)
- Pembawa acara (avatar pengguna, mis. maskot Cetakinds; tokoh terkenal perlu izin) bicara di kanan bawah; panggung kiri berisi stickman anonim dan benda raksasa yang memperagakan ide (diseret tagihan, tergencet tekanan).
- Kertas hangat, tinta gelap, aksen merah, teks penekanan hitam-merah. Metafora visual berganti-ganti dengan serah terima yang jelas: kelompok lama menyingkir sebelum pemeran utama baru mengambil alih.
- Gerak bibir mengikuti amplitudo VO (`visualizeAudio`/`getAudioData` dari `@remotion/media-utils`). Takarir maksimal 3 baris semantik.

### B6 · Meme Story — Terbatas
- Garis tinta tebal-tipis, cat matte, cahaya lembut, latar luas; ekspresi meme berlebihan. Paling bagus 9:16.
- Pelacakan menyamping, kedalaman berlapis, serah terima benda, close-up reaksi, jeda agar lelucon terbaca. Takarir satu baris Archivo Black bergaris.
- Latar cat butuh gambar dari pengguna; versi kode lebih datar.

### B7 · Teater Piksel — Penuh
- **Kanvas logis** 320×180 (9:16: 180×320, disusun ulang), diperbesar tepat 6× dengan nearest-neighbor. Di Remotion: gambar ke `<canvas>` ukuran logis di setiap `useCurrentFrame()`, tampilkan dengan `image-rendering: pixelated` dan `transform: scale(6)`. Semua koordinat dibulatkan ke grid setelah IK. Tanpa rotasi piksel yang buram dan tanpa tepi vektor halus. Lapis 1, 4, 5 skill dimatikan.
- **Tokoh (piksel logis):** garis tungkai putih 1 px dengan bayangan 1 px di kanan (#0c101c), tungkai jauh #c7cbd2; kepala radius luar 5 / dalam putih 4, outline #080e1c; torso 12, bahu ke kepala 8, tiap segmen kaki 9, tiap segmen lengan 7,3. Saat diam, kaki di pinggul x±2 dan tanah 17,85 di bawah pinggul. Setiap tokoh punya 1–2 aksesori profesi kecil yang menempel di bagian tubuhnya (topi koki + celemek; topi kurir + tas).
- **Huruf:** alfabet bitmap 7 baris, jarak antarhuruf 1 px, bayangan (1,1); krem #fff0cc, aksen teal #71c4c0. Tanpa font OS; karakter yang tidak ada di peta glyph harus memunculkan error, bukan diganti kotak.
- **Takarir:** satu baris; 16:9 di y=165 logis dengan lebar total ≤292; 9:16 ±60% lebar (maksimal 65%, margin ≥17,5% tiap sisi).
- **Dunia:** dithering terbatas, palet per lokasi/suasana. Tanpa scanline CRT, tanpa sarung tangan B4.
- **Aksi:** jalan dari samping dengan kaki bergantian dan telapak menapak; pilihan ditampilkan sebagai benda berbeda berlabel A/B/C, hanya satu yang disorot pada satu waktu. Kamera: konteks → close-up kontrol/properti → pemicu → kembali ke akibat.
- **Penutup wajib (kecuali pengguna menolak):** renungan dengan ketikan retro, teks berpendar lembut, gerak kecil, dan musik yang pas.

## 3. Tambahan skema manifest
```json
{
  "style": {
    "preset": "stickman-b7",
    "captionMode": "phrase",
    "cast": [{ "id": "kurir", "card": "stickman putih piksel, topi kurir biru, tas selempang cokelat" }]
  },
  "scenes": [
    {
      "id": "scene-03-tombol",
      "beat": "climax",
      "location": "kamar kos malam",
      "action": {
        "trigger": "kurir menekan tombol percepat",
        "contact": "tombol amblas di bawah telapak",
        "response": "kalender berganti cepat, kaki tetap di tempat",
        "reaction": "kurir menoleh kaget"
      },
      "exitState": "tangan masih di tombol, kamera close-up",
      "captionText": "Satu tombol, dan setahun lewat begitu saja."
    }
  ]
}
```
- `captionMode`: `karaoke` (default skill, per kata), `phrase` (frasa semantik satu baris; B5 boleh ≤3 baris), atau `bitmap` (B7). Waktu tetap diambil dari transkrip.

## 4. Pengganti aturan umum untuk preset ini
- **Lapis 1/4/5** (gradien bergerak, color grade, grain/vignette) dimatikan untuk A1 dan B7; diganti tekstur kertas untuk A3, B1, B2, B5; diganti lapis TV untuk B3.
- **Spring default** (snappy) diganti: A7 memakai damping rendah dengan overshoot; B7 memakai posisi yang dibulatkan ke grid piksel.
- **Voiceover tetap dari pengguna.** Repo asli memakai TTS (Gemini dan lainnya); di skill ini TTS tetap dilarang, dan musik/SFX tetap dari pengguna atau prosedural.
- **Micro-motion sinus** tetap boleh dipakai, tetapi tidak menggantikan Gerbang diam 2,5 detik.

## 5. Cek contact sheet tambahan
- Untuk adegan >3 detik, ambil frame tiap 1 detik: subjek utama harus berubah bermakna (gerbang 2,5 detik; B4 ≤3 detik per shot).
- Jumlah tungkai benar, tidak ada lengan tertinggal, tangan menyentuh benda yang dipegang, kaki menapak.
- Frame awal tiap adegan cocok dengan `exitState` adegan sebelumnya, atau potongan lokasinya jelas.
- Adegan terakhir menunjukkan perubahan, bukan pose diam.
- 9:16 tersusun ulang, tidak ada elemen penting terpotong; B7 tidak ada piksel buram atau ukuran piksel campur.
- Palet dan tokoh sesuai preset di semua adegan; tidak ada nama kanal atau aset dari repo asal.
````

## Lampiran: `assets/theme.ts`

```ts
import { SpringConfig } from 'remotion';

export const theme = {
  colors: {
    bgPrimary: '#0B0F19',
    bgSecondary: '#131A2A',
    surfaceGlass: 'rgba(15, 23, 42, 0.72)',
    surfaceBorder: 'rgba(255, 255, 255, 0.16)',
    textPrimary: '#F8FAFC',
    textSecondary: '#94A3B8',
    accentPrimary: '#38BDF8',
    accentHighlight: '#F59E0B',
  },
  typography: {
    fontHeading: 'Inter, system-ui, sans-serif',
    fontBody: 'Inter, system-ui, sans-serif',
    fontMono: 'JetBrains Mono, monospace',
  },
  springs: {
    snappy: { mass: 0.8, damping: 14, stiffness: 180 } satisfies SpringConfig,
    smooth: { mass: 1.0, damping: 18, stiffness: 120 } satisfies SpringConfig,
    bouncy: { mass: 0.7, damping: 10, stiffness: 200 } satisfies SpringConfig,
  },
};
```

## Lampiran: `scripts/sync_timeline.py`

```python
#!/usr/bin/env python3
"""
sync_timeline.py — Menyusun timeline Remotion dari manifest.json (+ transkrip WhisperX opsional).

Perbaikan utama dibanding versi awal:
- Durasi adegan dihitung dari FRASA JANGKAR (anchor) yang dicocokkan ke transkrip,
  bukan diketik manual. Adegan berakhir tepat saat adegan berikutnya mulai bicara.
- Tanpa transkrip: durasi diperkirakan dari jumlah kata captionText (kecepatan bicara).
- Mencatat audioPath + audioStartFrame per adegan, sehingga komposisi Highlight
  bisa memotong voiceover yang tepat untuk tiap adegan.
- Timeline back-to-back tanpa tumpang tindih transisi, sehingga takarir tidak bergeser.

Pemakaian (jalankan dari root proyek):
  python3 scripts/sync_timeline.py --manifest manifest.json --transcript transcript.json
  python3 scripts/sync_timeline.py --manifest manifest.json            # tanpa audio/transkrip
"""
import argparse
import json
import os
import re
import shutil
import subprocess
import sys

WORDS_PER_SEC = 2.9      # target tempo bicara (sedang-cepat) saat tanpa transkrip
MIN_SCENE_SEC = 2.0
TAIL_PAD_SEC = 0.6       # jeda setelah kata terakhir sebelum video selesai
ANCHOR_WORDS = 3         # panjang anchor default (diambil dari awal captionText)
ANCHOR_WINDOW = 25       # jangkauan fallback kata pertama anchor (kata) agar adegan tidak meloncat jauh


def norm(token: str) -> str:
    return re.sub(r"[^\w]", "", token.lower(), flags=re.UNICODE)


def tokens_of(text: str):
    return [t for t in (norm(x) for x in (text or "").split()) if t]


def audio_duration_sec(path):
    if not path or not shutil.which("ffprobe") or not os.path.exists(path):
        return None
    try:
        out = subprocess.run(
            ["ffprobe", "-v", "error", "-show_entries", "format=duration",
             "-of", "default=noprint_wrappers=1:nokey=1", path],
            capture_output=True, text=True, check=True,
        ).stdout.strip()
        return float(out)
    except Exception:
        return None


def load_words(path):
    if not path:
        return []
    try:
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
    except FileNotFoundError:
        print(f"[WARN] Transkrip {path} tidak ditemukan, memakai perkiraan durasi.", file=sys.stderr)
        return []
    words = []
    source = data.get("word_segments") or [w for s in data.get("segments", []) for w in s.get("words", [])]
    for w in source:
        if w.get("start") is None or w.get("end") is None:
            continue  # WhisperX kadang tidak memberi waktu untuk angka/simbol
        token = w["word"].strip()
        # Whisper memecah kata ulang: "Tiba" + "-tiba" -> gabungkan jadi "Tiba-tiba"
        if token.startswith("-") and words:
            prev = words[-1]; prev["word"] += token; prev["norm"] = norm(prev["word"]); prev["end"] = float(w["end"])
            continue
        words.append({"word": token, "norm": norm(token),
                      "start": float(w["start"]), "end": float(w["end"])})
    return words


def find_anchor(words, anchor_tokens, from_idx):
    """Cari urutan anchor_tokens di words mulai from_idx. Kembalikan index kata pertama atau None."""
    n = len(anchor_tokens)
    if n == 0:
        return None
    for i in range(from_idx, len(words) - n + 1):
        if all(words[i + k]["norm"] == anchor_tokens[k] for k in range(n)):
            return i
    # fallback: kata pertama anchor saja, tapi hanya di dekat posisi terakhir (maks 25 kata ke depan)
    for i in range(from_idx, min(len(words), from_idx + ANCHOR_WINDOW)):
        if words[i]["norm"] == anchor_tokens[0]:
            print(f"[WARN] anchor '{' '.join(anchor_tokens)}' hanya cocok sebagian (kata pertama) di kata ke-{i}; "
                  f"periksa ejaan anchor.", file=sys.stderr)
            return i
    return None


def estimate_sec(scene):
    n = len(tokens_of(scene.get("captionText") or scene.get("subtext") or scene.get("headline", "")))
    return max(MIN_SCENE_SEC, n / WORDS_PER_SEC + 0.8)


def even_word_timings(scene, dur):
    raw = (scene.get("captionText") or scene.get("subtext") or scene.get("headline", "")).split()
    if not raw:
        return []
    usable = max(1, dur - 8)
    step = usable / len(raw)
    out = []
    for i, tok in enumerate(raw):
        s = round(i * step)
        out.append({"word": tok, "startFrame": s, "endFrame": max(s + 1, round((i + 1) * step))})
    return out


def main():
    p = argparse.ArgumentParser(description="Sinkronisasi manifest -> timeline.generated.json")
    p.add_argument("--manifest", required=True)
    p.add_argument("--transcript", help="JSON WhisperX (segments[].words[] atau word_segments[])")
    p.add_argument("--fps", type=int, default=30)
    p.add_argument("--out", default="src/timeline.generated.json")
    args = p.parse_args()

    with open(args.manifest, "r", encoding="utf-8") as f:
        manifest = json.load(f)

    fps = manifest.get("fps", args.fps)
    scenes = manifest.get("scenes", [])
    audio_path = manifest.get("audioPath")  # relatif terhadap public/, mis. "audio/voiceover.mp3"
    words = load_words(args.transcript)

    # ---- 1. Tentukan detik mulai tiap adegan ----
    starts = []
    if words:
        cursor = 0
        for i, sc in enumerate(scenes):
            if i == 0:
                starts.append(0.0)  # adegan pertama selalu mulai di frame 0 (hook tanpa layar kosong)
                continue
            anchor = tokens_of(sc.get("anchor") or " ".join((sc.get("captionText") or "").split()[:ANCHOR_WORDS]))
            idx = find_anchor(words, anchor, cursor)
            if idx is None:
                print(f"[WARN] Anchor adegan '{sc.get('id')}' tidak ditemukan di transkrip; "
                      f"memakai perkiraan dari jumlah kata.", file=sys.stderr)
                starts.append(starts[-1] + estimate_sec(scenes[i - 1]))
            else:
                # mulai sedikit sebelum kata pertama agar visual mendahului suara
                starts.append(max(starts[-1] + MIN_SCENE_SEC / 2, words[idx]["start"] - 0.15))
                cursor = idx + 1
        speech_end = words[-1]["end"] + TAIL_PAD_SEC
        a_dur = audio_duration_sec(os.path.join("public", audio_path)) if audio_path else None
        total_sec = max(speech_end, a_dur or 0, starts[-1] + MIN_SCENE_SEC)
    else:
        t = 0.0
        for sc in scenes:
            starts.append(t)
            override = sc.get("durationInFrames")
            t += (override / fps) if override else estimate_sec(sc)
        total_sec = t

    # ---- 2. Konversi ke frame (satu kali pembulatan, tanpa celah/tumpang tindih) ----
    start_frames = [round(s * fps) for s in starts] + [round(total_sec * fps)]

    full, highlight, hl_cursor = [], [], 0
    for i, sc in enumerate(scenes):
        sf, ef = start_frames[i], start_frames[i + 1]
        dur = max(1, ef - sf)
        if words:
            s_sec, e_sec = sf / fps, ef / fps
            wt = [{"word": w["word"],
                   "startFrame": max(0, round((w["start"] - s_sec) * fps)),
                   "endFrame": min(dur, max(1, round((w["end"] - s_sec) * fps)))}
                  for w in words if s_sec <= w["start"] < e_sec]
        else:
            wt = even_word_timings(sc, dur)

        entry = {**sc, "startFrame": sf, "durationInFrames": dur,
                 "audioStartFrame": sf, "wordTimings": wt}
        entry.pop("anchor", None)
        full.append(entry)
        if sc.get("highlight"):
            highlight.append({**entry, "startFrame": hl_cursor})
            hl_cursor += dur

    audio_ok = bool(audio_path) and os.path.exists(os.path.join("public", audio_path))
    if audio_path and not audio_ok:
        print(f"[WARN] public/{audio_path} belum ada; video dirender tanpa suara.", file=sys.stderr)

    out = {
        "projectTitle": manifest.get("projectTitle", "Untitled"),
        "fps": fps,
        "audioPath": audio_path if audio_ok else None,
        "fullDurationInFrames": start_frames[-1],
        "highlightDurationInFrames": hl_cursor,
        "fullScenes": full,
        "highlightScenes": highlight,
    }
    os.makedirs(os.path.dirname(args.out) or ".", exist_ok=True)
    with open(args.out, "w", encoding="utf-8") as f:
        json.dump(out, f, indent=2, ensure_ascii=False)

    src = "transkrip+anchor" if words else "perkiraan jumlah kata"
    print(f"OK ({src}): Full={len(full)} adegan, {start_frames[-1]} frame ({start_frames[-1]/fps:.1f}s) | "
          f"Highlight={len(highlight)} adegan, {hl_cursor} frame ({hl_cursor/fps:.1f}s)")


if __name__ == "__main__":
    main()
```

## Lampiran: `scripts/make_contact_sheet.sh`

```bash
#!/usr/bin/env bash
# Pratinjau ringan + contact sheet yang mencakup SELURUH video.
# Per adegan diambil 2 frame: setelah animasi masuk selesai (~0.6s) dan menjelang transisi keluar.
# Pemakaian: bash scripts/make_contact_sheet.sh [MainStory|ShortVertical|HighlightVertical]
set -euo pipefail

COMP_ID="${1:-MainStory}"
FR="out/frames_$(date +%Y%m%d_%H%M%S)"   # folder baru tiap siklus; frame lama tidak dihapus
mkdir -p "$FR"

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
  ffmpeg -y -loglevel error -i out/preview.mp4 -vf "select=eq(n\,$f),scale=480:-2" -frames:v 1 "$FR/$(printf '%03d' $i).jpg"
  i=$((i+1))
done

COLS=4
ROWS=$(( (i + COLS - 1) / COLS ))
echo "[3/3] Menyusun contact sheet ${COLS}x${ROWS} dari $i frame..."
ffmpeg -y -loglevel error -framerate 1 -i "$FR/%03d.jpg" -vf "tile=${COLS}x${ROWS}:padding=6:color=black" -frames:v 1 out/contact_sheet.jpg

echo "Selesai! Periksa out/contact_sheet.jpg (urutan: per adegan [setelah masuk, sebelum keluar])"
```

## Lampiran: `scripts/asset_cache.py`

```python
#!/usr/bin/env python3
"""
asset_cache.py — Cache aset PNG hasil render di repo GitHub (private) agar bisa dipakai ulang.

Kunci cache = sha256 dari isi yang menentukan tampilan aset (komponen, props, style,
ukuran, dan isi file kode komponennya). Aset yang kuncinya sama tidak dirender ulang.

Struktur repo cache:
  assets/<key>.png
  index.json          { "<key>": {"name":..., "project":..., "size":"WxH", "created":...} }

Perintah (jalankan dari root proyek Remotion):
  python3 scripts/asset_cache.py init --repo PEMILIK/NAMA-REPO
  python3 scripts/asset_cache.py key  --spec spec.json            # cetak kunci
  python3 scripts/asset_cache.py get  --repo R --spec spec.json --dest public/cache/
        -> exit 0 + cetak path jika ADA di cache (HIT); exit 3 jika belum ada (MISS)
  python3 scripts/asset_cache.py put  --repo R --spec spec.json --file out/x.png
        -> commit + push PNG ke repo cache

spec.json contoh:
  {"name": "bg-hook", "project": "kemasan-kertas", "component": "src/stills/HookBg.tsx",
   "props": {"title": "..."}, "style": {...}, "width": 1080, "height": 1920,
   "deps": ["src/components/Art.tsx", "src/theme.ts"]}
  deps = file kode lain yang ikut menentukan tampilan; isinya ikut masuk kunci cache.

Opsi repo (untuk init/get/put):
  --branch asset-cache   simpan di branch ini (dibuat bila belum ada)
  --subdir asset-cache   simpan di subfolder ini di dalam repo
  --repo juga boleh path/URL git lokal (mis. untuk uji), selain PEMILIK/NAMA.
"""
import argparse
import datetime
import hashlib
import json
import os
import shutil
import subprocess
import sys

CACHE_DIR = os.path.expanduser("~/.remotion-asset-cache")
MAX_BYTES = 50 * 1024 * 1024
BRANCH = None   # diisi dari --branch
SUBDIR = ""     # diisi dari --subdir


def run(cmd, cwd=None, check=True):
    return subprocess.run(cmd, cwd=cwd, check=check, capture_output=True, text=True)


def compute_key(spec):
    payload = {k: spec.get(k) for k in ("component", "props", "style", "width", "height")}
    comp = spec.get("component")
    if comp and os.path.exists(comp):
        payload["componentHash"] = hashlib.sha256(open(comp, "rb").read()).hexdigest()
    deps = {}
    for d in sorted(spec.get("deps") or []):
        deps[d] = hashlib.sha256(open(d, "rb").read()).hexdigest() if os.path.exists(d) else "MISSING"
        if deps[d] == "MISSING":
            print(f"[WARN] deps {d} tidak ditemukan", file=sys.stderr)
    if deps:
        payload["deps"] = deps
    blob = json.dumps(payload, sort_keys=True, ensure_ascii=False).encode()
    return hashlib.sha256(blob).hexdigest()[:20]


def local_path(repo):
    name = repo.rstrip("/").replace("://", "_").replace("/", "__").replace(":", "_")
    return os.path.join(CACHE_DIR, name + (f"@{BRANCH}" if BRANCH else ""))


def root(path):
    """Folder tempat assets/ dan index.json (repo + --subdir)."""
    return os.path.join(path, SUBDIR) if SUBDIR else path


def remote_url(repo):
    return repo if ("://" in repo or repo.startswith(("/", ".", "~")) or repo.endswith(".git")) else f"https://github.com/{repo}.git"


def sync(repo):
    """Clone atau pull repo cache. Return path lokal, atau None jika tidak bisa diakses."""
    path = local_path(repo)
    try:
        if os.path.isdir(os.path.join(path, ".git")):
            has_remote = run(["git", "ls-remote", "--heads", "origin", BRANCH], cwd=path, check=False).stdout.strip() if BRANCH else "y"
            if has_remote:
                run(["git", "pull", "--ff-only", "-q", "origin"] + ([BRANCH] if BRANCH else []), cwd=path)
        else:
            os.makedirs(CACHE_DIR, exist_ok=True)
            url = remote_url(repo); use_gh = url == f"https://github.com/{repo}.git" and shutil.which("gh")
            clone = (lambda extra: ["gh", "repo", "clone", repo, path, "--", "-q"] + extra) if use_gh else (lambda extra: ["git", "clone", "-q", url, path] + extra)
            r = run(clone(["--branch", BRANCH, "--single-branch"] if BRANCH else []), check=False)
            if r.returncode != 0:
                shutil.rmtree(path, ignore_errors=True)
                run(clone([]))
                if BRANCH:
                    run(["git", "checkout", "-q", "-B", BRANCH], cwd=path)  # branch belum ada di remote: buat
        return path
    except subprocess.CalledProcessError as e:
        print(f"[WARN] Repo cache {repo} tidak bisa diakses: {(e.stderr or '').strip()[:200]}",
              file=sys.stderr)
        return path if os.path.isdir(path) else None


def load_index(path):
    f = os.path.join(root(path), "index.json")
    return json.load(open(f, encoding="utf-8")) if os.path.exists(f) else {}


def cmd_init(a):
    if not shutil.which("gh"):
        sys.exit("[ERROR] gh CLI tidak ada; buat repo private secara manual di GitHub.")
    r = run(["gh", "repo", "view", a.repo, "--json", "visibility"], check=False)
    if r.returncode == 0:
        vis = json.loads(r.stdout).get("visibility")
        print(f"Repo {a.repo} sudah ada (visibility: {vis}).")
        if vis != "PRIVATE":
            print("[WARN] Repo cache BUKAN private. Aset bisa dilihat publik.", file=sys.stderr)
    else:
        run(["gh", "repo", "create", a.repo, "--private",
             "--description", "Cache aset PNG remotion-storyteller"])
        print(f"Repo private {a.repo} dibuat.")
    path = sync(a.repo)
    if path and not os.path.exists(os.path.join(root(path), "index.json")):
        os.makedirs(os.path.join(root(path), "assets"), exist_ok=True)
        json.dump({}, open(os.path.join(root(path), "index.json"), "w"))
        run(["git", "add", "-A"], cwd=path)
        run(["git", "commit", "-qm", "init cache aset"], cwd=path)
        run(["git", "push", "-q", "-u", "origin", "HEAD"], cwd=path, check=False)


def cmd_key(a):
    print(compute_key(json.load(open(a.spec, encoding="utf-8"))))


def cmd_get(a):
    spec = json.load(open(a.spec, encoding="utf-8"))
    key = compute_key(spec)
    path = sync(a.repo)
    src = os.path.join(root(path), "assets", f"{key}.png") if path else None
    if src and os.path.exists(src):
        os.makedirs(a.dest, exist_ok=True)
        dst = os.path.join(a.dest, f"{spec.get('name', key)}.png")
        shutil.copy2(src, dst)
        print(dst)
        print(f"HIT {key}", file=sys.stderr)
        sys.exit(0)
    print(f"MISS {key}", file=sys.stderr)
    sys.exit(3)


def cmd_put(a):
    spec = json.load(open(a.spec, encoding="utf-8"))
    key = compute_key(spec)
    if os.path.getsize(a.file) > MAX_BYTES:
        sys.exit("[WARN] File > 50 MB, tidak diunggah ke cache.")
    path = sync(a.repo)
    if not path:
        sys.exit("[WARN] Repo cache tidak bisa diakses; aset hanya tersimpan lokal.")
    os.makedirs(os.path.join(root(path), "assets"), exist_ok=True)
    shutil.copy2(a.file, os.path.join(root(path), "assets", f"{key}.png"))
    idx = load_index(path)
    idx[key] = {"name": spec.get("name"), "project": spec.get("project"),
                "size": f"{spec.get('width')}x{spec.get('height')}",
                "created": datetime.datetime.now().isoformat(timespec="seconds")}
    json.dump(idx, open(os.path.join(root(path), "index.json"), "w", encoding="utf-8"),
              indent=2, ensure_ascii=False)
    rel = (SUBDIR + "/") if SUBDIR else ""
    run(["git", "add", f"{rel}assets/{key}.png", f"{rel}index.json"], cwd=path)
    run(["git", "commit", "-qm", f"aset {spec.get('name', key)} ({key})"], cwd=path, check=False)
    r = run(["git", "push", "-q", "-u", "origin", "HEAD"], cwd=path, check=False)
    if r.returncode != 0:
        sys.exit(f"[WARN] Push gagal ({r.stderr.strip()[:200]}); commit tersimpan lokal, "
                 f"push ulang nanti.")
    print(f"OK disimpan ke {a.repo}{'@' + BRANCH if BRANCH else ''}: {rel}assets/{key}.png")


def main():
    p = argparse.ArgumentParser()
    sub = p.add_subparsers(dest="cmd", required=True)
    for name in ("init", "key", "get", "put"):
        s = sub.add_parser(name)
        if name != "key":
            s.add_argument("--repo", required=True)
            s.add_argument("--branch", default=None)
            s.add_argument("--subdir", default="")
        if name != "init":
            s.add_argument("--spec", required=True)
        if name == "get":
            s.add_argument("--dest", default="public/cache/")
        if name == "put":
            s.add_argument("--file", required=True)
    a = p.parse_args()
    global BRANCH, SUBDIR
    BRANCH, SUBDIR = getattr(a, "branch", None), (getattr(a, "subdir", "") or "").strip("/")
    {"init": cmd_init, "key": cmd_key, "get": cmd_get, "put": cmd_put}[a.cmd](a)


if __name__ == "__main__":
    main()
```