'use client'

import React, { useState, useEffect, useRef } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { useScrollReveal } from '@/hooks/useScrollReveal'

function FaqItem({ question, answer }: { question: string, answer: string }) {
    const [isOpen, setIsOpen] = useState(false)
    const itemRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (itemRef.current && !itemRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isOpen])

    return (
        <div className={`faq-item ${isOpen ? 'open' : ''}`} ref={itemRef}>
            <button className="faq-q" onClick={() => setIsOpen(!isOpen)}>
                <span className="faq-q-text">{question}</span>
                <span className="faq-icon">+</span>
            </button>
            <div className="faq-a">
                <p>{answer}</p>
            </div>
        </div>
    )
}

function Toast({ message, visible, onHide }: { message: string, visible: boolean, onHide: () => void }) {
    useEffect(() => {
        if (visible) {
            const timer = setTimeout(onHide, 3000)
            return () => clearTimeout(timer)
        }
    }, [visible, onHide])

    if (!visible) return null

    return (
        <div style={{
            position: 'fixed',
            bottom: '30px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--crimson)',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '12px',
            boxShadow: '0 10px 30px rgba(192, 49, 79, 0.3)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            animation: 'reveal-up 0.4s ease-out'
        }}>
            <span style={{ fontSize: '1.2rem' }}>✨</span>
            <span style={{ fontWeight: 500 }}>{message}</span>
        </div>
    )
}

export default function PricingPage() {
    useScrollReveal()
    const [toast, setToast] = useState<{ visible: boolean, message: string }>({ visible: false, message: '' })
    const [isGrandAmourHovered, setIsGrandAmourHovered] = useState(false)

    const showComingSoon = () => {
        setToast({ visible: true, message: 'True Love & Forever plans are coming soon! Stay tuned.' })
    }

    return (
        <div className="pricing-body-page">
            <Navbar forceScrolled />

            <main>
                <div className="pricing-page" style={{ paddingTop: '100px' }}>
                    <section id="pricing" className="pricing-section">
                        <span className="wm" style={{ top: '3%', left: '-4%', transform: 'rotate(-10deg)' }}>yours</span>
                        <span className="wm" style={{ bottom: '5%', right: '-4%', transform: 'rotate(7deg)' }}>always</span>
                        <span className="wm" style={{ top: '38%', left: '52%', transform: 'rotate(-4deg)', fontSize: '3.5rem' }}>forever</span>

                        <div className="pricing-header">
                            <span className="badge">♥ Pricing</span>
                            <h1>
                                <span className="h1-top">One moment. One payment.</span>
                                <span className="h1-bottom">No subscriptions ever.</span>
                            </h1>
                            <p>Pay once, love forever. Pick the plan that fits your moment.</p>
                        </div>

                        <div className="plans-grid">
                            <div className="plan-card">
                                <div className="plan-name">Sweet Start</div>
                                <p className="plan-tagline">Perfect for a first gesture — simple, sweet, and heartfelt.</p>
                                <div className="plan-price-wrap">
                                    <span className="plan-currency">₹</span>
                                    <span className="plan-amount">49</span>
                                </div>
                                <p className="plan-once">one-time payment</p>
                                <div className="plan-divider"></div>
                                <ul className="plan-features">
                                    <li>1 Love Code creation</li>
                                    <li>Choose your mood & occasion</li>
                                    <li>AI-written personal message</li>
                                    <li>Up to 5 photo uploads</li>
                                    <li>Secret 4-digit unlock code</li>
                                    <li>Custom unlock hint message</li>
                                    <li>Shareable private link</li>
                                </ul>
                                <Link href="/create-49" className="plan-btn outline" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>♥ Get Started</Link>
                            </div>

                            <div className="plan-card popular">
                                <div className="popular-badge">⭐ Most Popular</div>
                                <div className="plan-name">True Love</div>
                                <p className="plan-tagline">The full experience — made for moments that deserve to be remembered forever.</p>
                                <div className="plan-price-wrap">
                                    <span className="plan-currency">₹</span>
                                    <span className="plan-amount">99</span>
                                </div>
                                <p className="plan-once">one-time payment</p>
                                <div className="plan-divider"></div>
                                <ul className="plan-features">
                                    <li>1 Love Code creation</li>
                                    <li>3 moods & 1 occasion selection</li>
                                    <li>AI-written personal message</li>
                                    <li>Up to 5 photo uploads</li>
                                    <li>5 premium photo frames (auto-curated)</li>
                                    <li>One cinematic video (crafted by our team)</li>
                                    <li>Secret 4-digit unlock code</li>
                                    <li>Custom unlock hint message</li>
                                    <li>Shareable private link</li>
                                    <li>Delivered via Email, WhatsApp or Instagram</li>
                                    <li>Scheduled delivery (date & time)</li>
                                </ul>
                                <Link href="/create-99" className="plan-btn filled" style={{ width: '100%', border: 'none', cursor: 'pointer', fontFamily: 'inherit', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>♥ Get Started</Link>
                            </div>

                            <div className="plan-card" style={{
                                border: '2px solid rgba(139,0,56,0.3)',
                                background: 'white',
                                boxShadow: isGrandAmourHovered ? '0 28px 64px rgba(139,0,56,0.25)' : '0 8px 40px rgba(139,0,56,0.15)',
                                transform: isGrandAmourHovered ? 'scale(1.02) translateY(-14px)' : 'scale(1.02)',
                                position: 'relative',
                                zIndex: 2,
                                transition: 'all 0.3s ease',
                                cursor: 'pointer'
                            }}
                            onMouseEnter={() => setIsGrandAmourHovered(true)}
                            onMouseLeave={() => setIsGrandAmourHovered(false)}>
                                <div style={{
                                    position: 'absolute',
                                    top: '-12px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    background: 'linear-gradient(135deg, #8b0038, #c4304f)',
                                    color: 'white',
                                    padding: '6px 20px',
                                    borderRadius: '9999px',
                                    fontSize: '11px',
                                    fontWeight: 'bold',
                                    letterSpacing: '0.5px',
                                    zIndex: 10
                                }}>✨ MOST PREMIUM</div>
                                <div className="plan-name" style={{
                                    background: 'linear-gradient(135deg, #8b0038, #c4304f)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                    fontFamily: 'Playfair Display, serif'
                                }}>Grand Amour</div>
                                <p className="plan-tagline">The ultimate love experience — crafted for those who believe love deserves to be extraordinary.</p>
                                <div className="plan-price-wrap">
                                    <span className="plan-currency" style={{ color: '#8b0038' }}>₹</span>
                                    <span className="plan-amount" style={{ color: '#8b0038' }}>149</span>
                                </div>
                                <p className="plan-once">one-time payment</p>
                                <div className="plan-divider"></div>
                                <ul className="plan-features" style={{ color: '#8b0038' }}>
                                    <li>Unlimited Love Code creations</li>
                                    <li>All moods & all occasions</li>
                                    <li>AI-written personal message</li>
                                    <li>Up to 10 photo uploads</li>
                                    <li>5 premium photo frames (auto-curated)</li>
                                    <li>1 cinematic video — crafted by our team</li>
                                    <li>Secret 4-digit unlock code + hint</li>
                                    <li>Optional background music</li>
                                    <li>Choose two delivery option via WhatsApp, email or Instagram</li>
                                    <li>Scheduled delivery (date & time)</li>
                                    <li>You'll know the moment they open your love code</li>
                                    <li>See how long they spent with your love code</li>
                                    <li>The can reply back with attached photo</li>
                                    <li>Get an instant email for every update</li>
                                </ul>
                                <Link href="/create-149" className="plan-btn filled" style={{ 
                                    width: '100%', 
                                    cursor: 'pointer', 
                                    fontFamily: 'inherit',
                                    background: 'linear-gradient(135deg, #8b0038, #c4304f)',
                                    border: 'none',
                                    color: 'white',
                                    textDecoration: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>♛ Get Started</Link>
                            </div>
                        </div>

                        <p className="pricing-trust">
                            <span>500+</span> Love Codes sent &nbsp;·&nbsp;
                            <span>4.9★</span> rating &nbsp;·&nbsp;
                            Secure payment &nbsp;·&nbsp;
                            End-to-end encrypted
                        </p>

                        <div className="faq-wrap">
                            <div className="faq-header">
                                <h2>Questions? We&apos;ve got <em>answers.</em></h2>
                                <p>Everything you need to know before creating your Love Code.</p>
                            </div>

                            <FaqItem
                                question="Is this really a one-time payment?"
                                answer="Yes — absolutely. You pay once and your digital love experience is yours to keep. No monthly fees, no renewals, no hidden charges. Just a single payment for a moment that will be cherished a lifetime."
                            />
                            <FaqItem
                                question="What exactly is a Love Code?"
                                answer="Think of it as a private digital time capsule. It's a beautifully animated experience built from your shared memories, AI-tailored messages, and custom visuals. It blooms into life only when your partner enters the secret code you've set."
                            />
                            <FaqItem
                                question="Can I upgrade my plan later?"
                                answer="Of course! Our True Love and Forever plans are launching very soon. You'll be able to upgrade seamlessly by just paying the difference. Your existing memories and Love Codes will always remain safe and preserved."
                            />
                            <FaqItem
                                question="How does the secret unlock code work?"
                                answer="When you create your Love Code, you'll set a 4-digit key — something only the two of you know (like your anniversary or the date of your first kiss). You can add a playful hint to guide them. It adds that perfect layer of shared intimacy."
                            />
                            <FaqItem
                                question="Is my data and privacy protected?"
                                answer="Your privacy is our highest priority. Every Love Code, photo, and message is end-to-end encrypted. We never share your data — it's a private world built only for you and your partner to explore."
                            />
                            <FaqItem
                                question="What payment methods can I use?"
                                answer="We want your experience to be as smooth as possible. We accept all major UPI apps (GPay, PhonePe, Paytm), along with all Indian and international Debit/Credit cards and Net Banking options."
                            />

                        </div>
                    </section>
                </div>
            </main>

            <Footer />
            <Toast
                message={toast.message}
                visible={toast.visible}
                onHide={() => setToast({ ...toast, visible: false })}
            />
        </div>
    )
}
