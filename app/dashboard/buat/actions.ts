'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function createUndangan(prevState: any, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  const slugRaw = formData.get('slug') as string
  const slug = slugRaw.toLowerCase().replace(/\s+/g, '-')
  const mempelai_1 = formData.get('mempelai_1') as string
  const mempelai_2 = formData.get('mempelai_2') as string
  
  // Combine Parent Names
  const ayah_1 = formData.get('ayah_1') as string
  const ibu_1 = formData.get('ibu_1') as string
  const ortu_mempelai_1 = ayah_1 && ibu_1 ? `${ayah_1} & ${ibu_1}` : (ayah_1 || ibu_1 || '')

  const ayah_2 = formData.get('ayah_2') as string
  const ibu_2 = formData.get('ibu_2') as string
  const ortu_mempelai_2 = ayah_2 && ibu_2 ? `${ayah_2} & ${ibu_2}` : (ayah_2 || ibu_2 || '')
  
  const tanggal_akad = formData.get('tanggal_akad') as string
  const tanggal_resepsi = formData.get('tanggal_resepsi') as string
  const lokasi_akad = formData.get('lokasi_akad') as string
  const lokasi_resepsi = formData.get('lokasi_resepsi') as string
  const alamat_akad = formData.get('alamat_akad') as string
  const alamat_resepsi = formData.get('alamat_resepsi') as string
  const maps_url_akad = formData.get('maps_url_akad') as string
  const maps_url_resepsi = formData.get('maps_url_resepsi') as string
  const maps_url = maps_url_resepsi || maps_url_akad || ''
  const tema = formData.get('tema') as string
  const quote = formData.get('quote') as string
  const ig_mempelai_1 = formData.get('ig_mempelai_1') as string
  const ig_mempelai_2 = formData.get('ig_mempelai_2') as string

  // Process Wedding Gift (JSON)
  const wedding_gift = []
  const bank1 = formData.get('bank_name_1') as string
  if (bank1) {
    wedding_gift.push({ bank: bank1, acc: formData.get('bank_acc_1'), owner: formData.get('bank_owner_1') })
  }
  const bank2 = formData.get('bank_name_2') as string
  if (bank2) {
    wedding_gift.push({ bank: bank2, acc: formData.get('bank_acc_2'), owner: formData.get('bank_owner_2') })
  }

  const uploadFile = async (fieldName: string, prefix: string) => {
    const file = formData.get(fieldName) as File
    if (file && file.size > 0) {
      const fileName = `${user.id}/${prefix}-${Date.now()}-${file.name}`
      const { error } = await supabase.storage.from('invitation-assets').upload(fileName, file)
      if (!error) {
        const { data } = supabase.storage.from('invitation-assets').getPublicUrl(fileName)
        return data.publicUrl
      }
    }
    return null
  }

  const foto_url = await uploadFile('foto_file', 'main')
  const foto_mempelai_1 = await uploadFile('foto_mempelai_1_file', 'm1')
  const foto_mempelai_2 = await uploadFile('foto_mempelai_2_file', 'm2')
  
  const bg_hero = await uploadFile('bg_hero_file', 'bg-hero')
  const bg_mempelai = await uploadFile('bg_mempelai_file', 'bg-mempelai')
  const bg_acara = await uploadFile('bg_acara_file', 'bg-acara')
  const bg_galeri = await uploadFile('bg_galeri_file', 'bg-galeri')
  const bg_ucapan = await uploadFile('bg_ucapan_file', 'bg-ucapan')

  // --- UPLOAD MUSIK ---
  let final_music_url = null
  const musicFile = formData.get('music_file') as File
  if (musicFile && musicFile.size > 0) {
    if (musicFile.size > 10 * 1024 * 1024) {
      return { error: 'File musik terlalu besar! Maksimal adalah 10MB.' }
    }
    const fileName = `${user.id}/music-${Date.now()}-${musicFile.name}`
    const { error: uploadError } = await supabase.storage.from('invitation-assets').upload(fileName, musicFile)
    if (!uploadError) {
      const { data: publicUrl } = supabase.storage.from('invitation-assets').getPublicUrl(fileName)
      final_music_url = publicUrl.publicUrl
    } else {
      return { error: `Gagal upload musik: ${uploadError.message}` }
    }
  }

  // Handle Gallery
  const gallery_urls: string[] = []
  const galleryFiles = formData.getAll('gallery_files') as File[]
  for (const file of galleryFiles) {
    if (file.size > 0) {
      const fileName = `${user.id}/gallery-${Date.now()}-${file.name}`
      const { error } = await supabase.storage.from('invitation-assets').upload(fileName, file)
      if (!error) {
        const { data: publicUrl } = supabase.storage.from('invitation-assets').getPublicUrl(fileName)
        gallery_urls.push(publicUrl.publicUrl)
      }
    }
  }

  const insertData: any = {
    user_id: user.id,
    slug: slug.toLowerCase().replace(/\s+/g, '-'),
    mempelai_1,
    mempelai_2,
    ortu_mempelai_1,
    ortu_mempelai_2,
    tanggal_akad: tanggal_akad ? new Date(tanggal_akad).toISOString() : null,
    tanggal_resepsi: tanggal_resepsi ? new Date(tanggal_resepsi).toISOString() : null,
    lokasi_akad,
    lokasi_resepsi,
    alamat_akad,
    alamat_resepsi,
    maps_url_akad,
    maps_url_resepsi,
    maps_url,
    tema,
    music_url: final_music_url,
    foto_url,
    foto_mempelai_1,
    foto_mempelai_2,
    ig_mempelai_1,
    ig_mempelai_2,
    background_type: formData.get('background_type') as string || 'polos',
    animation_type: formData.get('animation_type') as string || 'none',
    bg_hero,
    bg_mempelai,
    bg_acara,
    bg_galeri,
    bg_ucapan,
    quote: quote || null,
    wedding_gift: wedding_gift as any,
    gallery_urls,
    aktif: true
  }

  const { error } = await (supabase as any)
    .from('undangan')
    .insert(insertData)

  if (error) {
    console.error('Database insert error:', error)
    return { error: 'Gagal membuat undangan. Pastikan semua data valid atau slug belum dipakai.' }
  }

  revalidatePath('/dashboard')
  redirect('/dashboard')
}
