'use client'

import { useEffect, useState } from 'react'
import AdminLayout from './AdminLayout'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalPlans: 0,
        totalCodes: 0,
        tier49: 0,
        tier99: 0,
        tier149: 0,
        recentPlans: [] as any[]
    })
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        async function fetchStats() {
            setLoading(true)
            
            // Fetch True Love Plans
            const { data: plans, error: plansError } = await supabase
                .from('true_love_plans')
                .select('*')
                .order('created_at', { ascending: false })

            // Fetch Love Codes
            const { data: codes, error: codesError } = await supabase
                .from('love_codes')
                .select('*')

            if (!plansError && !codesError) {
                const p = plans || []
                const c = codes || []
                
                setStats({
                    totalPlans: p.length,
                    totalCodes: c.length,
                    tier49: p.filter(x => x.tier === 49).length,
                    tier99: p.filter(x => x.tier === 99).length,
                    tier149: p.filter(x => x.tier === 149).length,
                    recentPlans: p.slice(0, 5)
                })
            }
            setLoading(false)
        }

        fetchStats()
    }, [supabase])

    return (
        <AdminLayout>
            <div className="admin-header">
                <div>
                    <h1>Dashboard Overview</h1>
                    <p style={{ color: 'var(--admin-text-muted)', fontSize: '1.1rem' }}>Welcome back to your command center.</p>
                </div>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-label">Premium Plans</div>
                    <div className="stat-value">{stats.totalPlans}</div>
                    <div style={{ marginTop: '16px', fontSize: '0.85rem', color: '#166534', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '1.1rem' }}>📈</span> +{stats.totalPlans > 0 ? 'Recently updated' : '0'} today
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Active Love Codes</div>
                    <div className="stat-value">{stats.totalCodes}</div>
                    <div style={{ marginTop: '16px', fontSize: '0.85rem', color: 'var(--admin-primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '1.1rem' }}>✨</span> Spreading the love
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Revenue Estimate</div>
                    <div className="stat-value">₹{(stats.tier49 * 49) + (stats.tier99 * 99) + (stats.tier149 * 149)}</div>
                    <div style={{ marginTop: '16px', fontSize: '0.85rem', color: 'var(--admin-text-muted)', fontWeight: 500 }}>
                        Based on plan tiers
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr', gap: '32px', alignItems: 'start' }}>
                {/* Recent Plans Table */}
                <div className="admin-card">
                    <div className="admin-table-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ fontWeight: 700, fontFamily: 'Playfair Display, serif', fontSize: '1.5rem' }}>Recent Premium Plans</h3>
                        <Link href="/admin/plans" className="btn-action">View All Reports</Link>
                    </div>
                    <div className="table-container">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Sender</th>
                                    <th>Recipient</th>
                                    <th>Tier</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.recentPlans.length > 0 ? stats.recentPlans.map((plan: any) => (
                                    <tr key={plan.id}>
                                        <td style={{ fontWeight: 600 }}>{plan.sender_name}</td>
                                        <td style={{ color: 'var(--admin-text-muted)' }}>{plan.recipient_name}</td>
                                        <td><span className={`badge-tier tier-${plan.tier}`}>₹{plan.tier}</span></td>
                                        <td>
                                            <span style={{ 
                                                display: 'inline-flex', 
                                                alignItems: 'center', 
                                                gap: '6px', 
                                                fontSize: '0.8rem', 
                                                fontWeight: 600,
                                                color: plan.is_sent ? '#166534' : '#92400e'
                                            }}>
                                                {plan.is_sent ? '● Sent' : '○ Scheduled'}
                                            </span>
                                        </td>
                                        <td style={{ color: 'var(--admin-text-muted)', fontSize: '0.8rem' }}>{new Date(plan.created_at).toLocaleDateString()}</td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={5} style={{ textAlign: 'center', padding: '60px', color: 'var(--admin-text-muted)' }}>
                                            {loading ? 'Refreshing data...' : 'No activity logged yet.'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Tier Distribution */}
                <div className="admin-card" style={{ padding: '32px' }}>
                    <h3 style={{ fontWeight: 700, fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', marginBottom: '24px' }}>Tier Distribution</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {[
                            { name: 'Sweet Start (49)', count: stats.tier49, color: '#fee2e2' },
                            { name: 'True Love (99)', count: stats.tier99, color: '#fef3c7' },
                            { name: 'Grand Amour (149)', count: stats.tier149, color: '#dcfce7' }
                        ].map((tier) => (
                            <div key={tier.name}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.9rem', fontWeight: 600 }}>
                                    <span>{tier.name}</span>
                                    <span style={{ color: 'var(--admin-primary)' }}>{tier.count}</span>
                                </div>
                                <div style={{ height: '10px', background: '#f1f5f9', borderRadius: '10px', overflow: 'hidden' }}>
                                    <div style={{ 
                                        width: `${(tier.count / (stats.totalPlans || 1)) * 100}%`, 
                                        height: '100%', 
                                        background: tier.color,
                                        boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)',
                                        transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)'
                                    }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div style={{ marginTop: '32px', padding: '20px', background: 'rgba(232, 68, 90, 0.03)', borderRadius: '16px', border: '1px dashed var(--admin-border)' }}>
                        <p style={{ fontSize: '0.85rem', color: 'var(--admin-text-muted)', lineHeight: '1.5', textAlign: 'center' }}>
                            Top performing tier is <strong>{
                                stats.tier149 >= stats.tier99 && stats.tier149 >= stats.tier49 ? 'Grand Amour' :
                                stats.tier99 >= stats.tier49 ? 'True Love' : 'Sweet Start'
                            }</strong>.
                        </p>
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}
