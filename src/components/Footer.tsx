import Link from 'next/link'

export default function Footer() {
    return (
        <footer className="lb-footer">
            <div className="lb-footer-body">
                <div className="container">
                    <div className="lb-footer-grid">
                        {/* COLUMN 1: Brand + Socials */}
                        <div className="lb-col-brand">
                            <Link href="/" className="lb-logo">
                                <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                                    <defs>
                                        <linearGradient id="fg" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" style={{ stopColor: '#ff6b80' }} />
                                            <stop offset="100%" style={{ stopColor: '#e8445a' }} />
                                        </linearGradient>
                                    </defs>
                                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="url(#fg)" />
                                </svg>
                                <span className="lb-logo-text">Love <em>Bites</em><span className="lb-logo-dot"></span></span>
                            </Link>
                            <p className="lb-tagline">The world&apos;s most personal digital gift — turn your feelings into moments they&apos;ll never forget.</p>
                            <div className="lb-socials">
                                <a href="#" className="lb-social" aria-label="Instagram">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                                    </svg>
                                </a>
                                <a href="#" className="lb-social" aria-label="TikTok">
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.24 8.24 0 0 0 4.84 1.56V6.79a4.85 4.85 0 0 1-1.07-.1z" />
                                    </svg>
                                </a>
                                <a href="#" className="lb-social" aria-label="YouTube">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.4a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
                                        <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
                                    </svg>
                                </a>
                            </div>
                        </div>

                        {/* COLUMN 2: Love Bites Links */}
                        <div>
                            <h4 className="lb-col-title">Love Bites</h4>
                            <ul className="lb-links">
                                <li><Link href="/about">About</Link></li>
                                <li><Link href="/#journey">Love Stories</Link></li>
                                <li><Link href="/#how-it-works">How It Works</Link></li>
                                <li><Link href="/pricing">Pricing</Link></li>
                            </ul>
                        </div>

                        {/* COLUMN 3: Support */}
                        <div>
                            <h4 className="lb-col-title">Support</h4>
                            <ul className="lb-links">
                                <li><a href="#">Contact</a></li>
                                <li><a href="#">Help Center</a></li>
                                <li><a href="#">Refund Policy</a></li>
                                <li><a href="#">Report Issue</a></li>
                            </ul>
                        </div>

                        {/* COLUMN 4: Legal */}
                        <div>
                            <h4 className="lb-col-title">Legal</h4>
                            <ul className="lb-links">
                                <li><a href="#">Privacy Policy</a></li>
                                <li><a href="#">Terms of Service</a></li>
                                <li><a href="#">Cookie Policy</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div className="lb-divider"></div>

            <div className="lb-footer-bottom">
                <div className="container">
                    <div className="lb-bottom-inner">
                        <p className="lb-copy">© 2026 Love Bites. All rights reserved.</p>
                        <p className="lb-made-with">Made with <span className="lb-heart"></span> for unforgettable moments.</p>
                    </div>
                </div>
            </div>
        </footer>
    )
}
