"use client"

import React, { useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"

type Ripple = { id: number; x: number; y: number }

export default function PageTransitions({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const lastClick = useRef<{ x: number; y: number } | null>(null)
  const idRef = useRef(0)
  const [ripples, setRipples] = useState<Ripple[]>([])
  const [navOverlay, setNavOverlay] = useState<Ripple | null>(null)

  // global click ripples
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      // ignore right/middle clicks
      if (e.button !== 0) return
      const x = e.clientX
      const y = e.clientY
      const id = ++idRef.current
      lastClick.current = { x, y }
      setRipples((r) => [...r, { id, x, y }])
      // remove after animation
  window.setTimeout(() => setRipples((r) => r.filter((p) => p.id !== id)), 3000)
    }

    document.addEventListener("click", onClick, { capture: true })
    return () => document.removeEventListener("click", onClick, { capture: true })
  }, [])

  // page transition overlay when pathname changes
  useEffect(() => {
    if (pathname == null) return
    const coords = lastClick.current ?? { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const id = ++idRef.current
    setNavOverlay({ id, x: coords.x, y: coords.y })
  const t = window.setTimeout(() => setNavOverlay(null), 3000)
    return () => window.clearTimeout(t)
    // intentionally only depends on pathname
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  return (
    <>
      {children}

      <div aria-hidden className="transition-overlay-container">
        {ripples.map((r) => (
          <span
            key={r.id}
            className="ripple"
            style={{ left: `${r.x}px`, top: `${r.y}px` }}
          />
        ))}

        {navOverlay && (
          <span
            key={navOverlay.id}
            className="nav-overlay"
            style={{ left: `${navOverlay.x}px`, top: `${navOverlay.y}px` }}
          />
        )}
      </div>
    </>
  )
}
