import type { ReactNode } from "react"
import Link from "next/link"
import {
  Home,
  Trophy,
  Flame,
  Swords,
  Search,
  Inbox,
  Settings,
  ChevronDown,
  LayoutGrid,
  Users,
  Gavel,
  MessageSquare,
  Activity,
  ChevronLeft,
  ChevronRight,
  Grid2x2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { userLeagues } from "@/lib/mock"
import { TeamAvatar } from "./primitives"

/* ------------------------------------------------------------------ *
 * Icon rail — identical width / styling / color in every concept.    *
 * League variant expands the active league with a sub-nav beneath.   *
 * User variant shows leagues as plain logo chips (global context).   *
 * ------------------------------------------------------------------ */

const GLOBAL_NAV = [
  { icon: Home, label: "Home" },
  { icon: Trophy, label: "Standings" },
  { icon: Flame, label: "Activity" },
  { icon: Swords, label: "Matchups" },
]

const LEAGUE_SUBNAV = [
  { icon: LayoutGrid, label: "Overview" },
  { icon: Users, label: "Teams" },
  { icon: Activity, label: "Players" },
  { icon: Gavel, label: "Draft" },
  { icon: MessageSquare, label: "Chat" },
]

function RailButton({
  children,
  active,
  label,
}: {
  children: ReactNode
  active?: boolean
  label: string
}) {
  return (
    <button
      title={label}
      aria-label={label}
      className={cn(
        "grid h-10 w-10 place-items-center rounded-xl text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground",
        active && "bg-sidebar-accent text-foreground",
      )}
    >
      {children}
    </button>
  )
}

function IconRail({
  variant,
  activeLeagueId,
}: {
  variant: "league" | "user"
  activeLeagueId?: string
}) {
  const active = userLeagues.find((l) => l.id === activeLeagueId) ?? userLeagues[0]
  const others = userLeagues.filter((l) => l.id !== active.id)

  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex w-16 flex-col items-center gap-1 border-r border-sidebar-border bg-sidebar py-3">
      {/* Brand */}
      <Link
        href="/concepts"
        className="mb-1 grid h-10 w-10 place-items-center rounded-xl bg-primary font-extrabold text-primary-foreground"
        title="First Pick Labs"
      >
        FP
      </Link>

      <div className="my-1 h-px w-8 bg-sidebar-border" />

      {GLOBAL_NAV.map((n) => (
        <RailButton key={n.label} label={n.label} active={variant === "user" && n.label === "Home"}>
          <n.icon size={20} />
        </RailButton>
      ))}

      <div className="my-1 h-px w-8 bg-sidebar-border" />

      {/* Leagues */}
      <div className="flex flex-1 flex-col items-center gap-1 overflow-y-auto no-scrollbar">
        {variant === "league" ? (
          <>
            <div className="relative">
              <span className="block rounded-xl ring-2 ring-primary ring-offset-2 ring-offset-sidebar">
                <TeamAvatar seed={active.hue} label={active.name} size={40} />
              </span>
              <span className="absolute -bottom-1 -right-1 grid h-4 w-4 place-items-center rounded-full bg-primary text-primary-foreground">
                <ChevronDown size={11} strokeWidth={3} />
              </span>
            </div>
            <div className="mt-1 flex flex-col items-center gap-0.5 rounded-2xl bg-sidebar-accent/50 p-1">
              {LEAGUE_SUBNAV.map((s, i) => (
                <RailButton key={s.label} label={s.label} active={i === 0}>
                  <s.icon size={18} />
                </RailButton>
              ))}
            </div>
            <div className="my-1 h-px w-8 bg-sidebar-border" />
            {others.slice(0, 4).map((l) => (
              <Link key={l.id} href={`/league/bento?lid=${l.id}`} title={l.name} className="opacity-55 transition-opacity hover:opacity-100">
                <TeamAvatar seed={l.hue} label={l.name} size={34} />
              </Link>
            ))}
          </>
        ) : (
          userLeagues.map((l) => (
            <Link key={l.id} href="#" title={l.name} className="relative transition-transform hover:scale-105">
              <TeamAvatar seed={l.hue} label={l.name} size={40} />
              {l.unread > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                  {l.unread}
                </span>
              )}
            </Link>
          ))
        )}
      </div>

      <div className="mt-1 flex flex-col items-center gap-1">
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

/* ------------------------------------------------------------------ *
 * Concept navigator — slim meta strip for reviewing the 20 concepts. *
 * ------------------------------------------------------------------ */
function ConceptNav({
  kind,
  index,
  name,
  prev,
  next,
}: {
  kind: "League" | "User"
  index: number
  name: string
  prev?: string
  next?: string
}) {
  return (
    <div className="flex items-center gap-3 border-b border-border bg-background/80 px-5 py-2 text-xs backdrop-blur">
      <Link href="/concepts" className="inline-flex items-center gap-1.5 font-medium text-muted-foreground hover:text-foreground">
        <Grid2x2 size={14} /> Gallery
      </Link>
      <span className="text-border">/</span>
      <span
        className={cn(
          "rounded-full px-2 py-0.5 font-semibold",
          kind === "League" ? "bg-primary/15 text-primary" : "bg-info/15 text-info",
        )}
      >
        {kind} {index}/15
      </span>
      <span className="font-medium text-foreground">{name}</span>
      <div className="ml-auto flex items-center gap-1">
        <Link
          href={prev ?? "#"}
          aria-label="Previous concept"
          className={cn(
            "grid h-7 w-7 place-items-center rounded-md border border-border hover:bg-secondary",
            !prev && "pointer-events-none opacity-40",
          )}
        >
          <ChevronLeft size={15} />
        </Link>
        <Link
          href={next ?? "#"}
          aria-label="Next concept"
          className={cn(
            "grid h-7 w-7 place-items-center rounded-md border border-border hover:bg-secondary",
            !next && "pointer-events-none opacity-40",
          )}
        >
          <ChevronRight size={15} />
        </Link>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * Shell wrapper                                                      *
 * ------------------------------------------------------------------ */
export interface ShellProps {
  variant: "league" | "user"
  title: string
  index: number
  conceptName: string
  prev?: string
  next?: string
  activeLeagueId?: string
  headerExtra?: ReactNode
  children: ReactNode
}

const LEAGUE_NAV = ["League", "Teams", "Players", "Draft Central", "Game Day"]

export function Shell({
  variant,
  title,
  index,
  conceptName,
  prev,
  next,
  activeLeagueId,
  headerExtra,
  children,
}: ShellProps) {
  const league = userLeagues.find((l) => l.id === activeLeagueId) ?? userLeagues[0]
  return (
    <div className="min-h-screen bg-background">
      <IconRail variant={variant} activeLeagueId={activeLeagueId} />
      <div className="pl-16">
        <ConceptNav
          kind={variant === "league" ? "League" : "User"}
          index={index}
          name={conceptName}
          prev={prev}
          next={next}
        />

        {/* Top bar — single compact row */}
        <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur">
          <div className="flex items-center gap-2 px-6 py-2.5">
            {variant === "league" ? (
              <>
                {/* Compact league switcher (detail lives in the banner below) */}
                <button className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-secondary">
                  <TeamAvatar seed={league.hue} label={league.name} size={26} />
                  <span className="text-sm font-semibold leading-none">{league.name}</span>
                  <ChevronDown size={14} className="text-muted-foreground" />
                </button>
                <div className="mx-1 hidden h-5 w-px bg-border lg:block" />
                {/* Inline primary nav */}
                <nav className="hidden items-center gap-0.5 lg:flex">
                  {LEAGUE_NAV.map((n, i) => (
                    <button
                      key={n}
                      className={cn(
                        "flex items-center gap-1 rounded-md px-2.5 py-1.5 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground",
                        i === 0 && "text-foreground",
                      )}
                    >
                      {n}
                      <ChevronDown size={12} className="opacity-50" />
                    </button>
                  ))}
                </nav>
              </>
            ) : (
              <div>
                <h1 className="text-base font-semibold leading-none">{title}</h1>
                <p className="mt-1 text-xs text-muted-foreground">Welcome back, grayson</p>
              </div>
            )}

            <div className="ml-auto flex items-center gap-2">
              {headerExtra}
              <div className="relative hidden md:block">
                <Search size={15} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  placeholder="Search players, teams…"
                  className="h-9 w-52 rounded-lg border border-border bg-secondary/60 pl-8 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:border-ring"
                />
              </div>
              <button className="grid h-9 w-9 place-items-center rounded-lg border border-border text-muted-foreground hover:bg-secondary hover:text-foreground" aria-label="Inbox">
                <Inbox size={18} />
              </button>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1440px] px-6 py-6">{children}</main>
      </div>
    </div>
  )
}
