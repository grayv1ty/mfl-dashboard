import { Home, Users, ClipboardList, LayoutGrid, Gavel, CreditCard, MonitorPlay } from "lucide-react"

/* ------------------------------------------------------------------ *
 * Shared navigation model.
 * Both the User (home) shell and the League shell render the same
 * top-nav + dropdown sub-menu component from this config, so the two
 * areas stay structurally consistent. Each sub-item resolves to a
 * sample page (see app/**). League hrefs get ?lid= appended at render.
 * ------------------------------------------------------------------ */

export type NavVariant = "user" | "league"

/** Drives the flavour of sample content rendered on a page. */
export type SampleKind =
  | "home"
  | "players"
  | "team"
  | "roster"
  | "league"
  | "teams"
  | "draft"
  | "gameday"
  | "subscription"
  | "scores"

export type NavIcon = typeof Home

export interface NavLink {
  label: string
  href: string
  icon: NavIcon
  /** Overrides the section kind for sample content on this sub-page. */
  kind?: SampleKind
}

export interface NavSection {
  label: string
  href: string
  icon: NavIcon
  kind: SampleKind
  items: NavLink[]
}

/* General (global) menus — flat, no sub-menus. */
export const USER_NAV: NavSection[] = [
  { label: "Home", href: "/", icon: Home, kind: "home", items: [] },
  { label: "Subscription", href: "/subscription", icon: CreditCard, kind: "subscription", items: [] },
  { label: "Scores", href: "/scores", icon: MonitorPlay, kind: "scores", items: [] },
]

/* League sub-menu — flat items; each page filters in-page (no sub-menus). */
export const LEAGUE_NAV: NavSection[] = [
  { label: "League Home", href: "/league", icon: LayoutGrid, kind: "league", items: [] },
  { label: "Rosters", href: "/league/roster", icon: ClipboardList, kind: "roster", items: [] },
  { label: "Players", href: "/league/players", icon: Users, kind: "players", items: [] },
  { label: "Draft Center", href: "/league/draft", icon: Gavel, kind: "draft", items: [] },
]

export function navForVariant(variant: NavVariant): NavSection[] {
  return variant === "league" ? LEAGUE_NAV : USER_NAV
}

/** Append the active league id so league deep-links keep their context. */
export function withLid(href: string, lid?: string): string {
  if (!lid) return href
  return `${href}${href.includes("?") ? "&" : "?"}lid=${lid}`
}

/** True when `href` is the page itself or an ancestor segment of it. */
function hrefMatches(href: string, pathname: string): boolean {
  if (href === "/") return pathname === "/"
  return pathname === href || pathname.startsWith(href + "/")
}

/**
 * The owning section for `pathname`. Matches against the section href and all
 * of its item hrefs (so e.g. /home/activity resolves to Home even though Home
 * lives at "/"), picking the longest — most specific — match.
 */
export function activeSection(sections: NavSection[], pathname: string): NavSection | undefined {
  let best: NavSection | undefined
  let bestLen = -1
  for (const s of sections) {
    for (const href of [s.href, ...s.items.map((i) => i.href)]) {
      if (hrefMatches(href, pathname) && href.length > bestLen) {
        best = s
        bestLen = href.length
      }
    }
  }
  return best
}

/** Resolve a concrete pathname to its section + sub-item (for sample pages). */
export function resolveNav(
  variant: NavVariant,
  pathname: string,
): { section: NavSection; item: NavLink } | undefined {
  const sections = navForVariant(variant)
  const section = activeSection(sections, pathname)
  if (!section) return undefined
  const item =
    section.items.find((i) => i.href === pathname) ??
    [...section.items].sort((a, b) => b.href.length - a.href.length).find((i) => hrefMatches(i.href, pathname)) ??
    section.items[0]
  return { section, item }
}
