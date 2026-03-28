import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET() {
    try {
        const supabase = await createClient()
        
        const { data: settings, error } = await supabase
            .from('system_settings')
            .select('key, value')

        if (error) throw error

        const settingsMap = settings.reduce((acc: any, curr: any) => {
            acc[curr.key] = curr.value
            return acc
        }, {})

        return NextResponse.json(settingsMap)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
