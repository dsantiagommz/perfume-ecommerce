import { NextRequest, NextResponse } from 'next/server'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()

    console.log('Attempting signup:', { email, name })

    const response = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_KEY!,
      },
      body: JSON.stringify({
        email,
        password,
        data: { name },
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Supabase error:', data)
      return NextResponse.json({ error: data.message || 'Signup failed' }, { status: 400 })
    }

    console.log('Signup success')
    return NextResponse.json(data)
  } catch (err: any) {
    console.error('API route error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
