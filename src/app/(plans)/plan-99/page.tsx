'use client';

import { useState } from 'react';
import ProgressBar from '@/components/plan99/ProgressBar';
import MoodSelector from '@/components/plan99/MoodSelector';
import AboutPerson from '@/components/plan99/AboutPerson';
import AIMessage from '@/components/plan99/AIMessage';
import PhotoUpload from '@/components/plan99/PhotoUpload';
import VideoUpload from '@/components/plan99/VideoUpload';
import DeliverySettings from '@/components/plan99/DeliverySettings';
import { Plan99FormData } from '@/types/plan99';

const TOTAL_STEPS = 6;

export default function Plan99Page() {
    const [step, setStep] = useState(0);
    const [formData, setFormData] = useState<Partial<Plan99FormData>>({
        selectedMoods: [],
        framePhotos: [],
        videoPhotos: [],
        sendNow: true,
    });
    const [submitting, setSubmitting] = useState(false);
    const [shareSlug, setShareSlug] = useState<string | null>(null);
    const [submitError, setSubmitError] = useState('');

    const update = (partial: Partial<Plan99FormData>) =>
        setFormData(prev => ({ ...prev, ...partial }));

    function next() { setStep(s => Math.min(s + 1, TOTAL_STEPS - 1)); }
    function back() { setStep(s => Math.max(s - 1, 0)); }

    async function handleSubmit() {
        setSubmitting(true);
        setSubmitError('');
        try {
            const fd = new FormData();
            fd.append('yourName', formData.yourName ?? '');
            fd.append('partnerName', formData.partnerName ?? '');
            fd.append('partnerDesc', formData.partnerDesc ?? '');
            fd.append('occasion', formData.occasion ?? '');
            fd.append('moods', JSON.stringify(formData.selectedMoods ?? []));
            fd.append('aiMessage', formData.aiMessage ?? '');
            fd.append('unlockCode', formData.unlockCode ?? '');
            fd.append('unlockHint', formData.unlockHint ?? '');
            fd.append('deliveryMethod', formData.deliveryMethod ?? '');
            fd.append('deliveryContact', formData.deliveryContact ?? '');
            fd.append('sendNow', String(formData.sendNow ?? true));
            if (formData.scheduledDate && formData.scheduledTime) {
                fd.append('scheduledAt', `${formData.scheduledDate}T${formData.scheduledTime}:00`);
            }
            // Frame photos
            (formData.framePhotos ?? []).forEach((file, i) => {
                fd.append(`framePhoto_${i}`, file);
            });
            // Video clip photos
            (formData.videoPhotos ?? []).forEach((file, i) => {
                fd.append(`videoPhoto_${i}`, file);
            });

            const res = await fetch('/api/love-code', { method: 'POST', body: fd });
            const json = await res.json();
            if (json.success && json.share_slug) {
                setShareSlug(json.share_slug);
            } else {
                setSubmitError(json.error ?? 'Something went wrong. Please try again.');
            }
        } catch {
            setSubmitError('Network error. Please try again.');
        } finally {
            setSubmitting(false);
        }
    }

    // ✅ Success screen
    if (shareSlug) {
        const link = `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://lovebites.in'}/lb/${shareSlug}`;
        return (
            <main className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 flex flex-col items-center justify-center px-4">
                <div className="text-6xl mb-6 animate-bounce">💌</div>
                <h1 className="text-3xl font-bold text-pink-700 text-center mb-2">Sent with Love!</h1>
                <p className="text-pink-400 text-center mb-8 max-w-sm">
                    Your love surprise is ready. Share this link with {formData.partnerName ?? 'them'} when the moment is perfect.
                </p>
                <div className="bg-white border-2 border-pink-200 rounded-2xl px-5 py-4 max-w-sm w-full text-center shadow-lg mb-4">
                    <p className="text-xs text-pink-400 mb-1 font-semibold tracking-wider uppercase">Secret Love Link</p>
                    <p className="text-pink-700 font-mono font-bold text-sm break-all">{link}</p>
                </div>
                <button
                    onClick={() => navigator.clipboard.writeText(link)}
                    className="bg-gradient-to-r from-pink-400 to-rose-500 text-white font-bold px-8 py-3 rounded-2xl shadow-lg hover:shadow-pink-300 hover:scale-[1.02] transition-all"
                >
                    📋 Copy Link
                </button>
            </main>
        );
    }

    const STEPS = [
        <MoodSelector key="mood" data={formData} update={update} onNext={next} />,
        <AboutPerson key="about" data={formData} update={update} onNext={next} onBack={back} />,
        <AIMessage key="message" data={formData} update={update} onNext={next} onBack={back} />,
        <PhotoUpload key="photos" data={formData} update={update} onNext={next} onBack={back} />,
        <VideoUpload key="video" data={formData} update={update} onNext={next} onBack={back} />,
        <DeliverySettings key="deliver" data={formData} update={update} onSubmit={handleSubmit} submitting={submitting} onBack={back} />,
    ];

    return (
        <main className="min-h-screen w-full bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100">
            <header className="text-center pt-8 pb-4">
                <span className="inline-block bg-pink-200 text-pink-800 text-xs font-bold tracking-widest px-4 py-1 rounded-full mb-3">
                    ✨ ₹99 Premium
                </span>
                <h1 className="font-serif text-5xl font-bold text-pink-600">Love Bites</h1>
                <p className="text-pink-400 italic mt-1">Create something they&apos;ll treasure forever</p>
            </header>

            <ProgressBar step={step} total={TOTAL_STEPS} />

            <div className="w-full max-w-xl mx-auto px-4 pb-32">
                {submitError && (
                    <div className="mb-4 bg-red-50 border border-red-200 rounded-2xl px-4 py-3 text-red-500 text-sm text-center">
                        {submitError}
                    </div>
                )}
                {STEPS[step]}
            </div>
        </main>
    );
}
