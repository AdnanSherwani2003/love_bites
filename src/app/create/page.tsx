'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import './create.css'

export default function CreateLoveCode() {
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [loadingStep, setLoadingStep] = useState(0)

    // Form State
    const [mood, setMood] = useState('')
    const [partnerName, setPartnerName] = useState('')
    const [occasion, setOccasion] = useState('Anniversary 💍')
    const [memory, setMemory] = useState('')
    const [photos, setPhotos] = useState<string[]>([]) // Base64 or Object URLs
    const [template, setTemplate] = useState('Film Strip')
    const [hint, setHint] = useState('')
    const [pin, setPin] = useState(['', '', '', ''])

    // Validation State
    const [errors, setErrors] = useState<Record<string, boolean>>({})
    const [shaking, setShaking] = useState<Record<string, boolean>>({})

    // AI Generated State
    const [generatedMessage, setGeneratedMessage] = useState('')
    const [generatedCode, setGeneratedCode] = useState('')
    const [previewImage, setPreviewImage] = useState<string | null>(null)

    const fileInputRef = useRef<HTMLInputElement>(null)
    const supabase = createClient()
    const router = useRouter()

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.push('/')
        router.refresh()
    }

    // --- Step Navigation ---
    const triggerShake = (fields: string[]) => {
        const newErrors: Record<string, boolean> = {}
        const newShaking: Record<string, boolean> = {}
        fields.forEach(f => {
            newErrors[f] = true
            newShaking[f] = true
        })
        setErrors(newErrors)
        setShaking(newShaking)

        // Remove shake after animation completes (400ms)
        setTimeout(() => {
            setShaking({})
        }, 400)
    }

    const handleNext = async () => {
        // Clear previous errors when attempting next
        setErrors({})

        if (step === 2) {
            const emptyFields = []
            if (!partnerName.trim()) emptyFields.push('partnerName')
            if (!occasion) emptyFields.push('occasion')
            if (!memory.trim()) emptyFields.push('memory')

            if (emptyFields.length > 0) {
                triggerShake(emptyFields)
                return
            }
        }
        if (step === 3) {
            if (photos.length === 0) {
                triggerShake(['photos'])
                return
            }
            // Transition to AI Loading screen
            setStep(4)
            runLoader()
            return
        }
        if (step === 5) {
            const emptyFields = []
            if (!hint.trim()) emptyFields.push('hint')
            if (pin.some(p => !p.trim())) emptyFields.push('pin')

            if (emptyFields.length > 0) {
                triggerShake(emptyFields)
                return
            }
            await saveAndGenerateCode()
            return
        }
        setStep(s => s + 1)
        window.scrollTo(0, 0)
    }

    const handleBack = () => {
        setStep(s => s - 1)
        window.scrollTo(0, 0)
    }

    // --- Helpers ---
    const runLoader = () => {
        let currentStep = 1
        const interval = setInterval(() => {
            setLoadingStep(currentStep)
            currentStep++
            if (currentStep > 5) {
                clearInterval(interval)
                setTimeout(() => {
                    regenerateMessage()
                    setStep(4.5) // Step 4B - Preview
                    window.scrollTo(0, 0)
                }, 600)
            }
        }, 700)
    }

    const regenerateMessage = () => {
        const messages = [
            "You're the reason I believe in magic. This Love Code holds every moment I've been too speechless to describe.",
            "Loving you is the easiest and most extraordinary thing I've ever done. Every photo here is proof.",
            "Some things don't need explaining — they just need to be felt. Open this, and feel everything."
        ]
        setGeneratedMessage(messages[Math.floor(Math.random() * messages.length)])
    }

    // --- Photo Upload ---
    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return
        const files = Array.from(e.target.files)
        const remaining = 5 - photos.length
        if (remaining <= 0) return alert("Maximum 5 photos allowed")

        const filesToProcess = files.slice(0, remaining)
        const newPhotos: string[] = []

        for (const file of filesToProcess) {
            const resized = await resizeImage(file, 1200)
            newPhotos.push(resized)
        }

        setPhotos(prev => [...prev, ...newPhotos])
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    const resizeImage = (file: File, maxSide: number): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = (e) => {
                const img = new Image()
                img.onload = () => {
                    const canvas = document.createElement('canvas')
                    let { width, height } = img
                    if (width > height) {
                        if (width > maxSide) { height *= maxSide / width; width = maxSide }
                    } else {
                        if (height > maxSide) { width *= maxSide / height; height = maxSide }
                    }
                    canvas.width = width
                    canvas.height = height
                    const ctx = canvas.getContext('2d')
                    ctx?.drawImage(img, 0, 0, width, height)
                    resolve(canvas.toDataURL('image/jpeg', 0.7))
                }
                img.onerror = reject
                if (e.target?.result) img.src = e.target.result as string
            }
            reader.onerror = reject
            reader.readAsDataURL(file)
        })
    }

    const removePhoto = (index: number) => {
        setPhotos(prev => prev.filter((_, i) => i !== index))
    }

    // --- Final Save to Supabase API ---
    const saveAndGenerateCode = async () => {
        try {
            setLoading(true)

            // We will just save the base64 photos to localStorage for now (like legacy app)
            // or send them to Supabase Storage if we have time. Let's try uploading to storage!
            const uploadedUrls = []
            for (let i = 0; i < photos.length; i++) {
                const base64 = photos[i]
                const res = await fetch(base64)
                const blob = await res.blob()
                const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`
                const { data, error } = await supabase.storage.from('love_media').upload(fileName, blob)
                if (data) {
                    const publicUrl = supabase.storage.from('love_media').getPublicUrl(fileName).data.publicUrl
                    uploadedUrls.push(publicUrl)
                }
            }

            const res = await fetch('/api/create-love-code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sender_name: 'Sender', // Could add to form
                    recipient_name: partnerName || 'My Love',
                    recipient_contact: 'Unknown',
                    delivery_method: 'Link',
                    occasion,
                    mood: mood || 'Deeply in Love',
                    message: generatedMessage,
                    template,
                    lock_pin: pin.join(''),
                    photo_urls: uploadedUrls.length > 0 ? uploadedUrls : photos // Fallback to base64 if upload fails
                })
            })

            const data = await res.json()
            if (data.success) {
                setGeneratedCode(data.code)

                // Save locally just in case for immediate preview
                localStorage.setItem('loveFlowData', JSON.stringify({
                    partnerName: partnerName || 'My Love',
                    occasion,
                    memory,
                    openingMessage: generatedMessage,
                    mood,
                    unlockHint: hint,
                    code: data.code
                }))
                localStorage.setItem('lovePhotos', JSON.stringify(photos))

                setStep(6)
                router.push(`/view/${data.code}`)
            } else {
                alert("Failed to save Love Code: " + data.error)
            }
        } catch (err) {
            console.error(err)
            alert("Something went wrong.")
        } finally {
            setLoading(false)
        }
    }

    const spawnConfetti = () => {
        const container = document.getElementById('confettiContainer')
        if (!container) return
        container.innerHTML = ''
        const colors = ['#ff4d6d', '#ff758f', '#ff85a1', '#f06292', '#ad1457', '#ffd6e0']
        for (let i = 0; i < 60; i++) {
            const p = document.createElement('div')
            p.className = 'confetti-piece'
            p.style.position = 'absolute'
            p.style.left = (Math.random() * 100) + '%'
            p.style.top = (Math.random() * -20) + '%'
            p.style.background = colors[Math.floor(Math.random() * colors.length)]
            p.style.animationDelay = (Math.random() * 3) + 's'
            p.style.animationDuration = (3 + Math.random() * 4) + 's'
            const size = (8 + Math.random() * 8) + 'px'
            p.style.width = size
            p.style.height = size
            p.style.borderRadius = Math.random() > 0.5 ? '50%' : '3px'
            p.style.transform = `rotate(${Math.random() * 360}deg)`
            p.style.zIndex = '1000'
            container.appendChild(p)
        }
    }

    const handlePinChange = (index: number, value: string) => {
        const cleaned = value.replace(/[^0-9]/g, '') // only numbers
        const newPin = [...pin]
        newPin[index] = cleaned
        setPin(newPin)

        if (errors.pin) setErrors(prev => ({ ...prev, pin: false }))

        // Only move to next input if we actually entered a number
        if (cleaned && index < 3) {
            const nextInput = document.getElementById(`pin-${index + 1}`)
            if (nextInput) nextInput.focus()
        }
    }

    const handleBackspace = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Backspace' && !pin[index] && index > 0) {
            const prevInput = document.getElementById(`pin-${index - 1}`)
            if (prevInput) prevInput.focus()
        }
    }

    return (
        <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
            {/* --- HEADER PROGRESS BAR --- */}
            <div className="progress-wrap">
                <Link href="/" className="logo">
                    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="heart-icon">
                        <defs>
                            <linearGradient id="heartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" style={{ stopColor: 'var(--rose-light)' }} />
                                <stop offset="100%" style={{ stopColor: 'var(--rose)' }} />
                            </linearGradient>
                        </defs>
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="url(#heartGrad)" />
                    </svg>
                    <span className="logo-text">Love <i>Bites</i><span className="dot"></span></span>
                </Link>
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <div className="steps">
                        {[1, 2, 3, 4, 5, 6].map(i => {
                            const displayStep = step === 4.5 ? 4 : step
                            return (
                                <div
                                    key={i}
                                    className={`step-dot ${i < displayStep ? 'done' : ''} ${i === displayStep ? 'active' : ''}`}
                                />
                            )
                        })}
                    </div>
                    <button onClick={handleSignOut} className="btn-ghost" style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '0.9rem', color: 'var(--cta)', fontWeight: 500 }}>Sign Out</button>
                </div>
            </div>

            {/* --- SCREENS --- */}

            {/* SCREEN 1: MOOD */}
            <div className={`screen ${step === 1 ? 'active' : ''}`}>
                <span className="wm" style={{ top: '10%', left: '-5%', transform: 'rotate(-12deg)' }}>always</span>
                <span className="wm" style={{ bottom: '15%', right: '-5%', transform: 'rotate(8deg)' }}>forever</span>
                <div className="create-content">
                    <span className="create-badge">♥ Step 1 of 5</span>
                    <h1 className="create-h1">How do you feel about<br /><em>them right now?</em></h1>
                    <p className="subtext">Pick a mood — we&apos;ll craft everything around it.</p>

                    <div className="mood-grid">
                        {[
                            { label: 'Deeply in love', emoji: '💞', val: 'Deeply in Love' },
                            { label: 'Missing them', emoji: '🌙', val: 'Missing Them' },
                            { label: 'Celebrating us', emoji: '🎉', val: 'Celebrating Us' },
                            { label: 'Just because', emoji: '💌', val: 'Just Because' },
                            { label: 'Feeling romantic', emoji: '🔥', val: 'Feeling Romantic' },
                        ].map(m => (
                            <div
                                key={m.val}
                                className={`mood-card ${mood === m.val ? 'selected' : ''}`}
                                onClick={() => setMood(m.val)}
                            >
                                <span className="emoji">{m.emoji}</span>
                                <span className="label">{m.label}</span>
                            </div>
                        ))}
                    </div>

                    <div className="btn-row">
                        <button
                            className="btn-primary"
                            onClick={handleNext}
                            disabled={!mood}
                            style={{ opacity: mood ? 1 : 0.4 }}
                        >
                            Continue →
                        </button>
                    </div>
                </div>
            </div>

            {/* SCREEN 2: PERSONALIZE */}
            <div className={`screen ${step === 2 ? 'active' : ''}`}>
                <span className="wm" style={{ top: '8%', right: '-4%', transform: 'rotate(10deg)' }}>yours</span>
                <div className="create-content">
                    <span className="create-badge">♥ Step 2 of 5</span>
                    <h1 className="create-h1">Tell us about<br /><em>your person</em></h1>
                    <p className="subtext">Just three quick things — we&apos;ll handle the rest.</p>

                    <div className="form-group">
                        <label>Their name</label>
                        <input
                            type="text"
                            placeholder="e.g. Sofia, My love, Babe…"
                            value={partnerName}
                            onChange={e => { setPartnerName(e.target.value); if (errors.partnerName) setErrors(prev => ({ ...prev, partnerName: false })) }}
                            className={`${errors.partnerName ? 'has-error' : ''} ${shaking.partnerName ? 'shake' : ''}`}
                        />
                    </div>

                    <div className="form-group">
                        <label>Occasion</label>
                        <select
                            value={occasion}
                            onChange={e => { setOccasion(e.target.value); if (errors.occasion) setErrors(prev => ({ ...prev, occasion: false })) }}
                            className={`${errors.occasion ? 'has-error' : ''} ${shaking.occasion ? 'shake' : ''}`}
                        >
                            <option value="Anniversary 💍">Anniversary 💍</option>
                            <option value="Birthday 🎂">Birthday 🎂</option>
                            <option value="Valentine's Day 💝">Valentine&apos;s Day 💝</option>
                            <option value="Just Because 🌸">Just Because 🌸</option>
                            <option value="Apology 🥺">Apology 🥺</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>One memory or thing you love about them</label>
                        <textarea
                            placeholder="e.g. The way you laugh at your own jokes before finishing them…"
                            value={memory}
                            onChange={e => { setMemory(e.target.value); if (errors.memory) setErrors(prev => ({ ...prev, memory: false })) }}
                            className={`${errors.memory ? 'has-error' : ''} ${shaking.memory ? 'shake' : ''}`}
                        />
                    </div>

                    <div className="btn-row">
                        <button className="btn-secondary" onClick={handleBack}>← Back</button>
                        <button className="btn-primary" onClick={handleNext}>Add Memories →</button>
                    </div>
                </div>
            </div>

            {/* SCREEN 3: MEDIA UPLOAD */}
            <div className={`screen ${step === 3 ? 'active' : ''}`}>
                <span className="wm" style={{ top: '12%', left: '-4%', transform: 'rotate(-10deg)' }}>moments</span>
                <div className="create-content">
                    <span className="create-badge">♥ Step 3 of 5</span>
                    <h1 className="create-h1">Add Your<br /><em>Moments</em></h1>
                    <p className="subtext">Upload photos by occasion — we&apos;ll place them perfectly in your Love Code.</p>

                    <div
                        className={`upload-area ${errors.photos ? 'has-error' : ''} ${shaking.photos ? 'shake' : ''}`}
                        onClick={() => { fileInputRef.current?.click(); if (errors.photos) setErrors(prev => ({ ...prev, photos: false })) }}
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            accept="image/*"
                            multiple
                            style={{ display: 'none' }}
                            onChange={handlePhotoUpload}
                        />
                        <div className="upload-icon">📸</div>
                        <h3 style={{ color: errors.photos ? '#ff4d4f' : 'var(--crimson)' }}>Drop photos here or tap to upload</h3>
                        <p style={{ color: errors.photos ? '#ff4d4f' : 'var(--muted)' }}>JPG, PNG, HEIC · Up to 5 photos</p>
                    </div>

                    <div className="photo-grid">
                        {photos.map((src, i) => (
                            <div key={i} className="photo-slot filled" onClick={() => setPreviewImage(src)}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={src} alt="Uploaded" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }} />
                                <button
                                    className="photo-remove-btn"
                                    onClick={(e) => { e.stopPropagation(); removePhoto(i); }}
                                    title="Remove photo"
                                >
                                    ✕
                                </button>
                                <div className="photo-label">Preview</div>
                            </div>
                        ))}
                        {[...Array(5 - photos.length)].map((_, i) => (
                            <div key={`empty-${i}`} className="photo-slot empty" onClick={() => fileInputRef.current?.click()} style={{ cursor: 'pointer' }}>＋</div>
                        ))}
                    </div>

                    <div className="btn-row">
                        <button className="btn-secondary" onClick={handleBack}>← Back</button>
                        <button className="btn-primary" onClick={handleNext}>Generate My Love Code ♥</button>
                    </div>
                </div>
            </div>

            {/* SCREEN 4: AI LOADING */}
            <div className={`screen ${step === 4 ? 'active' : ''}`}>
                <div className="create-content">
                    <div className="ai-loader">
                        <div className="heart-pulse">♥</div>
                        <p className="loading-text">Crafting your Love Code…</p>
                        <ul className="loading-steps">
                            <li className={loadingStep >= 1 ? 'done' : ''}><span className="dot"></span>Reading your feelings</li>
                            <li className={loadingStep >= 2 ? 'done' : ''}><span className="dot"></span>Weaving in your memories</li>
                            <li className={loadingStep >= 3 ? 'done' : ''}><span className="dot"></span>Placing your photos</li>
                            <li className={loadingStep >= 4 ? 'done' : ''}><span className="dot"></span>Writing your message</li>
                            <li className={loadingStep >= 5 ? 'done' : ''}><span className="dot"></span>Adding final magic ✨</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* SCREEN 4B: PREVIEW */}
            <div className={`screen ${step === 4.5 ? 'active' : ''}`}>
                <span className="wm" style={{ top: '8%', left: '-4%', transform: 'rotate(-10deg)' }}>beautiful</span>
                <div className="create-content">
                    <span className="create-badge">♥ Step 4 of 5 — Preview</span>
                    <h1 className="create-h1">Your Love Code<br /><em>is ready</em></h1>

                    <div className="love-code-card">
                        <div className="to-label">To</div>
                        <div className="to-name">{partnerName || 'Your Love'}</div>

                        <div className="photo-strip">
                            {photos.map((src, i) => (
                                <div key={i} className="photo-strip-item">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={src} alt="strip" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }} />
                                </div>
                            ))}
                        </div>

                        <div className="message-preview">{generatedMessage}</div>
                        <div className="mood-tag-display">{mood} · {occasion}</div>
                    </div>

                    <button className="regen-btn" onClick={regenerateMessage}>↺ Regenerate message</button>

                    <div className="btn-row">
                        <button className="btn-secondary" onClick={() => setStep(3)}>← Edit</button>
                        <button className="btn-primary" onClick={() => setStep(5)}>Customize & Lock →</button>
                    </div>
                </div>
            </div>

            {/* SCREEN 5: CUSTOMIZE & LOCK */}
            <div className={`screen ${step === 5 ? 'active' : ''}`}>
                <span className="wm" style={{ bottom: '12%', left: '-4%', transform: 'rotate(-8deg)' }}>yours</span>
                <div className="create-content">
                    <span className="create-badge">♥ Step 5 of 5</span>
                    <h1 className="create-h1">Secure your<br /><em>Love Code</em></h1>
                    <p className="subtext">Set a secret hint and PIN that only the two of you know.</p>

                    <div className="form-group" style={{ marginTop: '0' }}>
                        <label>Secret unlock code hint</label>
                        <input
                            type="text"
                            placeholder="e.g. The date we first met, our song…"
                            value={hint}
                            onChange={e => { setHint(e.target.value); if (errors.hint) setErrors(prev => ({ ...prev, hint: false })) }}
                            className={`${errors.hint ? 'has-error' : ''} ${shaking.hint ? 'shake' : ''}`}
                        />
                    </div>

                    <div className="lock-input-wrap">
                        {[0, 1, 2, 3].map(i => (
                            <input
                                key={i}
                                id={`pin-${i}`}
                                className={`lock-digit ${errors.pin ? 'has-error' : ''} ${shaking.pin ? 'shake' : ''}`}
                                maxLength={1}
                                type="text"
                                placeholder="•"
                                value={pin[i]}
                                onChange={e => handlePinChange(i, e.target.value)}
                                onKeyDown={e => handleBackspace(e, i)}
                            />
                        ))}
                    </div>

                    <div className="lock-hint">
                        <strong>Tip:</strong> Use a date, a word, or a number only they would know — like the day you first met.
                    </div>

                    <div className="btn-row">
                        <button className="btn-secondary" onClick={() => setStep(4.5)} disabled={loading}>← Back</button>
                        <button className="btn-primary" onClick={handleNext} disabled={loading}>
                            {loading ? 'Generating...' : 'View Love Code ♥'}
                        </button>
                    </div>
                </div>
            </div>

            {/* IMAGE PREVIEW MODAL */}
            {previewImage && (
                <div className="preview-modal-overlay" onClick={() => setPreviewImage(null)}>
                    <div className="preview-modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="preview-close-btn" onClick={() => setPreviewImage(null)}>✕</button>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={previewImage} alt="Large Preview" className="preview-modal-image" />
                    </div>
                </div>
            )}
        </div>
    )
}
