'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

function LoginContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const nextPath = searchParams.get('next') || '/'
    const supabase = createClient()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [msg, setMsg] = useState<string | null>(null)

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setMsg(null)
        setIsLoading(true)

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`,
            },
        })

        if (error) {
            setError(error.message)
        } else {
            setMsg('Check your email for the confirmation link.')
            setEmail('')
            setPassword('')
        }
        setIsLoading(false)
    }

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setMsg(null)
        setIsLoading(true)

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            setError(error.message)
            setIsLoading(false)
        } else {
            router.refresh()
            router.push(nextPath)
        }
    }

    return (
        <div className="login-body-page" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar forceScrolled />

            <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '100px', paddingBottom: '60px' }}>
                <div className="login-card" style={{
                    background: 'rgba(255, 255, 255, 0.7)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(192, 49, 79, 0.15)',
                    padding: '40px',
                    borderRadius: '24px',
                    width: '100%',
                    maxWidth: '400px',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.05)'
                }}>
                    <div className="text-center" style={{ textAlign: 'center', marginBottom: '32px' }}>
                        <h1 style={{ fontFamily: 'Playfair Display, serif', color: 'var(--crimson)', fontSize: '2rem', marginBottom: '8px' }}>Welcome Back</h1>
                        <p style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>Sign in to manage your Love Codes</p>
                    </div>

                    <form className="login-form" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 500, marginBottom: '8px', color: 'var(--crimson)' }}>Email</label>
                            <input
                                name="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    borderRadius: '12px',
                                    border: '1px solid rgba(192, 49, 79, 0.2)',
                                    background: 'rgba(255, 255, 255, 0.9)',
                                    outline: 'none',
                                    fontFamily: 'inherit'
                                }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 500, marginBottom: '8px', color: 'var(--crimson)' }}>Password</label>
                            <input
                                type="password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    borderRadius: '12px',
                                    border: '1px solid rgba(192, 49, 79, 0.2)',
                                    background: 'rgba(255, 255, 255, 0.9)',
                                    outline: 'none',
                                    fontFamily: 'inherit'
                                }}
                            />
                        </div>

                        {error && <p style={{ color: 'var(--cta)', fontSize: '0.9rem', textAlign: 'center' }}>{error}</p>}
                        {msg && <p style={{ color: 'green', fontSize: '0.9rem', textAlign: 'center' }}>{msg}</p>}

                        <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                            <button
                                onClick={handleSignUp}
                                disabled={isLoading}
                                style={{
                                    flex: 1,
                                    padding: '14px',
                                    borderRadius: '30px',
                                    border: '1px solid var(--cta)',
                                    background: 'transparent',
                                    color: 'var(--cta)',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                Sign Up
                            </button>
                            <button
                                onClick={handleSignIn}
                                disabled={isLoading}
                                style={{
                                    flex: 1,
                                    padding: '14px',
                                    borderRadius: '30px',
                                    border: 'none',
                                    background: 'var(--cta)',
                                    color: 'white',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    boxShadow: '0 4px 15px rgba(192, 49, 79, 0.3)'
                                }}
                            >
                                {isLoading ? 'Please wait...' : 'Sign In'}
                            </button>
                        </div>
                    </form>
                </div>
            </main>

            <Footer />
        </div>
    )
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>}>
            <LoginContent />
        </Suspense>
    )
}
