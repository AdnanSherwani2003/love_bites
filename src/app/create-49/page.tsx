'use client';

import React, { useState } from 'react';
import SweetStart49 from '@/components/plan49/SweetStart49';

/**
 * Page for Creating the Sweet Start ₹49 Plan
 */
export default function Create49Page() {
    const handleComplete = (data: any) => {
        console.log("49 Plan Data:", data);
        alert("Love Code for Sweet Start ₹49 plan created!");
    };

    return (
        <div style={{ background: '#0d0008', minHeight: '100vh' }}>
            <SweetStart49 onComplete={handleComplete} />
        </div>
    );
}
