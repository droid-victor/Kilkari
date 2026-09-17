import { useEffect, useState } from 'react'

const LOGOS = ['/brand/kilkari-logo-en.svg', '/brand/kilkari-logo-hi.svg']
const INTERVAL_MS = 3200

/**
 * Crossfades between the English and Devanagari wordmarks on a timer.
 * Both images are always in the DOM (stacked) so the swap is a pure
 * opacity transition — no layout shift, no flash of a missing image.
 */
export function AnimatedLogo({ alt, className }: { alt: string; className?: string }) {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setActiveIndex((i) => (i + 1) % LOGOS.length)
    }, INTERVAL_MS)
    return () => clearInterval(id)
  }, [])

  return (
    <span className={`relative inline-block ${className ?? ''}`}>
      {/* Reserves layout space using the first logo, invisibly. */}
      <img src={LOGOS[0]} alt="" aria-hidden="true" className="h-full w-auto invisible" />
      {LOGOS.map((src, i) => (
        <img
          key={src}
          src={src}
          alt={i === 0 ? alt : ''}
          aria-hidden={i !== 0}
          className="absolute inset-0 h-full w-auto transition-opacity duration-700 ease-in-out"
          style={{ opacity: i === activeIndex ? 1 : 0 }}
        />
      ))}
    </span>
  )
}
