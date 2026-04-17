'use client';

import React, { useState } from 'react';
import GrandAmour149 from '@/components/plan149/GrandAmour149';
import { LockScreen, Preview99 } from '@/components/plan99/LoveBites99';
import { dataURLtoFile } from '@/utils/file';
import { trackEvent } from '@/lib/analytics';

export default function Create149Page() {
    const [currentView, setCurrentView] = useState("create"); // "create" | "lock" | "preview" | "success"
    const [formData, setFormData] = useState<any>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [shareSlug, setShareSlug] = useState("");
    const [submitError, setSubmitError] = useState("");
    const [features, setFeatures] = useState({ ai_magic: true });
    const [moods, setMoods] = useState<any[]>([]);
    const [occasions, setOccasions] = useState<any[]>([]);

    React.useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch('/api/settings');
                const data = await res.json();
                if (data.features) setFeatures(data.features);
                if (data.moods) setMoods(data.moods.value);
                if (data.occasions) setOccasions(data.occasions.value);
            } catch (err) {
                console.error("Failed to load features:", err);
            }
        };
        fetchSettings();
        trackEvent('page_view', { tier: '149' }, '149');
    }, []);

    const handleComplete = (data: any) => {
        // Map 149-plan fields to standard format for LockScreen/PreviewScreen
        // Note: GrandAmour has up to 10 photos and video photos
        const mappedData = {
            senderName: data.yourName,
            recipientName: data.partnerName,
            partnerDesc: data.theirStory,
            relationship: data.relationship || 'partner', // Use selected relationship or default to partner
            selectedMoods: data.selectedMoods, // Already objects in 149
            occasion: data.selectedOccasion, // Already object in 149
            generatedMessage: data.generatedMessage,
            photos: data.photos,
        };
        setFormData(mappedData);
        setCurrentView("lock");
    };

    const handleFinalSubmit = async () => {
        setIsSubmitting(true);
        setSubmitError("");
        try {
            const body = new FormData();
            body.append('tier', '149');
            body.append('yourName', formData.senderName || '');
            body.append('partnerName', formData.recipientName || '');
            body.append('partnerDesc', formData.partnerDesc || '');
            body.append('relationship', formData.relationship || 'partner');
            body.append('occasion', JSON.stringify(formData.occasion || {}));
            body.append('moods', JSON.stringify(formData.selectedMoods || []));
            body.append('aiMessage', formData.generatedMessage || '');
            body.append('unlockCode', formData.unlockCode || '');
            body.append('unlockHint', formData.hintMessage || '');
            body.append('deliveryMethod', formData.deliveryMethod || 'link');
            body.append('deliveryContact', formData.recipientContact || '');
            body.append('sendNow', 'true');

            // Handle Photo Uploads (up to 10)
            if (formData.photos && Array.isArray(formData.photos)) {
                formData.photos.forEach((photo: string, i: number) => {
                    if (photo && photo.startsWith('data:')) {
                        const file = dataURLtoFile(photo, `photo-${i}.jpg`);
                        if (file) body.append(`framePhoto_${i}`, file);
                    }
                });
            }

            // Handle Video Photo Uploads (up to 5)
            if (formData.videoPhotos && Array.isArray(formData.videoPhotos)) {
                formData.videoPhotos.forEach((photo: string, i: number) => {
                    if (photo && photo.startsWith('data:')) {
                        const file = dataURLtoFile(photo, `videoPhoto-${i}.jpg`);
                        if (file) body.append(`videoPhoto_${i}`, file);
                    }
                });
            }

            // Handle Photo Memories
            if (formData.photoMemories && Array.isArray(formData.photoMemories)) {
                body.append('photoMemories', JSON.stringify(formData.photoMemories));
            }

            const res = await fetch('/api/love-code', {
                method: 'POST',
                body: body
            });

            const result = await res.json();
            if (result.success) {
                trackEvent('letter_created', { tier: '149' }, '149');
                setShareSlug(result.share_slug);
                setCurrentView("success");
            } else {
                setSubmitError(result.error || "Failed to save your premium plan.");
            }
        } catch (err) {
            console.error("Submission error:", err);
            setSubmitError("Connectivity issue. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (currentView === "success") {
        const link = `${window.location.origin}/lb/${shareSlug}`;
        return (
            <main className="min-h-screen bg-[#0d0008] flex flex-col items-center justify-center px-4 text-white text-center font-serif">
                <div className="text-62xl mb-6 animate-pulse">👑</div>
                <h1 className="text-4xl font-bold text-[#c4304f] mb-2">Grand Amour Created!</h1>
                <p className="text-rose-200/60 mb-8 max-w-sm italic">
                    The ultimate expression of love is ready. Share the secret link.
                </p>
                <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 max-w-sm w-full mb-6 backdrop-blur-xl">
                    <p className="text-[10px] text-[#c4304f] mb-1 font-bold tracking-[3px] uppercase">Grand Amour Share Link</p>
                    <p className="text-white font-mono text-sm break-all">{link}</p>
                </div>
                <div className="flex flex-col gap-3 w-full max-w-sm">
                    <button
                        onClick={() => {
                            navigator.clipboard.writeText(link);
                            alert("Link copied! ❤️");
                        }}
                        className="bg-gradient-to-r from-[#7a1030] to-[#c4304f] text-white font-bold py-4 rounded-xl shadow-2xl hover:scale-[1.02] transition-all"
                    >
                        📋 Copy Grand Link
                    </button>
                    <a href="/" className="text-white/40 text-sm hover:text-white transition-colors py-2">Return Home</a>
                </div>
            </main>
        );
    }

    return (
        <div style={{ background: '#0d0008', minHeight: '100vh' }}>
            {submitError && (
                <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] bg-red-500 text-white px-6 py-3 rounded-full shadow-2xl">
                    {submitError}
                </div>
            )}

            {currentView === "create" && (
                <GrandAmour149 
                    onComplete={handleComplete} 
                    features={features} 
                    moods={moods as any} 
                    occasions={occasions as any} 
                />
            )}

            {currentView === "lock" && (
                <LockScreen
                    data={formData}
                    onUnlock={() => setCurrentView("preview")}
                />
            )}

            {currentView === "preview" && (
                <div className="relative">
                    <Preview99 
                        data={formData} 
                        tier="149" 
                        onConfirm={handleFinalSubmit}
                        isSubmitting={isSubmitting}
                    />
                </div>
            )}
        </div>
    );
}
