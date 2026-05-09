'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { Database } from '@/lib/supabase/types'

export async function updateUndangan(prevState: any, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  const id = formData.get('id') as string
  const slug = formData.get('slug') as string
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
  const music_url = formData.get('music_url') as string
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

  // --- UPLOAD FOTO UTAMA ---
  let foto_url = formData.get('foto_url_existing') as string
  const fotoFile = formData.get('foto_file') as File
  if (fotoFile && fotoFile.size > 0) {
    const fileName = `${user.id}/main-${Date.now()}-${fotoFile.name}`
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('invitation-assets')
      .upload(fileName, fotoFile)
    if (uploadError) {
      return { error: `Gagal upload foto utama: ${uploadError.message}` }
    }
    const { data: publicUrl } = supabase.storage.from('invitation-assets').getPublicUrl(fileName)
    foto_url = publicUrl.publicUrl
  }

  // --- UPLOAD FOTO MEMPELAI 1 ---
  let foto_mempelai_1 = formData.get('foto_mempelai_1_existing') as string
  const f1 = formData.get('foto_mempelai_1_file') as File
  if (f1 && f1.size > 0) {
    const fileName = `${user.id}/m1-${Date.now()}-${f1.name}`
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('invitation-assets')
      .upload(fileName, f1)
    if (uploadError) {
      return { error: `Gagal upload foto mempelai 1: ${uploadError.message}` }
    }
    const { data: publicUrl } = supabase.storage.from('invitation-assets').getPublicUrl(fileName)
    foto_mempelai_1 = publicUrl.publicUrl
  }

  // --- UPLOAD FOTO MEMPELAI 2 ---
  let foto_mempelai_2 = formData.get('foto_mempelai_2_existing') as string
  const f2 = formData.get('foto_mempelai_2_file') as File
  if (f2 && f2.size > 0) {
    const fileName = `${user.id}/m2-${Date.now()}-${f2.name}`
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('invitation-assets')
      .upload(fileName, f2)
    if (uploadError) {
      return { error: `Gagal upload foto mempelai 2: ${uploadError.message}` }
    }
    const { data: publicUrl } = supabase.storage.from('invitation-assets').getPublicUrl(fileName)
    foto_mempelai_2 = publicUrl.publicUrl
  }

  // --- UPLOAD BACKGROUND PER SEKSI ---
  const uploadBg = async (fieldName: string, currentUrl: string, prefix: string) => {
    const file = formData.get(fieldName) as File
    if (file && file.size > 0) {
      const fileName = `${user.id}/${prefix}-${Date.now()}-${file.name}`
      const { error } = await supabase.storage.from('invitation-assets').upload(fileName, file)
      if (error) return currentUrl || null
      const { data } = supabase.storage.from('invitation-assets').getPublicUrl(fileName)
      return data.publicUrl
    }
    return currentUrl || null
  }

  const bg_hero = await uploadBg('bg_hero_file', formData.get('current_bg_hero') as string, 'bg-hero')
  const bg_mempelai = await uploadBg('bg_mempelai_file', formData.get('current_bg_mempelai') as string, 'bg-mempelai')
  const bg_acara = await uploadBg('bg_acara_file', formData.get('current_bg_acara') as string, 'bg-acara')
  const bg_galeri = await uploadBg('bg_galeri_file', formData.get('current_bg_galeri') as string, 'bg-galeri')
  const bg_ucapan = await uploadBg('bg_ucapan_file', formData.get('current_bg_ucapan') as string, 'bg-ucapan')

  // --- UPLOAD MUSIK ---
  let existing_music_url = formData.get('music_url') as string
  let final_music_url = existing_music_url || null

  const musicFile = formData.get('music_file') as File
  if (musicFile && musicFile.size > 0) {
    if (musicFile.size > 10 * 1024 * 1024) {
      return { error: 'File musik terlalu besar! Maksimal adalah 10MB.' }
    }
    const fileName = `${user.id}/music-${Date.now()}-${musicFile.name}`
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('invitation-assets')
      .upload(fileName, musicFile)
    
    if (uploadError) {
      console.error('Music upload error:', uploadError)
      return { error: `Gagal upload musik: ${uploadError.message}` }
    } else {
      const { data: publicUrl } = supabase.storage.from('invitation-assets').getPublicUrl(fileName)
      final_music_url = publicUrl.publicUrl
    }
  }

  // Handle Gallery
  const existingGallery = (formData.get('gallery_urls_existing') as string || '').split(',').filter(Boolean)
  let gallery_urls = [...existingGallery]
  const galleryFiles = formData.getAll('gallery_files') as File[]
  for (const file of galleryFiles) {
    if (file.size > 0) {
      const fileName = `${user.id}/gallery-${Date.now()}-${file.name}`
      const { data, error } = await supabase.storage.from('invitation-assets').upload(fileName, file)
      if (!error) {
        const { data: publicUrl } = supabase.storage.from('invitation-assets').getPublicUrl(fileName)
        gallery_urls.push(publicUrl.publicUrl)
      }
    }
  }

  // Update ke database dengan casting untuk menghindari error 'never'
  const updateData: any = {
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
    foto_url: foto_url,
    foto_mempelai_1: foto_mempelai_1,
    foto_mempelai_2: foto_mempelai_2,
    ig_mempelai_1,
    ig_mempelai_2,
    background_type: formData.get('background_type') as string,
    animation_type: formData.get('animation_type') as string,
    bg_hero,
    bg_mempelai,
    bg_acara,
    bg_galeri,
    bg_ucapan,
    quote: quote || null,
    wedding_gift: wedding_gift as any,
    gallery_urls: gallery_urls,
  }

  const { error } = await (supabase as any)
    .from('undangan')
    .update(updateData)
    .eq('id', id)

  if (error) {
    console.error('Database update error:', error)
    return { error: 'Gagal memperbarui undangan. Pastikan semua data valid.' }
  }

  revalidatePath(`/u/${slug}`)
  revalidatePath(`/dashboard/${id}/edit`)
  redirect(`/dashboard`)
}
