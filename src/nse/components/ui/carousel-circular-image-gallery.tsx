"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { FaLinkedin } from "react-icons/fa"

interface TeamMember {
  name: string
  designation: string
  image: string
  linkedin: string
}

const team: TeamMember[] = [
  { name: "Deepak Dash",            designation: "Founder & Managing Director",      image: "/deepak.png",    linkedin: "https://www.linkedin.com/in/deepak-dash-783bb123" },
  { name: "Dhruv Dash",             designation: "Founder & Director",               image: "/cof&.png",      linkedin: "https://www.linkedin.com/in/dhruv-dash/" },
  { name: "Brigadier Inder Sethi",  designation: "Head of Global Strategy",          image: "/head&s.png",    linkedin: "https://www.linkedin.com/in/brigindersethi" },
  { name: "Mohan Srinivas Kanala",  designation: "Chief Technology Officer",         image: "/cto.jpeg",      linkedin: "https://www.linkedin.com/in/kanalamohan/" },
  { name: "Prachi Bothra",          designation: "Head of PR & CSR",                 image: "/csr2.jpeg",     linkedin: "" },
  { name: "Satish Peddada",         designation: "Head of AI & Transformation",      image: "/ai&t.png",      linkedin: "" },
  { name: "Ravindra Appasani",      designation: "Head of Venture Capital Advisory", image: "/head&vc2.png",  linkedin: "https://www.linkedin.com/in/ravindraappasani/" },
  { name: "Bhabani Shankar",        designation: "Head of Governance",               image: "/dirr.png",      linkedin: "" },
  { name: "Sudhakar Peddada",       designation: "Chief Operating Officer",          image: "/coo.png",       linkedin: "https://www.linkedin.com/in/sudhakarpeddada" },
  { name: "CA Lakshminath Kothuri", designation: "Chief Financial Officer",          image: "/head&fin.png",  linkedin: "https://www.linkedin.com/in/loka-lakshminath-k-79bb6b47/" },
  { name: "Kaluguri Manikanta",     designation: "Product Manager & Tech Architect", image: "/mani2.jpeg",    linkedin: "https://www.linkedin.com/in/kaluguri-manikanta-21419a287/" },
]

declare global {
  interface Window { gsap: any; MotionPathPlugin: any }
}

/* ── Text reveal animation styles injected once ── */
const STYLE_ID = "team-reveal-styles"
const injectStyles = () => {
  if (document.getElementById(STYLE_ID)) return
  const s = document.createElement("style")
  s.id = STYLE_ID
  s.textContent = `
    @keyframes revealUp {
      from { opacity: 0; transform: translateY(18px); clip-path: inset(0 0 100% 0); }
      to   { opacity: 1; transform: translateY(0);    clip-path: inset(0 0 0% 0); }
    }
    .reveal-name  { animation: revealUp 0.45s cubic-bezier(0.22,1,0.36,1) 0.05s both; }
    .reveal-role  { animation: revealUp 0.45s cubic-bezier(0.22,1,0.36,1) 0.15s both; }
    .reveal-link  { animation: revealUp 0.45s cubic-bezier(0.22,1,0.36,1) 0.25s both; }
  `
  document.head.appendChild(s)
}

export function TeamCarouselGallery() {
  const [current, setCurrent]   = useState(0)
  const [animKey, setAnimKey]   = useState(0)   // bump to re-trigger text animation
  const [gsapReady, setGsapReady] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const [inPlace, setInPlace]   = useState(0)
  const autoplayTimer = useRef<number | null>(null)

  useEffect(() => { injectStyles() }, [])

  /* Load GSAP from CDN */
  useEffect(() => {
    if (window.gsap && window.MotionPathPlugin) {
      window.gsap.registerPlugin(window.MotionPathPlugin); setGsapReady(true); return
    }
    const g = document.createElement("script")
    g.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"
    g.onload = () => {
      const m = document.createElement("script")
      m.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/MotionPathPlugin.min.js"
      m.onload = () => { window.gsap?.registerPlugin(window.MotionPathPlugin); setGsapReady(true) }
      document.body.appendChild(m)
    }
    document.body.appendChild(g)
  }, [])

  const goTo = useCallback((idx: number) => {
    if (disabled) return
    setDisabled(true)
    setCurrent(idx)
    setAnimKey(k => k + 1)
  }, [disabled])

  const next = useCallback(() => goTo((current + 1) % team.length), [current, goTo])
  const prev = useCallback(() => goTo((current - 1 + team.length) % team.length), [current, goTo])

  const onInPlace = (i: number) => { setInPlace(i); setDisabled(false) }

  /* Autoplay */
  useEffect(() => {
    if (!gsapReady) return
    if (autoplayTimer.current) clearInterval(autoplayTimer.current)
    autoplayTimer.current = window.setInterval(next, 4500)
    return () => { if (autoplayTimer.current) clearInterval(autoplayTimer.current) }
  }, [current, gsapReady, next])

  const member = team[inPlace]

  return (
    <div style={{ background: "#fff", padding: "48px 24px 40px", display: "flex", flexDirection: "column", alignItems: "center" }}>

      {/* Circular image frame — no card, just circle */}
      <div style={{ position: "relative", width: "min(72vmin, 480px)", height: "min(72vmin, 480px)" }}>

        {/* GSAP animated layers */}
        {gsapReady && team.map((m, i) => (
          <div key={i} style={{
            position: "absolute", inset: 0,
            borderRadius: "50%",
            overflow: "hidden",
            zIndex: inPlace === i ? i : team.length + 1,
          }}>
            <GalleryImage
              total={team.length} id={i} url={m.image}
              open={current === i} inPlace={inPlace === i} onInPlace={onInPlace}
            />
          </div>
        ))}

        {/* Text overlay — middle-left on the image */}
        <div key={animKey} style={{
          position: "absolute",
          left: "8%",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: team.length + 10,
          display: "flex",
          flexDirection: "column",
          gap: "4px",
          pointerEvents: "none",
        }}>
          {/* Dark semi-transparent backdrop for readability */}
          <div style={{
            position: "absolute",
            inset: "-12px -16px -12px -12px",
            background: "rgba(0,0,0,0.38)",
            borderRadius: "12px",
            backdropFilter: "blur(4px)",
            zIndex: -1,
          }} />

          <span className="reveal-name" style={{
            color: "#fff",
            fontWeight: 700,
            fontSize: "clamp(13px, 2.2vmin, 18px)",
            fontFamily: "'Georgia', serif",
            lineHeight: 1.2,
            whiteSpace: "nowrap",
          }}>
            {member.name}
          </span>

          <span className="reveal-role" style={{
            color: "rgba(255,255,255,0.80)",
            fontSize: "clamp(10px, 1.6vmin, 13px)",
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
            lineHeight: 1.4,
            maxWidth: "160px",
            whiteSpace: "normal",
          }}>
            {member.designation}
          </span>

          {member.linkedin ? (
            <a
              className="reveal-link"
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                marginTop: "6px",
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                color: "#fff",
                fontSize: "clamp(10px, 1.5vmin, 12px)",
                fontFamily: "'Helvetica Neue', Arial, sans-serif",
                fontWeight: 600,
                textDecoration: "none",
                pointerEvents: "auto",
                width: "fit-content",
              }}
            >
              <span style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                background: "#0a66c2", borderRadius: "50%", width: "22px", height: "22px",
              }}>
                <FaLinkedin size={12} color="#fff" />
              </span>
              LinkedIn
            </a>
          ) : (
            <span className="reveal-link" style={{ height: "22px" }} />
          )}
        </div>

      </div>

      {/* Photo thumbnail tabs — below the circle */}
      <div style={{ display: "flex", gap: "10px", marginTop: "20px", alignItems: "center", flexWrap: "wrap", justifyContent: "center" }}>
        {team.map((m, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            style={{
              width: i === current ? "52px" : "40px",
              height: i === current ? "52px" : "40px",
              borderRadius: "50%",
              padding: 0,
              border: i === current ? "2.5px solid #111" : "2px solid transparent",
              cursor: "pointer",
              overflow: "hidden",
              flexShrink: 0,
              boxShadow: i === current ? "0 0 0 3px rgba(0,0,0,0.12)" : "0 1px 4px rgba(0,0,0,0.12)",
              transition: "all 0.3s ease",
              background: "#eee",
            }}
            aria-label={m.name}
          >
            <img
              src={m.image}
              alt={m.name}
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", display: "block" }}
              draggable={false}
            />
          </button>
        ))}
      </div>

      {/* Prev / Next */}
      <div style={{ display: "flex", gap: "16px", marginTop: "28px" }}>
        {[{ label: "←", fn: prev }, { label: "→", fn: next }].map(({ label, fn }) => (
          <button key={label} onClick={fn} disabled={disabled}
            style={{
              width: "44px", height: "44px", borderRadius: "50%",
              border: "1.5px solid #ddd", background: "#fff",
              cursor: disabled ? "not-allowed" : "pointer",
              fontSize: "18px", display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              opacity: disabled ? 0.4 : 1,
              transition: "transform 0.15s",
            }}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}

/* ── GalleryImage (GSAP circle-wipe) ── */
interface GalleryImageProps {
  url: string; open: boolean; inPlace: boolean
  id: number; onInPlace: (id: number) => void; total: number
}

function GalleryImage({ url, open, inPlace, id, onInPlace, total }: GalleryImageProps) {
  const [firstLoad, setLoaded] = useState(true)
  const clip = useRef<SVGCircleElement>(null)
  const gap = 8, r = 6, W = 400, H = 400, bigR = r * 700

  const posSmall      = () => ({ cx: W/2 - (total*(r*2+gap)-gap)/2 + id*(r*2+gap), cy: H - 28, r })
  const posSmallAbove = () => ({ cx: W/2 - (total*(r*2+gap)-gap)/2 + id*(r*2+gap), cy: H/2, r: r*2 })
  const posCenter     = () => ({ cx: W/2, cy: H/2, r: r*7 })
  const posEnd        = () => ({ cx: W/2 - bigR, cy: H/2, r: bigR })
  const posStart      = () => ({ cx: W/2 + bigR, cy: H/2, r: bigR })

  useEffect(() => {
    const gsap = window.gsap
    if (!gsap || !clip.current) return
    setLoaded(false)
    const flipD = firstLoad ? 0 : 0.4, upD = firstLoad ? 0 : 0.2
    const bounceD = firstLoad ? 0.01 : 1, delay = firstLoad ? 0 : flipD + upD
    const def = { transformOrigin: "center center" }

    if (open) {
      gsap.timeline()
        .set(clip.current, { ...def, ...posSmall() })
        .to(clip.current,  { ...def, ...posCenter(), duration: upD,   ease: "power3.inOut" })
        .to(clip.current,  { ...def, ...posEnd(),    duration: flipD, ease: "power4.in", onComplete: () => onInPlace(id) })
    } else {
      gsap.timeline({ overwrite: true })
        .set(clip.current, { ...def, ...posStart() })
        .to(clip.current,  { ...def, ...posCenter(), delay, duration: flipD, ease: "power4.out" })
        .to(clip.current,  { ...def, motionPath: { path: [posSmallAbove(), posSmall()], curviness: 1 }, duration: bounceD, ease: "bounce.out" })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  return (
    <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice"
      style={{ width: "100%", height: "100%" }}>
      <defs>
        <clipPath id={`${id}_c`}><circle cx="0" cy="0" r={r} ref={clip} /></clipPath>
        <clipPath id={`${id}_s`}><rect width={W} height={H} /></clipPath>
      </defs>
      <g clipPath={`url(#${id}${inPlace ? "_s" : "_c"})`}>
        <image width={W} height={H} href={url} className="pointer-events-none" />
      </g>
    </svg>
  )
}


