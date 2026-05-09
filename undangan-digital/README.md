# Undangan Digital — Next.js + Supabase

## Tech Stack
- **Frontend**: Next.js 14 (App Router)
- **Database + Auth**: Supabase (PostgreSQL + Auth)
- **Hosting**: Vercel (gratis)
- **WA Blast**: Fonnte (opsional)

---

## Struktur Folder

```
undangan-digital/
├── app/
│   ├── u/[slug]/
│   │   ├── page.tsx          # Halaman undangan (publik)
│   │   └── RSVPForm.tsx      # Form RSVP (client component)
│   ├── dashboard/
│   │   └── page.tsx          # Dashboard admin
│   ├── login/
│   │   └── page.tsx          # Halaman login/register
│   └── api/
│       └── rsvp/
│           └── route.ts      # API endpoint RSVP
├── lib/
│   └── supabase/
│       ├── client.ts         # Browser client
│       ├── server.ts         # Server client
│       └── types.ts          # TypeScript types
├── supabase/
│   └── schema.sql            # Schema database
├── middleware.ts             # Auth middleware
└── .env.local.example        # Template env vars
```

---

## Step 1 — Buat Project Next.js

```bash
npx create-next-app@latest undangan-digital \
  --typescript --tailwind --app --src-dir no \
  --import-alias "@/*"

cd undangan-digital
```

---

## Step 2 — Install Dependencies

```bash
npm install @supabase/supabase-js @supabase/ssr
```

---

## Step 3 — Setup Supabase

1. Buka https://supabase.com → New project
2. Pilih nama project, password database, region (Southeast Asia)
3. Tunggu project ready (~1 menit)
4. Buka **SQL Editor** → paste isi file `supabase/schema.sql` → Run

---

## Step 4 — Konfigurasi Environment

```bash
cp .env.local.example .env.local
```

Isi nilai di `.env.local`:
- Buka Supabase Dashboard → Project Settings → API
- Copy **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
- Copy **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Copy **service_role key** → `SUPABASE_SERVICE_ROLE_KEY`

---

## Step 5 — Copy File Project

Copy semua file dari folder ini ke project Next.js lo:

```bash
# Copy lib/
cp -r lib/ ~/undangan-digital/lib/

# Copy app/
cp -r app/ ~/undangan-digital/app/

# Copy middleware
cp middleware.ts ~/undangan-digital/middleware.ts
```

---

## Step 6 — Jalankan Dev Server

```bash
npm run dev
```

Buka http://localhost:3000

- `/login` — Register akun admin dulu
- `/dashboard` — Buat undangan pertama
- `/u/[slug]?t=[token]` — Preview halaman tamu

---

## Step 7 — Deploy ke Vercel

```bash
npm install -g vercel
vercel

# Set environment variables di Vercel Dashboard:
# NEXT_PUBLIC_SUPABASE_URL
# NEXT_PUBLIC_SUPABASE_ANON_KEY
# SUPABASE_SERVICE_ROLE_KEY
```

Atau connect GitHub repo ke Vercel untuk auto-deploy.

---

## Cara Kerja Link Tamu

Setiap tamu mendapat link unik:
```
https://undanganlo.vercel.app/u/ariana-rizky?t=abc123xyz
```

- `ariana-rizky` = slug undangan
- `abc123xyz` = `link_token` unik per tamu (di-generate otomatis Supabase)

Tamu buka link → sistem kenali siapa tamu-nya → form RSVP muncul dengan nama mereka.

---

## Fitur Selanjutnya (Roadmap)

- [ ] Form buat undangan baru di dashboard
- [ ] Import tamu via Excel (xlsx)
- [ ] Blast WA via Fonnte API
- [ ] Dashboard RSVP dengan chart real-time
- [ ] Auto reminder H-7, H-3, H-1
- [ ] QR code check-in hari H
- [ ] Multi-tema (Sage Garden, Midnight Type)

---

## Generate TypeScript Types dari Supabase

Setelah schema dijalankan, lo bisa auto-generate types:

```bash
npx supabase login
npx supabase gen types typescript \
  --project-id <your-project-id> \
  > lib/supabase/types.ts
```

---

## Supabase Auth Settings

Di Supabase Dashboard → Authentication → Settings:
- **Site URL**: `https://undanganlo.vercel.app`
- **Redirect URLs**: `https://undanganlo.vercel.app/**`
- Email confirmation: bisa dimatikan untuk development
