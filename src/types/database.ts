export type LoveCodeStatus = 'draft' | 'active' | 'viewed'

export interface LoveCode {
    id: string                          // uuid primary key
    code: string                        // 6-char unique code (e.g. LV-X7K2)
    sender_name: string
    recipient_name: string
    recipient_contact: string           // email or phone
    delivery_method: 'email' | 'whatsapp' | 'link'
    occasion: string                    // e.g. "Anniversary", "Birthday"
    mood: string                        // e.g. "romantic", "playful", "nostalgic"
    message: string                     // the love letter text
    template: string                    // template name (cinematic, minimal, etc.)
    lock_pin: string | null             // 4-digit pin or null for no lock
    photo_urls: string[]                // array of Supabase Storage URLs
    status: LoveCodeStatus
    viewed_at: string | null
    created_at: string
    updated_at: string
}

export interface Database {
    public: {
        Tables: {
            love_codes: {
                Row: LoveCode
                Insert: Omit<LoveCode, 'id' | 'created_at' | 'updated_at'>
                Update: Partial<Omit<LoveCode, 'id' | 'created_at'>>
            }
        }
    }
}
