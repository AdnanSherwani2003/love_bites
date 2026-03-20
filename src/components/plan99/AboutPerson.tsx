'use client';

import { Plan99FormData } from '@/types/plan99';

interface AboutPersonProps {
    data: Partial<Plan99FormData>;
    update: (partial: Partial<Plan99FormData>) => void;
    onNext: () => void;
    onBack: () => void;
}

export default function AboutPerson({ data, update, onNext, onBack }: AboutPersonProps) {
    const isComplete = (data.yourName?.trim() ?? '').length > 0 && 
                      (data.partnerName?.trim() ?? '').length > 0 && 
                      (data.partnerDesc?.trim() ?? '').length > 10;

    return (
        <div className="animate-[fadeIn_0.5s_ease-out]">
            <h2 className="text-3xl font-bold text-pink-700 mb-2 font-serif text-center">Tell us about {data.partnerName || 'them'}</h2>
            <p className="text-pink-400 text-center mb-10 text-sm">A few details help our AI create the perfect message</p>

            <div className="space-y-6 mb-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="text-[10px] font-bold text-pink-400 uppercase tracking-widest mb-2 block ml-1">Your Name</label>
                        <input 
                            type="text" 
                            placeholder="Adnan"
                            value={data.yourName || ''}
                            onChange={(e) => update({ yourName: e.target.value })}
                            className="w-full bg-white/70 border-2 border-pink-100 rounded-2xl px-5 py-4 text-pink-700 placeholder-pink-200 outline-none focus:border-pink-300 focus:shadow-lg focus:shadow-pink-100 transition-all font-serif italic"
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-pink-400 uppercase tracking-widest mb-2 block ml-1">Their Name</label>
                        <input 
                            type="text" 
                            placeholder="Zoya"
                            value={data.partnerName || ''}
                            onChange={(e) => update({ partnerName: e.target.value })}
                            className="w-full bg-white/70 border-2 border-pink-100 rounded-2xl px-5 py-4 text-pink-700 placeholder-pink-200 outline-none focus:border-pink-300 focus:shadow-lg focus:shadow-pink-100 transition-all font-serif italic"
                        />
                    </div>
                </div>

                <div>
                    <label className="text-[10px] font-bold text-pink-400 uppercase tracking-widest mb-2 block ml-1">What makes them special?</label>
                    <textarea 
                        rows={5}
                        placeholder="They have the most infectious laugh, and they always know how to make me smile even on my hardest days..."
                        value={data.partnerDesc || ''}
                        onChange={(e) => update({ partnerDesc: e.target.value })}
                        className="w-full bg-white/70 border-2 border-pink-100 rounded-2xl px-5 py-4 text-pink-700 placeholder-pink-200 outline-none focus:border-pink-300 focus:shadow-lg focus:shadow-pink-100 transition-all font-serif italic resize-none"
                    />
                    <p className="mt-2 text-[10px] text-right text-pink-300 font-bold tracking-widest italic">min. 10 characters</p>
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
                    disabled={!isComplete}
                    onClick={onNext}
                    className="flex-[2] bg-gradient-to-r from-pink-400 to-rose-500 text-white font-bold py-4 rounded-2xl shadow-lg hover:shadow-pink-200 hover:scale-[1.01] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                >
                    Continue ➔
                </button>
            </div>
        </div>
    );
}
