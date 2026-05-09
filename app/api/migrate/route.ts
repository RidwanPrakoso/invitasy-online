// app/api/migrate/route.ts
// One-time migration endpoint to add music_url and gallery_urls columns
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Add music_url column
  const { error: err1 } = await supabase.rpc('exec_sql', {
    query: `ALTER TABLE undangan ADD COLUMN IF NOT EXISTS music_url TEXT DEFAULT NULL;`
  }).single()

  // Add gallery_urls column (JSONB array)
  const { error: err2 } = await supabase.rpc('exec_sql', {
    query: `ALTER TABLE undangan ADD COLUMN IF NOT EXISTS gallery_urls JSONB DEFAULT '[]'::jsonb;`
  }).single()

  // If rpc doesn't exist, try raw SQL via REST
  if (err1 || err2) {
    // Fallback: use the SQL directly via supabase-js
    const res1 = await supabase.from('undangan').select('music_url').limit(1)
    const res2 = await supabase.from('undangan').select('gallery_urls').limit(1)

    const needsMigration = res1.error || res2.error

    if (needsMigration) {
      return NextResponse.json({
        message: 'Migration needed. Please run the following SQL in your Supabase SQL Editor:',
        sql: [
          "ALTER TABLE undangan ADD COLUMN IF NOT EXISTS music_url TEXT DEFAULT NULL;",
          "ALTER TABLE undangan ADD COLUMN IF NOT EXISTS gallery_urls JSONB DEFAULT '[]'::jsonb;"
        ]
      }, { status: 200 })
    }

    return NextResponse.json({ message: 'Columns already exist. No migration needed.' })
  }

  return NextResponse.json({ message: 'Migration completed successfully!' })
}
