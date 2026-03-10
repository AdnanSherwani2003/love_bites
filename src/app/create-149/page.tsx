'use client';

import React, { useState } from 'react';
import GrandAmour149 from '@/components/plan149/GrandAmour149';

/**
 * Page for Creating the Grand Amour ₹149 Plan
 */
export default function Create149Page() {
    const [currentView, setCurrentView] = useState("create"); // "create" | "lock" | "preview"
    const [formData, setFormData] = useState(null);

    const handleComplete = (data: any) => {
        setFormData(data);
        // For now, we point to lock screen once ready. 
        // Using alert since LockScreen/PreviewScreen for 149 are yet to be separately styled if needed.
        console.log("149 Plan Data:", data);
        alert("Love Code for Grand Amour ₹149 plan created! (Lock & Preview screens integration coming next)");
    };

    return (
        <div style={{ background: '#0d0008', minHeight: '100vh' }}>
            {currentView === "create" && (
                <GrandAmour149 onComplete={handleComplete} />
            )}
        </div>
    );
}
