'use client';

import { Plan99FormData } from '@/types/plan99';

interface DeliverySettingsProps {
    data: Partial<Plan99FormData>;
    update: (partial: Partial<Plan99FormData>) => void;
    onSubmit: () => void;
    submitting: boolean;
    onBack: () => void;
}

const deliveryMethods = [
    { id: "link", label: "Secret Link", icon: "🔗", description: "Get a link to share yourself anytime" },
    { id: "email", label: "Email", icon: "✉️", description: "Delivered via LoveBites official email" },
    { id: "whatsapp", label: "WhatsApp", icon: "💬", description: "Sent from our LoveBites business account" },
];

export default function DeliverySettings({ data, update, onSubmit, submitting, onBack }: DeliverySettingsProps) {
    const isComplete = (data.unlockCode ?? '').length === 4 && 
                      (data.unlockHint ?? '').length > 0 && 
                      data.deliveryMethod;

    return (
        <div className="animate-[fadeIn_0.5s_ease-out]">
            <h2 className="text-3xl font-bold text-pink-700 mb-2 font-serif text-center">Seal with a Secret</h2>
            <p className="text-pink-400 text-center mb-10 text-sm">Add a security code and choose how to deliver your gift</p>

            <div className="space-y-8 mb-12">
                {/* Security Section */}
                <div className="bg-white/70 border-2 border-pink-100 rounded-3xl p-8 shadow-lg shadow-pink-100/50">
                    <h3 className="text-pink-700 font-bold mb-6 font-serif flex items-center gap-2">
                        <span className="text-xl">🔒</span> Unlock Code
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label className="text-[10px] font-bold text-pink-400 uppercase tracking-widest mb-2 block ml-1">4-Digit Passcode</label>
                            <input 
                                type="text" 
                                maxLength={4}
                                placeholder="1234"
                                value={data.unlockCode || ''}
                                onChange={(e) => update({ unlockCode: e.target.value.replace(/\D/g, '') })}
                                className="w-full bg-pink-50/50 border-2 border-pink-100 rounded-2xl px-5 py-4 text-pink-700 placeholder-pink-200 outline-none focus:border-pink-300 transition-all font-mono text-xl tracking-[1em] text-center"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-pink-400 uppercase tracking-widest mb-2 block ml-1">Unlock Hint</label>
                            <input 
                                type="text" 
                                placeholder="The day we first met"
                                value={data.unlockHint || ''}
                                onChange={(e) => update({ unlockHint: e.target.value })}
                                className="w-full bg-pink-50/50 border-2 border-pink-100 rounded-2xl px-5 py-4 text-pink-700 placeholder-pink-200 outline-none focus:border-pink-300 transition-all font-serif italic"
                            />
                        </div>
                    </div>
                </div>

                {/* Delivery Method */}
                <div>
                    <label className="text-[10px] font-bold text-pink-400 uppercase tracking-widest mb-4 block text-center">Choose Delivery Method</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {deliveryMethods.map(m => (
                            <button
                                key={m.id}
                                onClick={() => update({ deliveryMethod: m.id as any })}
                                className={`p-6 rounded-3xl border-2 transition-all text-left flex flex-col gap-3 ${
                                    data.deliveryMethod === m.id 
                                    ? 'bg-white border-pink-400 shadow-xl shadow-pink-100 scale-[1.02]' 
                                    : 'bg-white/50 border-pink-100 hover:border-pink-200'
                                }`}
                            >
                                <span className="text-3xl">{m.icon}</span>
                                <div>
                                    <h4 className="font-bold text-pink-700">{m.label}</h4>
                                    <p className="text-[10px] text-pink-400 leading-tight mt-1">{m.description}</p>
                                </div>
                                {data.deliveryMethod === m.id && (
                                    <div className="absolute top-4 right-4 bg-pink-500 text-white rounded-full p-1">
                                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Optional Schedule */}
                <div className="bg-pink-50/30 rounded-3xl p-6 border border-pink-100">
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input 
                            type="checkbox" 
                            checked={!data.sendNow} 
                            onChange={(e) => update({ sendNow: !e.target.checked })}
                            className="w-5 h-5 accent-pink-500"
                        />
                        <span className="text-sm font-bold text-pink-600 font-serif italic">Schedule for later?</span>
                    </label>
                    {!data.sendNow && (
                        <div className="grid grid-cols-2 gap-4 mt-4 animate-[fadeIn_0.3s_ease-out]">
                            <input 
                                type="date" 
                                value={data.scheduledDate || ''}
                                onChange={(e) => update({ scheduledDate: e.target.value })}
                                className="bg-white border border-pink-100 rounded-xl px-4 py-3 text-pink-700 text-sm outline-none focus:border-pink-300 shadow-sm"
                            />
                            <input 
                                type="time" 
                                value={data.scheduledTime || ''}
                                onChange={(e) => update({ scheduledTime: e.target.value })}
                                className="bg-white border border-pink-100 rounded-xl px-4 py-3 text-pink-700 text-sm outline-none focus:border-pink-300 shadow-sm"
                            />
                        </div>
                    )}
                </div>
            </div>

            <div className="flex gap-4">
                <button
                    onClick={onBack}
                    className="flex-1 bg-white/50 text-pink-400 font-bold py-4 rounded-2xl border-2 border-pink-50 hover:bg-white transition-all shadow-sm"
                >
                    Back
                </button>
                <button
                    disabled={!isComplete || submitting}
                    onClick={onSubmit}
                    className="flex-[2] bg-gradient-to-r from-pink-400 to-rose-500 text-white font-bold py-4 rounded-2xl shadow-xl hover:shadow-pink-200 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center gap-3"
                >
                    {submitting ? (
                        <>
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            Creating Magic...
                        </>
                    ) : (
                        'Complete Gift 🎁'
                    )}
                </button>
            </div>
        </div>
    );
}
