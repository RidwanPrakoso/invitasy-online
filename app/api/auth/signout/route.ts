import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()

  // Sign out from Supabase
  await supabase.auth.signOut()

  // Redirect to home page or login page
  const url = new URL(request.url)
  return NextResponse.redirect(new URL('/', url.origin), {
    status: 303, // See Other (to change POST to GET)
  })
}
