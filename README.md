# 🌌 Nexus - Portal Manajemen Organisasi

Nexus adalah sistem informasi berbasis web modern yang dirancang khusus untuk mengelola keanggotaan, acara, dan absensi kegiatan di lingkungan UKM Computer Education, Universitas Muhammadiyah Cirebon.

Dibangun dengan fokus pada kecepatan, efisiensi resource, dan keamanan menggunakan arsitektur serverless.

## ✨ Fitur Utama

- **🔒 Autentikasi Aman:** Login instan menggunakan akun Google (SSO) via Supabase Auth.
- **👥 Manajemen Peran Terpusat (RBAC):** Sistem role dinamis mulai dari Tamu, Menunggu Persetujuan, Anggota, hingga Pengurus.
- **📅 Manajemen Kajian & Acara:** Pembuatan acara dengan batas waktu pendaftaran (Buka/Tutup kegiatan).
- **✅ Absensi Real-time:** Pengurus dapat melakukan *tracking* kehadiran anggota hanya dengan satu kali klik tanpa *refresh* halaman.
- **⚡ Serverless Ready:** Dioptimalkan penuh untuk berjalan di jaringan global Cloudflare Pages.

## 🛠️ Tech Stack

- **Framework:** [SvelteKit](https://kit.svelte.dev/) (SSR)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Database & Auth:** [Supabase](https://supabase.com/) (PostgreSQL)
- **Deployment:** [Cloudflare Pages](https://pages.cloudflare.com/) (menggunakan `@sveltejs/adapter-cloudflare`)
- **Package Manager:** `pnpm` (Hemat resource dan super cepat)

## 🚀 Panduan Instalasi Lokal

### Prasyarat
Pastikan mesin kamu sudah terinstal:
- Node.js (versi 20 atau 22 sangat disarankan)
- `pnpm`
- Git

### Langkah Instalasi

1. **Clone repositori ini**
```bash
   git clone [https://github.com/hamadaharu/nexus.git](https://github.com/hamadaharu/nexus.git)
   cd nexus
```

2. **Install dependensi**
```bash
pnpm install
```

3. **Konfigurasi Environment Variables**
Buat file `.env` di direktori root aplikasi (copy dari `.env.example` jika ada), dan isikan kredensial Supabase kamu. 
   
> **⚠️ PERINGATAN KRUSIAL:** Pastikan kamu menyalin API Key secara utuh. Perhatikan dengan saksama karakter terakhir pada *anon key* (jangan sampai karakter strip `-` tertinggal saat nge-blok teks, atau server akan menolak akses! SAYA SEMPAT NGGAK TIDUR GARA GARA INI).

```
PUBLIC_SUPABASE_URL="https://xxxxxxxxxxxx.supabase.co"
PUBLIC_SUPABASE_ANON_KEY="eyJhbG...-xxx"
```

4. **Jalankan server pengembangan**
```bash
pnpm dev
```
Aplikasi akan berjalan di `http://localhost:5173`.

## ☁️ Panduan Deployment (Cloudflare Pages)

Aplikasi ini menggunakan adapter khusus Cloudflare. Saat melakukan *setup* di dashboard Cloudflare, pastikan:

1. **Build Command:** `pnpm build`
2. **Build Output Directory:** `.svelte-kit/cloudflare`
3. **Environment Variables:** Masukkan variabel Supabase di menu **Settings > Environment variables** untuk *Production*.
4. **Node.js Version:** Set variabel `NODE_VERSION` ke `20`.
5. **Compatibility Flags:** Tambahkan *flag* `nodejs_compat` agar SvelteKit SSR dapat merender fungsi server dengan sempurna.

## 🗺️ Roadmap Pengembangan Selanjutnya

Aplikasi ini akan terus dikembangkan untuk mendukung ekosistem digital organisasi:
- [ ] Integrasi Cloud Storage untuk unggah poster & dokumentasi kajian.
- [ ] Sistem generator *E-Certificate* otomatis pasca-acara.
- [ ] Modul Computer Based Test (CBT) mini untuk evaluasi pasca-kajian/bootcamp.
- [ ] Integrasi bot notifikasi WhatsApp.
