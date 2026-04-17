# RelationshipSelection Component

A premium, modern, romantic UI component for relationship selection with luxury aesthetic and Apple-level polish.

## Features

- **Glassmorphism Design**: Translucent cards with backdrop blur and subtle borders
- **Smooth Animations**: Framer Motion powered transitions and micro-interactions
- **Premium Visual Effects**: Ambient lighting, floating particles, and vignette
- **Responsive Layout**: Adapts beautifully to mobile and desktop
- **Interactive States**: Hover effects, selection animations, and press feedback
- **Custom Input**: Animated text field for custom relationship descriptions

## Tech Stack

- React with TypeScript
- Tailwind CSS for styling
- Framer Motion for animations

## Installation

Make sure you have the required dependencies installed:

```bash
npm install framer-motion
```

## Usage

```tsx
import React, { useState } from 'react';
import RelationshipSelection from '@/components/RelationshipSelection';

export default function YourComponent() {
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
    <RelationshipSelection
      onSelect={handleSelect}
      selectedRelationship={selectedRelationship}
      customRelationship={customRelationship}
      onCustomChange={handleCustomChange}
    />
  );
}
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `onSelect` | `(relationship: string) => void` | Callback when a relationship is selected |
| `selectedRelationship` | `string \| null` | Currently selected relationship ID |
| `customRelationship` | `string` | Value for custom relationship input |
| `onCustomChange` | `(value: string) => void` | Callback for custom input changes |

## Relationship Options

The component includes 5 relationship options:

1. **Partner** - girlfriend/boyfriend/wife/husband
2. **Family** - parents/siblings  
3. **Relative** - cousins, etc.
4. **Friend** - friends
5. **Custom** - user-defined relationship with text input

## Design System

### Colors
- **Background**: Deep maroon to near-black gradient (`#2a0a1a` to `#0a0005`)
- **Primary**: Pink to rose gradients (`#ec4899` to `#f43f5e`)
- **Text**: White with varying opacity levels

### Typography
- **Headings**: Elegant serif font (`font-serif`)
- **UI Text**: Clean sans-serif (`font-sans`)
- **Sizes**: Responsive scaling from mobile to desktop

### Animations
- **Duration**: 0.3-0.4s for transitions
- **Easing**: Smooth ease curves
- **Effects**: Scale, translateY, glow, and pulse animations

## Customization

### Modifying Colors

Update the gradient classes in the component to match your brand:

```tsx
// Change background gradient
className="bg-gradient-to-br from-[#2a0a1a] via-[#1a050a] to-[#0a0005]"

// Change accent colors
className="bg-gradient-to-r from-pink-500 to-rose-600"
```

### Adding New Relationships

Extend the `relationships` array in the component:

```tsx
const relationships = [
  // ... existing relationships
  { 
    id: 'colleague', 
    label: 'Colleague', 
    sub: 'work relationship',
    icon: 'ð',
    gradient: 'from-green-500 to-teal-600'
  }
];
```

## Performance

- Uses React.memo for optimal re-rendering
- Framer Motion's `AnimatePresence` for smooth enter/exit animations
- CSS transforms for GPU-accelerated animations
- Minimal re-renders with proper state management

## Accessibility

- Semantic HTML5 elements
- Keyboard navigation support
- ARIA labels where appropriate
- High contrast ratios for text readability

## Browser Support

- Modern browsers with CSS Grid and Flexbox support
- Requires JavaScript for animations
- Tested on Chrome, Firefox, Safari, and Edge

## Demo

Visit `/relationship-demo` to see the component in action with live interaction feedback.

## File Structure

```
src/
  components/
    RelationshipSelection.jsx          # Main component
    RelationshipSelection-README.md     # This documentation
  app/
    relationship-demo/
      page.tsx                         # Demo page
```

## Contributing

When modifying this component:

1. Maintain the luxury aesthetic and smooth animations
2. Test on both mobile and desktop viewports
3. Ensure accessibility standards are met
4. Keep performance in mind with additional features
