'use client'

import React, { useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { useScrollReveal } from '@/hooks/useScrollReveal'

function FaqItem({ question, answer }: { question: string, answer: string }) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className={`faq-item ${isOpen ? 'active' : ''}`}>
            <button className="faq-q" onClick={() => setIsOpen(!isOpen)}>
                <span className="faq-q-text">{question}</span>
                <span className="faq-icon" style={{ transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }}>+</span>
            </button>
            <div className="faq-a" style={{ display: isOpen ? 'block' : 'none' }}>
                <p>{answer}</p>
            </div>
        </div>
    )
}

export default function PricingPage() {
    useScrollReveal()
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
                                    <li>Shareable private link</li>
                                </ul>
                                <Link href="/create" className="plan-btn outline">♥ Get Started</Link>
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
                                    <li>3 Love Code creations</li>
                                    <li>All moods & occasions</li>
                                    <li>AI-written personal message</li>
                                    <li>Up to 20 photo uploads</li>
                                    <li>5 premium templates</li>
                                    <li>Secret 4-digit unlock code</li>
                                    <li>Custom unlock hint message</li>
                                    <li>Shareable private link</li>
                                    <li>Reaction notifications</li>
                                </ul>
                                <Link href="/create" className="plan-btn filled">♥ Create Your Love Code</Link>
                            </div>

                            <div className="plan-card">
                                <div className="plan-name">Forever Love</div>
                                <p className="plan-tagline">For the ones who love deeply — unlimited codes, every occasion, for life.</p>
                                <div className="plan-price-wrap">
                                    <span className="plan-currency">₹</span>
                                    <span className="plan-amount">149</span>
                                </div>
                                <p className="plan-once">one-time payment</p>
                                <div className="plan-divider"></div>
                                <ul className="plan-features">
                                    <li>Unlimited Love Code creations</li>
                                    <li>All moods & occasions</li>
                                    <li>AI-written personal message</li>
                                    <li>Unlimited photo uploads</li>
                                    <li>All premium templates</li>
                                    <li>Secret unlock code + hint</li>
                                    <li>Cinematic slideshow mode</li>
                                    <li>Background music option</li>
                                    <li>Reaction notifications</li>
                                    <li>Priority support</li>
                                </ul>
                                <Link href="/create" className="plan-btn outline">♥ Get Forever Love</Link>
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
                                answer="Yes — absolutely. You pay once and your plan is yours forever. No monthly fees, no renewals, no hidden charges. Just a single payment for a moment that lasts a lifetime."
                            />
                            <FaqItem
                                question="What is a Love Code?"
                                answer="A Love Code is a private, beautifully animated experience built from your photos, feelings, and an AI-written message. You lock it with a secret code only your partner would know — and when they unlock it, they see something they'll never forget."
                            />
                            <FaqItem
                                question="Can I upgrade my plan later?"
                                answer="Yes — you can upgrade at any time. You'll only pay the difference between your current plan and the new one. Your existing Love Codes and data are always preserved."
                            />
                            <FaqItem
                                question="How does the secret unlock code work?"
                                answer="You set a 4-digit code — something only your partner would know, like the date you first met or a special number. You can also add a hint to guide them. They enter the code on their screen and your Love Code unlocks just for them."
                            />
                            <FaqItem
                                question="Is my data private and secure?"
                                answer="Completely. Your photos, messages, and Love Codes are end-to-end encrypted and private. Only the person with your unique link and secret code can ever see what you created."
                            />
                            <FaqItem
                                question="What payment methods are accepted?"
                                answer="We accept all major UPI apps (GPay, PhonePe, Paytm), debit and credit cards, and net banking. All payments are processed securely."
                            />

                        </div>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    )
}
