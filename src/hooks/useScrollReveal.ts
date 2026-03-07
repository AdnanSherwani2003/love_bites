'use client'

import { useEffect } from 'react'

export function useScrollReveal() {
    useEffect(() => {
        const io = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add('v')
                    e.target.classList.add('revealed')
                }
            })
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' })

        const revealTargets = document.querySelectorAll(
            '#journey, .jrn-pair, .jrn-tc, .jrn-head, .jrn-sb, .jrn-how, .jrn-cta, .jrn-gw-q, #occasions, .occasion-card, #pricing, .plan-card, #about, .reveal-up, .animate-on-scroll'
        )
        revealTargets.forEach(el => io.observe(el))

        return () => {
            io.disconnect()
        }
    }, [])
}
