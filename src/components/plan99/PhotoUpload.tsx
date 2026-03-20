'use client';

import { useState, useRef } from 'react';
import { Plan99FormData } from '@/types/plan99';

interface PhotoUploadProps {
    data: Partial<Plan99FormData>;
    update: (partial: Partial<Plan99FormData>) => void;
    onNext: () => void;
    onBack: () => void;
}

export default function PhotoUpload({ data, update, onNext, onBack }: PhotoUploadProps) {
    const fileRef = useRef<HTMLInputElement>(null);
    const [activeSlot, setActiveSlot] = useState<number | null>(null);
    const [memories, setMemories] = useState<string[]>(Array(5).fill(''));

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0] && activeSlot !== null) {
            const newFile = e.target.files[0];
            const currentPhotos = [...(data.framePhotos || [])];
            currentPhotos[activeSlot] = newFile;
            update({ framePhotos: currentPhotos });
            setActiveSlot(null);
        }
    };

    const removePhoto = (index: number) => {
        const currentPhotos = [...(data.framePhotos || [])];
        currentPhotos[index] = undefined as any; // Temporary hack to keep index
        update({ framePhotos: currentPhotos.filter(p => p !== undefined) }); // This is a bit tricky with File array
    };

    // Better way to handle 5 slots with Files
    const slots = Array(5).fill(null);
    const photos = data.framePhotos || [];

    return (
        <div className="animate-[fadeIn_0.5s_ease-out]">
            <h2 className="text-3xl font-bold text-pink-700 mb-2 font-serif text-center">Capture the Moments</h2>
            <p className="text-pink-400 text-center mb-10 text-sm">Add up to 5 photos of your favourite memories together</p>

            <input 
                type="file" 
                ref={fileRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
            />

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-12">
                {slots.map((_, i) => {
                    const file = photos[i];
                    const preview = file ? URL.createObjectURL(file) : null;
                    return (
                        <div key={i} className="flex flex-col gap-2">
                            <button
                                onClick={() => { setActiveSlot(i); fileRef.current?.click(); }}
                                className={`aspect-square rounded-2xl border-2 border-dashed flex items-center justify-center transition-all overflow-hidden relative ${
                                    preview ? 'border-pink-400 border-solid shadow-lg' : 'border-pink-200 bg-white/40 hover:bg-white hover:border-pink-300'
                                }`}
                            >
                                {preview ? (
                                    <img src={preview} alt="Memory" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-2xl text-pink-200">+</span>
                                )}
                            </button>
                            {preview && (
                                <button 
                                    onClick={() => {
                                        const next = [...photos];
                                        next.splice(i, 1);
                                        update({ framePhotos: next });
                                    }}
                                    className="text-[10px] font-bold text-pink-300 hover:text-pink-500 uppercase tracking-widest text-center"
                                >
                                    Remove
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>

            <p className="text-[10px] font-bold text-pink-400 uppercase tracking-widest mb-6 text-center">Your Photos will be used for the interactive opening</p>

            <div className="flex gap-4">
                <button
                    onClick={onBack}
                    className="flex-1 bg-white/50 text-pink-400 font-bold py-4 rounded-2xl border-2 border-pink-50 hover:bg-white transition-all"
                >
                    Back
                </button>
                <button
                    onClick={onNext}
                    className="flex-[2] bg-gradient-to-r from-pink-400 to-rose-500 text-white font-bold py-4 rounded-2xl shadow-lg hover:shadow-pink-200 hover:scale-[1.01] transition-all"
                >
                    Continue ➔
                </button>
            </div>
        </div>
    );
}
