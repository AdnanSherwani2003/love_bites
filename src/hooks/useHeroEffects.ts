'use client'

import { useEffect } from 'react'

// Encapsulates all hero section DOM-based animations from the original app.js
export function useHeroEffects() {
    useEffect(() => {
        let isMounted = true

        // ── FLOATING HEARTS ──
        function createHeart() {
            if (!isMounted) return
            const container = document.getElementById('heart-container')
            if (!container) return
            const heart = document.createElement('div')
            heart.classList.add('heart')
            heart.innerHTML = '♥'
            const startX = Math.random() * window.innerWidth
            const size = Math.random() * 20 + 10
            const duration = Math.random() * 4 + 4
            heart.style.left = `${startX}px`
            heart.style.fontSize = `${size}px`
            heart.style.animationDuration = `${duration}s`
            heart.style.bottom = '-50px'
            container.appendChild(heart)
            setTimeout(() => heart.remove(), duration * 1000)
        }
        const heartInterval = setInterval(createHeart, 300)

        // ── FLOATING PHRASES ──
        const phrases = [
            { text: 'She cried happy tears 😭💕', color: 'rgba(232,68,90,0.12)' },
            { text: 'He proposed with this 💍', color: 'rgba(255,107,128,0.12)' },
            { text: 'Sent at midnight on our anniversary', color: 'rgba(192,41,62,0.08)' },
            { text: 'She said YES 🎉', color: 'rgba(255,182,193,0.2)' },
            { text: 'Made him cry in the best way 💙', color: 'rgba(232,68,90,0.1)' },
            { text: '3 years together 🕯️', color: 'rgba(255,107,128,0.1)' },
            { text: 'Best birthday surprise ever 🎂', color: 'rgba(192,41,62,0.08)' },
            { text: 'Long distance love 💌', color: 'rgba(232,68,90,0.12)' },
            { text: 'Our first year ❤️', color: 'rgba(255,182,193,0.18)' },
            { text: 'I love you to the moon 🌙', color: 'rgba(232,68,90,0.1)' },
        ]
        const zones = [
            { left: '2%', bottom: '-60px' }, { left: '8%', bottom: '-60px' },
            { left: '72%', bottom: '-60px' }, { left: '80%', bottom: '-60px' },
        ]
        function spawnPhrase() {
            const phraseContainer = document.getElementById('floatingPhrases')
            if (!phraseContainer) return
            const p = phrases[Math.floor(Math.random() * phrases.length)]
            const zone = zones[Math.floor(Math.random() * zones.length)]
            const el = document.createElement('div')
            el.className = 'float-phrase'
            el.textContent = p.text
            el.style.cssText = `left:${zone.left};bottom:${zone.bottom};background:${p.color};animation-duration:${Math.random() * 8 + 10}s;animation-delay:0s;`
            phraseContainer.appendChild(el)
            setTimeout(() => el.remove(), 18000)
        }
        const phraseInterval = setInterval(spawnPhrase, 2200)
        setTimeout(() => { spawnPhrase(); spawnPhrase() }, 600)

        // ── CHAT BUBBLES ──
        const conversations = [
            [{ side: 'sender', text: 'I made something special for you 💌', time: '9:41 PM' }, { side: 'receiver', text: 'OMG what is this?? 😭', time: '9:42 PM' }],
            [{ side: 'sender', text: 'Open the link babe 🔗', time: '11:58 PM' }, { side: 'receiver', text: "I'm literally crying right now 😭💕", time: '11:59 PM' }],
            [{ side: 'sender', text: 'Happy anniversary my love 🥂', time: '12:00 AM' }, { side: 'receiver', text: 'This is the most beautiful thing ever ❤️', time: '12:01 AM' }],
            [{ side: 'sender', text: 'Your surprise is ready 🎁', time: '3:30 PM' }, { side: 'receiver', text: 'I will cherish this forever 🙏❤️', time: '3:32 PM' }],
        ]
        let convIndex = 0
        function spawnConversation() {
            const bubbleContainer = document.getElementById('chatBubbles')
            if (!bubbleContainer) return
            const conv = conversations[convIndex % conversations.length]
            convIndex++
            const topBase = Math.random() * 25 + 55
            conv.forEach((msg, i) => {
                setTimeout(() => {
                    const el = document.createElement('div')
                    el.className = `chat-bubble bubble-${msg.side}`
                    const isLeft = msg.side === 'sender'
                    const pos = `${Math.random() * 6 + 2}%`
                    el.style.cssText = `${isLeft ? 'left' : 'right'}:${pos};top:${topBase + i * 8}%;animation-duration:5s;animation-delay:0s;`
                    el.innerHTML = `${msg.text}<div class="bubble-time">${msg.time} ${msg.side === 'sender' ? '✓✓' : ''}</div>`
                    bubbleContainer.appendChild(el)
                    setTimeout(() => el.remove(), 5200)
                }, i * 1200)
            })
        }
        const bubbleInterval = setInterval(spawnConversation, 6000)
        setTimeout(spawnConversation, 1500)

        // ── TOASTS ──
        const toasts = [
            { icon: '💝', iconClass: 'pink', title: "Sarah just opened her Love Code", msg: "She's been on it for 4 minutes 😍", time: 'just now' },
            { icon: '🎉', iconClass: 'gold', title: 'Ahmed sent a Love Code to Priya', msg: 'Anniversary surprise — scheduled for midnight', time: '2m ago' },
            { icon: '😭', iconClass: 'pink', title: 'New reaction received!', msg: '"This made me cry happy tears" 💕', time: '5m ago' },
            { icon: '💍', iconClass: 'gold', title: 'Proposal Love Code created', msg: 'Special delivery scheduled for Saturday', time: '8m ago' },
            { icon: '🔔', iconClass: 'blue', title: 'Your Love Code was opened!', msg: 'Maria just unlocked your message ❤️', time: '12m ago' },
            { icon: '✨', iconClass: 'green', title: '500th Love Code milestone!', msg: 'Our community keeps growing 🎊', time: '1h ago' },
        ]
        let toastIndex = 0
        function showToast() {
            if (!isMounted) return
            const toastContainer = document.getElementById('toastContainer')
            if (!toastContainer) return
            const existing = toastContainer.querySelectorAll<HTMLElement>('.toast.show')
            if (existing.length >= 3) {
                const oldest = existing[0]
                oldest.classList.remove('show')
                oldest.classList.add('hide')
                setTimeout(() => oldest.remove(), 400)
            }
            const data = toasts[toastIndex % toasts.length]
            toastIndex++
            const toast = document.createElement('div')
            toast.className = 'toast'
            toast.innerHTML = `<div class="toast-icon ${data.iconClass}">${data.icon}</div><div class="toast-body"><div class="toast-title">${data.title}</div><div class="toast-msg">${data.msg}</div></div><div class="toast-time">${data.time}</div><div class="toast-progress"></div>`
            toastContainer.appendChild(toast)
            requestAnimationFrame(() => requestAnimationFrame(() => toast.classList.add('show')))
            setTimeout(() => { toast.classList.remove('show'); toast.classList.add('hide'); setTimeout(() => toast.remove(), 400) }, 4500)
        }
        setTimeout(() => showToast(), 800)
        setTimeout(() => showToast(), 3000)
        setTimeout(() => showToast(), 5500)
        const toastInterval = setInterval(showToast, 5000)

        // ── BG SHAPES ──
        const heartChars = ['♥', '♡', '❣️', '❦']
        function spawnBgShape(chars: string[]) {
            if (!isMounted) return
            const bgShapesContainer = document.getElementById('bgShapes')
            if (!bgShapesContainer) return
            const el = document.createElement('div')
            el.className = 'bg-shape heart-shape'
            const char = chars[Math.floor(Math.random() * chars.length)]
            const size = Math.random() * 10 + 6
            const left = Math.random() * 98
            const dur = Math.random() * 14 + 10
            const delay = Math.random() * 8
            el.style.cssText = `left:${left}%;bottom:-20px;font-size:${size}px;color:rgba(232,68,90,0.18);animation-duration:${dur}s;animation-delay:${delay}s;`
            el.textContent = char
            bgShapesContainer.appendChild(el)
            setTimeout(() => el.remove(), (dur + delay) * 1000 + 500)
        }
        for (let i = 0; i < 10; i++) setTimeout(() => spawnBgShape(heartChars), i * 800)
        const bgShapeInterval = setInterval(() => spawnBgShape(heartChars), 1800)

        // ── JOURNEY SECTION: Intersection Observer + 3D tilt ──
        const io = new IntersectionObserver((entries) => {
            entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('v'); e.target.classList.add('revealed') } })
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' })
        const revealTargets = document.querySelectorAll(
            '#journey, .jrn-pair, .jrn-tc, .jrn-head, .jrn-sb, .jrn-how, .jrn-cta, .jrn-gw-q, #occasions, .occasion-card, #pricing, .plan-card, #about, .reveal-up, .animate-on-scroll'
        )
        revealTargets.forEach(el => io.observe(el))

        document.querySelectorAll<HTMLElement>('.jrn-img').forEach(c => {
            c.addEventListener('mousemove', (e) => {
                const r = c.getBoundingClientRect()
                const x = (e.clientX - r.left) / r.width - 0.5
                const y = (e.clientY - r.top) / r.height - 0.5
                c.style.transform = `perspective(800px) rotateY(${x * 7}deg) rotateX(${-y * 7}deg) scale(1.02)`
                c.style.transition = 'none'
            })
            c.addEventListener('mouseleave', () => { c.style.transform = ''; c.style.transition = 'transform .6s ease' })
        })

            // ── FAQ ACCORDION ──
            ; (window as typeof window & { toggleFaq: (btn: HTMLElement) => void }).toggleFaq = function (btn: HTMLElement) {
                const item = btn.parentElement!
                const isOpen = item.classList.contains('open')
                document.querySelectorAll('.faq-item').forEach(el => el.classList.remove('open'))
                if (!isOpen) item.classList.add('open')
            }

        return () => {
            isMounted = false
            clearInterval(heartInterval)
            clearInterval(phraseInterval)
            clearInterval(bubbleInterval)
            clearInterval(toastInterval)
            clearInterval(bgShapeInterval)
            io.disconnect()

            // Clear containers to prevent flash of duplicated old content on remount
            const containers = ['toastContainer', 'chatBubbles', 'floatingPhrases', 'heart-container', 'bgShapes']
            containers.forEach(id => {
                const el = document.getElementById(id)
                if (el) el.innerHTML = ''
            })
        }
    }, [])
}
