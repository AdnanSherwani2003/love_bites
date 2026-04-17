import React, { useMemo } from 'react';

const MemoriesStringLights: React.FC = () => {
    // Break the composite path into 4 cubic bezier segments based on the user's path:
    // M 450,0 C 350,80 150,180 200,280 C 250,380 650,420 600,520 C 550,620 150,660 200,760 C 250,860 650,900 580,980
    const segments = [
        { p0: {x:450, y:0},   p1: {x:350, y:80},  p2: {x:150, y:180}, p3: {x:200, y:280} },
        { p0: {x:200, y:280}, p1: {x:250, y:380}, p2: {x:650, y:420}, p3: {x:600, y:520} },
        { p0: {x:600, y:520}, p1: {x:550, y:620}, p2: {x:150, y:660}, p3: {x:200, y:760} },
        { p0: {x:200, y:760}, p1: {x:250, y:860}, p2: {x:650, y:900}, p3: {x:580, y:980} }
    ];

    const getBezierPoint = (t: number, p0: any, p1: any, p2: any, p3: any) => {
        const cx = Math.pow(1 - t, 3) * p0.x + 3 * Math.pow(1 - t, 2) * t * p1.x + 3 * (1 - t) * Math.pow(t, 2) * p2.x + Math.pow(t, 3) * p3.x;
        const cy = Math.pow(1 - t, 3) * p0.y + 3 * Math.pow(1 - t, 2) * t * p1.y + 3 * (1 - t) * Math.pow(t, 2) * p2.y + Math.pow(t, 3) * p3.y;
        return { x: cx, y: cy };
    };

    const bulbs = useMemo(() => {
        const generatedBulbs: {x: number, y: number}[] = [];
        // Place a few bulbs per segment
        const tValues = [0.15, 0.35, 0.55, 0.75, 0.95];
        
        segments.forEach(seg => {
            tValues.forEach(t => {
                generatedBulbs.push(getBezierPoint(t, seg.p0, seg.p1, seg.p2, seg.p3));
            });
        });
        return generatedBulbs;
    }, []);

    return (
        <svg
            viewBox="0 0 900 1000"
            preserveAspectRatio="xMidYMid stretch"
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 1,
                pointerEvents: 'none',
            }}
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <filter id="memories-bulb-halo" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
                </filter>
                <style>{`
                    @keyframes memories-glow-pulse {
                        0%, 100% { opacity: 0.9; transform: scale(1); }
                        50% { opacity: 0.45; transform: scale(0.95); }
                    }
                    .memories-bulb-pulse {
                        animation: memories-glow-pulse infinite ease-in-out;
                    }
                `}</style>
            </defs>

            {/* Continuous Weave Path */}
            <path
                d="M 450,0 C 350,80 150,180 200,280 C 250,380 650,420 600,520 C 550,620 150,660 200,760 C 250,860 650,900 580,980"
                fill="none"
                stroke="rgba(200,180,190,0.35)"
                strokeWidth="0.8"
            />

            {/* Bulbs */}
            {bulbs.map((p, i) => {
                const duration = (2.5 + Math.random()).toFixed(2) + 's';
                const delay = (i * 0.3).toFixed(2) + 's';

                return (
                    <g key={i} className="memories-bulb-pulse" style={{ animationDuration: duration, animationDelay: delay, transformOrigin: `${p.x}px ${p.y}px` }}>
                        {/* Halo Layer */}
                        <g filter="url(#memories-bulb-halo)">
                            <circle cx={p.x} cy={p.y} r="6" fill="#ffccd8" opacity="0.6" />
                        </g>
                        {/* Bulb Body */}
                        <circle cx={p.x} cy={p.y} r="6" fill="#ffccd8" />
                        <circle cx={p.x} cy={p.y} r="3" fill="#fff0f5" />
                    </g>
                );
            })}
        </svg>
    );
};

export default MemoriesStringLights;
