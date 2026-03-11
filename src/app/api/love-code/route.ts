import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { nanoid } from 'nanoid'

export async function POST(request: Request) {
    try {
        const supabase = await createClient()
        const formData = await request.formData()

        // Generate a unique slug
        const uniqueSlug = `LB-${nanoid(4).toUpperCase()}`

        const tierStr = formData.get('tier') as string || '99'
        const senderName = formData.get('yourName') as string || ''
        const recipientName = formData.get('partnerName') as string || ''
        const partnerDesc = formData.get('partnerDesc') as string || ''
        const occasionStr = formData.get('occasion') as string || '{}'
        const moodsStr = formData.get('moods') as string || '[]'
        const aiMessage = formData.get('aiMessage') as string || ''
        const unlockCode = formData.get('unlockCode') as string || ''
        const unlockHint = formData.get('unlockHint') as string || ''
        const deliveryMethod = formData.get('deliveryMethod') as string || ''
        const deliveryContact = formData.get('deliveryContact') as string || ''
        const sendNow = formData.get('sendNow') === 'true'
        const scheduledAtStr = formData.get('scheduledAt') as string || null

        // Parse JSON
        const tier = parseInt(tierStr)
        const occasion = JSON.parse(occasionStr)
        const moods = JSON.parse(moodsStr)

        // Upload photos helper
        const uploadPhoto = async (file: File, folder: string) => {
            const fileExt = file.name.split('.').pop()
            const fileName = `${folder}/${uniqueSlug}-${nanoid()}.${fileExt}`
            const arrayBuffer = await file.arrayBuffer()
            const buffer = new Uint8Array(arrayBuffer)

            const { data, error } = await supabase.storage
                .from('love_media')
                .upload(fileName, buffer, { contentType: file.type })

            if (error) throw error
            const { data: publicUrlData } = supabase.storage.from('love_media').getPublicUrl(fileName)
            return publicUrlData.publicUrl
        }

        // Upload frame photos (up to 10 for plan 149)
        const framePhotos = []
        for (let i = 0; i < 10; i++) {
            const file = formData.get(`framePhoto_${i}`) as File
            if (file) {
                const url = await uploadPhoto(file, 'frames')
                framePhotos.push(url)
            }
        }

        // Upload video photos
        const videoPhotos = []
        for (let i = 0; i < 5; i++) {
            const file = formData.get(`videoPhoto_${i}`) as File
            if (file) {
                const url = await uploadPhoto(file, 'videos')
                videoPhotos.push(url)
            }
        }

        const scheduledAt = scheduledAtStr ? new Date(scheduledAtStr).toISOString() : null

        const insertData = {
            slug: uniqueSlug,
            tier,
            sender_name: senderName,
            recipient_name: recipientName,
            recipient_contact: deliveryContact,
            occasion: occasion,
            moods: moods,
            partner_desc: partnerDesc,
            ai_message: aiMessage,
            unlock_code: unlockCode,
            unlock_hint: unlockHint,
            frame_photos: framePhotos,
            video_photos: videoPhotos,
            delivery_method: deliveryMethod,
            scheduled_at: scheduledAt,
            is_sent: sendNow
        }

        const { error } = await supabase
            .from('true_love_plans')
            .insert(insertData)

        if (error) {
            console.error('Supabase true_love_plans insert error:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({
            success: true,
            share_slug: uniqueSlug
        })

    } catch (error: any) {
        console.error('Unexpected error in love-code API:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
