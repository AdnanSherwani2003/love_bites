import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET() {
    try {
        const supabase = await createClient()
        
        const { data: settings, error } = await supabase
            .from('system_settings')
            .select('*')
            .order('key')

        if (error) throw error

        const settingsMap = settings.reduce((acc: any, curr: any) => {
            acc[curr.key] = {
                value: curr.value,
                description: curr.description,
                id: curr.id
            }
            return acc
        }, {})

        return NextResponse.json(settingsMap)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function PATCH(request: Request) {
    try {
        const supabase = await createClient()
        
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const { data: profile } = await supabase
            .from('profiles')
            .select('is_admin')
            .eq('id', session.user.id)
            .single()

        if (!profile?.is_admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const { key, value } = await request.json()
        
        if (!key || value === undefined) {
            return NextResponse.json({ error: 'Missing key or value' }, { status: 400 })
        }

        const { data, error } = await supabase
            .from('system_settings')
            .update({ value, updated_at: new Date().toISOString() })
            .eq('key', key)
            .select()
            .single()

        if (error) throw error

        return NextResponse.json(data)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
