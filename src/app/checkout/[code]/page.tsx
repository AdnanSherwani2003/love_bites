'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Footer from '@/components/Footer'
import { createClient } from '@/utils/supabase/client'
import '../../view/[code]/view.css' // Corrected path

export default function CheckoutPage() {
    const params = useParams()
    const router = useRouter()
    const code = params.code as string
    const [loading, setLoading] = useState(false)
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

    const handlePayment = () => {
        setLoading(true)
        // Simulate payment process
        setTimeout(() => {
            setLoading(false)
            router.push(`/share/${code}`)
        }, 1500)
    }

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.push('/')
        router.refresh()
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
                                className={`step-dot ${i < 6 ? 'done' : ''} ${i === 6 ? 'active' : ''}`}
                            />
                        ))}
                    </div>
                    <button onClick={handleSignOut} className="btn-ghost" style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '0.9rem', color: 'var(--cta)', fontWeight: 500 }}>Sign Out</button>
                </div>
            </div>

            <main className="screen active">
                <span className="wm" style={{ top: '10%', left: '-5%', transform: 'rotate(-12deg)' }}>always</span>
                <span className="wm" style={{ bottom: '15%', right: '-5%', transform: 'rotate(8deg)' }}>forever</span>

                <div className="create-content" style={{ animation: 'reveal-up 0.6s ease-out' }}>
                    <span className="create-badge">♥ Secure Your Love Code</span>
                    <h1 className="create-h1">Secure your<br /><em>Love Code</em></h1>
                    <p className="subtext">
                        Pay once to get your private link and share this beautiful moment with <strong>{loveData?.recipient_name || 'your loved one'}</strong>.
                    </p>

                    <div className="price-box" style={{
                        background: 'rgba(255, 255, 255, 0.8)',
                        padding: '32px',
                        borderRadius: '24px',
                        marginBottom: '32px',
                        border: '1.5px solid rgba(192, 49, 79, 0.15)',
                        backdropFilter: 'blur(10px)',
                        textAlign: 'left'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontWeight: 700, color: 'var(--crimson)', fontSize: '1.1rem' }}>Total Amount</span>
                            <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--cta)' }}>₹49</span>
                        </div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--muted)', marginTop: '8px' }}>One-time payment · Lifetime access</div>
                    </div>

                    <div className="btn-row">
                        <button
                            className="btn-primary"
                            onClick={handlePayment}
                            disabled={loading}
                            style={{ width: '100%', fontSize: '1.1rem', padding: '18px' }}
                        >
                            {loading ? 'Processing...' : 'Complete Payment ♥'}
                        </button>
                    </div>

                    <p style={{ marginTop: '24px', fontSize: '0.85rem', color: 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        🔒 <span>Secure payment via Razorpay / UPI</span>
                    </p>
                </div>
            </main>

            <Footer />
        </div>
    )
}
