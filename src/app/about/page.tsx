'use client'

import React from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useScrollReveal } from '@/hooks/useScrollReveal'

export default function AboutPage() {
    useScrollReveal()
    return (
        <>
            <Navbar forceScrolled />

            <main>
                <div className="about-page" style={{ paddingTop: '100px' }}>
                    <section id="about" className="about-section">
                        <span className="wm" style={{ top: '3%', left: '-4%', transform: 'rotate(-10deg)' }}>human</span>
                        <span className="wm" style={{ bottom: '5%', right: '-4%', transform: 'rotate(7deg)' }}>genuine</span>
                        <span className="wm" style={{ top: '40%', left: '52%', transform: 'rotate(-4deg)', fontSize: '3.5rem' }}>real</span>

                        <div className="about-hero animate-on-scroll">
                            <span className="badge">♥ About Us</span>
                            <h1>
                                <span className="h1-top">We believe love deserves</span>
                                <span className="h1-bottom">more than just words.</span>
                            </h1>
                            <p>Love Bites was built by two people who got tired of ordinary. So they built something extraordinary — for everyone who&apos;s ever felt too much to say in a single text.</p>
                        </div>

                        <div className="manifesto animate-on-scroll">
                            <div className="manifesto-inner">
                                <p className="manifesto-quote">
                                    "In a world full of emojis and blue ticks,<br />
                                    we wanted to build something that actually <em>felt</em> like something."
                                </p>
                                <span className="manifesto-attr">— Salah & Arbaz, Founders of Love Bites</span>
                            </div>
                        </div>

                        <div className="story-wrap">
                            <div className="story-text animate-on-scroll">
                                <span className="section-label">♥ Our Story</span>
                                <h2>Built by two friends<br />who believed in <em>more.</em></h2>
                                <p>Love Bites was created by <strong>Salah and Arbaz</strong> — two founders who believed that expressing love shouldn&apos;t feel ordinary.</p>
                                <p>In a world where messages and emojis fill every conversation, they wanted to build something different. Something that could turn feelings into meaningful moments — something that could surprise, touch, and stay in someone&apos;s memory long after they first saw it.</p>
                                <p>Love Bites was built with one simple idea: <strong>love deserves more than just words.</strong></p>
                            </div>
                            <div className="founder-cards animate-on-scroll">
                                <div className="founder-card">
                                    <div className="founder-avatar">🧠</div>
                                    <div className="founder-name">Salah</div>
                                    <div className="founder-role">Co-Founder</div>
                                    <p className="founder-quote">"I wanted to build something that could say everything you feel but never know how to say out loud."</p>
                                </div>
                                <div className="founder-card">
                                    <div className="founder-avatar">💡</div>
                                    <div className="founder-name">Arbaz</div>
                                    <div className="founder-role">Co-Founder</div>
                                    <p className="founder-quote">"The best moments in relationships aren&apos;t grand gestures — they&apos;re the ones that catch you completely off guard."</p>
                                </div>
                            </div>
                        </div>

                        <div className="mission-wrap">
                            <span className="section-label">♥ Our Mission</span>
                            <h2 className="animate-on-scroll">What we&apos;re here to <em>do.</em></h2>
                            <div className="mission-cards">
                                <div className="mission-card animate-on-scroll">
                                    <span className="mission-icon">💞</span>
                                    <div className="mission-title">Make love feel real</div>
                                    <p className="mission-desc">We turn what you feel into something they can actually experience — not just read.</p>
                                </div>
                                <div className="mission-card animate-on-scroll">
                                    <span className="mission-icon">✨</span>
                                    <div className="mission-title">Make ordinary moments unforgettable</div>
                                    <p className="mission-desc">A random Tuesday can become the day they never forget. That&apos;s the power we&apos;re building.</p>
                                </div>
                                <div className="mission-card animate-on-scroll">
                                    <span className="mission-icon">🔒</span>
                                    <div className="mission-title">Keep it personal & private</div>
                                    <p className="mission-desc">Every Love Code is encrypted, private, and locked — just for the two of you.</p>
                                </div>
                            </div>
                        </div>

                        <div className="values-wrap">
                            <span className="section-label">♥ What We Stand For</span>
                            <h2 className="animate-on-scroll">Our core <em>values.</em></h2>
                            <div className="values-grid">
                                <div className="value-card animate-on-scroll">
                                    <span className="value-num">01</span>
                                    <div className="value-title">Feelings First</div>
                                    <p className="value-desc">Every feature we build starts with a feeling, not a function. Emotion drives everything.</p>
                                </div>
                                <div className="value-card animate-on-scroll">
                                    <span className="value-num">02</span>
                                    <div className="value-title">Beautifully Simple</div>
                                    <p className="value-desc">You shouldn&apos;t need to be a designer to create something beautiful. We handle that part.</p>
                                </div>
                                <div className="value-card animate-on-scroll">
                                    <span className="value-num">03</span>
                                    <div className="value-title">Radically Personal</div>
                                    <p className="value-desc">No two Love Codes are the same. Every one is crafted around a real person and a real feeling.</p>
                                </div>
                                <div className="value-card animate-on-scroll">
                                    <span className="value-num">04</span>
                                    <div className="value-title">Built with Heart</div>
                                    <p className="value-desc">We&apos;re a small team that cares deeply about what we build — because love deserves that kind of attention.</p>
                                </div>
                            </div>
                        </div>

                        <div className="about-cta animate-on-scroll">
                            <h3>Ready to create something <em>unforgettable?</em></h3>
                            <p>Join hundreds of people who&apos;ve already made someone feel truly special.</p>
                            <a href="/pricing" className="cta-btn">♥ Create Your Love Code</a>
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
