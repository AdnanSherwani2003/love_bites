'use client';

import { useState, useRef } from 'react';
import { Plan99FormData } from '@/types/plan99';

interface VideoUploadProps {
    data: Partial<Plan99FormData>;
    update: (partial: Partial<Plan99FormData>) => void;
    onNext: () => void;
    onBack: () => void;
}

export default function VideoUpload({ data, update, onNext, onBack }: VideoUploadProps) {
    const fileRef = useRef<HTMLInputElement>(null);
    const [activeSlot, setActiveSlot] = useState<number | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0] && activeSlot !== null) {
            const newFile = e.target.files[0];
            const currentPhotos = [...(data.videoPhotos || [])];
            currentPhotos[activeSlot] = newFile;
            update({ videoPhotos: currentPhotos });
            setActiveSlot(null);
        }
    };

    const slots = Array(5).fill(null);
    const photos = data.videoPhotos || [];

    return (
        <div className="animate-[fadeIn_0.5s_ease-out]">
            <h2 className="text-3xl font-bold text-pink-700 mb-2 font-serif text-center">Let's make a movie</h2>
            <p className="text-pink-400 text-center mb-10 text-sm">Add 5 photos to create a special video clip for your message</p>

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
                                className={`aspect-square rounded-2xl border-2 border-dashed flex items-center justify-center transition-all overflow-hidden relative shadow-lg ${
                                    preview ? 'border-pink-400 border-solid shadow-pink-100' : 'border-pink-200 bg-white/40 hover:bg-white hover:border-pink-300'
                                }`}
                            >
                                {preview ? (
                                    <img src={preview} alt="Video Frame" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-2xl text-pink-200">+</span>
                                )}
                                <div className="absolute bottom-2 right-2 bg-pink-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">{i + 1}</div>
                            </button>
                            {preview && (
                                <button 
                                    onClick={() => {
                                        const next = [...photos];
                                        next.splice(i, 1);
                                        update({ videoPhotos: next });
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

            <div className="bg-white/70 border-2 border-pink-100 rounded-3xl p-8 mb-12 flex items-center gap-6">
                <div className="text-4xl">🎬</div>
                <div>
                    <h3 className="text-pink-700 font-bold mb-1 font-serif">Cinematic Memory Clip</h3>
                    <p className="text-pink-400 text-xs">Our AI will weave these 5 moments into a beautiful, music-backed sequence.</p>
                </div>
            </div>

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
