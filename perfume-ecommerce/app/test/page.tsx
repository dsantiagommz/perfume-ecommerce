'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function TestPage() {
  const [status, setStatus] = useState('Testing...')

  useEffect(() => {
    const test = async () => {
      try {
        setStatus('1. Testing Supabase client initialization...')
        console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
        console.log('Supabase Auth:', supabase.auth)

        setStatus('2. Testing auth.getSession()...')
        const { data, error } = await supabase.auth.getSession()
        console.log('Session:', { data, error })

        setStatus('3. All tests passed!')
      } catch (err: any) {
        setStatus(`Error: ${err.message}`)
        console.error('Full error:', err)
      }
    }

    test()
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Supabase Test</h1>
      <pre className="bg-gray-100 p-4 rounded text-black">{status}</pre>
      <p className="mt-4 text-sm">Check browser console (F12) for detailed logs</p>
    </div>
  )
}
