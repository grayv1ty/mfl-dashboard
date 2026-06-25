import type { ReactNode } from "react"
import Image from "next/image"
import {
  ArrowUp,
  ArrowDown,
  Minus,
  TrendingUp,
  TrendingDown,
  Circle,
  Hash,
  GripVertical,
  MoreHorizontal,
  Megaphone,
  Repeat,
  ShoppingCart,
  UserMinus,
  ClipboardList,
  CheckCircle2,
  Clock,
  Users as UsersIcon,
  Flame,
  Calendar,
  Settings,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  schedule,
  standings,
  matchups,
  activity,
  news,
  players,
  powerRankings,
  commishTasks,
  chatMessages,
  members,
  achievements,
  weeklyAwards,
  transactions,
  userLeagues,
  type Position,
  type Team,
  type UserLeague,
} from "@/lib/mock"
import { Panel, PanelHeader, TeamAvatar, PlayerAvatar, TeamLogo, PositionPill, Tag, Progress } from "./primitives"
import { DynamicIcon } from "./icon"

/* ---------------- Widget frame (draggable look, league dashboards) ---------------- */
export function Widget({
  title,
  icon,
  action,
  children,
  className,
  bodyClassName,
}: {
  title: ReactNode
  icon?: ReactNode
  action?: ReactNode
  children: ReactNode
  className?: string
  bodyClassName?: string
}) {
  return (
    <Panel className={cn("group/widget flex flex-col", className)}>
      <div className="flex items-center gap-2 px-4 pt-3.5 pb-2.5">
        <GripVertical
          size={15}
          className="-ml-1 cursor-grab text-muted-foreground/40 opacity-0 transition-opacity group-hover/widget:opacity-100"
        />
        {icon && <span className="text-muted-foreground">{icon}</span>}
        <h3 className="text-sm font-semibold tracking-tight">{title}</h3>
        <div className="ml-auto flex items-center gap-1.5">
          {action}
          <button className="grid h-6 w-6 place-items-center rounded-md text-muted-foreground/60 hover:bg-secondary hover:text-foreground" aria-label="Widget options">
            <MoreHorizontal size={15} />
          </button>
        </div>
      </div>
      <div className={cn("flex-1 px-4 pb-4", bodyClassName)}>{children}</div>
    </Panel>
  )
}

/* ---------------- NFL schedule strip ---------------- */
export function NflSchedule({ count = 7, className }: { count?: number; className?: string }) {
  return (
    <div className={cn("flex gap-3 overflow-x-auto no-scrollbar", className)}>
      {schedule.slice(0, count).map((g) => (
        <div key={g.id} className="min-w-[150px] flex-1 rounded-xl bg-secondary/50 p-3">
          <div className="space-y-1.5">
            {[g.away, g.home].map((t, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TeamLogo abbr={t.abbr} size={22} />
                  <span className="text-sm font-semibold">{t.abbr}</span>
                </div>
                <span className="text-sm font-bold tabular-nums">{t.score}</span>
              </div>
            ))}
          </div>
          <div className="mt-2.5 flex items-center justify-between border-t border-border pt-2">
            <span className="text-[11px] text-muted-foreground">{g.kickoff}</span>
            {g.status === "live" && (
              <span className="flex items-center gap-1 text-[10px] font-bold text-primary">
                <Circle size={6} className="animate-pulse fill-current" /> LIVE
              </span>
            )}
            {g.status === "final" && <span className="text-[10px] font-medium text-muted-foreground">FINAL</span>}
          </div>
        </div>
      ))}
    </div>
  )
}

/* ---------------- Streak chip ---------------- */
function Streak({ streak }: { streak: string }) {
  const win = streak.startsWith("W")
  return (
    <span className={cn("text-xs font-semibold tabular-nums", win ? "text-success" : "text-destructive")}>
      {streak}
    </span>
  )
}

/* ---------------- Standings ---------------- */
export function StandingsTable({
  rows = standings,
  variant = "full",
  highlight = "t1",
  limit,
}: {
  rows?: Team[]
  variant?: "full" | "compact"
  highlight?: string
  limit?: number
}) {
  const data = limit ? rows.slice(0, limit) : rows
  if (variant === "compact") {
    return (
      <ul className="space-y-0.5">
        {data.map((t) => (
          <li
            key={t.id}
            className={cn(
              "flex items-center gap-3 rounded-lg px-2 py-1.5",
              t.id === highlight && "bg-primary/10",
            )}
          >
            <span className="w-5 text-center text-xs font-semibold text-muted-foreground tabular-nums">{t.rank}</span>
            <TeamAvatar seed={t.avatar} label={t.name} size={26} />
            <span className="truncate text-sm font-medium">{t.name}</span>
            <span className="ml-auto text-xs text-muted-foreground tabular-nums">
              {t.wins}-{t.losses}
            </span>
            <Streak streak={t.streak} />
          </li>
        ))}
      </ul>
    )
  }
  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-secondary/40 text-left text-xs text-muted-foreground">
            <th className="py-2.5 pl-3 font-medium">#</th>
            <th className="py-2.5 font-medium">Team</th>
            <th className="py-2.5 font-medium">Rec</th>
            <th className="hidden py-2.5 font-medium sm:table-cell">PF</th>
            <th className="hidden py-2.5 font-medium sm:table-cell">PA</th>
            <th className="py-2.5 pr-3 text-right font-medium">Strk</th>
          </tr>
        </thead>
        <tbody>
          {data.map((t) => (
            <tr
              key={t.id}
              className={cn(
                "border-b border-border/60 last:border-0",
                t.id === highlight && "bg-primary/5",
              )}
            >
              <td className="py-2.5 pl-3 text-xs font-semibold text-muted-foreground tabular-nums">{t.rank}</td>
              <td className="py-2.5">
                <div className="flex items-center gap-2.5">
                  <TeamAvatar seed={t.avatar} label={t.name} size={28} />
                  <div className="leading-tight">
                    <div className="font-medium">{t.name}</div>
                    <div className="text-[11px] text-muted-foreground">@{t.owner}</div>
                  </div>
                </div>
              </td>
              <td className="py-2.5 tabular-nums">
                {t.wins}-{t.losses}
              </td>
              <td className="hidden py-2.5 tabular-nums sm:table-cell">{t.pf}</td>
              <td className="hidden py-2.5 text-muted-foreground tabular-nums sm:table-cell">{t.pa}</td>
              <td className="py-2.5 pr-3 text-right">
                <Streak streak={t.streak} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* ---------------- Matchup card ---------------- */
export function MatchupCard({ m = matchups[0], className }: { m?: (typeof matchups)[number]; className?: string }) {
  const live = m.status === "live"
  const homeWin = m.homeScore >= m.awayScore
  return (
    <div className={cn("rounded-xl border border-border bg-secondary/40 p-3.5", className)}>
      <div className="mb-2.5 flex items-center justify-between">
        <span className={cn("text-[11px] font-semibold", live ? "text-primary" : "text-muted-foreground")}>
          {live ? "● LIVE" : "Sun 1:00 PM"}
        </span>
        <span className="text-[11px] text-muted-foreground">Week 7</span>
      </div>
      {[
        { t: m.home, s: m.homeScore, p: m.homeProj, lead: live && homeWin },
        { t: m.away, s: m.awayScore, p: m.awayProj, lead: live && !homeWin },
      ].map((side, i) => (
        <div key={i} className="flex items-center gap-2.5 py-1.5">
          <TeamAvatar seed={side.t.avatar} label={side.t.name} size={30} />
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-medium">{side.t.name}</div>
            <div className="text-[11px] text-muted-foreground">
              {side.t.wins}-{side.t.losses} · proj {side.p}
            </div>
          </div>
          <span className={cn("text-lg font-bold tabular-nums", side.lead ? "text-foreground" : "text-muted-foreground")}>
            {live ? side.s.toFixed(1) : "—"}
          </span>
        </div>
      ))}
    </div>
  )
}

/* ---------------- Activity feed ---------------- */
const ACT_ICON: Record<string, ReactNode> = {
  trade: <Repeat size={14} />,
  waiver: <ShoppingCart size={14} />,
  drop: <UserMinus size={14} />,
  lineup: <ClipboardList size={14} />,
  message: <Megaphone size={14} />,
  trophy: <DynamicIcon name="trophy" size={14} />,
  draft: <Hash size={14} />,
}

export function ActivityFeed({ limit }: { limit?: number }) {
  const data = limit ? activity.slice(0, limit) : activity
  return (
    <ul className="space-y-1">
      {data.map((a) => (
        <li key={a.id} className="flex items-start gap-3 rounded-lg px-2 py-2 hover:bg-secondary/50">
          <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-secondary text-muted-foreground">
            {ACT_ICON[a.type]}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm leading-snug">
              <span className="font-semibold capitalize">{a.actor}</span>{" "}
              <span className="text-muted-foreground">{a.text}</span>
            </p>
            <span className="text-[11px] text-muted-foreground">{a.time}</span>
          </div>
        </li>
      ))}
    </ul>
  )
}

/* ---------------- Player news ---------------- */
export function PlayerNews({ layout = "cards", limit = 3 }: { layout?: "cards" | "list"; limit?: number }) {
  const data = news.slice(0, limit)
  if (layout === "list") {
    return (
      <ul className="divide-y divide-border">
        {data.map((n) => (
          <li key={n.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
            <PlayerAvatar name={n.player} pos={n.pos} size={36} />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="font-medium text-foreground">{n.player}</span>
                {n.team} · <PositionPill pos={n.pos} />
              </div>
              <p className="mt-0.5 text-sm font-medium leading-snug">{n.headline}</p>
              <span className="text-[11px] text-muted-foreground">
                {n.source} · {n.time}
              </span>
            </div>
          </li>
        ))}
      </ul>
    )
  }
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {data.map((n) => (
        <div key={n.id} className="rounded-xl bg-secondary/40 p-3.5">
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <span className="font-medium text-foreground">{n.player}</span>, {n.team} · <PositionPill pos={n.pos} />
          </div>
          <p className="mt-2 text-sm font-semibold leading-snug">{n.headline}</p>
          <p className="mt-2 text-[11px] text-muted-foreground">
            Published by {n.source} · {n.time}
          </p>
        </div>
      ))}
    </div>
  )
}

/* ---------------- ADP table ---------------- */
const POS_TABS: (Position | "ALL")[] = ["ALL", "QB", "RB", "WR", "TE", "FLEX", "K", "DEF"]
export function AdpTable({ showFilters = true, limit = 6 }: { showFilters?: boolean; limit?: number }) {
  return (
    <div>
      {showFilters && (
        <div className="mb-3 flex flex-wrap gap-1.5">
          {POS_TABS.map((p, i) => (
            <button
              key={p}
              className={cn(
                "rounded-md border px-2.5 py-1 text-xs font-semibold",
                i === 0
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-muted-foreground hover:text-foreground",
              )}
            >
              {p}
            </button>
          ))}
        </div>
      )}
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs text-muted-foreground">
            <th className="pb-2 font-medium">Name</th>
            <th className="pb-2 font-medium">Pos</th>
            <th className="pb-2 text-right font-medium">ADP</th>
          </tr>
        </thead>
        <tbody>
          {players.slice(0, limit).map((p) => (
            <tr key={p.id} className="border-b border-border/50 last:border-0">
              <td className="py-2.5">
                <div className="flex items-center gap-2.5">
                  <PlayerAvatar name={p.name} pos={p.pos} size={26} />
                  <span className="font-medium">{p.name}</span>
                </div>
              </td>
              <td className="py-2.5">
                <PositionPill pos={p.pos} />
              </td>
              <td className="py-2.5 text-right font-semibold tabular-nums">{p.adp}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* ---------------- Power rankings ---------------- */
export function PowerRankings({ limit = 6 }: { limit?: number }) {
  return (
    <ul className="space-y-2">
      {powerRankings.slice(0, limit).map((p) => {
        const delta = p.prev - p.rank
        return (
          <li key={p.team.id} className="flex items-center gap-3">
            <span className="w-5 text-center text-lg font-bold tabular-nums text-muted-foreground">{p.rank}</span>
            <span className="flex w-6 items-center justify-center">
              {delta > 0 ? (
                <span className="flex items-center text-xs text-success">
                  <ArrowUp size={12} />
                  {delta}
                </span>
              ) : delta < 0 ? (
                <span className="flex items-center text-xs text-destructive">
                  <ArrowDown size={12} />
                  {Math.abs(delta)}
                </span>
              ) : (
                <Minus size={12} className="text-muted-foreground" />
              )}
            </span>
            <TeamAvatar seed={p.team.avatar} label={p.team.name} size={30} />
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium">{p.team.name}</div>
              <div className="truncate text-[11px] text-muted-foreground">{p.blurb}</div>
            </div>
            <span className="rounded-md bg-secondary px-2 py-1 text-xs font-bold tabular-nums">{p.rating}</span>
          </li>
        )
      })}
    </ul>
  )
}

/* ---------------- Commissioner tools ---------------- */
export function CommishTools() {
  return (
    <ul className="space-y-1.5">
      {commishTasks.map((c) => (
        <li key={c.id} className="flex items-center gap-3 rounded-lg border border-border bg-secondary/30 px-3 py-2.5">
          <span
            className={cn(
              "grid h-7 w-7 place-items-center rounded-lg",
              c.done ? "bg-success/15 text-success" : "bg-secondary text-muted-foreground",
            )}
          >
            {c.done ? <CheckCircle2 size={15} /> : <Clock size={15} />}
          </span>
          <div className="min-w-0 flex-1">
            <div className={cn("text-sm font-medium", c.done && "text-muted-foreground line-through")}>{c.label}</div>
            <div className="truncate text-[11px] text-muted-foreground">{c.detail}</div>
          </div>
          {!c.done && (
            <Tag tone={c.priority === "high" ? "destructive" : c.priority === "med" ? "warning" : "muted"}>
              {c.priority}
            </Tag>
          )}
        </li>
      ))}
    </ul>
  )
}

/* ---------------- League chat ---------------- */
export function LeagueChat({ limit = 5 }: { limit?: number }) {
  return (
    <div className="flex h-full flex-col">
      <ul className="flex-1 space-y-3">
        {chatMessages.slice(0, limit).map((m) => (
          <li key={m.id} className="flex items-start gap-2.5">
            <TeamAvatar seed={`${(m.user.charCodeAt(0) * 6) % 360}`} label={m.user} size={28} />
            <div className="min-w-0">
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-semibold capitalize">{m.user}</span>
                <span className="text-[10px] text-muted-foreground">{m.time}</span>
              </div>
              <p className="text-sm text-muted-foreground">{m.text}</p>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-3 flex items-center gap-2 rounded-lg border border-border bg-secondary/40 px-3 py-2">
        <input
          placeholder="Message #general…"
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
        <span className="text-xs font-semibold text-primary">Send</span>
      </div>
    </div>
  )
}

/* ---------------- Online members ---------------- */
export function MembersList() {
  return (
    <ul className="space-y-2">
      {members.map((m) => (
        <li key={m.name} className="flex items-center gap-2.5">
          <span className="relative">
            <TeamAvatar seed={`${(m.name.charCodeAt(0) * 8) % 360}`} label={m.name} size={30} />
            <span
              className={cn(
                "absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card",
                m.status === "online" ? "bg-success" : m.status === "away" ? "bg-warning" : "bg-muted-foreground",
              )}
            />
          </span>
          <div className="min-w-0">
            <div className="text-sm font-medium capitalize">{m.name}</div>
            {m.note && <div className="truncate text-[11px] text-muted-foreground">{m.note}</div>}
          </div>
        </li>
      ))}
    </ul>
  )
}

/* ---------------- Achievements grid ---------------- */
const TIER_COLOR: Record<string, string> = {
  bronze: "oklch(0.62 0.1 55)",
  silver: "oklch(0.75 0.02 264)",
  gold: "oklch(0.8 0.14 85)",
  platinum: "oklch(0.78 0.1 200)",
}
export function AchievementsGrid({ columns = 5, limit }: { columns?: number; limit?: number }) {
  const data = limit ? achievements.slice(0, limit) : achievements
  return (
    <div className="grid gap-2.5" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0,1fr))` }}>
      {data.map((a) => (
        <div
          key={a.id}
          title={`${a.label} — ${a.detail}`}
          className={cn(
            "flex flex-col items-center gap-1.5 rounded-xl border border-border bg-secondary/30 p-3 text-center",
            !a.earned && "opacity-35",
          )}
        >
          <span
            className="grid h-10 w-10 place-items-center rounded-full"
            style={{ background: `color-mix(in oklch, ${TIER_COLOR[a.tier]} 20%, transparent)`, color: TIER_COLOR[a.tier] }}
          >
            <DynamicIcon name={a.icon} size={18} />
          </span>
          <span className="text-[11px] font-medium leading-tight">{a.label}</span>
        </div>
      ))}
    </div>
  )
}

/* ---------------- Weekly awards ---------------- */
export function WeeklyAwards() {
  return (
    <div className="grid grid-cols-2 gap-2.5">
      {weeklyAwards.map((w) => (
        <div key={w.id} className="rounded-xl bg-secondary/40 p-3">
          <div className="flex items-center gap-2 text-muted-foreground">
            <DynamicIcon name={w.icon} size={15} />
            <span className="text-[11px] font-medium">{w.title}</span>
          </div>
          <div className="mt-1.5 text-lg font-bold tabular-nums">{w.value}</div>
          <div className="truncate text-[11px] text-muted-foreground">{w.team}</div>
        </div>
      ))}
    </div>
  )
}

/* ---------------- Transactions ---------------- */
const TX_TONE: Record<string, "success" | "destructive" | "info"> = {
  add: "success",
  drop: "destructive",
  trade: "info",
}
export function Transactions({ limit }: { limit?: number }) {
  const data = limit ? transactions.slice(0, limit) : transactions
  return (
    <ul className="space-y-1">
      {data.map((t) => (
        <li key={t.id} className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-secondary/40">
          <Tag tone={TX_TONE[t.type]} className="uppercase">
            {t.type}
          </Tag>
          <div className="min-w-0 flex-1">
            <span className="text-sm font-medium">{t.player}</span>{" "}
            <span className="text-xs text-muted-foreground">{t.detail}</span>
            <div className="text-[11px] text-muted-foreground">{t.team}</div>
          </div>
          <span className="text-[11px] text-muted-foreground">{t.time}</span>
        </li>
      ))}
    </ul>
  )
}

/* ---------------- League banner hero (banner + league icon + meta + stats) ---------------- */
export function LeagueBanner({
  league = userLeagues[0],
  tags = ["Keeper", "Dynasty"],
  className,
}: {
  league?: UserLeague
  tags?: string[]
  className?: string
}) {
  const me = standings[0]
  const stats = [
    { label: "My Rank", value: `#${league.myRank}`, icon: <DynamicIcon name="trophy" size={13} /> },
    { label: "Record", value: league.record, icon: <Flame size={13} /> },
    { label: "Points For", value: league.pointsFor, icon: <TrendingUp size={13} /> },
    { label: "Teams", value: league.teams, icon: <UsersIcon size={13} /> },
    { label: "Moves", value: me.moves, icon: <Repeat size={13} /> },
  ]
  return (
    <Panel className={cn("relative overflow-hidden", className)}>
      <div className="relative h-32 w-full sm:h-36">
        <Image src="/league-banner.png" alt="" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/70 to-card/10" />
        <div className="absolute right-3 top-3 flex gap-1.5">
          {tags.map((t) => (
            <span key={t} className="rounded-full bg-background/70 px-2.5 py-1 text-[11px] font-semibold backdrop-blur">
              {t}
            </span>
          ))}
        </div>
      </div>
      <div className="relative -mt-12 flex items-end gap-4 px-5">
        <span className="rounded-2xl ring-4 ring-card">
          <TeamAvatar seed={league.hue} label={league.name} size={72} className="rounded-2xl" />
        </span>
        <div className="flex-1 pb-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight">{league.name}</h2>
            <Tag tone="primary">Active</Tag>
          </div>
          <p className="text-xs text-muted-foreground">
            {league.format} · {league.teams} teams · Season 2026 · Week 7
          </p>
        </div>
        <div className="hidden gap-2 pb-1 md:flex">
          <button className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground">
            <Calendar size={14} /> Set Lineup
          </button>
          <button className="grid h-9 w-9 place-items-center rounded-lg border border-border text-muted-foreground hover:text-foreground" aria-label="League settings">
            <Settings size={16} />
          </button>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-px overflow-hidden border-t border-border bg-border sm:grid-cols-3 lg:grid-cols-5">
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

/* ---------------- Trend pill ---------------- */
export function TrendPill({ value, className }: { value: number; className?: string }) {
  const up = value >= 0
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 text-xs font-semibold tabular-nums",
        up ? "text-success" : "text-destructive",
        className,
      )}
    >
      {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
      {up ? "+" : ""}
      {value}
    </span>
  )
}
