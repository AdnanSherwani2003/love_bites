'use client';

import React, { useState } from 'react';
import TrueLovePlan from '@/components/TrueLovePlan';
import { LockScreen, PreviewScreen } from '@/components/plan99/LoveBites99';

export default function Create99Page() {
    const [currentView, setCurrentView] = useState("create"); // "create" | "lock" | "preview"
    const [formData, setFormData] = useState(null);

    const handleComplete = (data) => {
        setFormData(data);
        setCurrentView("lock");
    };

    return (
        <div style={{ background: '#1a0e00', minHeight: '100vh' }}>
            {currentView === "create" && (
                <TrueLovePlan onComplete={handleComplete} />
            )}

            {currentView === "lock" && (
                <LockScreen
                    data={formData}
                    onUnlock={() => setCurrentView("preview")}
                />
            )}

            {currentView === "preview" && (
                <PreviewScreen data={formData} />
            )}
        </div>
    );
}
