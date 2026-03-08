'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

export default function Navbar({ forceScrolled = false }: { forceScrolled?: boolean }) {
    const [scrolled, setScrolled] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const [user, setUser] = useState<any>(null)
    const supabase = createClient()
    const router = useRouter()

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', handleScroll)

        // Fetch User Auth State
        const getUser = async () => {
            const { data } = await supabase.auth.getUser()
            setUser(data?.user || null)
        }
        getUser()

        // Listen to Auth Changes
        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            setUser(session?.user || null)
        })

        return () => {
            window.removeEventListener('scroll', handleScroll)
            authListener.subscription.unsubscribe()
        }
    }, [supabase.auth])

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        closeMenu()
        router.refresh()
    }

    const handleCreateClick = (e: React.MouseEvent) => {
        e.preventDefault()
        if (user) {
            router.push('/pricing')
        } else {
            router.push('/login?next=/pricing')
        }
        closeMenu()
    }

    const closeMenu = () => setMenuOpen(false)

    return (
        <>
            <nav id="navbar" className={scrolled || forceScrolled ? 'scrolled' : 'top'}>
                <div className="nav-container container">
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

                    <ul className="nav-links">
                        <li><Link href="/#how-it-works">How It Works</Link></li>
                        <li><Link href="/#journey">Love Stories</Link></li>
                        <li><Link href="/occasions">Occasions</Link></li>
                        <li><Link href="/ai-magic">AI Magic <span className="badge">New</span></Link></li>
                        <li><Link href="/pricing">Pricing</Link></li>
                        <li><Link href="/about">About Us</Link></li>
                    </ul>

                    <div className="nav-actions">
                        {user ? (
                            <button onClick={handleSignOut} className="btn-ghost" style={{ cursor: 'pointer', background: 'none', border: 'none', fontSize: '0.95rem' }}>Sign Out</button>
                        ) : (
                            <Link href="/login" className="btn-ghost">Sign In</Link>
                        )}
                        <Link href="/pricing" onClick={handleCreateClick} className="btn-primary-sm">Create Love Code</Link>
                    </div>

                    <button
                        className={`hamburger${menuOpen ? ' open' : ''}`}
                        id="hamburger"
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Open menu"
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>
            </nav>

            {/* FULLSCREEN MOBILE MENU */}
            <div className={`fullscreen-menu${menuOpen ? ' open' : ''}`} id="fullscreenMenu">
                <div className="menu-topbar">
                    <div className="menu-logo">
                        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <linearGradient id="menuHeartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" style={{ stopColor: 'var(--rose-light)' }} />
                                    <stop offset="100%" style={{ stopColor: 'var(--rose)' }} />
                                </linearGradient>
                            </defs>
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="url(#menuHeartGrad)" />
                        </svg>
                        <span className="menu-logo-text">Love<em>Bites</em><span className="menu-logo-dot"></span></span>
                    </div>
                    <button className="menu-close-btn" id="menuCloseBtn" onClick={closeMenu}>✕</button>
                </div>

                <div className="menu-items">
                    <div className="menu-section-label">Explore</div>
                    <Link href="/#how-it-works" className="menu-item" onClick={closeMenu}>
                        <div className="menu-item-left">
                            <div className="menu-item-icon icon-rose">✨</div>
                            <div className="menu-item-text">
                                <span className="menu-item-label">How It Works</span>
                                <span className="menu-item-sub">See the magic behind the code</span>
                            </div>
                        </div>
                        <span className="menu-arrow">›</span>
                    </Link>
                    <Link href="/#journey" className="menu-item" onClick={closeMenu}>
                        <div className="menu-item-left">
                            <div className="menu-item-icon icon-pink">💝</div>
                            <div className="menu-item-text">
                                <span className="menu-item-label">Love Stories</span>
                                <span className="menu-item-sub">Get inspired by real love codes</span>
                            </div>
                        </div>
                        <span className="menu-arrow">›</span>
                    </Link>
                    <Link href="/ai-magic" className="menu-item" onClick={closeMenu}>
                        <div className="menu-item-left">
                            <div className="menu-item-icon icon-green">🤖</div>
                            <div className="menu-item-text">
                                <span className="menu-item-label">AI Magic</span>
                                <span className="menu-item-sub">Powered by advanced AI</span>
                            </div>
                        </div>
                        <div className="menu-item-right">
                            <span className="menu-badge">New</span>
                            <span className="menu-arrow">›</span>
                        </div>
                    </Link>
                </div>

                <div className="menu-footer">
                    <Link href="/pricing" onClick={handleCreateClick} className="menu-btn-create" id="menuBtnCreate" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        ♥ Create Your Love Code
                    </Link>
                    {user ? (
                        <button className="menu-btn-signin" onClick={handleSignOut}>Sign Out</button>
                    ) : (
                        <Link href="/login" style={{ textDecoration: 'none' }} className="menu-btn-signin" onClick={closeMenu}>Sign In</Link>
                    )}
                </div>
            </div>
        </>
    )
}
