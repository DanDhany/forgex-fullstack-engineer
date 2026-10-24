# ForgeX Full-Stack Engineer v1.1.8 — Landing Page

Dokumentasi dan panduan arsitektur visual landing page resmi untuk **ForgeX Full-Stack Engineer v1.1.8** di direktori `site/`, siap dipublikasikan ke GitHub Pages.

---

## 🏛️ Konsep Visual: Architectural Blueprint & Forge Workshop

Desain landing page ini menjauhi pola SaaS generik (kartu repetitif dan neon glow tanpa makna) dengan menerapkan konsep **Architectural Blueprint & Forge Workshop** (bengkel teknik presisi):

1. **Variasi Komposisi Antarseksi (Non-Repetitive Layouts):**
   - **Hero & Diagnostic Telemetry:** Asymmetric layout dengan command strip cepat dan terminal diagnostik langsung 3 tab (`agent-terminal.sh`, `WORK-STATE.md`, `contract-trace.json`).
   - **01 / Workflow Pipeline:** Skema jalur kontinu (*Continuous Pipeline Schematic*) dengan 5 stasiun teknis interaktif (`Inspect` &rarr; `Design` &rarr; `Connect` &rarr; `Verify` &rarr; `Handoff`) dan split display naratif + terminal.
   - **02 / Comparative Ledger:** Ledger komparatif editorial 2 kolom yang membedah kegagalan agen konvensional versus invarian sistemik ForgeX tanpa kartu bertumpuk.
   - **03 / Modular Ecosystem Shelf:** Rak modular 4 kolom terintegrasi dengan pembatas blueprint vertikal dan spesifikasi framework nyata.
   - **04 / Command Deck Console:** Konsol agen yang ramping, meratakan hierarki bersarang (tanpa *box-inside-box*) dengan pemilihan 8 agen dan tombol copy langsung.
   - **05 / Repository Spec Tree:** Manifest pohon berkas repositori autentik (`├── product.md`, `├── WORK-STATE.md [LIVING MEMORY]`), mencerminkan struktur nyata proyek full-stack.
   - **06 / Verified Answers FAQ:** Akordeon tipografis bersih dengan garis batas halus.

2. **Proporsi Warna & Tonal Depth:**
   - **Forge Terracotta Ember (`#EA580C` light / `#FB923C` dark):** Aksen terukur pada titik aktif, indikator status, dan sorotan kunci.
   - **Dark Mode (`#0A0D12` kanvas, `#12161D` panel, `#1A212B` active, `#222934` border):** Tonal depth bertingkat nyata, bukan sekadar navy datar.
   - **Light Mode (`#F7F5F0` warm stone kanvas, `#FFFFFF` panel, `#DCD8CD` border):** Nuansa kertas kalkir arsitektural dengan kontras tinggi teks karbon (`#181B1E`).

3. **Interaktivitas Mandiri (Zero Runtime Dependencies):**
   - Theme toggle (Dark / Light / System) dengan `localStorage`.
   - Workflow stepper interaktif.
   - Agent compatibility hub (8 profil agen dengan direktori dan perintah akurat).
   - Copy-to-clipboard dengan toast feedback.
   - Responsive mobile navigation drawer.

---

## 📂 Struktur direktori `site/`

```text
site/
├── index.html            # Markup semantik landing page
├── tasks.html            # Task Creation Workbench UI
├── tasks.js              # Client logic: validasi, loading, duplicate-guard, SQLite ledger sync
├── style.css             # Desain token, tema light/dark, responsive layout
├── app.js                # Interaktivitas client-side landing page
├── README.md             # Dokumentasi landing page & task workbench
├── assets/
│   ├── favicon.svg       # Favicon SVG
│   ├── logo.svg          # Logo ForgeX
│   └── forgex-hero.svg   # Hero SVG visual workflow
└── screenshots/          # Bukti QA aktual
    ├── before/           # Baseline screenshot sebelum critique pass (14 file)
    ├── tasks-workbench-desktop-dark.png
    ├── tasks-workbench-desktop-light.png
    ├── tasks-workbench-mobile-dark.png
    ├── tasks-workbench-mobile-light.png
    └── ...
```

---

## 🛠️ Task Creation Workbench & API

Aplikasi menyediakan modul pembuatan task dengan validasi ganda (frontend & backend) dan persistensi native SQLite:

### Menjalankan Server Lokal:
```bash
npm run serve
# Menjalankan server pada http://localhost:3000
# - Landing Page: http://localhost:3000/index.html
# - Task Workbench: http://localhost:3000/tasks.html
# - Tasks API: http://localhost:3000/api/tasks
```

### Kontrak Endpoint API (`/api/tasks`):
- `GET /api/tasks` &rarr; Mengembalikan daftar task (`200 OK`, JSON array).
- `POST /api/tasks` &rarr; Membuat task baru (`201 Created` atau `422 Unprocessable Entity`).
  - Request Body:
    ```json
    {
      "title": "Enforce contract boundary",
      "priority": "high",
      "description": "Optional context..."
    }
    ```
  - Aturan Validasi Server:
    - `title`: Wajib, non-kosong, 1–120 karakter.
    - `priority`: Wajib, enum terbatas: `low`, `medium`, `high`, `urgent`.
    - `description`: Opsional, maksimal 1000 karakter.
  - Proteksi:
    - Input invalid menghasilkan `422 Unprocessable Entity` dengan rincian field error.
    - Malformed JSON menghasilkan `400 Bad Request`.
    - Duplicate submission guard mencegah pengiriman ganda saat in-flight.

---

## 🧪 Verifikasi & Pengujian

Jalankan test suite lengkap (unit test, contract check, regression test, dan automated Playwright browser QA):

```bash
npm test
```

Automated browser QA memeriksa `scrollWidth <= clientWidth` secara ketat pada 7 viewport (320, 360, 390, 430, 768, 1280, 1440px) pada kedua tema serta alur penuh Task Workbench.
