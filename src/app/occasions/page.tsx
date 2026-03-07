'use client'

import React from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { useScrollReveal } from '@/hooks/useScrollReveal'

export default function OccasionsPage() {
    useScrollReveal()
    return (
        <>
            <Navbar forceScrolled />

            <main>
                <div className="occasions-page" style={{ paddingTop: '100px' }}>
                    <section id="occasions" className="occasions-section">
                        <span className="wm" style={{ top: '3%', left: '-4%', transform: 'rotate(-10deg)' }}>love</span>
                        <span className="wm" style={{ bottom: '5%', right: '-4%', transform: 'rotate(7deg)' }}>celebrate</span>
                        <span className="wm" style={{ top: '40%', left: '52%', transform: 'rotate(-4deg)', fontSize: '3.5rem' }}>cherish</span>

                        <div className="occasions-header">
                            <span className="badge">♥ Occasions</span>
                            <h1>
                                <span className="h1-top">Every feeling deserves</span>
                                <span className="h1-bottom">its own moment.</span>
                            </h1>
                            <p>Pick an occasion — we&apos;ll craft a Love Code that fits it perfectly.</p>
                        </div>

                        <div className="occasions-grid">
                            <Link href="/create" className="occasion-card">
                                <div className="card-inner">
                                    <span className="occasion-emoji">💍</span>
                                    <div className="occasion-name">Anniversary</div>
                                    <p className="occasion-desc">Celebrate another year of choosing each other — with every memory that made it real.</p>
                                    <span className="occasion-pill">Start creating →</span>
                                </div>
                            </Link>
                            <Link href="/create" className="occasion-card">
                                <div className="card-inner">
                                    <span className="occasion-emoji">🎂</span>
                                    <div className="occasion-name">Birthday</div>
                                    <p className="occasion-desc">More than a card. A whole cinematic experience built around the person they are.</p>
                                    <span className="occasion-pill">Start creating →</span>
                                </div>
                            </Link>
                            <Link href="/create" className="occasion-card">
                                <div className="card-inner">
                                    <span className="occasion-emoji">💝</span>
                                    <div className="occasion-name">Valentine&apos;s Day</div>
                                    <p className="occasion-desc">Skip the generic. Give them something that actually feels like you wrote it.</p>
                                    <span className="occasion-pill">Start creating →</span>
                                </div>
                            </Link>
                            <Link href="/create" className="occasion-card">
                                <div className="card-inner">
                                    <span className="occasion-emoji">🌸</span>
                                    <div className="occasion-name">Just Because</div>
                                    <p className="occasion-desc">No reason needed. Sometimes the most unforgettable moments are the unexpected ones.</p>
                                    <span className="occasion-pill">Start creating →</span>
                                </div>
                            </Link>
                            <Link href="/create" className="occasion-card">
                                <div className="card-inner">
                                    <span className="occasion-emoji">🌍</span>
                                    <div className="occasion-name">Long Distance</div>
                                    <p className="occasion-desc">Miles apart, but this will make them feel like you&apos;re right there with them.</p>
                                    <span className="occasion-pill">Start creating →</span>
                                </div>
                            </Link>
                            <Link href="/create" className="occasion-card">
                                <div className="card-inner">
                                    <span className="occasion-emoji">🥺</span>
                                    <div className="occasion-name">Apology</div>
                                    <p className="occasion-desc">Some apologies need more than words. Show them how much they truly mean to you.</p>
                                    <span className="occasion-pill">Start creating →</span>
                                </div>
                            </Link>
                            <Link href="/create" className="occasion-card">
                                <div className="card-inner">
                                    <span className="occasion-emoji">💎</span>
                                    <div className="occasion-name">Proposal</div>
                                    <p className="occasion-desc">The moment before the moment. Build up to the question with everything that led you here.</p>
                                    <span className="occasion-pill">Start creating →</span>
                                </div>
                            </Link>
                            <Link href="/create" className="occasion-card">
                                <div className="card-inner">
                                    <span className="occasion-emoji">🌹</span>
                                    <div className="occasion-name">First Date</div>
                                    <p className="occasion-desc">Tell them how you felt before, during, and after. Make the beginning unforgettable.</p>
                                    <span className="occasion-pill">Start creating →</span>
                                </div>
                            </Link>
                        </div>

                        <div className="occasions-cta">
                            <p>Not sure which to pick? <strong>Any occasion works.</strong></p>
                            <Link href="/create" className="cta-btn">♥ Create Your Love Code</Link>
                            <p className="cta-trust">
                                <span>500+</span> Love Codes sent &nbsp;·&nbsp;
                                <span>4.9★</span> rating &nbsp;·&nbsp;
                                End-to-end encrypted
                            </p>
                        </div>
                    </section>
                </div>
            </main>

            <Footer />
        </>
    )
}
