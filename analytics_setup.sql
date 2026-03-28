-- Advanced Analytics Tables
CREATE TABLE IF NOT EXISTS public.analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type TEXT NOT NULL, -- 'page_view', 'plan_select', 'letter_created', 'payment_success'
    page_path TEXT,
    tier TEXT, -- '49', '99', '149'
    metadata JSONB DEFAULT '{}'::jsonb,
    session_id TEXT,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for faster querying
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON public.analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON public.analytics_events(created_at);

-- RLS for Analytics (Admin only read, Public write for certain events)
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public to insert events" ON public.analytics_events;
CREATE POLICY "Allow public to insert events" ON public.analytics_events
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admin full access to analytics" ON public.analytics_events;
CREATE POLICY "Admin full access to analytics" ON public.analytics_events
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.is_admin = TRUE
        )
    );
