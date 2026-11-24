#!/usr/bin/env node
/**
 * generate-tts.js
 * Membuka Gemini (share link) dengan Playwright, mengirim teks dari
 * public/naskah.json, lalu menyimpan hasil suara ke public/voiceover.mp3.
 *
 * Env:
 *   GEMINI_AUTH_JSON   (wajib) storageState Playwright hasil login Google.
 *                      Boleh berupa JSON mentah, JSON base64, atau path ke file.
 *   GEMINI_URL         (opsional) default https://share.gemini.google/pZmxzPm30gTV
 *   TTS_TIMEOUT_MS     (opsional) default 240000
 *   HEADLESS           (opsional) "false" untuk melihat browser saat debug lokal
 *   GEMINI_INPUT_SELECTOR / GEMINI_DOWNLOAD_SELECTOR (opsional) override selector
 */
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const { chromium } = require("playwright");

const ROOT = path.resolve(__dirname, "..");
const NASKAH = path.join(ROOT, "public", "naskah.json");
const OUTPUT = path.join(ROOT, "public", "voiceover.mp3");
const DEBUG_DIR = path.join(ROOT, "tts-debug");
const URL = process.env.GEMINI_URL || "https://share.gemini.google/pZmxzPm30gTV";
const TIMEOUT = Number(process.env.TTS_TIMEOUT_MS || 240000);

const INPUT_SELECTORS = [
  process.env.GEMINI_INPUT_SELECTOR,
  "rich-textarea .ql-editor",
  'div[contenteditable="true"][role="textbox"]',
  'div[contenteditable="true"]',
  "textarea",
].filter(Boolean);

const DOWNLOAD_SELECTORS = [
  process.env.GEMINI_DOWNLOAD_SELECTOR,
  'button[aria-label*="Download" i]',
  'button[aria-label*="Unduh" i]',
  'a[download]',
  'button:has-text("Download")',
  'button:has-text("Unduh")',
].filter(Boolean);

function loadStorageState() {
  const raw = process.env.GEMINI_AUTH_JSON;
  if (!raw) throw new Error("GEMINI_AUTH_JSON belum di-set (storageState Playwright hasil login Google).");
  const trimmed = raw.trim();
  if (trimmed.startsWith("{")) return JSON.parse(trimmed);
  if (fs.existsSync(trimmed)) return JSON.parse(fs.readFileSync(trimmed, "utf8"));
  return JSON.parse(Buffer.from(trimmed, "base64").toString("utf8"));
}

function loadText() {
  const naskah = JSON.parse(fs.readFileSync(NASKAH, "utf8"));
  if (typeof naskah.voiceover === "string" && naskah.voiceover.trim()) return naskah.voiceover.trim();
  const scenes = Array.isArray(naskah.scenes) ? naskah.scenes : [];
  const text = scenes.map((s) => (s.teks || "").trim()).filter(Boolean).join("\n\n");
  if (!text) throw new Error("public/naskah.json tidak berisi teks (field 'voiceover' atau scenes[].teks).");
  return text;
}

async function firstVisible(page, selectors, timeout) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    for (const sel of selectors) {
      const loc = page.locator(sel).last();
      if (await loc.isVisible().catch(() => false)) return loc;
    }
    await page.waitForTimeout(1000);
  }
  return null;
}

/** Simpan buffer audio; konversi ke mp3 dengan ffmpeg bila formatnya bukan mp3. */
function saveAudio(buffer, hint) {
  fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
  const isMp3 = buffer.slice(0, 3).toString() === "ID3" || (buffer[0] === 0xff && (buffer[1] & 0xe0) === 0xe0);
  if (isMp3) {
    fs.writeFileSync(OUTPUT, buffer);
  } else {
    const tmp = path.join(path.dirname(OUTPUT), `voiceover.tmp${path.extname(hint || "") || ".bin"}`);
    fs.writeFileSync(tmp, buffer);
    execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", tmp, "-codec:a", "libmp3lame", "-q:a", "2", OUTPUT]);
    fs.unlinkSync(tmp);
  }
  console.log(`✅ Voiceover tersimpan: ${path.relative(ROOT, OUTPUT)} (${fs.statSync(OUTPUT).size} bytes)`);
}

async function main() {
  const text = loadText();
  console.log(`📝 Teks naskah: ${text.split(/\s+/).length} kata`);

  const browser = await chromium.launch({ headless: process.env.HEADLESS !== "false" });
  const context = await browser.newContext({
    storageState: loadStorageState(),
    acceptDownloads: true,
    locale: "id-ID",
    viewport: { width: 1366, height: 900 },
  });
  const page = await context.newPage();

  // Tangkap respons audio di jaringan sebagai cadangan bila tombol unduh tidak ada.
  let capturedAudio = null;
  page.on("response", async (res) => {
    try {
      const type = res.headers()["content-type"] || "";
      if (/^audio\//.test(type) || /\.(mp3|wav|ogg|m4a)(\?|$)/.test(res.url())) {
        const body = await res.body();
        if (body.length > 10_000) capturedAudio = { body, url: res.url(), type };
      }
    } catch { /* abaikan */ }
  });

  try {
    console.log(`🌐 Membuka ${URL}`);
    await page.goto(URL, { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.waitForLoadState("networkidle", { timeout: 30000 }).catch(() => {});

    if (/accounts\.google\.com/.test(page.url())) {
      throw new Error("Diarahkan ke halaman login Google — GEMINI_AUTH_JSON kedaluwarsa/tidak valid.");
    }

    const input = await firstVisible(page, INPUT_SELECTORS, 60000);
    if (!input) throw new Error("Kolom input Gemini tidak ditemukan. Set GEMINI_INPUT_SELECTOR.");

    await input.click();
    await input.fill(text).catch(async () => {
      await page.keyboard.insertText(text);
    });
    await page.keyboard.press("Enter");
    console.log("⏳ Menunggu Gemini menghasilkan audio…");

    const deadline = Date.now() + TIMEOUT;
    while (Date.now() < deadline) {
      // 1) Tombol unduh -> event download
      for (const sel of DOWNLOAD_SELECTORS) {
        const btn = page.locator(sel).last();
        if (await btn.isVisible().catch(() => false)) {
          const [download] = await Promise.all([
            page.waitForEvent("download", { timeout: 30000 }),
            btn.click(),
          ]).catch(() => [null]);
          if (download) {
            const tmp = await download.path();
            saveAudio(fs.readFileSync(tmp), download.suggestedFilename());
            return;
          }
        }
      }
      // 2) Elemen <audio src=...>
      const src = await page.locator("audio[src]").last().getAttribute("src").catch(() => null);
      if (src) {
        const body = src.startsWith("data:")
          ? Buffer.from(src.split(",")[1], "base64")
          : await page.evaluate(async (u) => {
              const r = await fetch(u);
              return Array.from(new Uint8Array(await r.arrayBuffer()));
            }, src).then((arr) => Buffer.from(arr));
        if (body.length > 10_000) {
          saveAudio(body, src);
          return;
        }
      }
      // 3) Respons audio dari jaringan
      if (capturedAudio) {
        saveAudio(capturedAudio.body, capturedAudio.url);
        return;
      }
      await page.waitForTimeout(2000);
    }
    throw new Error(`Audio tidak muncul dalam ${TIMEOUT / 1000} detik.`);
  } catch (err) {
    fs.mkdirSync(DEBUG_DIR, { recursive: true });
    await page.screenshot({ path: path.join(DEBUG_DIR, "error.png"), fullPage: true }).catch(() => {});
    fs.writeFileSync(path.join(DEBUG_DIR, "page.html"), await page.content().catch(() => ""));
    throw err;
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(`❌ generate-tts gagal: ${err.message}`);
  process.exit(1);
});
