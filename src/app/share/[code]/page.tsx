'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { createClient } from '@/utils/supabase/client'
import '../../create/create.css' // Corrected path

export default function SharePage() {
    const params = useParams()
    const code = params.code as string
    const [copied, setCopied] = useState(false)
    const [loveData, setLoveData] = useState<any>(null)
    const supabase = createClient()

    useEffect(() => {
        const fetchData = async () => {
            const { data, error } = await supabase
                .from('love_codes')
                .select('*')
                .eq('code', code)
                .single()

            if (data) setLoveData(data)
        }
        if (code) fetchData()
    }, [code, supabase])

    const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/view/${code}` : ''

    const handleCopy = () => {
        navigator.clipboard.writeText(shareUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const shareWhatsApp = () => {
        const text = `I've created something special for you. Unlock it here: ${shareUrl}`
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
    }

    const shareEmail = () => {
        const subject = "I've created a Love Code for you ♥"
        const body = `Hi! I've made a special digital experience for you. You can unlock it using our secret code here: ${shareUrl}`
        window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    }

    const shareIMessage = () => {
        const text = `Unlock your Love Code here: ${shareUrl}`
        window.location.href = `sms:?&body=${encodeURIComponent(text)}`
    }

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        window.location.href = '/'
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
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div
                                key={i}
                                className={`step-dot done`}
                            />
                        ))}
                    </div>
                    <button onClick={handleSignOut} className="btn-ghost" style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '0.9rem', color: 'var(--cta)', fontWeight: 500 }}>Sign Out</button>
                </div>
            </div>

            <main className="screen active">
                {/* Watermark background words from create.css style */}
                <span className="wm" style={{ top: '10%', left: '-5%', transform: 'rotate(-12deg)' }}>always</span>
                <span className="wm" style={{ bottom: '15%', right: '-5%', transform: 'rotate(8deg)' }}>forever</span>

                <div className="create-content" style={{ animation: 'reveal-up 0.8s ease-out' }}>
                    <div className="love-code-card" style={{ padding: '48px 32px', textAlign: 'center' }}>
                        <span className="create-badge">♥ Your Love Code is Live!</span>

                        <h1 className="create-h1">Ready to <br /><em>make them cry</em></h1>

                        <p className="subtext" style={{ marginBottom: '32px' }}>
                            Share the link. They&apos;ll see a locked screen until they enter your secret code.
                        </p>

                        <div className="share-link-box" style={{ background: 'white', border: '1.5px solid rgba(192, 49, 79, 0.15)', padding: '12px 12px 12px 20px', borderRadius: '18px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--rose)', fontSize: '0.9rem', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                lovebites.app/view/{code}
                            </span>
                            <button onClick={handleCopy} className="copy-btn" style={{ padding: '10px 24px', borderRadius: '12px', fontWeight: 700 }}>
                                {copied ? 'Copied!' : 'Copy'}
                            </button>
                        </div>

                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                            <button onClick={shareIMessage} className="share-btn" style={{ minWidth: '100px', background: 'white' }}>
                                <span className="s-icon">💬</span>
                                <span>iMessage</span>
                            </button>
                            <button onClick={shareWhatsApp} className="share-btn" style={{ minWidth: '100px', background: 'white' }}>
                                <span className="s-icon">💚</span>
                                <span>WhatsApp</span>
                            </button>
                            <button onClick={shareEmail} className="share-btn" style={{ minWidth: '100px', background: 'white' }}>
                                <span className="s-icon">✉️</span>
                                <span>Email</span>
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
