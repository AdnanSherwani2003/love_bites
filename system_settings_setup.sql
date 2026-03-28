-- 1. Create the system_settings table
CREATE TABLE IF NOT EXISTS public.system_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Enable Row Level Security
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS Policies
-- Only admins can modify settings. Public can read (via API we control).
DROP POLICY IF EXISTS "Admins can manage settings" ON public.system_settings;
CREATE POLICY "Admins can manage settings" 
    ON public.system_settings 
    FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() AND profiles.is_admin = TRUE
        )
    );

DROP POLICY IF EXISTS "Public can read settings" ON public.system_settings;
CREATE POLICY "Public can read settings"
    ON public.system_settings
    FOR SELECT
    USING (true);

-- 4. Seed Initial Data
INSERT INTO public.system_settings (key, value, description)
VALUES 
('pricing', '{"tier_49": 49, "tier_99": 99, "tier_149": 149, "popular_tier": "99"}', 'Platform pricing and plan labels'),
('features', '{"ai_magic": true, "image_uploads": true, "video_tributes": true}', 'Feature toggles for global site functionality'),
('content', '{"hero_title": "Love Bites", "hero_subtitle": "Digital Love Letters", "footer_text": "Crafted with love for your special moments."}', 'Dynamic copy for the main website'),
('moods', '[
    {"id": "deeply_in_love", "label": "Deeply in Love", "subtitle": "I feel completely in love with you", "emoji": "❤️", "category": "Romantic"},
    {"id": "adoring", "label": "Adoring", "subtitle": "I adore everything about you", "emoji": "🥰", "category": "Romantic"},
    {"id": "affectionate", "label": "Affectionate", "subtitle": "I feel warm and affectionate toward you", "emoji": "💞", "category": "Romantic"},
    {"id": "hopelessly_romantic", "label": "Hopelessly Romantic", "subtitle": "You make me believe in love stories", "emoji": "💘", "category": "Romantic"},
    {"id": "cherishing", "label": "Cherishing", "subtitle": "I cherish every moment with you", "emoji": "🌹", "category": "Romantic"},
    {"id": "obsessed", "label": "Obsessed with You", "subtitle": "I can't get enough of you", "emoji": "😍", "category": "Romantic"},
    {"id": "grateful", "label": "Grateful", "subtitle": "I''m thankful to have you in my life", "emoji": "💓", "category": "Emotional"},
    {"id": "tender", "label": "Tender Hearted", "subtitle": "You soften my world", "emoji": "🥺", "category": "Emotional"},
    {"id": "vulnerable", "label": "Vulnerable", "subtitle": "I can be myself with you", "emoji": "🩹", "category": "Emotional"},
    {"id": "playful", "label": "Playful Love", "subtitle": "Loving you is fun and exciting", "emoji": "😘", "category": "Fun"},
    {"id": "happy", "label": "Happy with You", "subtitle": "You make my life joyful", "emoji": "😄", "category": "Fun"},
    {"id": "silly", "label": "Silly & Wild", "subtitle": "We are weird together", "emoji": "🤪", "category": "Fun"},
    {"id": "devoted", "label": "Devoted", "subtitle": "My heart belongs to you", "emoji": "💗", "category": "Deep"},
    {"id": "comforted", "label": "Comforted", "subtitle": "You make me feel safe and calm", "emoji": "🤍", "category": "Deep"},
    {"id": "forever", "label": "Forever Yours", "subtitle": "I want a lifetime with you", "emoji": "💍", "category": "Deep"},
    {"id": "soulmate", "label": "Soulmate Feeling", "subtitle": "You feel like my other half", "emoji": "🌙", "category": "Deep"},
    {"id": "passionate", "label": "Passionate", "subtitle": "My love for you burns intensely", "emoji": "🔥", "category": "Deep"}
]', 'Categorized moods for love letter generation'),
('occasions', '[
    {"id": "anniversary", "label": "Anniversary", "emoji": "💑"},
    {"id": "birthday", "label": "Birthday", "emoji": "🎂"},
    {"id": "valentine", "label": "Valentine''s Day", "emoji": "💝"},
    {"id": "just_because", "label": "Just Because", "emoji": "🌸"},
    {"id": "proposal", "label": "Proposal", "emoji": "💍"},
    {"id": "long_distance", "label": "Long Distance", "emoji": "✈️"}
]', 'Event occasions for the creation flow')
ON CONFLICT (key) DO NOTHING;
