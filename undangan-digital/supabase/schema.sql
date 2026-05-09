-- ==============================================
-- UNDANGAN DIGITAL — Supabase Schema
-- Jalankan file ini di Supabase SQL Editor
-- ==============================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ==============================================
-- TABLE: undangan
-- ==============================================
create table public.undangan (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid references auth.users(id) on delete cascade,
  slug          text unique not null,           -- URL: /u/ariana-rizky
  mempelai_1    text not null,
  mempelai_2    text not null,
  tanggal_akad  timestamptz,
  tanggal_resepsi timestamptz,
  lokasi_akad   text,
  lokasi_resepsi text,
  alamat_akad   text,
  alamat_resepsi text,
  maps_url      text,
  tema          text default 'mono',            -- mono | sage | midnight
  foto_url      text,
  aktif         boolean default true,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- ==============================================
-- TABLE: tamu
-- ==============================================
create table public.tamu (
  id            uuid primary key default uuid_generate_v4(),
  undangan_id   uuid references public.undangan(id) on delete cascade,
  nama          text not null,
  no_wa         text,
  email         text,
  kategori      text default 'umum',            -- vip | keluarga | umum
  link_token    text unique default encode(gen_random_bytes(12), 'hex'),
  blast_status  text default 'pending',         -- pending | sent | failed
  blast_at      timestamptz,
  created_at    timestamptz default now()
);

-- ==============================================
-- TABLE: rsvp
-- ==============================================
create table public.rsvp (
  id            uuid primary key default uuid_generate_v4(),
  tamu_id       uuid references public.tamu(id) on delete cascade,
  undangan_id   uuid references public.undangan(id) on delete cascade,
  status        text not null check (status in ('hadir','tidak','ragu')),
  jumlah_tamu   integer default 1 check (jumlah_tamu >= 1),
  ucapan        text,
  created_at    timestamptz default now(),
  -- satu tamu hanya bisa RSVP satu kali
  unique(tamu_id)
);

-- ==============================================
-- TABLE: guestbook
-- ==============================================
create table public.guestbook (
  id            uuid primary key default uuid_generate_v4(),
  undangan_id   uuid references public.undangan(id) on delete cascade,
  nama          text not null,
  ucapan        text not null,
  tampil        boolean default true,
  created_at    timestamptz default now()
);

-- ==============================================
-- ROW LEVEL SECURITY (RLS)
-- ==============================================

alter table public.undangan     enable row level security;
alter table public.tamu         enable row level security;
alter table public.rsvp         enable row level security;
alter table public.guestbook    enable row level security;

-- undangan: hanya owner yang bisa CRUD
create policy "owner full access" on public.undangan
  for all using (auth.uid() = user_id);

-- undangan: publik bisa baca by slug (untuk halaman tamu)
create policy "public read by slug" on public.undangan
  for select using (aktif = true);

-- tamu: hanya owner undangan yang bisa CRUD
create policy "owner manages tamu" on public.tamu
  for all using (
    undangan_id in (
      select id from public.undangan where user_id = auth.uid()
    )
  );

-- tamu: publik bisa baca via link_token (untuk RSVP page)
create policy "public read by token" on public.tamu
  for select using (true);

-- rsvp: siapa saja bisa insert (tamu submit RSVP)
create policy "anyone can rsvp" on public.rsvp
  for insert with check (true);

-- rsvp: owner bisa baca semua RSVP undangannya
create policy "owner reads rsvp" on public.rsvp
  for select using (
    undangan_id in (
      select id from public.undangan where user_id = auth.uid()
    )
  );

-- guestbook: siapa saja bisa insert
create policy "anyone can post guestbook" on public.guestbook
  for insert with check (true);

-- guestbook: publik bisa baca yang tampil = true
create policy "public reads guestbook" on public.guestbook
  for select using (tampil = true);

-- owner bisa kelola guestbook
create policy "owner manages guestbook" on public.guestbook
  for all using (
    undangan_id in (
      select id from public.undangan where user_id = auth.uid()
    )
  );

-- ==============================================
-- INDEXES untuk performa
-- ==============================================
create index on public.undangan (slug);
create index on public.undangan (user_id);
create index on public.tamu (undangan_id);
create index on public.tamu (link_token);
create index on public.rsvp (undangan_id);
create index on public.rsvp (tamu_id);
create index on public.guestbook (undangan_id);

-- ==============================================
-- FUNCTION: auto update updated_at
-- ==============================================
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger undangan_updated_at
  before update on public.undangan
  for each row execute function update_updated_at();
