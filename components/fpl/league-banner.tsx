"use client"

import { usePathname } from "next/navigation"

/* ------------------------------------------------------------------ *
 * Decorative banner behind the league top-nav.
 * Anchored to the header's left edge, full height, fading out toward the
 * right so the nav menu and search stay readable. The photo (from the
 * league mock) is tinted with the league's hue and darkened with a veil so
 * text stays legible, and the inner layer replays a left-to-right wipe on
 * each navigation.
 * ------------------------------------------------------------------ */
export function LeagueBanner({ src = "/league-banner.png", hue = "245" }: { src?: string; hue?: string }) {
  const pathname = usePathname()
  const h = Number(hue)
  return (
    <div
      aria-hidden
      className="banner-fade pointer-events-none absolute -left-6 right-0 top-1/2 h-14 -translate-y-1/2 overflow-hidden"
    >
      <div key={pathname} className="banner-sweep absolute inset-0">
        {/* Base photo */}
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${src})` }} />
        {/* League-color tint */}
        <div
          className="absolute inset-0 mix-blend-color"
          style={{ background: `linear-gradient(90deg, oklch(0.6 0.2 ${h}), oklch(0.5 0.16 ${(h + 40) % 360}))` }}
        />
        {/* Dark veil so the picture isn't too bright behind text */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/85 via-background/55 to-background/35" />
      </div>
    </div>
  )
}
