'use client'

import React, { useState, useRef } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { useScrollReveal } from '@/hooks/useScrollReveal'

export default function AIMagicPage() {
    useScrollReveal()
    const [selectedMood, setSelectedMood] = useState('')
    const [feeling, setFeeling] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(false)
    const [inputError, setInputError] = useState(false)
    const [result, setResult] = useState<{ opening: string; message: string; closing: string } | null>(null)

    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const outputWrapRef = useRef<HTMLDivElement>(null)

    const moods = [
        '💞 In Love', '🥺 Missing You', '🎂 Birthday', '💍 Anniversary',
        '🌸 Just Because', '🌍 Long Distance', '💎 Proposal', '🥺 Apology'
    ]

    const toggleMood = (mood: string) => {
        if (selectedMood === mood) {
            setSelectedMood('')
        } else {
            setSelectedMood(mood)
        }
    }

    const handleGenerate = async () => {
        if (!feeling.trim()) {
            setInputError(true)
            textareaRef.current?.focus()
            setTimeout(() => setInputError(false), 1500)
            return
        }

        setIsLoading(true)
        setError(false)
        setResult(null)

        const moodLine = selectedMood ? `Mood/Occasion: ${selectedMood}\n` : ''
        const prompt =
            `You are a romantic AI that writes deeply personal, heartfelt love messages for the Love Bites app.\n\n` +
            `The user has shared this feeling:\n"${feeling.trim()}"\n` +
            moodLine + '\n' +
            `Write a love message with exactly 3 parts. ` +
            `Respond ONLY with valid JSON — no markdown, no backticks, no extra text:\n\n` +
            `{\n` +
            `  "opening": "A single romantic opening line — poetic, intimate, 1 sentence. Like the first line of a love letter.",\n` +
            `  "message": "The main message body — 3 to 4 sentences. Warm, personal, emotional. Speaks directly to the feeling shared. Uses you and I.",\n` +
            `  "closing": "A tender closing line — like a signature. Poetic and memorable. 1 sentence."\n` +
            `}`

        try {
            const res = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: 'claude-sonnet-4-20250514',
                    max_tokens: 1000,
                    messages: [{ role: 'user', content: prompt }]
                })
            })

            const data = await res.json()

            let raw = ''
            if (data.content && data.content.length > 0) {
                for (let i = 0; i < data.content.length; i++) {
                    if (data.content[i].type === 'text') {
                        raw += data.content[i].text
                    }
                }
            }

            const cleaned = raw.replace(/```json|```/g, '').trim()
            const parsed = JSON.parse(cleaned)

            setResult({
                opening: parsed.opening || '',
                message: parsed.message || '',
                closing: parsed.closing || ''
            })

            setTimeout(() => {
                outputWrapRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
            }, 100)

        } catch (err) {
            setError(true)
        } finally {
            setIsLoading(false)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            handleGenerate()
        }
    }

    return (
        <div className="ai-magic-page">
            <Navbar forceScrolled />

            <main style={{ paddingTop: '80px' }}>
                <section className="ai-magic-section" id="ai-magic" style={{ minHeight: '100vh' }}>
                    <span className="wm" style={{ top: '4%', left: '-4%', transform: 'rotate(-10deg)' }}>magic</span>
                    <span className="wm" style={{ bottom: '5%', right: '-4%', transform: 'rotate(7deg)' }}>heartfelt</span>
                    <span className="wm" style={{ top: '44%', left: '55%', transform: 'rotate(-3deg)', fontSize: '3rem' }}>crafted</span>

                    <div className="ai-magic-header">
                        <span className="badge">✨ AI Magic</span>
                        <h2>
                            <span className="h2-top">See what our AI can write</span>
                            <span className="h2-bottom">just for you.</span>
                        </h2>
                        <p>Type how you feel — our AI turns it into a message they&apos;ll never forget. Try it free, right now.</p>
                    </div>

                    <div className="ai-demo-card">
                        <div className="ai-input-wrap">
                            <label className="ai-input-label">
                                How are you feeling right now?
                                <span>write anything — a few words or a full thought</span>
                            </label>

                            <textarea
                                ref={textareaRef}
                                className="ai-textarea"
                                id="ai-feeling-input"
                                placeholder="e.g. I miss her so much it hurts, I want her to know how special she is to me..."
                                maxLength={300}
                                value={feeling}
                                onChange={(e) => setFeeling(e.target.value)}
                                onKeyDown={handleKeyDown}
                                style={{ borderColor: inputError ? 'rgba(192,49,79,0.5)' : '' }}
                            ></textarea>

                            <span className="ai-mood-label">Pick a mood (optional)</span>
                            <div className="ai-mood-pills">
                                {moods.map((mood) => (
                                    <span
                                        key={mood}
                                        className={`ai-mood-pill ${selectedMood === mood ? 'selected' : ''}`}
                                        onClick={() => toggleMood(mood)}
                                    >
                                        {mood}
                                    </span>
                                ))}
                            </div>

                            <button
                                className={`ai-generate-btn ${isLoading ? 'loading' : ''}`}
                                id="ai-generate-btn"
                                onClick={handleGenerate}
                                disabled={isLoading}
                            >
                                <div className="ai-spinner"></div>
                                <span className="btn-text">✨ Generate My Message</span>
                            </button>

                            {error && (
                                <div className="ai-error visible" id="ai-error">
                                    Something went wrong. Please try again in a moment.
                                </div>
                            )}
                        </div>

                        <div
                            className={`ai-output-wrap ${result ? 'visible' : ''}`}
                            id="ai-output-wrap"
                            style={{ display: result ? 'block' : 'none' }}
                            ref={outputWrapRef}
                        >
                            <div className="ai-output-header">
                                <div className="ai-output-dot"></div>
                                <span className="ai-output-label">✨ Your AI-crafted message</span>
                            </div>

                            <div className="ai-opening" id="ai-opening">{result?.opening}</div>
                            <div className="ai-message" id="ai-message">{result?.message}</div>
                            <div className="ai-closing" id="ai-closing">{result?.closing}</div>

                            <div className="ai-output-cta">
                                <p>Love what you see? <strong>Turn this into a full Love Code</strong> with photos, music & a secret unlock.</p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                                    <button className="ai-regen-btn" onClick={handleGenerate}>↺ Regenerate</button>
                                    <Link href="/create" className="ai-cta-btn">♥ Create Love Code →</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    )
}
