'use client';

import React, { useState, useEffect } from 'react';
import { LockScreen, Preview99 } from '@/components/plan99/LoveBites99';
import { dataURLtoFile } from '@/utils/file';

interface LovePreview49PageProps {
    occasionId: string;
    themeColor?: string;
}

export default function LovePreview49Page({ occasionId, themeColor = '#c4304f' }: LovePreview49PageProps) {
    const [currentView, setCurrentView] = useState("lock");
    const [formData, setFormData] = useState<any>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [shareSlug, setShareSlug] = useState("");
    const [submitError, setSubmitError] = useState("");

    useEffect(() => {
        const savedData = localStorage.getItem('pendingLoveBite_49');
        if (savedData) {
            const data = JSON.parse(savedData);
            setFormData(data);
        }
    }, []);

    const handleFinalSubmit = async () => {
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

            if (formData.photos && Array.isArray(formData.photos)) {
                formData.photos.forEach((photo: string, i: number) => {
                    if (photo && photo.startsWith('data:')) {
                        const file = dataURLtoFile(photo, `photo-${i}.jpg`);
                        if (file) body.append(`framePhoto_${i}`, file);
                    }
                });
            }

            const res = await fetch('/api/love-code', {
                method: 'POST',
                body: body
            });

            const result = await res.json();
            if (result.success) {
                setShareSlug(result.share_slug);
                setCurrentView("success");
                localStorage.removeItem('pendingLoveBite_49');
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
                <div className="text-6xl mb-6 animate-bounce">💌</div>
                <h1 className="text-4xl font-bold mb-2" style={{ color: themeColor }}>Sweet Start Sent!</h1>
                <p className="text-rose-200/60 mb-8 max-w-sm italic">
                    Your love surprise is now part of our legacy. Share the link below.
                </p>
                <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 max-w-sm w-full mb-6 backdrop-blur-xl">
                    <p className="text-[10px] mb-1 font-bold tracking-[3px] uppercase" style={{ color: themeColor }}>Secret Share Link</p>
                    <p className="text-white font-mono text-sm break-all">{link}</p>
                </div>
                <div className="flex flex-col gap-3 w-full max-w-sm">
                    <button
                        onClick={() => {
                            navigator.clipboard.writeText(link);
                            alert("Link copied! ❤️");
                        }}
                        className="text-white font-bold py-4 rounded-xl shadow-2xl hover:scale-[1.02] transition-all"
                        style={{ background: `linear-gradient(135deg, ${themeColor}, #000)` }}
                    >
                        📋 Copy Link
                    </button>
                    <a href="/" className="text-white/40 text-sm hover:text-white transition-colors py-2">Return Home</a>
                </div>
            </main>
        );
    }

    if (!formData) {
        return (
            <div className="min-h-screen bg-[#0d0008] flex flex-col items-center justify-center text-white">
                <p className="mb-4 text-rose-200/60 italic">Deep down, your message is waiting to be born...</p>
                <a href="/create-49" className="text-rose-400 underline hover:text-rose-300 transition-colors">Start your journey here</a>
            </div>
        );
    }

    return (
        <div style={{ background: '#0d0008', minHeight: '100vh' }}>
            {submitError && (
                <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] bg-red-500 text-white px-6 py-3 rounded-full shadow-2xl">
                    {submitError}
                </div>
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
