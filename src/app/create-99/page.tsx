'use client';

import React, { useState } from 'react';
import TrueLovePlan from '@/components/TrueLovePlan';
import { LockScreen, Preview99 } from '@/components/plan99/LoveBites99';
import { dataURLtoFile } from '@/utils/file';

export default function Create99Page() {
    const [currentView, setCurrentView] = useState("create"); // "create" | "lock" | "preview" | "success"
    const [formData, setFormData] = useState<any>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [shareSlug, setShareSlug] = useState("");
    const [submitError, setSubmitError] = useState("");

    const handleComplete = async (data: any) => {
        setFormData(data);
        setCurrentView("lock");
    };

    const handleFinalSubmit = async () => {
        setIsSubmitting(true);
        setSubmitError("");
        try {
            const body = new FormData();
            body.append('tier', '99');
            body.append('yourName', formData.senderName || '');
            body.append('partnerName', formData.recipientName || '');
            body.append('partnerDesc', formData.partnerDesc || '');
            body.append('occasion', JSON.stringify(formData.occasion || {}));
            body.append('moods', JSON.stringify(formData.selectedMoods || []));
            body.append('aiMessage', formData.generatedMessage || '');
            body.append('unlockCode', formData.unlockCode || '');
            body.append('unlockHint', formData.hintMessage || '');
            body.append('deliveryMethod', formData.deliveryMethod || 'link');
            body.append('deliveryContact', formData.recipientContact || '');
            body.append('sendNow', 'true');
            if (formData.photoMemories) {
                body.append('photoMemories', JSON.stringify(formData.photoMemories));
            }

            // Handle Photo Uploads
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
            } else {
                setSubmitError(result.error || "Failed to save your love plan.");
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
            <main className="min-h-screen bg-[#0d0d1a] flex flex-col items-center justify-center px-4 text-white text-center font-serif">
                <div className="text-6xl mb-6 animate-bounce">✨</div>
                <h1 className="text-4xl font-bold text-[#ff6b8a] mb-2">Sent with Love!</h1>
                <p className="text-rose-200/60 mb-8 max-w-sm italic">
                    Your premium love surprise is live and ready to be discovered.
                </p>
                <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 max-w-sm w-full mb-6 backdrop-blur-xl">
                    <p className="text-[10px] text-[#ff6b8a] mb-1 font-bold tracking-[3px] uppercase">Secret Share Link</p>
                    <p className="text-white font-mono text-sm break-all">{link}</p>
                </div>
                <div className="flex flex-col gap-3 w-full max-w-sm">
                    <button
                        onClick={() => {
                            navigator.clipboard.writeText(link);
                            alert("Link copied to clipboard! ❤️");
                        }}
                        className="bg-gradient-to-r from-[#7a1030] to-[#c4304f] text-white font-bold py-4 rounded-xl shadow-2xl hover:scale-[1.02] transition-all"
                    >
                        📋 Copy Secret Link
                    </button>
                    <a href="/" className="text-white/40 text-sm hover:text-white transition-colors py-2">Return Home</a>
                </div>
            </main>
        );
    }

    return (
        <div style={{ background: '#1a0e00', minHeight: '100vh', position: 'relative' }}>
            {submitError && (
                <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] bg-red-500 text-white px-6 py-3 rounded-full shadow-2xl animate-bounce">
                    {submitError}
                </div>
            )}
            
            {currentView === "create" && (
                <TrueLovePlan onComplete={handleComplete} />
            )}

            {currentView === "lock" && (
                <LockScreen
                    data={formData}
                    onUnlock={() => setCurrentView("preview")}
                />
            )}

            {currentView === "preview" && (
                <div className="relative">
                    <Preview99 data={formData} />
                    <div className="fixed bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/80 to-transparent flex justify-center z-50">
                        <button 
                            onClick={handleFinalSubmit}
                            disabled={isSubmitting}
                            className="bg-gradient-to-r from-[#7a1030] to-[#c4304f] text-white font-bold px-12 py-4 rounded-full shadow-2xl hover:scale-105 transition-all disabled:opacity-50"
                        >
                            {isSubmitting ? "Generating Link..." : "Confirm & Send Premium Plan ✉️"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
