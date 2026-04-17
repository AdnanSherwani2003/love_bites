import React, { useMemo } from 'react';

const StringLights: React.FC = () => {
    // Cubic Bezier formula
    const getBezierPoint = (t: number, p0: any, p1: any, p2: any, p3: any) => {
        const cx = Math.pow(1 - t, 3) * p0.x + 3 * Math.pow(1 - t, 2) * t * p1.x + 3 * (1 - t) * Math.pow(t, 2) * p2.x + Math.pow(t, 3) * p3.x;
        const cy = Math.pow(1 - t, 3) * p0.y + 3 * Math.pow(1 - t, 2) * t * p1.y + 3 * (1 - t) * Math.pow(t, 2) * p2.y + Math.pow(t, 3) * p3.y;
        return { x: cx, y: cy };
    };

    const tValues = [0.05, 0.13, 0.22, 0.32, 0.42, 0.52, 0.62, 0.73, 0.85];

    const leftWire = {
        p0: {x: -20, y: 0},
        p1: {x: 150, y: 20},
        p2: {x: 300, y: 160},
        p3: {x: 375, y: 140}
    };

    const rightWire = {
        p0: {x: 770, y: 0},
        p1: {x: 590, y: 20},
        p2: {x: 440, y: 160},
        p3: {x: 375, y: 140}
    };

    const bulbs = useMemo(() => {
        const generatedBulbs: {x: number, y: number}[] = [];
        
        // Left string
        tValues.forEach(t => {
            generatedBulbs.push(getBezierPoint(t, leftWire.p0, leftWire.p1, leftWire.p2, leftWire.p3));
        });

        // Right string
        tValues.forEach(t => {
            generatedBulbs.push(getBezierPoint(t, rightWire.p0, rightWire.p1, rightWire.p2, rightWire.p3));
        });

        return generatedBulbs;
    }, []);

    return (
        <svg
            viewBox="0 0 750 200"
            preserveAspectRatio="xMidYMin meet"
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '200px',
                zIndex: 2,
                pointerEvents: 'none',
            }}
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <filter id="stringlights-halo" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
                </filter>
                <style>{`
                    @keyframes glow-pulse {
                        0%, 100% { opacity: 0.9; transform: scale(1); }
                        50% { opacity: 0.45; transform: scale(0.95); }
                    }
                    .bulb-pulse {
                        animation: glow-pulse infinite ease-in-out;
                    }
                `}</style>
            </defs>

            {/* Catenary Drape Paths */}
            <path
                d="M -20,0 C 150,20 300,160 375,140"
                fill="none"
                stroke="rgba(200,180,190,0.35)"
                strokeWidth="0.8"
            />
            <path
                d="M 770,0 C 590,20 440,160 375,140"
                fill="none"
                stroke="rgba(200,180,190,0.35)"
                strokeWidth="0.8"
            />

            {/* Bulbs */}
            {bulbs.map((p, i) => {
                const duration = (2.5 + Math.random()).toFixed(2) + 's';
                const delay = (i * 0.3).toFixed(2) + 's';

                return (
                    <g key={i} className="bulb-pulse" style={{ animationDuration: duration, animationDelay: delay, transformOrigin: `${p.x}px ${p.y}px` }}>
                        {/* Halo Layer */}
                        <g filter="url(#stringlights-halo)">
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

export default StringLights;
