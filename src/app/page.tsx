'use client'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useHeroEffects } from '@/hooks/useHeroEffects'
import Link from 'next/link'
import Image from 'next/image'

export default function HomePage() {
  useHeroEffects()

  return (
    <>
      <div id="heart-container"></div>
      <div id="hero-particles"></div>

      <Navbar />

      <main>
        <div className="toast-container" id="toastContainer"></div>

        {/* ── HERO SECTION ── */}
        <section id="hero">
          <div className="bg-words" id="bgWords"></div>
          <div className="bg-shapes" id="bgShapes"></div>
          <div className="hero-bg"></div>
          <div className="hero-overlay"></div>
          <div className="floating-phrases" id="floatingPhrases"></div>
          <div className="chat-bubbles" id="chatBubbles"></div>

          <div className="hero-content container">
            <div className="hero-eyebrow reveal-up">
              <span className="eyebrow-dot">♥</span>
              The world&apos;s most personal digital gift
            </div>

            <h1 className="hero-title reveal-up" style={{ transitionDelay: '0.1s' }}>
              Turn Feelings Into <em>Unforgettable</em> Moments.
            </h1>

            <p className="hero-sub reveal-up" style={{ transitionDelay: '0.2s' }}>
              Create a private Love Code your partner unlocks — filled with
              animations, memories, and emotions they&apos;ll never forget.
            </p>

            <div className="hero-actions reveal-up" style={{ transitionDelay: '0.3s' }}>
              <Link href="/create" className="btn-primary hero-cta">
                <span>♥</span> Create Your Love Code
              </Link>
              <a href="#examples" className="btn-outline-hero">View Demo</a>
            </div>

            <div className="hero-trust reveal-up" style={{ transitionDelay: '0.4s' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--rose-light)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l-5-4.87 6.91-1.01L12 2z"></path>
                </svg>
                500+ Love Codes Sent
              </span>
              <span className="trust-dot">·</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--rose-light)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
                4.9 Star Rating
              </span>
              <span className="trust-dot">·</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--rose-light)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                End-To-End-Encrypted
              </span>
            </div>
          </div>
        </section>

        {/* ── JOURNEY SECTION ── */}
        <section id="journey">
          <div id="jrn-pts"></div>

          <div className="jrn-gateway">
            <p className="jrn-gw-q" id="jrn-gq">
              &quot;Every love story is beautiful.<br />
              But yours should be <em>unforgettable.</em>&quot;
            </p>
            <div className="jrn-gw-line"></div>
            <p className="jrn-gw-s">Scroll to experience it</p>
          </div>

          <div className="jrn-head" id="jrn-sh">
            <div className="jrn-eyebrow">♥ A Journey Through Love</div>
            <h2 className="jrn-title">Feel Every <em>Chapter</em><br />of Your Story</h2>
            <p className="jrn-sub">Real moments. Real emotions. The kind of love that deserves to be remembered forever.</p>
          </div>

          {/* PAIR 1 */}
          <div className="jrn-wrap">
            <div className="jrn-pair">
              <div className="jrn-img">
                <Image src="/images/gallery/img_1.jpg" alt="Couple laughing in park" width={600} height={400} />
                <div className="jrn-img-cap">
                  <div className="jrn-img-tag">🌿 Joy &amp; Laughter</div>
                  <div className="jrn-img-q">&quot;The way you laugh is my favourite sound in the world.&quot;</div>
                </div>
              </div>
              <div className="jrn-story">
                <div className="jrn-story-name">Arjun S. · Mumbai</div>
                <div className="jrn-story-title">&quot;She cried for 10 minutes straight.&quot;</div>
                <div className="jrn-story-body">&quot;I&apos;d been planning it for 3 weeks. Collected every photo from her camera roll, our old WhatsApp chats, even a selfie from our first date she thought she&apos;d deleted. When she opened the Love Code that night, she sat there silently at first — then the tears came. Best decision of my life.&quot;</div>
                <div className="jrn-story-meta">Sent on their 2nd anniversary · via WhatsApp</div>
              </div>
            </div>
          </div>

          {/* PAIR 2 — flipped */}
          <div className="jrn-wrap">
            <div className="jrn-pair flip">
              <div className="jrn-img">
                <Image src="/images/gallery/img_2.jpg" alt="Couple dancing in rain" width={600} height={400} />
                <div className="jrn-img-cap">
                  <div className="jrn-img-tag">🌧️ Spontaneous Love</div>
                  <div className="jrn-img-q">&quot;Some of the best moments were never planned.&quot;</div>
                </div>
              </div>
              <div className="jrn-story">
                <div className="jrn-story-name">Vikram K. · New Delhi</div>
                <div className="jrn-story-title">&quot;She called me crying at 2am.&quot;</div>
                <div className="jrn-story-body">&quot;She&apos;s in Dubai. I&apos;m in Delhi. Long distance for 14 months. On our anniversary I sent her a Love Code with every video from our FaceTime calls. She called me at 2am completely broken down. We&apos;re getting married next year.&quot;</div>
                <div className="jrn-story-meta">Long distance · Delhi &amp; Dubai · via Email</div>
              </div>
            </div>
          </div>

          {/* TAGS CARD */}
          <div className="jrn-tags-wrap">
            <div className="jrn-tc" id="jrn-tc">
              <div className="jrn-tc-l">Celebrate Every Moment</div>
              <div className="jrn-tags">
                <span className="jrn-tag">💍 Proposals</span>
                <span className="jrn-tag">🎂 Birthdays</span>
                <span className="jrn-tag">💌 Long Distance</span>
                <span className="jrn-tag">🌅 Anniversaries</span>
                <span className="jrn-tag">🕯️ Just Because</span>
                <span className="jrn-tag">🌙 Midnight Surprises</span>
                <span className="jrn-tag">✈️ Reunions</span>
              </div>
            </div>
          </div>

          {/* PAIR 3 */}
          <div className="jrn-wrap">
            <div className="jrn-pair">
              <div className="jrn-img">
                <Image src="/images/gallery/img_3.jpg" alt="Indian couple with candles" width={600} height={400} />
                <div className="jrn-img-cap">
                  <div className="jrn-img-tag">🕯️ Intimacy</div>
                  <div className="jrn-img-q">&quot;In the warmth of us, I found my forever.&quot;</div>
                </div>
              </div>
              <div className="jrn-story">
                <div className="jrn-story-name">Priya R. · Bengaluru</div>
                <div className="jrn-story-title">&quot;I couldn&apos;t breathe.&quot;</div>
                <div className="jrn-story-body">&quot;Our anniversary. He handed me his phone mid-dinner, no explanation. The Love Code started playing — our entire journey together, set to the song from our first road trip. I still watch it when I miss him, even though he&apos;s right next to me.&quot;</div>
                <div className="jrn-story-meta">3rd anniversary · Bengaluru · via WhatsApp</div>
              </div>
            </div>
          </div>

          {/* STORY BREAK */}
          <div className="jrn-sb" id="jrn-sb1">
            <div className="jrn-sb-line"></div>
            <p className="jrn-sb-q">&quot;She opened the link at midnight.<br />She hasn&apos;t stopped <em>smiling</em> since.&quot;</p>
            <p className="jrn-sb-sub">— A real Love Bites story · Mumbai, India</p>
            <div className="jrn-sb-line" style={{ marginTop: '1.5rem', marginBottom: 0 }}></div>
          </div>

          {/* PAIR 4 — flipped */}
          <div className="jrn-wrap">
            <div className="jrn-pair flip">
              <div className="jrn-img">
                <Image src="/images/gallery/img_4.jpg" alt="Anniversary dinner" width={600} height={400} />
                <div className="jrn-img-cap">
                  <div className="jrn-img-tag">🥂 Anniversaries</div>
                  <div className="jrn-img-q">&quot;To us. To every year we choose each other again.&quot;</div>
                </div>
              </div>
              <div className="jrn-story">
                <div className="jrn-story-name">Rohit M. · Hyderabad</div>
                <div className="jrn-story-title">&quot;She said yes before I even finished.&quot;</div>
                <div className="jrn-story-body">&quot;I created the Love Code 2 hours before I proposed. At the restaurant I handed her my phone before getting down on one knee. She watched the whole thing, then looked up at me with tears streaming — and said yes before I&apos;d even reached into my pocket for the ring.&quot;</div>
                <div className="jrn-story-meta">Proposal night · Hyderabad · via Love Code link</div>
              </div>
            </div>
          </div>

          {/* HOW IT REACHES THEM */}
          <div className="jrn-how" id="how-it-works">
            <div className="jrn-how-lbl">♥ How Love Bites Reaches Them</div>
            <div className="jrn-how-grid">
              <div className="jrn-hw">
                <Image src="/images/gallery/image_5.jpeg" alt="WhatsApp notification" width={400} height={300} />
                <div className="jrn-hw-info">
                  <div className="jrn-hw-step">Step 01</div>
                  <div className="jrn-hw-title">WhatsApp Notification</div>
                  <div className="jrn-hw-desc">Your partner gets a message from Love Bites&apos; verified business account — personal and instant.</div>
                </div>
              </div>
              <div className="jrn-hw">
                <Image src="/images/gallery/image_6.jpeg" alt="Love Bites email" width={400} height={300} />
                <div className="jrn-hw-info">
                  <div className="jrn-hw-step">Step 02</div>
                  <div className="jrn-hw-title">Beautiful Email Delivery</div>
                  <div className="jrn-hw-desc">A cinematic email lands in their inbox — personal, not promotional. Designed to feel special from the very first glance.</div>
                </div>
              </div>
              <div className="jrn-hw">
                <Image src="/images/gallery/image_7.png" alt="Love Code experience" width={400} height={300} />
                <div className="jrn-hw-info">
                  <div className="jrn-hw-step">Step 03</div>
                  <div className="jrn-hw-title">They Feel Every Moment</div>
                  <div className="jrn-hw-desc">Animations, music, and your memories create an experience they will never, ever forget.</div>
                </div>
              </div>
            </div>
          </div>

          {/* FINAL CTA */}
          <div className="jrn-cta" id="jrn-cta">
            <p className="jrn-cta-e">Your love story deserves to be remembered</p>
            <h2 className="jrn-cta-t">&quot;Ready to create a moment<br />they&apos;ll never forget?&quot;</h2>
            <Link href="/create" className="jrn-cta-btn">♥ Create Your Love Code</Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
