import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(
    request: Request,
    context: { params: { code: string } }
) {
    try {
        const supabase = await createClient()
        const { code } = await context.params

        const { data, error } = await supabase
            .from('love_codes')
            .select('*')
            .eq('code', code)
            .single()

        if (error || !data) {
            console.error('Supabase fetch error:', error)
            return NextResponse.json({ error: 'Love Code not found' }, { status: 404 })
        }

        return NextResponse.json({ success: true, data })

    } catch (error: any) {
        console.error('Unexpected error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
