'use client';

import React, { useState } from 'react';
import RelationshipSelection from '@/components/RelationshipSelection';

export default function RelationshipDemoPage() {
  const [selectedRelationship, setSelectedRelationship] = useState<string | null>(null);
  const [customRelationship, setCustomRelationship] = useState('');

  const handleSelect = (relationship: string) => {
    setSelectedRelationship(relationship);
    if (relationship !== 'custom') {
      setCustomRelationship('');
    }
  };

  const handleCustomChange = (value: string) => {
    setCustomRelationship(value);
  };

  return (
    <div className="relative">
      <RelationshipSelection
        onSelect={handleSelect}
        selectedRelationship={selectedRelationship}
        customRelationship={customRelationship}
        onCustomChange={handleCustomChange}
      />
      
      {/* Demo info overlay */}
      <div className="fixed top-4 left-4 z-20 bg-black/50 backdrop-blur-md rounded-lg p-4 text-white text-sm max-w-xs">
        <h3 className="font-semibold mb-2 text-pink-400">Demo Mode</h3>
        <p className="text-white/70 mb-2">
          Selected: <span className="text-white font-medium">{selectedRelationship || 'None'}</span>
        </p>
        {selectedRelationship === 'custom' && (
          <p className="text-white/70">
            Custom: <span className="text-white font-medium">{customRelationship || 'Empty'}</span>
          </p>
        )}
      </div>

      {/* Navigation hint */}
      <div className="fixed bottom-4 right-4 z-20">
        <button
          onClick={() => window.history.back()}
          className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-all duration-300"
        >
          â Back
        </button>
      </div>
    </div>
  );
}
