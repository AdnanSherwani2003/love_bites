'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '../AdminLayout'

export default function AnalyticsPage() {
    const [stats, setStats] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchStats() {
            try {
                const res = await fetch('/api/admin/analytics')
                const data = await res.json()
                setStats(data)
            } catch (err) {
                console.error('Failed to load analytics:', err)
            } finally {
                setLoading(false)
            }
        }
        fetchStats()
    }, [])

    if (loading) return <AdminLayout><div style={{ padding: '40px', textAlign: 'center' }}>Crunching data...</div></AdminLayout>

    return (
        <AdminLayout>
            <div style={{ padding: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                    <div>
                        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.5rem', marginBottom: '8px' }}>📈 Performance Insights</h1>
                        <p style={{ color: 'var(--admin-text-muted)' }}>Real-time usage and conversion metrics for Love Bites.</p>
                    </div>
                </div>

                {/* Key Metrics Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '40px' }}>
                    <div className="admin-card" style={{ padding: '24px' }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--admin-text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Total Views</div>
                        <div style={{ fontSize: '2rem', fontWeight: 800 }}>{stats?.total_views || 0}</div>
                    </div>
                    <div className="admin-card" style={{ padding: '24px' }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--admin-text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Total Creations</div>
                        <div style={{ fontSize: '2rem', fontWeight: 800 }}>{stats?.total_creations || 0}</div>
                    </div>
                    <div className="admin-card" style={{ padding: '24px' }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--admin-text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Conversion Rate</div>
                        <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--admin-primary)' }}>{stats?.conversion_rate || 0}%</div>
                    </div>
                    <div className="admin-card" style={{ padding: '24px' }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--admin-text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Est. Revenue</div>
                        <div style={{ fontSize: '2rem', fontWeight: 800 }}>
                            ₹{(stats?.tier_distribution?.tier_49 * 49) + (stats?.tier_distribution?.tier_99 * 99) + (stats?.tier_distribution?.tier_149 * 149)}
                        </div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                    
                    {/* Tier Distribution Chart (Simple CSS implementation) */}
                    <div className="admin-card">
                        <div className="admin-table-header">
                            <h3 style={{ fontFamily: 'Playfair Display, serif' }}>📊 Tier Popularity</h3>
                        </div>
                        <div style={{ padding: '32px' }}>
                            {[
                                { label: 'Sweet Start (₹49)', count: stats?.tier_distribution?.tier_49, color: '#f8c291' },
                                { label: 'True Love (₹99)', count: stats?.tier_distribution?.tier_99, color: '#e8445a' },
                                { label: 'Grand Amour (₹149)', count: stats?.tier_distribution?.tier_149, color: '#6a0dad' },
                            ].map((tier, i) => (
                                <div key={i} style={{ marginBottom: '20px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                                        <span>{tier.label}</span>
                                        <span style={{ fontWeight: 700 }}>{tier.count} sales</span>
                                    </div>
                                    <div style={{ width: '100%', height: '12px', background: 'rgba(0,0,0,0.05)', borderRadius: '6px', overflow: 'hidden' }}>
                                        <div style={{ 
                                            width: `${(tier.count / stats?.total_creations * 100) || 0}%`, 
                                            height: '100%', 
                                            background: tier.color,
                                            transition: 'width 1s ease-out'
                                        }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Events Log */}
                    <div className="admin-card" style={{ display: 'flex', flexDirection: 'column' }}>
                        <div className="admin-table-header">
                            <h3 style={{ fontFamily: 'Playfair Display, serif' }}>⚡ Real-time Activity</h3>
                        </div>
                        <div style={{ flex: 1, padding: '12px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {stats?.recent_activity?.map((event: any) => (
                                    <div key={event.id} style={{ padding: '12px', borderBottom: '1px solid rgba(0,0,0,0.03)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <span style={{ 
                                                fontSize: '0.65rem', 
                                                padding: '4px 8px', 
                                                borderRadius: '100px', 
                                                background: event.event_type === 'letter_created' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(33, 150, 243, 0.1)',
                                                color: event.event_type === 'letter_created' ? '#2e7d32' : '#1565c0',
                                                marginRight: '12px',
                                                fontWeight: 700
                                            }}>
                                                {event.event_type.replace('_', ' ')}
                                            </span>
                                            <span style={{ fontSize: '0.85rem' }}>
                                                {event.tier ? `Plan: ₹${event.tier}` : 'Landing Page'}
                                            </span>
                                        </div>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>
                                            {new Date(event.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}
