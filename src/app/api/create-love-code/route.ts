import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { nanoid } from 'nanoid'

export async function POST(request: Request) {
    try {
        const supabase = await createClient()
        const body = await request.json()

        // Generate a unique 6-character code (e.g. LV-X7K2)
        const uniqueCode = `LV-${nanoid(4).toUpperCase()}`

        const {
            sender_name,
            recipient_name,
            recipient_contact,
            delivery_method,
            occasion,
            mood,
            message,
            template,
            lock_pin,
            photo_urls
        } = body

        const { data, error } = await supabase
            .from('love_codes')
            .insert([
                {
                    code: uniqueCode,
                    sender_name,
                    recipient_name,
                    recipient_contact,
                    delivery_method,
                    occasion,
                    mood,
                    message,
                    template,
                    lock_pin,
                    photo_urls: photo_urls || [],
                    status: 'active'
                }
            ])
            .select()
            .single()

        if (error) {
            console.error('Supabase insert error:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({
            success: true,
            code: uniqueCode,
            data
        })

    } catch (error: any) {
        console.error('Unexpected error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
