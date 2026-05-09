'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function createUndangan(prevState: any, formData: FormData) {
  const supabase = await createClient()

  // Cek auth
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Ambil data teks
  const slugRaw = formData.get('slug') as string
  const slug = slugRaw.toLowerCase().replace(/\s+/g, '-')
  
  const mempelai_1 = formData.get('mempelai_1') as string
  const mempelai_2 = formData.get('mempelai_2') as string
  const tanggal_akad = formData.get('tanggal_akad') as string
  const tanggal_resepsi = formData.get('tanggal_resepsi') as string
  const lokasi_akad = formData.get('lokasi_akad') as string
  const lokasi_resepsi = formData.get('lokasi_resepsi') as string
  const alamat_akad = formData.get('alamat_akad') as string
  const alamat_resepsi = formData.get('alamat_resepsi') as string
  const maps_url = formData.get('maps_url') as string
  const tema = formData.get('tema') as string
  const music_url = formData.get('music_url') as string
  const quote = formData.get('quote') as string

  // --- LOGIKA UPLOAD FOTO UTAMA ---
  let foto_url = null
  const fotoFile = formData.get('foto_file') as File
  if (fotoFile && fotoFile.size > 0) {
    const fileName = `${user.id}/${Date.now()}-${fotoFile.name}`
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('invitation-assets')
      .upload(fileName, fotoFile)

    if (!uploadError) {
      const { data: publicUrl } = supabase.storage
        .from('invitation-assets')
        .getPublicUrl(fileName)
      foto_url = publicUrl.publicUrl
    }
  }

  // --- LOGIKA UPLOAD GALERI ---
  const galleryFiles = formData.getAll('gallery_files') as File[]
  const gallery_urls: string[] = []
  
  for (const file of galleryFiles) {
    if (file && file.size > 0) {
      const fileName = `${user.id}/gallery/${Date.now()}-${file.name}`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('invitation-assets')
        .upload(fileName, file)

      if (!uploadError) {
        const { data: publicUrl } = supabase.storage
          .from('invitation-assets')
          .getPublicUrl(fileName)
        gallery_urls.push(publicUrl.publicUrl)
      }
    }
  }

  // --- LOGIKA UPLOAD MUSIK ---
  let final_music_url = music_url
  const musicFile = formData.get('music_file') as File
  if (musicFile && musicFile.size > 0) {
    const fileName = `${user.id}/music/${Date.now()}-${musicFile.name}`
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('invitation-assets')
      .upload(fileName, musicFile)

    if (!uploadError) {
      const { data: publicUrl } = supabase.storage
        .from('invitation-assets')
        .getPublicUrl(fileName)
      final_music_url = publicUrl.publicUrl
    }
  }

  // Insert ke database
  const { error } = await (supabase
    .from('undangan') as any)
    .insert({
      user_id: user.id,
      slug,
      mempelai_1,
      mempelai_2,
      foto_url,
      tanggal_akad: tanggal_akad ? new Date(tanggal_akad).toISOString() : null,
      tanggal_resepsi: tanggal_resepsi ? new Date(tanggal_resepsi).toISOString() : null,
      lokasi_akad,
      lokasi_resepsi,
      alamat_akad,
      alamat_resepsi,
      maps_url,
      tema,
      quote: quote || null,
      music_url: final_music_url || null,
      gallery_urls,
    })

  if (error) {
    console.error('Error creating undangan:', error)
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  redirect('/dashboard')
}
