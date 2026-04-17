'use client';

import React, { useState } from 'react';
import SweetStart49 from '@/components/plan49/SweetStart49';
import { LockScreen, Preview99 } from '@/components/plan99/LoveBites99';
import { dataURLtoFile } from '@/utils/file';
import { useRouter } from 'next/navigation';
import { trackEvent } from '@/lib/analytics';

export default function Create49Page() {
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
        trackEvent('page_view', { tier: '49' }, '49');
    }, []);
    const router = useRouter();

    const handleComplete = (data: any) => {
        // Map 49-plan fields to standard format for LockScreen/PreviewScreen
        const mappedData = {
            senderName: data.yourName,
            recipientName: data.partnerName,
            partnerDesc: data.theirStory,
            relationship: data.relationship || 'partner', // Use selected relationship or default to partner
            selectedMoods: [{ emoji: "❤️", label: data.selectedMood || "Love" }],
            occasion: { 
                id: data.selectedOccasion, 
                emoji: data.selectedOccasion === 'anniversary' ? "💑" : 
                       data.selectedOccasion === 'birthday' ? "🎂" : 
                       data.selectedOccasion === 'valentines' ? "💝" : 
                       data.selectedOccasion === 'just_because' ? "🌸" : 
                       data.selectedOccasion === 'proposal' ? "💍" : 
                       data.selectedOccasion === 'long_distance' ? "✈️" : "🌸",
                label: data.selectedOccasion?.split('_').map((s: string) => s.charAt(0).toUpperCase() + s.slice(1)).join(' ') || "Just Because" 
            },
            generatedMessage: data.generatedMessage,
            photos: data.photos,
            photoMemories: data.photoMemories,
            unlockCode: data.unlockCode,
            hintMessage: data.hintMessage,
            partnerPhotoUrl: data.partnerPhotoUrl
        };
        
        // Save to localStorage for the preview route
        try {
            localStorage.setItem('pendingLoveBite_49', JSON.stringify(mappedData));
        } catch (e) {
            console.warn("LocalStorage quota exceeded, trying to save without photos");
            try {
                const dataWithoutPhotos = { ...mappedData, photos: [] };
                localStorage.setItem('pendingLoveBite_49', JSON.stringify(dataWithoutPhotos));
                alert("Some photos were too large for the local preview and will be skipped. They will still be uploaded on final submission! ❤️");
            } catch (innerError) {
                console.error("Failed to save even without photos:", innerError);
                setSubmitError("Your message is too large to preview. Please try shortening it or removing some photos.");
                return;
            }
        }
        
        // Redirect to occasion-specific preview route
        const occasionSlug = data.selectedOccasion.replace('_', '-');
        router.push(`/lovepreview49-${occasionSlug}`);
    };

    const handleFinalSubmit = async () => {
        if (!formData) {
            setSubmitError("Please complete the form first before submitting.");
            return;
        }
        
        setIsSubmitting(true);
        setSubmitError("");
        try {
            const body = new FormData();
            body.append('tier', '49');
            body.append('yourName', formData.senderName || '');
            body.append('partnerName', formData.recipientName || '');
            body.append('partnerDesc', formData.partnerDesc || '');
            body.append('occasion', JSON.stringify(formData.occasion || {}));
            body.append('moods', JSON.stringify(formData.selectedMoods || []));
            body.append('aiMessage', formData.generatedMessage || '');
            body.append('unlockCode', formData.unlockCode || '');
            body.append('unlockHint', formData.hintMessage || '');
            body.append('deliveryMethod', 'link');
            body.append('sendNow', 'true');

            // Handle Photo Uploads
            if (formData.photos && Array.isArray(formData.photos)) {
                formData.photos.forEach((photo: string, i: number) => {
                    if (photo && photo.startsWith('data:')) {
                        const file = dataURLtoFile(photo, `photo-${i}.jpg`);
                        if (file) body.append(`framePhoto_${i}`, file);
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
                trackEvent('letter_created', { tier: '49' }, '49');
                setShareSlug(result.share_slug);
                setCurrentView("success");
            } else {
                setSubmitError(result.error || "Failed to save your plan.");
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
                <div className="text-62xl mb-6 animate-bounce">💌</div>
                <h1 className="text-4xl font-bold text-[#c4304f] mb-2">Sweet Start Sent!</h1>
                <p className="text-rose-200/60 mb-8 max-w-sm italic">
                    Your love surprise is now part of our legacy. Share the link below.
                </p>
                <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 max-w-sm w-full mb-6 backdrop-blur-xl">
                    <p className="text-[10px] text-[#c4304f] mb-1 font-bold tracking-[3px] uppercase">Secret Share Link</p>
                    <p className="text-white font-mono text-sm break-all">{link}</p>
                </div>
                <div className="flex flex-col gap-3 w-full max-w-sm">
                    <button
                        onClick={() => {
                            navigator.clipboard.writeText(link);
                            alert("Link copied! ❤️");
                        }}
                        className="bg-gradient-to-r from-[#9b1a3a] to-[#c4304f] text-white font-bold py-4 rounded-xl shadow-2xl hover:scale-[1.02] transition-all"
                    >
                        📋 Copy Link
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
                <SweetStart49 
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
                        tier="49" 
                        onConfirm={handleFinalSubmit}
                        isSubmitting={isSubmitting}
                    />
                </div>
            )}
        </div>
    );
}
