import { createClient } from '@/utils/supabase/client';

export type AnalyticsEvent = 'page_view' | 'plan_select' | 'letter_created' | 'payment_success' | 'ai_generate';

export const trackEvent = async (
    eventType: AnalyticsEvent, 
    metadata: any = {}, 
    tier?: string
) => {
    try {
        const supabase = createClient();
        
        // Get current path if on client
        const path = typeof window !== 'undefined' ? window.location.pathname : null;
        
        const { error } = await supabase
            .from('analytics_events')
            .insert({
                event_type: eventType,
                page_path: path,
                tier: tier || metadata.tier,
                metadata: metadata,
            });

        if (error) {
            console.warn('Analytics Tracking Error:', error.message);
        }
    } catch (err) {
        console.error('Analytics system failure:', err);
    }
};

/**
 * Usage Examples:
 * trackEvent('page_view', { source: 'direct' });
 * trackEvent('plan_select', { price: 99 }, '99');
 * trackEvent('letter_created', { moods: ['romantic'] }, '49');
 */
