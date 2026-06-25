import type { ReactNode } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { userLeagues, userProfile, achievements, type UserLeague } from "@/lib/mock"
import { Panel, TeamAvatar, Tag, Progress } from "./primitives"
import { DynamicIcon } from "./icon"
import { Circle, ChevronRight, Trophy, Flame, Star, Settings, Share2 } from "lucide-react"

const TIER_COLOR: Record<string, string> = {
  bronze: "oklch(0.62 0.1 55)",
  silver: "oklch(0.75 0.02 264)",
  gold: "oklch(0.8 0.14 85)",
  platinum: "oklch(0.78 0.1 200)",
}

/* Horizontal rail of earned achievement badges */
export function BadgeRail({ limit, showLabels = false }: { limit?: number; showLabels?: boolean }) {
  const data = (limit ? achievements.slice(0, limit) : achievements).filter((a) => a.earned)
  return (
    <div className="flex flex-wrap gap-2">
      {data.map((a) => (
        <div
          key={a.id}
          title={`${a.label} — ${a.detail}`}
          className={cn(
            "flex items-center gap-2 rounded-full border border-border bg-secondary/40 py-1 pl-1 pr-3",
            !showLabels && "pr-1",
          )}
        >
          <span
            className="grid h-7 w-7 place-items-center rounded-full"
            style={{ background: `color-mix(in oklch, ${TIER_COLOR[a.tier]} 22%, transparent)`, color: TIER_COLOR[a.tier] }}
          >
            <DynamicIcon name={a.icon} size={14} />
          </span>
          {showLabels && <span className="text-xs font-medium">{a.label}</span>}
        </div>
      ))}
    </div>
  )
}

/* Full profile banner: banner image + avatar + identity + level + badges + stats */
export function UserBanner({ className }: { className?: string }) {
  const leading = userLeagues.filter((l) => l.leading).length
  const pct = Math.round((userProfile.xp / userProfile.xpToNext) * 100)
  const stats = [
    { label: "Leagues", value: userProfile.leaguesJoined, icon: <Trophy size={13} /> },
    { label: "Leading", value: `${leading}/${userLeagues.length}`, icon: <Star size={13} /> },
    { label: "Win Rate", value: `${userProfile.winRate}%`, icon: <Flame size={13} /> },
    { label: "Titles", value: userProfile.championships, icon: <DynamicIcon name="crown" size={13} /> },
    { label: "Streak", value: userProfile.currentStreak, icon: <Flame size={13} /> },
  ]
  return (
    <Panel className={cn("relative overflow-hidden", className)}>
      <div className="relative h-32 w-full sm:h-40">
        <Image src="/user-banner.png" alt="" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/60 to-card/10" />
        <div className="absolute right-3 top-3 flex gap-1.5">
          <button className="inline-flex items-center gap-1.5 rounded-lg bg-background/70 px-2.5 py-1.5 text-xs font-medium backdrop-blur hover:text-foreground" aria-label="Share profile">
            <Share2 size={13} /> Share
          </button>
          <button className="grid h-8 w-8 place-items-center rounded-lg bg-background/70 backdrop-blur" aria-label="Edit profile">
            <Settings size={14} />
          </button>
        </div>
      </div>
      <div className="relative -mt-14 flex flex-col gap-4 px-5 pb-5 sm:flex-row sm:items-end">
        <span className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl ring-4 ring-card">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/user-avatar.png" alt="grayson" className="h-full w-full object-cover" />
        </span>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight">{userProfile.name}</h2>
            <Tag tone="primary">Lv {userProfile.level}</Tag>
          </div>
          <p className="text-sm text-muted-foreground">
            {userProfile.handle} · {userProfile.rank}
          </p>
          <div className="mt-2 max-w-xs">
            <div className="mb-1 flex items-center justify-between text-[11px] text-muted-foreground">
              <span>Level {userProfile.level}</span>
              <span className="tabular-nums">
                {userProfile.xp.toLocaleString()} / {userProfile.xpToNext.toLocaleString()} XP
              </span>
            </div>
            <Progress value={pct} className="h-2" />
          </div>
        </div>
        <div className="pb-1">
          <BadgeRail limit={8} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-px overflow-hidden border-t border-border bg-border sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((s) => (
          <div key={s.label} className="flex flex-col gap-0.5 bg-card px-5 py-3">
            <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              {s.icon} {s.label}
            </span>
            <span className="text-lg font-bold tabular-nums">{s.value}</span>
          </div>
        ))}
      </div>
    </Panel>
  )
}

/* KPI tile with optional trend + sparkline slot */
export function Kpi({
  label,
  value,
  delta,
  sub,
  icon,
  className,
}: {
  label: string
  value: ReactNode
  delta?: string
  sub?: ReactNode
  icon?: ReactNode
  className?: string
}) {
  const up = delta?.startsWith("+")
  return (
    <Panel className={cn("p-5", className)}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        {icon && <span className="text-muted-foreground">{icon}</span>}
      </div>
      <div className="mt-2 flex items-end gap-2">
        <span className="text-3xl font-bold tracking-tight tabular-nums">{value}</span>
        {delta && (
          <span className={cn("mb-1 text-xs font-semibold", up ? "text-success" : "text-destructive")}>{delta}</span>
        )}
      </div>
      {sub && <div className="mt-1 text-xs text-muted-foreground">{sub}</div>}
    </Panel>
  )
}

/* Rich league card used across several user concepts */
export function LeagueCard({ league, className }: { league: UserLeague; className?: string }) {
  const live = league.matchupStatus === "live"
  return (
    <Panel className={cn("group flex flex-col p-4 transition-colors hover:border-ring", className)}>
      <div className="flex items-center gap-3">
        <TeamAvatar seed={league.hue} label={league.name} size={42} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-sm font-semibold">{league.name}</h3>
            {league.unread > 0 && (
              <span className="grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                {league.unread}
              </span>
            )}
          </div>
          <p className="text-[11px] text-muted-foreground">
            {league.format} · {league.teams} teams
          </p>
        </div>
        <ChevronRight size={16} className="text-muted-foreground transition-transform group-hover:translate-x-0.5" />
      </div>

      <div className="mt-3 flex items-center gap-2">
        <Tag tone={league.leading ? "success" : "muted"}>
          <Trophy size={11} /> #{league.myRank}
        </Tag>
        <span className="text-xs text-muted-foreground tabular-nums">{league.record}</span>
        <span className="ml-auto text-xs text-muted-foreground tabular-nums">{league.pointsFor} PF</span>
      </div>

      {league.draftIn ? (
        <div className="mt-3 rounded-lg bg-secondary/50 px-3 py-2 text-center text-xs">
          <span className="text-muted-foreground">Draft in </span>
          <span className="font-semibold text-foreground">{league.draftIn}</span>
        </div>
      ) : (
        <div className="mt-3 rounded-lg bg-secondary/50 px-3 py-2">
          <div className="mb-1.5 flex items-center justify-between text-[11px]">
            <span className={cn("font-semibold", live ? "text-primary" : "text-muted-foreground")}>
              {live ? (
                <span className="inline-flex items-center gap-1">
                  <Circle size={6} className="animate-pulse fill-current" /> LIVE
                </span>
              ) : (
                "Upcoming"
              )}
            </span>
            <span className="text-muted-foreground">vs {league.nextOpponent}</span>
          </div>
          {live && (
            <div className="flex items-center justify-between text-sm font-bold tabular-nums">
              <span className={league.myScore >= league.oppScore ? "text-foreground" : "text-muted-foreground"}>
                {league.myScore.toFixed(1)}
              </span>
              <span className="text-xs text-muted-foreground">—</span>
              <span className={league.oppScore > league.myScore ? "text-foreground" : "text-muted-foreground"}>
                {league.oppScore.toFixed(1)}
              </span>
            </div>
          )}
        </div>
      )}
    </Panel>
  )
}

/* Compact one-line league row */
export function LeagueRow({ league }: { league: UserLeague }) {
  const live = league.matchupStatus === "live"
  return (
    <div className="flex items-center gap-3 rounded-xl px-2 py-2.5 hover:bg-secondary/50">
      <TeamAvatar seed={league.hue} label={league.name} size={34} />
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium">{league.name}</div>
        <div className="text-[11px] text-muted-foreground">
          {league.format} · #{league.myRank} · {league.record}
        </div>
      </div>
      {live ? (
        <div className="text-right">
          <div className="text-sm font-bold tabular-nums">
            {league.myScore.toFixed(1)} <span className="text-muted-foreground">- {league.oppScore.toFixed(1)}</span>
          </div>
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-primary">
            <Circle size={5} className="animate-pulse fill-current" /> LIVE
          </span>
        </div>
      ) : league.draftIn ? (
        <Tag tone="info">Draft {league.draftIn}</Tag>
      ) : (
        <Tag tone={league.leading ? "success" : "muted"}>#{league.myRank}</Tag>
      )}
    </div>
  )
}

/* Profile summary block reused in several concepts */
export function ProfileStats({ columns = 2 }: { columns?: number }) {
  const leading = userLeagues.filter((l) => l.leading).length
  const stats = [
    { label: "Leagues", value: userLeagues.length },
    { label: "Leading", value: `${leading}/${userLeagues.length}` },
    { label: "Win rate", value: "65%" },
    { label: "Titles", value: 3 },
  ]
  return (
    <div className="grid gap-2.5" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0,1fr))` }}>
      {stats.map((s) => (
        <div key={s.label} className="rounded-xl bg-secondary/50 px-3 py-3 text-center">
          <div className="text-xl font-bold tabular-nums">{s.value}</div>
          <div className="mt-0.5 text-[11px] text-muted-foreground">{s.label}</div>
        </div>
      ))}
    </div>
  )
}

/* Level / XP progress bar */
export function LevelBar() {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-xs">
        <span className="font-medium">Level 24 · Elite Manager</span>
        <span className="text-muted-foreground tabular-nums">7,400 / 10,000 XP</span>
      </div>
      <Progress value={74} className="h-2" />
    </div>
  )
}
