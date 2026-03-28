'use client'

import { useEffect, useState } from 'react'
import AdminLayout from '../AdminLayout'
import { createClient } from '@/utils/supabase/client'

export default function PlansManagement() {
    const [plans, setPlans] = useState<any[]>([])
    const [codes, setCodes] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [activeTab, setActiveTab] = useState<'premium' | 'free'>('premium')
    
    const supabase = createClient()

    useEffect(() => {
        fetchData()
    }, [])

    async function fetchData() {
        setLoading(true)
        const { data: pData } = await supabase.from('true_love_plans').select('*').order('created_at', { ascending: false })
        const { data: cData } = await supabase.from('love_codes').select('*').order('created_at', { ascending: false })
        
        setPlans(pData || [])
        setCodes(cData || [])
        setLoading(false)
    }

    const filteredPlans = plans.filter(p => 
        p.sender_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.recipient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.slug?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const filteredCodes = codes.filter(c => 
        c.sender_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.recipient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.code?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleDelete = async (id: string, table: string) => {
        if (!confirm('Are you sure you want to delete this plan? This action cannot be undone.')) return
        
        const { error } = await supabase.from(table).delete().eq('id', id)
        if (error) alert('Error deleting: ' + error.message)
        else fetchData()
    }

    return (
        <AdminLayout>
            <div className="admin-header">
                <div>
                    <h1>Plans Management</h1>
                    <p style={{ color: 'var(--admin-text-muted)', fontSize: '1.1rem' }}>Review, filter and manage every digital love byte.</p>
                </div>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <div style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--admin-text-muted)', pointerEvents: 'none' }}>🔍</span>
                        <input 
                            type="text" 
                            placeholder="Search name or ID..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                padding: '14px 16px 14px 44px',
                                borderRadius: '16px',
                                border: '1px solid var(--admin-border)',
                                background: 'var(--admin-glass)',
                                width: '320px',
                                outline: 'none',
                                fontSize: '0.9rem',
                                transition: 'all 0.3s',
                                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
                            }}
                            onFocus={(e) => e.target.style.borderColor = 'var(--admin-primary)'}
                            onBlur={(e) => e.target.style.borderColor = 'var(--admin-border)'}
                        />
                    </div>
                    <button onClick={fetchData} className="btn-action" style={{ padding: '14px 20px', borderRadius: '16px' }}>↻ Refresh List</button>
                </div>
            </div>

            <div className="tab-container">
                <button 
                   onClick={() => setActiveTab('premium')}
                   className={`tab-btn ${activeTab === 'premium' ? 'active' : ''}`}
                >
                    Premium Packages ({plans.length})
                </button>
                <button 
                   onClick={() => setActiveTab('free')}
                   className={`tab-btn ${activeTab === 'free' ? 'active' : ''}`}
                >
                    Free Love Codes ({codes.length})
                </button>
            </div>

            <div className="admin-card">
                <div className="table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Code/Slug</th>
                                <th>Sender</th>
                                <th>Recipient</th>
                                {activeTab === 'premium' && <th>Tier</th>}
                                <th>Created Date</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={6} style={{ textAlign: 'center', padding: '100px', color: 'var(--admin-text-muted)' }}>
                                    <div className="dot" style={{ margin: '0 auto 16px', width: '8px', height: '8px' }}></div>
                                    Syncing with database...
                                </td></tr>
                            ) : (activeTab === 'premium' ? filteredPlans : filteredCodes).length > 0 ? (
                                (activeTab === 'premium' ? filteredPlans : filteredCodes).map((item: any) => (
                                    <tr key={item.id}>
                                        <td style={{ fontWeight: 700, color: 'var(--admin-primary-dark)', fontFamily: 'monospace', fontSize: '1rem' }}>{item.slug || item.code}</td>
                                        <td style={{ fontWeight: 600 }}>{item.sender_name}</td>
                                        <td style={{ color: 'var(--admin-text-muted)' }}>{item.recipient_name}</td>
                                        {activeTab === 'premium' && (
                                            <td><span className={`badge-tier tier-${item.tier}`}>₹{item.tier}</span></td>
                                        )}
                                        <td style={{ color: 'var(--admin-text-muted)', fontSize: '0.85rem' }}>{new Date(item.created_at).toLocaleDateString(undefined, { dateStyle: 'long' })}</td>
                                        <td style={{ textAlign: 'right' }}>
                                            <div style={{ display: 'inline-flex', gap: '10px' }}>
                                                <a href={`/${item.slug ? 'view/' + item.slug : 'lb/' + item.code}`} target="_blank" className="btn-action" style={{ padding: '8px 14px' }}>
                                                    👁️ View
                                                </a>
                                                <button 
                                                    onClick={() => handleDelete(item.id, activeTab === 'premium' ? 'true_love_plans' : 'love_codes')}
                                                    className="btn-action btn-delete"
                                                    style={{ padding: '8px 14px' }}
                                                >
                                                    🗑️ Erase
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan={6} style={{ textAlign: 'center', padding: '100px', color: 'var(--admin-text-muted)' }}>
                                    No records matching your search were found.
                                </td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    )
}
