'use client'



import React, { useState, useEffect, useRef } from 'react'

import { useParams, useRouter } from 'next/navigation'

import './view.css'



// --- THEME DATA MAPPED DIRECTLY FROM LEGACY ---

const THEMES: Record<string, any> = {

    'Anniversary 💍': { cls: 'theme-anniversary', heart: '♥', lockIcon: '🔒', burstEmoji: ['♥', '✨', '💛', '🌟'], petals: ['✨', '🌟', '💫', '⭐'], petalCount: 15, particleColor: 'rgba(201,168,76,', toLabel: 'A Love Code — Just For You', pill: '💍 Anniversary', eyebrow: '♥ Every chapter of us', s2title: 'The moments that make<br/><em>us, us.</em>', finalTitle: 'Always & Forever', finalQuote: '"You are every love story<br/>I ever wanted to <em>live.</em>"', photoStyle: ['style-polaroid', 'style-polaroid', 'style-polaroid', 'style-polaroid', 'style-polaroid'], tags: ['💍 First Date', '✈️ Trip Together', '🎂 Birthday', '🌙 Everyday', '⭐ Memory'], quotes: ['"The night everything changed."', '"Our world, just for a while."', '"Another year of you."', '"The quiet ones are my favourite."', '"Every moment with you counts."'], captions: ['I still remember exactly how you looked. The way you smiled like you already knew.', 'Between the airport chaos and sunsets — I realized I want every road with you.', 'Celebrating you is the easiest thing. You make every day feel like a reason.', 'Not every moment needs a stage. Some of my best are just — you, being you.', 'Every single moment with you is one I\'d choose again.'], placeholderEmojis: ['🌅', '🏝️', '🎂', '🕯️', '💝'], placeholderClasses: ['p1', 'p2', 'p3', 'p4', 'p5'] },

    'Birthday 🎂': { cls: 'theme-birthday', heart: '🎂', lockIcon: '🎂', burstEmoji: ['🎉', '🎈', '✨', '🎊'], petals: ['🎉', '🎈', '⭐', '✨', '🌟'], petalCount: 25, particleColor: 'rgba(255,107,53,', toLabel: 'A Birthday Surprise — Just For You', pill: '🎂 Happy Birthday!', eyebrow: '🎂 All the moments that made you, you', s2title: 'A year full of<br/><em>beautiful memories.</em>', finalTitle: 'Happy Birthday, Beautiful', finalQuote: '"Another year of you —<br/>the world\'s greatest <em>gift.</em>"', photoStyle: ['style-polaroid', 'style-polaroid', 'style-polaroid', 'style-polaroid', 'style-polaroid'], tags: ['🎂 Birthday Moment', '🎉 Celebration', '🌟 Memory', '🎈 Together', '💝 Special'], quotes: ['"Every year you get more wonderful."', '"This one\'s for you, superstar."', '"Another trip around the sun."', '"The best thing about your birthday? You."', '"Here\'s to you, always."'], captions: ['Another year of knowing you — and somehow it only gets better.', 'You make every celebration feel like the best one yet.', 'The way you light up a room hasn\'t changed one bit.', 'I\'m so lucky to get to celebrate you.', 'Happy birthday to the person who makes ordinary days extraordinary.'], placeholderEmojis: ['🎉', '🎈', '🌟', '🎊', '🎂'], placeholderClasses: ['p2', 'p3', 'p1', 'p4', 'p5'] },

    "Valentine's Day 💝": { cls: 'theme-valentine', heart: '💝', lockIcon: '💝', burstEmoji: ['💝', '🌹', '❤️', '💕'], petals: ['🌹', '💕', '❤️', '🌸', '💗'], petalCount: 30, particleColor: 'rgba(232,68,90,', toLabel: 'A Valentine — Just For You', pill: "💝 Valentine's Day", eyebrow: '❤️ Every reason I love you', s2title: 'The love between<br/><em>you and me.</em>', finalTitle: 'Be My Valentine', finalQuote: '"You are the reason<br/>love feels like <em>magic.</em>"', photoStyle: ['style-polaroid', 'style-polaroid', 'style-polaroid', 'style-polaroid', 'style-polaroid'], tags: ['❤️ First Date', '💕 Together', '🌹 Romance', '💗 Everyday', '✨ Special'], quotes: ['"The night I knew you were everything."', '"Together is my favourite place."', '"You make love feel easy."', '"Every day feels like Valentine\'s."', '"Endlessly, hopelessly — yours."'], captions: ['From the very first moment, I knew you were something different.', 'Being with you is the easiest and best thing I\'ve ever done.', 'You make love feel simple and beautiful.', 'I fall for you a little more every single day.', 'This day, every day — you\'re my person.'], placeholderEmojis: ['🌹', '💕', '❤️', '💗', '🌸'], placeholderClasses: ['p1', 'p3', 'p2', 'p4', 'p5'] },

    'Just Because 🌸': { cls: 'theme-justbecause', heart: '🌸', lockIcon: '🌸', burstEmoji: ['🌸', '💜', '✨', '💫'], petals: ['🌸', '🌷', '💜', '✨', '🌺'], petalCount: 20, particleColor: 'rgba(192,132,252,', toLabel: 'A Little Something — Just Because', pill: '🌸 Just Because', eyebrow: '🌸 The small moments that mean everything', s2title: 'No reason needed —<br/><em>just you.</em>', finalTitle: 'Just Because I Love You', finalQuote: '"No occasion needed<br/>to love you <em>endlessly.</em>"', photoStyle: ['style-polaroid', 'style-polaroid', 'style-polaroid', 'style-polaroid', 'style-polaroid'], tags: ['🌸 A Random Day', '☕ Morning', '🌙 Quiet Night', '💜 Just Us', '✨ This Moment'], quotes: ['"No reason — just you."', '"A random day and yet — perfect."', '"The small moments are the best."', '"Just because you deserve this."', '"Because every day with you counts."'], captions: ['You don\'t need a reason to be celebrated. You just do.', 'Some of my favourite days are ones where nothing special happened — except you.', 'The quiet in-between moments with you are my favourite.', 'I made this for no reason except that I love you.', 'Because you deserve to be reminded, always.'], placeholderEmojis: ['🌸', '🌷', '💜', '✨', '🌙'], placeholderClasses: ['p2', 'p1', 'p4', 'p3', 'p5'] },

    'Apology 🥺': { cls: 'theme-apology', heart: '🤍', lockIcon: '🥺', burstEmoji: ['🤍', '🌸', '✨', '💗'], petals: ['🌸', '🤍', '✨', '🕊️'], petalCount: 10, particleColor: 'rgba(249,168,201,', toLabel: 'From My Heart — To Yours', pill: '🥺 From the Heart', eyebrow: '🤍 The moments I treasure most', s2title: 'The us I never<br/><em>want to lose.</em>', finalTitle: "I'm Sorry. I Mean It.", finalQuote: '"What we have is worth<br/>more than my <em>pride.</em>"', photoStyle: ['style-polaroid', 'style-polaroid', 'style-polaroid', 'style-polaroid', 'style-polaroid'], tags: ['🤍 A Good Memory', '🌸 When We Laughed', '☀️ A Happy Day', '💗 Us at Our Best', '✨ Why You Matter'], quotes: ['"This is what I never want to lose."', '"Remember this? Me too, always."', '"Our best days — I want more."', '"You matter more than I showed."', '"I\'m sorry. And I mean every word."'], captions: ['I keep coming back to the good times and remembering what we are.', 'I never want to take what we have for granted again.', 'This is the us I want to protect.', 'You deserve someone who shows up. I\'m going to be that person.', 'I\'m sorry. Not because I have to — but because you deserve to hear it.'], placeholderEmojis: ['🤍', '🌸', '☀️', '💗', '✨'], placeholderClasses: ['p1', 'p2', 'p3', 'p4', 'p5'] }

}



export default function ViewLoveCodePage() {

    const params = useParams()

    const router = useRouter()

    const code = Array.isArray(params?.code) ? params.code[0] : params?.code



    const [data, setData] = useState<any>(null)

    const [loading, setLoading] = useState(true)

    const [unlocked, setUnlocked] = useState(false)

    const [unlockingAnim, setUnlockingAnim] = useState(false)



    const [pin, setPin] = useState(['', '', '', ''])

    const [themeConfig, setThemeConfig] = useState<any>(null)

    const [error, setError] = useState('')

    const [isShaking, setIsShaking] = useState(false)



    // Heart Burst ref to spawn hearts dynamically

    const burstRef = useRef<HTMLDivElement>(null)



    useEffect(() => {

        async function fetchData() {

            if (!code) return

            try {

                const res = await fetch(`/api/get-love-code/${code}`)

                const json = await res.json()



                if (json.success) {

                    setData(json.data)

                    const occasion = json.data.occasion

                    setThemeConfig(THEMES[occasion] || THEMES['Anniversary 💍'])

                } else {

                    // Fallback to localStorage exactly like legacy `love-view.html` 

                    // did if there was no server.

                    const localData = localStorage.getItem('loveFlowData')

                    if (localData) {

                        const parsed = JSON.parse(localData)

                        const localPhotos = JSON.parse(localStorage.getItem('lovePhotos') || '[]')

                        setData({

                            code: parsed.code || code,

                            recipient_name: parsed.partnerName,

                            occasion: parsed.occasion,

                            mood: parsed.mood,

                            message: parsed.openingMessage,

                            lock_pin: '0000', // fallback pin if using localstorage

                            lock_hint: parsed.unlockHint,

                            photo_urls: localPhotos

                        })

                        setThemeConfig(THEMES[parsed.occasion] || THEMES['Anniversary 💍'])

                    } else {

                        setError(json.error || 'Code not found')

                    }

                }

            } catch (err) {

                console.error(err)

                setError('Error loading Love Code')

            } finally {

                setLoading(false)

            }

        }

        fetchData()

    }, [code])



    useEffect(() => {

        if (themeConfig?.cls) {

            document.body.className = themeConfig.cls

        }

        return () => { document.body.className = '' }

    }, [themeConfig])



    // --- Scroll Intersection Observer for Photos ---

    useEffect(() => {

        if (unlocked) {

            const els = document.querySelectorAll('.photo-moment, .final-wrap')

            const obs = new IntersectionObserver((entries) => {

                entries.forEach((e) => {

                    if (e.isIntersecting) e.target.classList.add('visible')

                })

            }, { threshold: 0.15 })

            els.forEach((m) => obs.observe(m))



            return () => obs.disconnect()

        }

    }, [unlocked])



    const handlePinChange = (index: number, val: string) => {

        const cleaned = val.replace(/[^0-9]/g, '')

        const newPin = [...pin]

        newPin[index] = cleaned

        setPin(newPin)



        // Only move to next input if we actually entered a number

        if (cleaned && index < 3) {

            const nextInput = document.getElementById(`vd-${index + 1}`)

            if (nextInput) nextInput.focus()

        }

        if (isShaking) setIsShaking(false)

    }



    const handleBackspace = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {

        if (e.key === 'Backspace' && !pin[index] && index > 0) {

            const prevInput = document.getElementById(`vd-${index - 1}`)

            if (prevInput) prevInput.focus()

        }

    }



    const unlock = () => {

        const entered = pin.join('')

        // In legacy, any code unlocked if no backend. We enforce pin if it exists in data

        if (data?.lock_pin && entered !== data.lock_pin && data.lock_pin.length === 4) {

            setIsShaking(true)

            setTimeout(() => setIsShaking(false), 600)

            setPin(['', '', '', ''])

            return

        }



        setUnlockingAnim(true)



        // Spawn Burst Hearts

        if (burstRef.current && themeConfig) {

            burstRef.current.style.display = 'block'

            const cx = window.innerWidth / 2

            const cy = window.innerHeight / 2

            for (let i = 0; i < 36; i++) {

                const h = document.createElement('div')

                h.className = 'burst-heart'

                const angle = (Math.PI * 2 / 36) * i

                const dist = 120 + Math.random() * 250

                h.style.left = cx + 'px'

                h.style.top = cy + 'px'

                h.style.setProperty('--tx', (Math.cos(angle) * dist) + 'px')

                h.style.setProperty('--ty', (Math.sin(angle) * dist) + 'px')

                h.style.animationDelay = `${Math.random() * 0.4}s`

                h.style.fontSize = `${0.8 + Math.random() * 2}rem`

                h.textContent = themeConfig.burstEmoji[Math.floor(Math.random() * themeConfig.burstEmoji.length)]

                burstRef.current.appendChild(h)

            }

        }



        setTimeout(() => setUnlocked(true), 1200)

    }



    const handleSendClick = () => {

        router.push(`/checkout/${code}`)

    }



    if (loading) return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg1)', color: 'var(--text)' }}>Loading Love Code...</div>

    if (error || !data || !themeConfig) return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg1)', color: 'var(--text)' }}><h2>{error || 'Not Found'}</h2></div>



    const photos = data.photo_urls && data.photo_urls.length > 0 ? data.photo_urls : ['p1', 'p2', 'p3', 'p4', 'p5'] // Default placeholders if NO photos



    return (

        <>

            {/* petal-field background animation removed as requested */}



            <div id="heartBurst" ref={burstRef}></div>



            {/* --- LOCK SCREEN --- */}

            {!unlocked && (

                <div id="lockScreen" className={unlockingAnim ? 'unlocking' : ''}>

                    <p className="lock-logo">♥ Love Bites</p>

                    <div className="lock-icon">{themeConfig.lockIcon}</div>

                    <h2 className="lock-title">Someone left you<br /><em>something special</em></h2>

                    <p className="lock-sub">Enter your secret code to unlock it</p>



                    <div className={`lock-digits ${isShaking ? 'shake' : ''}`}>

                        {[0, 1, 2, 3].map(i => (

                            <input

                                key={i}

                                id={`vd-${i}`}

                                className={`lock-digit ${isShaking ? 'has-error' : ''}`}

                                maxLength={1}

                                type="text"

                                placeholder="·"

                                value={pin[i]}

                                onChange={e => handlePinChange(i, e.target.value)}

                                onKeyDown={e => handleBackspace(e, i)}

                            />

                        ))}

                    </div>



                    <p className={`lock-hint ${isShaking ? 'has-error' : ''}`}>

                        {isShaking ? "Oops! That's not the secret code 🥺" : (data.lock_hint ? `Hint: ${data.lock_hint}` : 'Hint: A 4 digit code they shared')} 💌

                    </p>



                    <button

                        className="unlock-btn"

                        onClick={unlock}

                        disabled={pin.join('').length !== 4 && !!data.lock_pin}

                    >

                        {themeConfig.heart} Open Your Surprise

                    </button>

                </div>

            )}



            {/* --- UNLOCKED EXPERIENCE --- */}

            {unlocked && (

                <div id="experience" style={{ display: 'flex' }}>



                    <section id="scene1">

                        {/* scene1-particles background animation removed as requested */}



                        <div className="quote-wrap">

                            <p className="to-label">{themeConfig.toLabel}</p>

                            <h1 className="to-name">{data.recipient_name || 'Someone Special'}</h1>

                            <p className="opening-quote" dangerouslySetInnerHTML={{ __html: data.message }}></p>

                            <div className="mood-pill">{themeConfig.pill} {data.mood ? `· ${data.mood}` : ''}</div>



                            <div className="scroll-cue">

                                <span>Your moments</span>

                                <div className="scroll-arrow"></div>

                            </div>

                        </div>

                    </section>



                    <section id="scene2">

                        <div className="scene2-header">

                            <p className="scene2-eyebrow">{themeConfig.eyebrow}</p>

                            <h2 className="scene2-title" dangerouslySetInnerHTML={{ __html: themeConfig.s2title }}></h2>

                        </div>



                        <div className="photo-sequence">

                            {photos.map((src: string, i: number) => {

                                const pStyle = themeConfig.photoStyle[i] || 'style-polaroid'

                                const isReal = src.startsWith('http') || src.startsWith('data:')



                                return (

                                    <React.Fragment key={i}>

                                        {i > 0 && (

                                            <div className="moment-divider">

                                                <span>{themeConfig.heart}</span>

                                            </div>

                                        )}



                                        <div className={`photo-moment ${pStyle}`} data-idx={i % 2}>

                                            <div className="moment-inner">

                                                <div className="moment-img">

                                                    {isReal ? (

                                                        // eslint-disable-next-line @next/next/no-img-element

                                                        <img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="memory" />

                                                    ) : (

                                                        <div className={`moment-img-placeholder ${themeConfig.placeholderClasses[i]}`} style={{ aspectRatio: pStyle === 'style-polaroid' ? '1/1' : '4/5', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '5rem' }}>

                                                            {themeConfig.placeholderEmojis[i]}

                                                        </div>

                                                    )}

                                                    {pStyle === 'style-polaroid' && <div className="polaroid-caption">{themeConfig.tags[i]}</div>}

                                                </div>



                                                <div className="moment-text">

                                                    <p className="moment-number">Moment 0{i + 1}</p>

                                                    <div className="moment-tag">{themeConfig.tags[i] || '♥ Memory'}</div>

                                                    <p className="moment-quote">{themeConfig.quotes[i] || '"A moment just for us."'}</p>

                                                    <p className="moment-caption">{themeConfig.captions[i] || ''}</p>

                                                </div>

                                            </div>

                                        </div>

                                    </React.Fragment>

                                )

                            })}

                        </div>

                    </section>



                    <section id="scene3">

                        <div className="final-particles">

                            {[...Array(20)].map((_, i) => (

                                <div

                                    key={i}

                                    className="s1-particle"

                                    style={{

                                        left: `${Math.random() * 100}%`,

                                        bottom: 0,

                                        width: `${2 + Math.random() * 4}px`,

                                        height: `${2 + Math.random() * 4}px`,

                                        background: `${themeConfig.particleColor}${0.4 + Math.random() * 0.5})`,

                                        animationDuration: `${6 + Math.random() * 8}s`,

                                        animationDelay: `${Math.random() * 5}s`,

                                        zIndex: 5

                                    }}

                                />

                            ))}

                        </div>



                        <div className="final-wrap">

                            <div className="final-heart">{themeConfig.heart}</div>

                            <p className="final-title">{themeConfig.finalTitle}</p>

                            <p className="final-quote" dangerouslySetInnerHTML={{ __html: themeConfig.finalQuote }}></p>

                            <p className="final-names">— With everything {themeConfig.heart}</p>

                            <p className="final-made">Created with <span>♥</span> on Love Bites</p>

                        </div>

                    </section>



                    {/* --- SHARE SECTION --- */}

                    <section className="share-section">

                        <h2 className="lock-title" style={{ color: 'white' }}>Love the preview?<br /><em>Send it to them now</em></h2>

                        <button className="share-cta-btn" onClick={handleSendClick}>

                            Send to your loved one ♥

                        </button>

                    </section>



                </div>

            )}



        </>

    )

}

