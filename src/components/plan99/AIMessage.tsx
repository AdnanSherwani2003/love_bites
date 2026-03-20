'use client';

import { useState } from 'react';
import { Plan99FormData } from '@/types/plan99';

interface AIMessageProps {
    data: Partial<Plan99FormData>;
    update: (partial: Partial<Plan99FormData>) => void;
    onNext: () => void;
    onBack: () => void;
}

export default function AIMessage({ data, update, onNext, onBack }: AIMessageProps) {
    const [isGenerating, setIsGenerating] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const generateAI = async () => {
        setIsGenerating(true);
        try {
            const res = await fetch('/api/generate-message', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    moods: data.selectedMoods,
                    occasion: data.occasion,
                    yourName: data.yourName,
                    partnerName: data.partnerName,
                    partnerDesc: data.partnerDesc
                })
            });
            const json = await res.json();
            if (json.message) {
                update({ aiMessage: json.message });
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="animate-[fadeIn_0.5s_ease-out]">
            <h2 className="text-3xl font-bold text-pink-700 mb-2 font-serif text-center">Crafting the Words</h2>
            <p className="text-pink-400 text-center mb-10 text-sm">Let our AI help you say exactly what's in your heart</p>

            <div className="mb-8">
                {data.aiMessage ? (
                    <div className="bg-white/70 border-2 border-pink-100 rounded-3xl p-8 relative shadow-lg shadow-pink-100/50">
                        <div className="text-4xl text-pink-200 absolute top-4 left-6 font-serif">"</div>
                        {isEditing ? (
                            <textarea 
                                rows={10}
                                value={data.aiMessage}
                                onChange={(e) => update({ aiMessage: e.target.value })}
                                className="w-full bg-transparent border-none outline-none text-pink-700 font-serif italic text-lg leading-relaxed resize-none"
                            />
                        ) : (
                            <p className="text-pink-700 font-serif italic text-lg leading-relaxed whitespace-pre-wrap">
                                {data.aiMessage}
                            </p>
                        )}
                        <div className="text-4xl text-pink-200 absolute bottom-2 right-6 font-serif translate-y-2">"</div>
                        
                        <div className="flex justify-end gap-3 mt-6">
                            <button 
                                onClick={generateAI}
                                disabled={isGenerating}
                                className="text-xs font-bold text-pink-400 hover:text-pink-600 transition-colors uppercase tracking-widest disabled:opacity-50"
                            >
                                {isGenerating ? 'Regenerating...' : '↺ Regenerate'}
                            </button>
                            <button 
                                onClick={() => setIsEditing(!isEditing)}
                                className="text-xs font-bold text-pink-400 hover:text-pink-600 transition-colors uppercase tracking-widest"
                            >
                                {isEditing ? '✓ Done Editing' : '✎ Edit Message'}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white/40 border-2 border-dashed border-pink-200 rounded-3xl p-12 text-center">
                        <div className="text-6xl mb-6">🖋️</div>
                        <h3 className="text-pink-700 font-bold mb-4 font-serif">Something magical is waiting...</h3>
                        <button
                            onClick={generateAI}
                            disabled={isGenerating}
                            className="bg-pink-500 text-white font-bold px-10 py-4 rounded-2xl shadow-lg hover:shadow-pink-200 hover:scale-[1.02] transition-all disabled:opacity-50"
                        >
                            {isGenerating ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    Writing your love story...
                                </span>
                            ) : (
                                'Generate AI Message ✨'
                            )}
                        </button>
                    </div>
                )}
            </div>

            <div className="flex gap-4">
                <button
                    onClick={onBack}
                    className="flex-1 bg-white/50 text-pink-400 font-bold py-4 rounded-2xl border-2 border-pink-50 hover:bg-white transition-all"
                >
                    Back
                </button>
                <button
                    disabled={!data.aiMessage || isGenerating}
                    onClick={onNext}
                    className="flex-[2] bg-gradient-to-r from-pink-400 to-rose-500 text-white font-bold py-4 rounded-2xl shadow-lg hover:shadow-pink-200 hover:scale-[1.01] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                >
                    Continue ➔
                </button>
            </div>
        </div>
    );
}
