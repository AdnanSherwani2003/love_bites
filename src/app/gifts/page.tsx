'use client'

import React from 'react'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import Image from 'next/image'

export default function GiftsPage() {
  const giftCategories = [
    {
      title: 'Digital Hampers',
      desc: 'Curated digital experiences, playlists, and photo montages.',
      icon: '🎁',
      image: '/images/gifts/digital.png',
    },
    {
      title: 'Physical Keepsakes',
      desc: 'Custom jewelry, engraved frames, and handwritten letters.',
      icon: '💍',
      image: '/images/gifts/physical.png',
    },
    {
      title: 'Experience Dates',
      desc: 'Romantic getaways, dinner dates, and adventure passes.',
      icon: '🥂',
      image: '/images/gifts/experience.png',
    }
  ]

  return (
    <main className="gifts-page">
      <Navbar forceScrolled={true} />
      
      {/* HERO SECTION */}
      <section className="gifts-hero">
        <div className="container">
          <span className="badge">
            The Art of Giving
          </span>
          <h1>
            <span className="h1-top">Curated Gifts for Your</span>
            <span className="h1-bottom">Special Someone</span>
          </h1>
          <p>
            Elegant gifts paired with your Love Code to make every moment unforgettable. 
            Choose from our handcrafted collections designed to celebrate your unique bond.
          </p>
        </div>
      </section>

      {/* CATEGORIES GRID */}
      <section className="gifts-grid-section">
        <div className="gifts-grid">
          {giftCategories.map((cat, idx) => (
            <div key={idx} className="gift-card">
              <div className="gift-card-img-wrap">
                <Image 
                  src={cat.image} 
                  alt={cat.title}
                  fill
                  style={{ objectFit: 'cover' }}
                  priority={idx === 0}
                />
                <div className="gift-card-overlay">
                  <div className="gift-icon-float">{cat.icon}</div>
                  <h3 className="gift-card-category">{cat.title}</h3>
                </div>
              </div>
              <div className="gift-card-body">
                <p>
                  {cat.desc}
                </p>
                <button className="gift-explore-btn">
                  Explore Collection <span>→</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="gifts-cta-section">
        <div className="gifts-cta-content">
          <h2>Ready to make them feel special?</h2>
          <p style={{ fontSize: '1.1rem', marginBottom: '2.5rem' }}>
            Every gift should be accompanied by words that matter. Create your Love Code and pair it with a perfect gift today.
          </p>
          <Link href="/pricing" className="btn-primary" style={{ padding: '1.2rem 2.5rem', fontSize: '1.1rem', display: 'inline-block', textDecoration: 'none' }}>
             Start Creating Now <span style={{ marginLeft: '8px' }}>♥</span>
          </Link>
        </div>
      </section>
      
      <footer style={{ textAlign: 'center', color: 'var(--text-mid)', padding: '4rem 0', borderTop: '1px solid var(--glass-border)' }}>
        <p>© 2026 Love Bites. All rights reserved.</p>
      </footer>
    </main>
  )
}
