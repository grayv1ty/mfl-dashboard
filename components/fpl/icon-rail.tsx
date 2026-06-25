"use client"

import type { ReactNode } from "react"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Settings, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { userLeagues } from "@/lib/mock"
import { USER_NAV, LEAGUE_NAV, withLid, activeSection } from "@/lib/nav"
import { TeamAvatar } from "./primitives"

/* ------------------------------------------------------------------ *
 * Icon rail — fixed-width left dock shared across the app.
 * Primary nav items and each league expand an inline accordion sub-menu
 * directly beneath the item (click the chevron). Sub-items deep-link to
 * the matching page; leagues carry their ?lid= context through.
 * ------------------------------------------------------------------ */

function RailButton({
  children,
  active,
  label,
  href,
  onClick,
}: {
  children: ReactNode
  active?: boolean
  label: string
  href?: string
  onClick?: () => void
}) {
  const cls = cn(
    "grid h-10 w-10 place-items-center rounded-xl text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground",
    active && "bg-sidebar-accent text-foreground",
  )
  if (href) {
    return (
      <Link href={href} title={label} aria-label={label} className={cls}>
        {children}
      </Link>
    )
  }
  return (
    <button title={label} aria-label={label} className={cls} onClick={onClick}>
      {children}
    </button>
  )
}

/* Small chevron toggle anchored to the bottom-right of a rail item. */
function ExpandToggle({
  label,
  open,
  onToggle,
}: {
  label: string
  open: boolean
  onToggle: () => void
}) {
  return (
    <button
      onClick={onToggle}
      title={`${label} menu`}
      aria-label={`Toggle ${label} menu`}
      aria-expanded={open}
      className="absolute -bottom-1 -right-1 grid h-4 w-4 place-items-center rounded-full bg-sidebar-accent text-muted-foreground ring-2 ring-sidebar transition-colors hover:bg-primary hover:text-primary-foreground"
    >
      <ChevronRight size={10} strokeWidth={3} className={cn("transition-transform", open && "rotate-90")} />
    </button>
  )
}

/* Rounded container holding the expanded sub-menu beneath an item.
 * mt-3 clears the parent item's chevron toggle, which overhangs its corner. */
function SubMenu({ children }: { children: ReactNode }) {
  return (
    <div className="mb-1 mt-3 flex w-full flex-col items-center gap-0.5 rounded-2xl bg-sidebar-accent/50 p-1">
      {children}
    </div>
  )
}

export function IconRail({
  activeLeagueId,
}: {
  /** Kept for API symmetry with the shell; primary nav is the same in both. */
  variant?: "league" | "user"
  activeLeagueId?: string
}) {
  const pathname = usePathname()
  const current = activeSection(USER_NAV, pathname)
  const leagueCurrent = activeSection(LEAGUE_NAV, pathname)

  // A single open accordion across the whole rail — selecting an item
  // expands its sub-menu and collapses every other one.
  const navKey = (label: string) => `nav:${label}`
  const lgKey = (id: string) => `lg:${id}`
  const [open, setOpen] = useState<string | null>(
    activeLeagueId ? lgKey(activeLeagueId) : current ? navKey(current.label) : null,
  )
  const toggle = (key: string) => setOpen((cur) => (cur === key ? null : key))

  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex w-16 flex-col items-center border-r border-sidebar-border bg-sidebar">
      {/* Brand zone — full-width bottom border lines up with the top header bar */}
      <div className="flex h-14 w-full shrink-0 items-center justify-center border-b border-sidebar-border">
        <Link
          href="/"
          className="grid h-10 w-10 place-items-center overflow-hidden rounded-xl bg-sidebar-accent"
          title="First Pick Labs"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/fpl-logo.png" alt="First Pick Labs" width={28} height={28} className="h-7 w-7" />
        </Link>
      </div>

      {/* Scrollable nav: primary sections (accordion) + league switcher.
         gap-2.5 leaves room for each item's overhanging chevron toggle. */}
      <div className="flex w-full flex-1 flex-col items-center gap-2.5 overflow-y-auto no-scrollbar py-3">
        {USER_NAV.map((s) => {
          const active = current?.label === s.label
          const hasItems = s.items.length > 0
          const isOpen = hasItems && open === navKey(s.label)
          return (
            <div key={s.label} className="flex w-full flex-col items-center">
              <div className="relative">
                <Link
                  href={s.href}
                  title={s.label}
                  aria-label={s.label}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setOpen(hasItems ? navKey(s.label) : null)}
                  className={cn(
                    "grid h-10 w-10 place-items-center rounded-xl text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground",
                    active && "bg-sidebar-accent text-foreground",
                  )}
                >
                  <s.icon size={20} />
                </Link>
                {hasItems && (
                  <ExpandToggle label={s.label} open={isOpen} onToggle={() => toggle(navKey(s.label))} />
                )}
              </div>

              {isOpen && (
                <SubMenu>
                  {s.items.map((it) => {
                    const itemActive = pathname === it.href
                    return (
                      <Link
                        key={it.href}
                        href={it.href}
                        title={it.label}
                        aria-label={it.label}
                        aria-current={itemActive ? "page" : undefined}
                        className={cn(
                          "grid h-9 w-9 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground",
                          itemActive && "bg-sidebar-accent text-foreground",
                        )}
                      >
                        <it.icon size={17} />
                      </Link>
                    )
                  })}
                </SubMenu>
              )}
            </div>
          )
        })}

        <div className="my-2 h-px w-8 shrink-0 bg-sidebar-border" />

        {/* Leagues — click avatar → league home, chevron → its sub-menu. */}
        {userLeagues.map((l) => {
          const isActive = l.id === activeLeagueId
          const isOpen = open === lgKey(l.id)
          return (
            <div key={l.id} className="group/lg relative flex w-full flex-col items-center">
              {/* Active / hover indicator — pill flush to the rail's left edge, never clips */}
              <span
                aria-hidden
                className={cn(
                  "absolute left-0 top-5 w-1 -translate-y-1/2 rounded-r-full bg-primary transition-all duration-200",
                  isActive ? "h-7 opacity-100" : "h-0 opacity-0 group-hover/lg:h-4 group-hover/lg:opacity-60",
                )}
              />
              <div className="relative">
                {/* Avatar → that league's home page */}
                <Link
                  href={`/league?lid=${l.id}`}
                  title={l.name}
                  aria-label={l.name}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => setOpen(lgKey(l.id))}
                  className="block transition-transform hover:scale-105"
                >
                  <TeamAvatar
                    seed={l.hue}
                    label={l.name}
                    size={40}
                    className={cn(isActive && "ring-2 ring-primary ring-offset-2 ring-offset-sidebar")}
                  />
                </Link>

                {l.unread > 0 && (
                  <span className="pointer-events-none absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-destructive px-1 text-[10px] font-bold text-white ring-2 ring-sidebar">
                    {l.unread}
                  </span>
                )}

                <ExpandToggle label={l.name} open={isOpen} onToggle={() => toggle(lgKey(l.id))} />
              </div>

              {isOpen && (
                <SubMenu>
                  {LEAGUE_NAV.map((s) => {
                    const itemActive = isActive && leagueCurrent?.label === s.label
                    return (
                      <Link
                        key={s.label}
                        href={withLid(s.href, l.id)}
                        title={s.label}
                        aria-label={s.label}
                        aria-current={itemActive ? "page" : undefined}
                        className={cn(
                          "grid h-9 w-9 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground",
                          itemActive && "bg-sidebar-accent text-foreground",
                        )}
                      >
                        <s.icon size={17} />
                      </Link>
                    )
                  })}
                </SubMenu>
              )}
            </div>
          )
        })}
      </div>

      <div className="flex flex-col items-center gap-1 border-t border-sidebar-border py-3">
        <RailButton label="Settings">
          <Settings size={20} />
        </RailButton>
        <span title="grayson">
          <TeamAvatar seed="200" label="grayson" size={34} />
        </span>
      </div>
    </aside>
  )
}
