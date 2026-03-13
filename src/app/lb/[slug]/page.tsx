'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import LoveBites99 from '@/components/plan99/LoveBites99';
import SweetStart49 from '@/components/plan49/SweetStart49';
import GrandAmour149 from '@/components/plan149/GrandAmour149';

export default function PremiumPlanViewer() {
    const params = useParams();
    const slug = params.slug as string;
    const [plan, setPlan] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const supabase = createClient();

    useEffect(() => {
        async function fetchPlan() {
            if (!slug) return;
            try {
                const { data, error: fetchError } = await supabase
                    .from('true_love_plans')
                    .select('*')
                    .eq('slug', slug)
                    .single();

                if (fetchError) throw fetchError;
                if (!data) throw new Error('Plan not found');

                // Map database fields to the format expected by components
                const mappedData = {
                    recipientName: data.recipient_name,
                    senderName: data.sender_name,
                    selectedMoods: data.moods, // Assuming [{emoji, label}] format
                    occasion: data.occasion,     // Assuming {emoji, label} format
                    hintMessage: data.unlock_hint,
                    unlockCode: data.unlock_code,
                    generatedMessage: data.ai_message,
                    photos: data.frame_photos || [null, null, null, null, null],
                    videoPhotos: data.video_photos || [null, null, null, null, null],
                };

                setPlan({ ...data, mappedData });
            } catch (err: any) {
                console.error('Error fetching plan:', err);
                setError(err.message || 'Could not load the love plan.');
            } finally {
                setLoading(false);
            }
        }

        fetchPlan();
    }, [slug, supabase]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0d0d1a] flex flex-col items-center justify-center text-white font-serif italic">
                <div className="text-4xl animate-pulse mb-4">💌</div>
                <p>Opening your love surprise...</p>
            </div>
        );
    }

    if (error || !plan) {
        return (
            <div className="min-h-screen bg-[#0d0d1a] flex flex-col items-center justify-center text-white p-6 text-center">
                <div className="text-6xl mb-6">💔</div>
                <h1 className="text-2xl font-bold mb-2">Oops!</h1>
                <p className="opacity-60 max-w-xs">{error || 'This link seems to be broken or expired.'}</p>
                <a href="/" className="mt-8 text-[#ff6b8a] underline underline-offset-4">Return Home</a>
            </div>
        );
    }

    // Render the premium experience for all plans
    return <LoveBites99 data={plan.mappedData} isViewer={true} tier={plan.tier} />;
}
