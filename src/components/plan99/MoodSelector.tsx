'use client';

import { useState } from 'react';
import { Plan99FormData } from '@/types/plan99';

const moodsData = [
    { id: "deeply_in_love", label: "Deeply in Love", emoji: "❤️", category: "Romantic" },
    { id: "adoring", label: "Adoring", emoji: "🥰", category: "Romantic" },
    { id: "affectionate", label: "Affectionate", emoji: "💞", category: "Romantic" },
    { id: "hopelessly_romantic", label: "Hopelessly Romantic", emoji: "💘", category: "Romantic" },
    { id: "grateful", label: "Grateful", emoji: "💓", category: "Emotional" },
    { id: "cherishing", label: "Cherishing", emoji: "🌹", category: "Romantic" },
    { id: "devoted", label: "Devoted", emoji: "💗", category: "Deep" },
    { id: "comforted", label: "Comforted", emoji: "🤍", category: "Deep" },
    { id: "obsessed", label: "Obsessed with You", emoji: "😍", category: "Romantic" },
    { id: "playful", label: "Playful Love", emoji: "😘", category: "Fun" },
    { id: "happy", label: "Happy with You", emoji: "😄", category: "Fun" },
    { id: "forever", label: "Forever Yours", emoji: "💍", category: "Deep" },
    { id: "soulmate", label: "Soulmate Feeling", emoji: "🌙", category: "Deep" },
    { id: "passionate", label: "Passionate", emoji: "🔥", category: "Deep" }
];

const occasions = [
    { id: "anniversary", label: "Anniversary", emoji: "💑" },
    { id: "birthday", label: "Birthday", emoji: "🎂" },
    { id: "valentine", label: "Valentine's Day", emoji: "💝" },
    { id: "just_because", label: "Just Because", emoji: "🌸" },
    { id: "proposal", label: "Proposal", emoji: "💍" },
    { id: "long_distance", label: "Long Distance", emoji: "✈️" },
];

interface MoodSelectorProps {
    data: Partial<Plan99FormData>;
    update: (partial: Partial<Plan99FormData>) => void;
    onNext: () => void;
}

export default function MoodSelector({ data, update, onNext }: MoodSelectorProps) {
    const [activeTab, setActiveTab] = useState("Romantic");

    const toggleMood = (id: string) => {
        const current = data.selectedMoods || [];
        if (current.includes(id)) {
            update({ selectedMoods: current.filter(m => m !== id) });
        } else if (current.length < 3) {
            update({ selectedMoods: [...current, id] });
        }
    };

    const categories = ["Romantic", "Emotional", "Deep", "Fun"];
    const filteredMoods = moodsData.filter(m => m.category === activeTab);

    return (
        <div className="animate-[fadeIn_0.5s_ease-out]">
            <h2 className="text-3xl font-bold text-pink-700 mb-2 font-serif text-center">How are you feeling?</h2>
            <p className="text-pink-400 text-center mb-10 text-sm">Select up to 3 moods that describe your love right now</p>

            {/* Occasion Selection */}
            <div className="mb-8">
                <p className="text-[10px] font-bold text-pink-400 uppercase tracking-widest mb-4 text-center">Select Occasion</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {occasions.map((o) => (
                        <button
                            key={o.id}
                            onClick={() => update({ occasion: o.id })}
                            className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                                data.occasion === o.id 
                                ? 'bg-white border-pink-400 shadow-pink-100 shadow-xl scale-[1.02]' 
                                : 'bg-white/50 border-pink-100 hover:border-pink-200'
                            }`}
                        >
                            <span className="text-2xl">{o.emoji}</span>
                            <span className={`text-xs font-bold ${data.occasion === o.id ? 'text-pink-600' : 'text-pink-300'}`}>
                                {o.label}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Tabs */}
            <div className="flex justify-center gap-2 mb-6">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setActiveTab(cat)}
                        className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                            activeTab === cat 
                            ? 'bg-pink-500 text-white shadow-lg' 
                            : 'bg-white/70 text-pink-400 hover:bg-white'
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Mood Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
                {filteredMoods.map(mood => {
                    const isSelected = (data.selectedMoods || []).includes(mood.id);
                    return (
                        <button
                            key={mood.id}
                            onClick={() => toggleMood(mood.id)}
                            className={`p-5 rounded-2xl border-2 transition-all flex items-center gap-4 text-left ${
                                isSelected 
                                ? 'bg-white border-pink-400 shadow-pink-100 shadow-xl scale-[1.02]' 
                                : 'bg-white/50 border-pink-100 hover:border-pink-200'
                            }`}
                        >
                            <span className="text-3xl">{mood.emoji}</span>
                            <div>
                                <h3 className={`font-bold ${isSelected ? 'text-pink-700' : 'text-pink-600'}`}>{mood.label}</h3>
                                <p className="text-[10px] text-pink-400">Perfect for your {activeTab.toLowerCase()} message</p>
                            </div>
                            {isSelected && (
                                <div className="ml-auto bg-pink-500 text-white rounded-full p-1">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>

            <button
                disabled={!data.occasion || (data.selectedMoods || []).length === 0}
                onClick={onNext}
                className="w-full bg-gradient-to-r from-pink-400 to-rose-500 text-white font-bold py-4 rounded-2xl shadow-lg hover:shadow-pink-200 hover:scale-[1.01] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
            >
                Continue ➔
            </button>
        </div>
    );
}
