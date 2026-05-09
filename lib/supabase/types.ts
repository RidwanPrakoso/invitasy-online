// lib/supabase/types.ts
// Generate ulang dengan: npx supabase gen types typescript --project-id <id> > lib/supabase/types.ts

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export interface Database {
  public: {
    Tables: {
      undangan: {
        Row: {
          id: string
          user_id: string | null
          slug: string
          mempelai_1: string
          mempelai_2: string
          ortu_mempelai_1: string | null
          ortu_mempelai_2: string | null
          foto_mempelai_1: string | null
          foto_mempelai_2: string | null
          ig_mempelai_1: string | null
          ig_mempelai_2: string | null
          background_type: string | null
          animation_type: string | null
          custom_bg_url: string | null
          bg_hero: string | null
          bg_mempelai: string | null
          bg_acara: string | null
          bg_galeri: string | null
          bg_ucapan: string | null
          tanggal_akad: string | null
          tanggal_resepsi: string | null
          lokasi_akad: string | null
          lokasi_resepsi: string | null
          alamat_akad: string | null
          alamat_resepsi: string | null
          maps_url: string | null
          tema: string | null
          foto_url: string | null
          music_url: string | null
          gallery_urls: string[] | null
          quote: string | null
          wedding_gift: Json | null
          aktif: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['undangan']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['undangan']['Insert']>
      }
      tamu: {
        Row: {
          id: string
          undangan_id: string
          nama: string
          no_wa: string | null
          email: string | null
          kategori: string
          link_token: string
          blast_status: string
          blast_at: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['tamu']['Row'], 'id' | 'link_token' | 'created_at'>
        Update: Partial<Database['public']['Tables']['tamu']['Insert']>
      }
      rsvp: {
        Row: {
          id: string
          tamu_id: string
          undangan_id: string
          status: 'hadir' | 'tidak' | 'ragu'
          jumlah_tamu: number
          ucapan: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['rsvp']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['rsvp']['Insert']>
      }
      guestbook: {
        Row: {
          id: string
          undangan_id: string
          nama: string
          ucapan: string
          tampil: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['guestbook']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['guestbook']['Insert']>
      }
    }
  }
}

// Shorthand types
export type Undangan = Database['public']['Tables']['undangan']['Row']
export type Tamu = Database['public']['Tables']['tamu']['Row']
export type RSVP = Database['public']['Tables']['rsvp']['Row']
export type Guestbook = Database['public']['Tables']['guestbook']['Row']
