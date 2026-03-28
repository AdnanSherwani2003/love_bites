import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const supabase = await createClient();

        // 1. Verify Admin Session
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { data: profile } = await supabase
            .from('profiles')
            .select('is_admin')
            .eq('id', user.id)
            .single();

        if (!profile || !profile.is_admin) {
            return NextResponse.json({ error: 'Access Denied' }, { status: 403 });
        }

        // 2. Fetch Aggregated Metrics
        // Note: In a production app, we would use more efficient grouping queries.
        // For simplicity, we fetch recent events and aggregate.

        // Get total events by type
        const { data: allEvents, error } = await supabase
            .from('analytics_events')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        const metrics = {
            total_views: allEvents.filter(e => e.event_type === 'page_view').length,
            total_creations: allEvents.filter(e => e.event_type === 'letter_created').length,
            tier_distribution: {
                tier_49: allEvents.filter(e => e.tier === '49').length,
                tier_99: allEvents.filter(e => e.tier === '99').length,
                tier_149: allEvents.filter(e => e.tier === '149').length,
            },
            recent_activity: allEvents.slice(0, 10),
            conversion_rate: allEvents.length > 0 
                ? (allEvents.filter(e => e.event_type === 'letter_created').length / 
                   Math.max(1, allEvents.filter(e => e.event_type === 'page_view').length) * 100).toFixed(1)
                : 0
        };

        return NextResponse.json(metrics);
    } catch (err: any) {
        console.error('Analytics Fetch Error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
