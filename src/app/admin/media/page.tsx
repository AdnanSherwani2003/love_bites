'use client'

import { useEffect, useState } from 'react'
import AdminLayout from '../AdminLayout'
import { createClient } from '@/utils/supabase/client'

export default function MediaGallery() {
    const [files, setFiles] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        fetchMedia()
    }, [])

    async function fetchMedia() {
        setLoading(true)
        // List from 'love_media' bucket
        // Note: Supabase storage list might not be recursive by default if not specified
        // We'll try to list common folders: 'frames', 'videos'
        
        const folders = ['frames', 'videos']
        let allFiles: any[] = []

        for (const folder of folders) {
            const { data, error } = await supabase.storage.from('love_media').list(folder, {
                limit: 100,
                offset: 0,
                sortBy: { column: 'name', order: 'desc' }
            })

            if (data) {
                const filesWithUrl = data.map(f => ({
                    ...f,
                    folder,
                    url: supabase.storage.from('love_media').getPublicUrl(`${folder}/${f.name}`).data.publicUrl
                }))
                allFiles = [...allFiles, ...filesWithUrl]
            }
        }

        setFiles(allFiles)
        setLoading(false)
    }

    const handleDelete = async (folder: string, name: string) => {
        if (!confirm('Are you sure you want to delete this file?')) return
        
        const { error } = await supabase.storage.from('love_media').remove([`${folder}/${name}`])
        if (error) alert('Error: ' + error.message)
        else fetchMedia()
    }

    return (
        <AdminLayout>
            <div className="admin-header">
                <div>
                    <h1>Media Repository</h1>
                    <p style={{ color: 'var(--admin-text-muted)', fontSize: '1.1rem' }}>Audit and manage all visual assets uploaded by users.</p>
                </div>
                <button onClick={fetchMedia} className="btn-action" style={{ padding: '14px 20px', borderRadius: '16px' }}>↻ Refresh Gallery</button>
            </div>

            <div className="admin-card" style={{ padding: '32px' }}>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '100px', color: 'var(--admin-text-muted)' }}>
                        <div className="dot" style={{ margin: '0 auto 16px', width: '8px', height: '8px' }}></div>
                        Fetching media from storage...
                    </div>
                ) : files.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '24px' }}>
                        {files.map((file) => (
                            <div key={file.id || file.name} className="admin-card" style={{ overflow: 'hidden', border: 'none', background: 'white', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                                <div style={{ height: '220px', position: 'relative', background: '#f8fafc' }}>
                                    {file.metadata?.mimetype?.includes('video') ? (
                                        <video src={file.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <img src={file.url} alt={file.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    )}
                                    <div style={{ 
                                        position: 'absolute', 
                                        top: '12px', 
                                        right: '12px', 
                                        background: 'rgba(255, 255, 255, 0.95)', 
                                        padding: '6px 12px', 
                                        borderRadius: '10px', 
                                        fontSize: '0.65rem', 
                                        fontWeight: 800,
                                        color: 'var(--admin-primary)',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em',
                                        boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
                                    }}>
                                        {file.folder}
                                    </div>
                                    {file.metadata?.mimetype?.includes('video') && (
                                        <div style={{ position: 'absolute', bottom: '12px', left: '12px', background: 'rgba(0,0,0,0.4)', color: 'white', padding: '4px 8px', borderRadius: '6px', fontSize: '0.7rem' }}>
                                            Video 🎬
                                        </div>
                                    )}
                                </div>
                                <div style={{ padding: '20px' }}>
                                    <div style={{ 
                                        fontSize: '0.8rem', 
                                        color: 'var(--admin-text)', 
                                        fontWeight: 600,
                                        marginBottom: '6px', 
                                        overflow: 'hidden', 
                                        textOverflow: 'ellipsis', 
                                        whiteSpace: 'nowrap',
                                        fontFamily: 'monospace'
                                    }}>
                                        {file.name}
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)', fontWeight: 500 }}>
                                            {(file.metadata?.size / 1024 / 1024).toFixed(2)} MB
                                        </span>
                                        <button 
                                            onClick={() => handleDelete(file.folder, file.name)}
                                            className="btn-action btn-delete"
                                            style={{ padding: '6px 10px', fontSize: '0.75rem' }}
                                        >
                                            🗑️ Erase
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '100px', color: 'var(--admin-text-muted)' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📁</div>
                        <h3>No media found</h3>
                        <p>Total vacuum in the 'love_media' bucket.</p>
                    </div>
                )}
            </div>
        </AdminLayout>
    )
}
