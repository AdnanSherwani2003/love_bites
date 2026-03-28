'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import './admin.css'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [isLoading, setIsLoading] = useState(true)
    const [isAdmin, setIsAdmin] = useState(false)
    const router = useRouter()
    const pathname = usePathname()
    const supabase = createClient()

    useEffect(() => {
        async function checkAdmin() {
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                router.push(`/login?next=${pathname}`)
                return
            }

            // Check if user is admin in profiles table
            const { data: profile, error } = await supabase
                .from('profiles')
                .select('is_admin')
                .eq('id', user.id)
                .single()

            if (error || !profile?.is_admin) {
                // If profiles doesn't exist yet or is_admin is false, 
                // we show access denied or redirect
                setIsAdmin(false)
                setIsLoading(false)
            } else {
                setIsAdmin(true)
                setIsLoading(false)
            }
        }

        checkAdmin()
    }, [supabase, router, pathname])

    if (isLoading) {
        return (
            <div className="auth-overlay">
                <div className="dot" style={{ width: '12px', height: '12px' }}></div>
                <p style={{ marginTop: '16px', color: 'var(--rose-dark)', fontWeight: 500 }}>Verifying Admin Access...</p>
            </div>
        )
    }

    if (!isAdmin) {
        return (
            <div className="auth-overlay">
                <h1 style={{ color: 'var(--rose-dark)', marginBottom: '16px' }}>Access Denied</h1>
                <p style={{ color: '#64748b', marginBottom: '24px' }}>You do not have permission to view this page.</p>
                <Link href="/" className="btn-primary-sm">Return Home</Link>
            </div>
        )
    }

    return (
        <div className="admin-container">
            <aside className="admin-sidebar">
                <div className="sidebar-header">
                    <Link href="/" className="logo" style={{ animation: 'none', textDecoration: 'none' }}>
                        <span className="logo-text" style={{ fontSize: '1.25rem' }}>Love <i>Bites</i> Admin</span>
                    </Link>
                </div>
                
                <div className="sidebar-nav-container">
                    <Link href="/admin" className={`sidebar-link ${pathname === '/admin' ? 'active' : ''}`}>
                        <span>📊</span> Dashboard
                    </Link>
                    <Link href="/admin/analytics" className={`sidebar-link ${pathname.includes('/admin/analytics') ? 'active' : ''}`}>
                        <span>📈</span> Analytics
                    </Link>
                    <Link href="/admin/plans" className={`sidebar-link ${pathname.includes('/admin/plans') ? 'active' : ''}`}>
                        <span>💌</span> Love Plans
                    </Link>
                    <Link href="/admin/media" className={`sidebar-link ${pathname.includes('/admin/media') ? 'active' : ''}`}>
                        <span>🖼️</span> Media Gallery
                    </Link>
                    <Link href="/admin/settings" className={`sidebar-link ${pathname.includes('/admin/settings') ? 'active' : ''}`}>
                        <span>⚙️</span> Settings
                    </Link>
                </div>

                <div style={{ padding: '24px', borderTop: '1px solid var(--admin-border)' }}>
                    <button 
                        onClick={() => supabase.auth.signOut().then(() => router.push('/'))}
                        className="sidebar-link" 
                        style={{ background: 'none', border: 'none', width: '100%', cursor: 'pointer', justifySelf: 'flex-end' }}
                    >
                        <span>🚪</span> Sign Out
                    </button>
                </div>
            </aside>

            <main className="admin-main">
                {children}
            </main>
        </div>
    )
}
