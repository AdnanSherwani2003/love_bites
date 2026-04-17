'use client'

import React, { useState, useEffect, useRef, useLayoutEffect } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import '@/app/pricing/pricing-new.css'

interface Feature {
  text: string;
}

interface PlanProps {
  name: string;
  price: number;
  tagline: string;
  iconColor: string;
  buttonType: 'outline' | 'filled' | 'premium';
  label: string;
  visibleFeatures: string[];
  hiddenFeatures: string[];
  badge?: string;
  badgeClass?: string;
  cardClass?: string;
  href: string;
  descRef: React.RefObject<HTMLParagraphElement | null>;
}

const SweetStartIcon = () => (
  <svg width="64" height="64" viewBox="0 0 44 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22 8 C22 8 14 4 14 10 C14 14 18 15 22 15 C26 15 30 14 30 10 C30 4 22 8 22 8Z" fill="#9b1a3a" opacity="0.7"/>
    <path d="M22 8 C22 8 14 12 22 15" stroke="#c4304f" strokeWidth="1" fill="none" strokeLinecap="round"/>
    <path d="M22 8 C22 8 30 12 22 15" stroke="#c4304f" strokeWidth="1" fill="none" strokeLinecap="round"/>
    <rect x="8" y="15" width="28" height="18" rx="2" fill="none" stroke="#9b1a3a" strokeWidth="1.2"/>
    <line x1="22" y1="15" x2="22" y2="33" stroke="#c4304f" strokeWidth="1.2"/>
    <line x1="8" y1="21" x2="36" y2="21" stroke="#c4304f" strokeWidth="1.2"/>
  </svg>
);

const TrueLoveIcon = () => (
  <svg width="64" height="64" viewBox="0 0 48 44" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="6" y="18" width="36" height="22" rx="3" fill="none" stroke="#c0314f" strokeWidth="1.3"/>
    <rect x="6" y="14" width="36" height="8" rx="2" fill="none" stroke="#c0314f" strokeWidth="1.3"/>
    <line x1="24" y1="14" x2="24" y2="40" stroke="#c0314f" strokeWidth="1.3"/>
    <path d="M24 14 C24 14 34 10 34 6 C34 3 31 2 28 4 C26 5.5 24 8 24 8Z" fill="#c0314f" opacity="0.8"/>
    <path d="M24 14 C24 14 14 10 14 6 C14 3 17 2 20 4 C22 5.5 24 9 24 9Z" fill="#c0314f" opacity="0.85"/>
    <circle cx="38" cy="10" r="2.5" fill="#c0314f"/>
    <circle cx="10" cy="8" r="1.8" fill="#fff8f0" opacity="0.5"/>
    <circle cx="44" cy="32" r="1" fill="#c0314f" opacity="0.3"/>
    <circle cx="6" cy="34" r="1" fill="#c0314f" opacity="0.3"/>
  </svg>
);

const GrandAmourIcon = () => (
  <svg width="64" height="64" viewBox="0 0 50 46" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="5" y="20" width="40" height="22" rx="3" fill="none" stroke="#8b0a2a" strokeWidth="1.3"/>
    <rect x="5" y="15" width="40" height="8" rx="2" fill="none" stroke="#8b0a2a" strokeWidth="1.3"/>
    <line x1="25" y1="15" x2="25" y2="42" stroke="#8b0a2a" strokeWidth="1.3"/>
    <path d="M25 15 C25 15 13 10 13 5 C13 2 16 1 19 3 C21.5 4.5 25 9 25 9Z" fill="#8b0a2a" opacity="0.85"/>
    <path d="M25 15 C25 15 37 10 37 5 C37 2 34 1 31 3 C28.5 4.5 25 9 25 9Z" fill="#8b0a2a" opacity="0.85"/>
    <circle cx="25" cy="20" r="3.5" fill="#8b0a2a"/>
    <circle cx="25" cy="20" r="1.8" fill="#fff8f0" opacity="0.5"/>
    <path d="M5 23 C5 23 15 25.5 25 23 C35 21 45 23 45 23" stroke="#8b0a2a" strokeWidth="0.7" fill="none" opacity="0.4"/>
    <circle cx="42" cy="12" r="1.5" fill="#8b0a2a" opacity="0.45"/>
    <circle cx="8" cy="11" r="1.5" fill="#8b0a2a" opacity="0.45"/>
    <circle cx="44" cy="32" r="1" fill="#8b0a2a" opacity="0.3"/>
    <circle cx="6" cy="34" r="1" fill="#8b0a2a" opacity="0.3"/>
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 13L9 17L19 7" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

function PlanCard({ 
  name, price, tagline, iconColor, buttonType, label, 
  visibleFeatures, hiddenFeatures, badge, badgeClass, cardClass, href, descRef 
}: PlanProps) {
  const allFeatures = [...visibleFeatures, ...hiddenFeatures];

  return (
    <div 
      className={`plan-card-new ${cardClass || ''} ${badge ? 'popular' : ''}`}
      style={{
        padding: '24px',
        borderRadius: '16px'
      }}
    >
      {badge && <div className={`card-badge ${badgeClass}`} style={{ fontSize: '11px', padding: '3px 10px' }}>{badge}</div>}
      
      <div className="top">
        <div className="plan-icon-container" style={{ marginBottom: '16px' }}>
          {name === 'Sweet Start' ? <SweetStartIcon /> : name === 'True Love' ? <TrueLoveIcon /> : <GrandAmourIcon />}
        </div>
        <h2 className="plan-name-new" style={{ fontSize: '22px', fontWeight: '700', marginBottom: '4px' }}>{name}</h2>
        <p className="plan-desc-new" ref={descRef} style={{ fontSize: '13px', marginBottom: '16px' }}>{tagline}</p>
        <div className="plan-price-new" style={{ marginBottom: '4px' }}>
          <span className="currency" style={{ fontSize: '44px', fontWeight: '700' }}>₹</span>
          <span className="amount" style={{ fontSize: '44px', fontWeight: '700' }}>{price}</span>
        </div>
        <p className="payment-note" style={{ fontSize: '12px', marginBottom: '16px' }}>one-time payment</p>
        <Link 
          href={href} 
          className={`get-started-btn ${
            buttonType === 'outline' ? 'btn-outline-red' : 
            buttonType === 'filled' ? 'btn-filled-red' : 'btn-premium-grad'
          }`}
          style={{
            padding: '16px 32px',
            fontSize: '16px',
            fontWeight: '700',
            marginBottom: '-18px',
            display: 'inline-block',
            borderRadius: '12px',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: buttonType === 'outline' ? '0 4px 12px rgba(192, 49, 79, 0.15)' : 
                       buttonType === 'filled' ? '0 8px 24px rgba(192, 49, 79, 0.3)' : 
                       '0 8px 24px rgba(139, 10, 42, 0.3)',
            transform: 'scale(1)',
            border: buttonType === 'outline' ? '2px solid rgba(192, 49, 79, 0.6)' : 'none',
            letterSpacing: '0.5px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05) translateY(-2px)';
            e.currentTarget.style.boxShadow = buttonType === 'outline' ? '0 8px 20px rgba(192, 49, 79, 0.25)' : 
                                       buttonType === 'filled' ? '0 12px 32px rgba(192, 49, 79, 0.4)' : 
                                       '0 12px 32px rgba(139, 10, 42, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = buttonType === 'outline' ? '0 4px 12px rgba(192, 49, 79, 0.15)' : 
                                       buttonType === 'filled' ? '0 8px 24px rgba(192, 49, 79, 0.3)' : 
                                       '0 8px 24px rgba(139, 10, 42, 0.3)';
          }}
        >
          ♥ Get Started
        </Link>
      </div>

      <div className="divider"></div>

      <div className="mid">
        <span className="feature-label" style={{ fontSize: '11px', letterSpacing: '0.12em', marginBottom: '10px', display: 'block' }}>{label}</span>
        <ul className="feature-list" style={{ fontSize: '13px', lineHeight: '1.45', marginBottom: '0' }}>
          {allFeatures.map((f, i) => (
            <li key={i} className="feature-item" style={{ marginBottom: '10px' }}>
              <span className="check"><CheckIcon /></span>
              {f}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function PricingPage() {
    const [pricing, setPricing] = useState({ tier_49: 49, tier_99: 99, tier_149: 149 })
    const [loading, setLoading] = useState(true)
    
    const descRefs = [
      useRef<HTMLParagraphElement | null>(null),
      useRef<HTMLParagraphElement | null>(null),
      useRef<HTMLParagraphElement | null>(null)
    ];

    useEffect(() => {
        fetchSettings()
    }, [])

    const fetchSettings = async () => {
        try {
            const response = await fetch('/api/settings')
            const data = await response.json()
            if (data.pricing) setPricing(data.pricing)
        } catch (err) {
            console.error('Failed to load dynamic pricing:', err)
        } finally {
            setLoading(false)
        }
    }

    useLayoutEffect(() => {
      const equalizeHeights = () => {
        // Reset heights first
        descRefs.forEach(ref => {
          if (ref.current) ref.current.style.height = 'auto';
        });

        // Find max height
        let maxHeight = 0;
        descRefs.forEach(ref => {
          if (ref.current) {
            maxHeight = Math.max(maxHeight, ref.current.offsetHeight);
          }
        });

        // Set all to max height
        descRefs.forEach(ref => {
          if (ref.current) {
            ref.current.style.height = `${maxHeight}px`;
          }
        });
      };

      equalizeHeights();
      window.addEventListener('resize', equalizeHeights);
      return () => window.removeEventListener('resize', equalizeHeights);
    }, [loading]); // Run when loading finishes and content is rendered

    return (
        <div className="pricing-body-page">
            <Navbar forceScrolled />

            <main className="pricing-section-new">
                <header className="pricing-header-new" style={{ paddingTop: '100px' }}>
                    <span className="pill-tag">♥ Pricing</span>
                    <h1>
                        <span className="subtitle-it">One moment. One payment.</span>
                        <span className="title-bold-it">No subscriptions ever.</span>
                    </h1>
                    <p>Pay once, love forever. Pick the plan that fits your moment.</p>
                </header>

                <div className="plans-grid-new" style={{ gap: '20px' }}>
                    <PlanCard 
                      name="Sweet Start"
                      price={pricing.tier_49}
                      tagline="Perfect for a first gesture — simple, sweet, and heartfelt."
                      iconColor="#c0314f"
                      buttonType="outline"
                      label="Included"
                      href="/create-49"
                      descRef={descRefs[0]}
                      visibleFeatures={[
                        "1 Love Code creation",
                        "Choose mood & occasion",
                        "AI-written personal message",
                        "Up to 5 photo uploads"
                      ]}
                      hiddenFeatures={[
                        "Secret unlock code & hint",
                        "Custom unlock hint message",
                        "Shareable private link"
                      ]}
                    />

                    <PlanCard 
                      name="True Love"
                      price={pricing.tier_99}
                      tagline="The full experience — made for moments that deserve to be remembered forever."
                      iconColor="#c0314f"
                      buttonType="filled"
                      label="Everything in Sweet Start, plus"
                      badge="⭐ Most Popular"
                      badgeClass="badge-popular"
                      href="/create-99"
                      descRef={descRefs[1]}
                      visibleFeatures={[
                        "3 moods & 1 occasion selection",
                        "5 premium photo frames",
                        "Cinematic video by our team",
                        "Secret 4-digit unlock code + hint"
                      ]}
                      hiddenFeatures={[
                        "Email WhatsApp or Instagram delivery",
                        "Scheduled delivery (date & time)"
                      ]}
                    />

                    <PlanCard 
                      name="Grand Amour"
                      price={pricing.tier_149}
                      tagline="The ultimate love experience — crafted for those who believe love deserves to be extraordinary."
                      iconColor="#8b0a2a"
                      buttonType="premium"
                      label="Everything in True Love, plus"
                      badge="✦ Most Premium"
                      badgeClass="badge-premium"
                      cardClass="premium"
                      href="/create-149"
                      descRef={descRefs[2]}
                      visibleFeatures={[
                        "Unlimited Love Code creations",
                        "Up to 10 photo uploads",
                        "Optional background music",
                        "Read receipts & time spent tracking"
                      ]}
                      hiddenFeatures={[
                        "Reply with voice note or photo",
                        "Instant email for every update",
                        "Two delivery channels of your choice",
                        "All moods & occasions unlocked"
                      ]}
                    />
                </div>

                <footer className="pricing-footer-new">
                  <div className="footer-trust-line">
                    Sent officially from Love Bites <span className="dot-sep"></span> No subscription <span className="dot-sep"></span> Pay once
                  </div>
                </footer>
            </main>

            <Footer />
        </div>
    )
}
