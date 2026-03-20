'use client';

interface ProgressBarProps {
    step: number;
    total: number;
}

export default function ProgressBar({ step, total }: ProgressBarProps) {
    const progress = ((step + 1) / total) * 100;

    return (
        <div className="w-full max-w-xl mx-auto px-4 mb-8">
            <div className="flex justify-between items-end mb-2">
                <span className="text-[10px] font-bold text-pink-400 uppercase tracking-widest">
                    Step {step + 1} of {total}
                </span>
                <span className="text-xl">✨</span>
            </div>
            <div className="h-2 w-full bg-pink-100 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-gradient-to-r from-pink-400 to-rose-500 transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
}
