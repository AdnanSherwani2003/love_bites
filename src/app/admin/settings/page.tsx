'use client'

import React, { useState, useEffect } from 'react'
import AdminLayout from '../AdminLayout'
import { createClient } from '@/utils/supabase/client'

export default function AdminSettings() {
    const supabase = createClient()
    const [settings, setSettings] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState<string | null>(null)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    useEffect(() => {
        fetchSettings()
    }, [])

    const fetchSettings = async () => {
        try {
            setLoading(true)
            const response = await fetch('/api/admin/settings')
            const data = await response.json()
            if (data.error) throw new Error(data.error)
            setSettings(data)
        } catch (err: any) {
            setMessage({ type: 'error', text: 'Failed to load settings: ' + err.message })
        } finally {
            setLoading(false)
        }
    }

    const updateSetting = async (key: string, newValue: any) => {
        try {
            setSaving(key)
            setMessage(null)
            
            const response = await fetch('/api/admin/settings', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key, value: newValue })
            })
            
            const result = await response.json()
            if (result.error) throw new Error(result.error)

            setSettings((prev: any) => ({
                ...prev,
                [key]: { ...prev[key], value: newValue }
            }))
            
            setMessage({ type: 'success', text: `Successfully updated ${key} configuration.` })
            setTimeout(() => setMessage(null), 3000)
        } catch (err: any) {
            setMessage({ type: 'error', text: 'Update failed: ' + err.message })
        } finally {
            setSaving(null)
        }
    }

    if (loading) {
        return (
            <AdminLayout>
                <div className="admin-header">
                    <h1>System Settings</h1>
                    <p style={{ color: 'var(--admin-text-muted)', fontSize: '1.1rem' }}>Configuring your digital ecosystem...</p>
                </div>
                <div className="admin-card" style={{ padding: '100px', textAlign: 'center', color: 'var(--admin-text-muted)' }}>
                    <div className="dot" style={{ margin: '0 auto 16px', width: '8px', height: '8px' }}></div>
                    Syncing global configurations...
                </div>
            </AdminLayout>
        )
    }

    if (!settings || Object.keys(settings).length === 0) {
        return (
            <AdminLayout>
                <div className="admin-header">
                    <div>
                        <h1>System Settings</h1>
                        <p style={{ color: 'var(--admin-text-muted)', fontSize: '1.1rem' }}>Global configuration and platform parameters.</p>
                    </div>
                </div>
                <div className="admin-card" style={{ padding: '60px', textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🛠️</div>
                    <h3 style={{ marginBottom: '12px' }}>Database Setup Required</h3>
                    <p style={{ color: 'var(--admin-text-muted)', maxWidth: '500px', margin: '0 auto 24px' }}>
                        The system settings table hasn't been initialized in your Supabase database yet.
                    </p>
                    <div style={{ background: 'rgba(0,0,0,0.05)', padding: '20px', borderRadius: '12px', textAlign: 'left', marginBottom: '24px' }}>
                        <p style={{ fontWeight: 600, marginBottom: '8px', fontSize: '0.9rem' }}>To fix this, please run the SQL query from:</p>
                        <code style={{ fontSize: '0.8rem', color: '#c4304f' }}>system_settings_setup.sql</code>
                    </div>
                    <button 
                        onClick={fetchSettings}
                        className="admin-btn-primary"
                        style={{ padding: '12px 32px' }}
                    >
                        🔄 Check Again
                    </button>
                    {message && (
                        <p style={{ marginTop: '20px', color: '#991b1b', fontSize: '0.8rem' }}>{message.text}</p>
                    )}
                </div>
            </AdminLayout>
        )
    }

    return (
        <AdminLayout>
            <div className="admin-header">
                <div>
                    <h1>System Settings</h1>
                    <p style={{ color: 'var(--admin-text-muted)', fontSize: '1.1rem' }}>Global configuration and platform parameters.</p>
                </div>
                {message && (
                    <div style={{ 
                        padding: '12px 24px', 
                        borderRadius: '12px', 
                        background: message.type === 'success' ? 'rgba(22, 101, 52, 0.1)' : 'rgba(153, 27, 27, 0.1)',
                        color: message.type === 'success' ? '#166534' : '#991b1b',
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        border: `1px solid ${message.type === 'success' ? 'rgba(22, 101, 52, 0.2)' : 'rgba(153, 27, 27, 0.2)'}`,
                        animation: 'fadeIn 0.3s ease-out'
                    }}>
                        {message.type === 'success' ? '✨ ' : '⚠️ '} {message.text}
                    </div>
                )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '32px' }}>
                
                {/* Pricing Configuration */}
                <div className="admin-card">
                    <div className="admin-table-header">
                        <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem' }}>💰 Revenue & Pricing</h3>
                    </div>
                    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.8rem', fontWeight: 600, color: 'var(--admin-text-muted)' }}>Tier: Sweet Start</label>
                                <div style={{ position: 'relative' }}>
                                    <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontWeight: 700 }}>₹</span>
                                    <input 
                                        type="number" 
                                        value={settings.pricing?.value.tier_49}
                                        onChange={(e) => setSettings((prev: any) => ({
                                            ...prev, 
                                            pricing: { ...prev.pricing, value: { ...prev.pricing.value, tier_49: parseInt(e.target.value) } }
                                        }))}
                                        style={{ width: '100%', padding: '12px 12px 12px 28px', borderRadius: '10px', border: '1px solid var(--admin-border)', background: 'white' }}
                                    />
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.8rem', fontWeight: 600, color: 'var(--admin-text-muted)' }}>Tier: True Love</label>
                                <div style={{ position: 'relative' }}>
                                    <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontWeight: 700 }}>₹</span>
                                    <input 
                                        type="number" 
                                        value={settings.pricing?.value.tier_99}
                                        onChange={(e) => setSettings((prev: any) => ({
                                            ...prev, 
                                            pricing: { ...prev.pricing, value: { ...prev.pricing.value, tier_99: parseInt(e.target.value) } }
                                        }))}
                                        style={{ width: '100%', padding: '12px 12px 12px 28px', borderRadius: '10px', border: '1px solid var(--admin-border)', background: 'white' }}
                                    />
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.8rem', fontWeight: 600, color: 'var(--admin-text-muted)' }}>Tier: Grand Amour</label>
                                <div style={{ position: 'relative' }}>
                                    <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontWeight: 700 }}>₹</span>
                                    <input 
                                        type="number" 
                                        value={settings.pricing?.value.tier_149}
                                        onChange={(e) => setSettings((prev: any) => ({
                                            ...prev, 
                                            pricing: { ...prev.pricing, value: { ...prev.pricing.value, tier_149: parseInt(e.target.value) } }
                                        }))}
                                        style={{ width: '100%', padding: '12px 12px 12px 28px', borderRadius: '10px', border: '1px solid var(--admin-border)', background: 'white' }}
                                    />
                                </div>
                            </div>
                        </div>
                        <button 
                            disabled={saving === 'pricing'}
                            onClick={() => updateSetting('pricing', settings.pricing.value)} 
                            className="btn-action" 
                            style={{ 
                                background: 'black', 
                                color: 'white', 
                                padding: '12px', 
                                borderRadius: '12px', 
                                border: 'none', 
                                fontWeight: 700, 
                                width: '100%', 
                                cursor: 'pointer' 
                            }}
                        >
                            {saving === 'pricing' ? 'Synchronizing...' : 'Update Pricing Matrix'}
                        </button>
                    </div>
                </div>

                {/* Feature Toggles */}
                <div className="admin-card">
                    <div className="admin-table-header">
                        <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem' }}>⚡ Advanced Features</h3>
                    </div>
                    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', background: 'rgba(232, 68, 90, 0.03)', borderRadius: '12px' }}>
                            <div>
                                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>AI-Magic Engine</div>
                                <p style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>Enable AI message generation for users.</p>
                            </div>
                            <input 
                                type="checkbox" 
                                checked={settings.features?.value.ai_magic}
                                onChange={(e) => updateSetting('features', { ...settings.features.value, ai_magic: e.target.checked })}
                                style={{ width: '44px', height: '22px', cursor: 'pointer' }}
                            />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', background: 'rgba(232, 68, 90, 0.03)', borderRadius: '12px' }}>
                            <div>
                                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Maintenance Mode</div>
                                <p style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>Redirect all users to a maintenance screen.</p>
                            </div>
                            <input 
                                type="checkbox" 
                                checked={settings.features?.value.maintenance}
                                onChange={(e) => updateSetting('features', { ...settings.features.value, maintenance: e.target.checked })}
                                style={{ width: '44px', height: '22px', cursor: 'pointer' }}
                            />
                        </div>
                        <p style={{ fontSize: '0.75rem', fontStyle: 'italic', textAlign: 'center', color: '#64748b' }}>Changes are reflected across all sessions immediately.</p>
                    </div>
                </div>

                {/* Content Configuration */}
                <div className="admin-card">
                    <div className="admin-table-header">
                        <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem' }}>📝 Content & Support</h3>
                    </div>
                    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.8rem', fontWeight: 600, color: 'var(--admin-text-muted)' }}>Popular Tier Badge</label>
                            <select 
                                value={settings.content?.value.popular_tier}
                                onChange={(e) => updateSetting('content', { ...settings.content.value, popular_tier: parseInt(e.target.value) })}
                                style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--admin-border)', background: 'white' }}
                            >
                                <option value={49}>Sweet Start (49)</option>
                                <option value={99}>True Love (99)</option>
                                <option value={149}>Grand Amour (149)</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.8rem', fontWeight: 600, color: 'var(--admin-text-muted)' }}>Support Multi-channel</label>
                            <input 
                                type="text" 
                                placeholder="Support Email"
                                value={settings.content?.value.support_email}
                                onChange={(e) => setSettings((prev: any) => ({
                                    ...prev, 
                                    content: { ...prev.content, value: { ...prev.content.value, support_email: e.target.value } }
                                }))}
                                style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--admin-border)', background: 'white', marginBottom: '10px' }}
                            />
                            <input 
                                type="text" 
                                placeholder="WhatsApp or Phone"
                                value={settings.content?.value.whatsapp}
                                onChange={(e) => setSettings((prev: any) => ({
                                    ...prev, 
                                    content: { ...prev.content, value: { ...prev.content.value, whatsapp: e.target.value } }
                                }))}
                                style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--admin-border)', background: 'white' }}
                            />
                        </div>
                        <button 
                            disabled={saving === 'content'}
                            onClick={() => updateSetting('content', settings.content.value)} 
                            className="btn-action" 
                            style={{ padding: '12px', borderRadius: '12px', fontWeight: 600, width: '100%' }}
                        >
                            Save Content Updates
                        </button>
                    </div>
                </div>

                {/* Audit Information */}
                <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '40px', background: 'rgba(232, 68, 90, 0.02)' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>🛡️</div>
                        <h3 style={{ marginBottom: '12px', fontFamily: 'Playfair Display, serif' }}>System Audit</h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--admin-text-muted)', lineHeight: '1.6' }}>
                           Every configuration change is logged for security. The system syncs with Supabase Edge to ensure zero-latency updates for global users.
                        </p>
                        <div style={{ marginTop: '24px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--admin-primary)' }}>
                           SYNC STATUS: OPERATIONAL
                        </div>
                    </div>
                </div>
            </div>

            {/* Content CMS Section */}
            <div style={{ marginTop: '32px' }}>
                <h2 style={{ marginBottom: '24px', fontFamily: 'Playfair Display, serif' }}>🎨 Content CMS</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                    
                    {/* Moods CMS */}
                    <div className="admin-card" style={{ display: 'flex', flexDirection: 'column' }}>
                        <div className="admin-table-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem' }}>✨ Moods Registry</h3>
                            <button 
                                onClick={() => updateSetting('moods', [
                                    { id: `new_mood_${Date.now()}`, label: 'New Mood', subtitle: 'Description...', emoji: '✨', category: 'Romantic' },
                                    ...settings.moods.value
                                ])}
                                style={{ background: '#000', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '8px', fontSize: '0.8rem', cursor: 'pointer' }}
                            >
                                + Add Mood
                            </button>
                        </div>
                        <div style={{ maxHeight: '500px', overflowY: 'auto', padding: '12px' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                                <thead style={{ position: 'sticky', top: 0, background: 'white', zIndex: 1, borderBottom: '1px solid var(--admin-border)' }}>
                                    <tr>
                                        <th style={{ textAlign: 'left', padding: '12px 8px' }}>Mood</th>
                                        <th style={{ textAlign: 'left', padding: '12px 8px' }}>Emoji</th>
                                        <th style={{ textAlign: 'left', padding: '12px 8px' }}>Category</th>
                                        <th style={{ textAlign: 'center', padding: '12px 8px' }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {settings.moods?.value.map((mood: any, idx: number) => (
                                        <tr key={mood.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.03)' }}>
                                            <td style={{ padding: '8px' }}>
                                                <input 
                                                    value={mood.label} 
                                                    onChange={(e) => {
                                                        const newMoods = [...settings.moods.value]
                                                        newMoods[idx].label = e.target.value
                                                        setSettings({...settings, moods: {...settings.moods, value: newMoods}})
                                                    }}
                                                    style={{ width: '100%', border: 'none', background: 'transparent', fontWeight: 600 }}
                                                />
                                            </td>
                                            <td style={{ padding: '8px' }}>{mood.emoji}</td>
                                            <td style={{ padding: '8px' }}>{mood.category}</td>
                                            <td style={{ padding: '8px', textAlign: 'center' }}>
                                                <button 
                                                    onClick={() => {
                                                        const newMoods = settings.moods.value.filter((_: any, i: number) => i !== idx)
                                                        updateSetting('moods', newMoods)
                                                    }}
                                                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                                                >
                                                    🗑️
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div style={{ padding: '16px', borderTop: '1px solid var(--admin-border)', textAlign: 'right' }}>
                             <button 
                                onClick={() => updateSetting('moods', settings.moods.value)}
                                style={{ background: 'var(--admin-primary)', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '10px', fontWeight: 600, cursor: 'pointer' }}
                             >
                                {saving === 'moods' ? 'Saving...' : 'Save All Moods'}
                             </button>
                        </div>
                    </div>

                    {/* Occasions CMS */}
                    <div className="admin-card" style={{ display: 'flex', flexDirection: 'column' }}>
                        <div className="admin-table-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem' }}>📅 Occasions Hub</h3>
                            <button 
                                onClick={() => updateSetting('occasions', [
                                    { id: `new_occ_${Date.now()}`, label: 'New Event', emoji: '🎉' },
                                    ...settings.occasions.value
                                ])}
                                style={{ background: '#000', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '8px', fontSize: '0.8rem', cursor: 'pointer' }}
                            >
                                + Add Occasion
                            </button>
                        </div>
                        <div style={{ maxHeight: '500px', overflowY: 'auto', padding: '12px' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                                <thead style={{ position: 'sticky', top: 0, background: 'white', zIndex: 1, borderBottom: '1px solid var(--admin-border)' }}>
                                    <tr>
                                        <th style={{ textAlign: 'left', padding: '12px 8px' }}>Event Name</th>
                                        <th style={{ textAlign: 'left', padding: '12px 8px' }}>Icon</th>
                                        <th style={{ textAlign: 'center', padding: '12px 8px' }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {settings.occasions?.value.map((occ: any, idx: number) => (
                                        <tr key={occ.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.03)' }}>
                                            <td style={{ padding: '8px' }}>
                                                <input 
                                                    value={occ.label} 
                                                    onChange={(e) => {
                                                        const newOccs = [...settings.occasions.value]
                                                        newOccs[idx].label = e.target.value
                                                        setSettings({...settings, occasions: {...settings.occasions, value: newOccs}})
                                                    }}
                                                    style={{ width: '100%', border: 'none', background: 'transparent', fontWeight: 600 }}
                                                />
                                            </td>
                                            <td style={{ padding: '8px', fontSize: '1.2rem' }}>{occ.emoji}</td>
                                            <td style={{ padding: '8px', textAlign: 'center' }}>
                                                <button 
                                                    onClick={() => {
                                                        const newOccs = settings.occasions.value.filter((_: any, i: number) => i !== idx)
                                                        updateSetting('occasions', newOccs)
                                                    }}
                                                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                                                >
                                                    🗑️
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div style={{ padding: '16px', borderTop: '1px solid var(--admin-border)', textAlign: 'right' }}>
                             <button 
                                onClick={() => updateSetting('occasions', settings.occasions.value)}
                                style={{ background: 'var(--admin-primary)', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '10px', fontWeight: 600, cursor: 'pointer' }}
                             >
                                {saving === 'occasions' ? 'Saving...' : 'Save All Occasions'}
                             </button>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}
