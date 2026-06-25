import type { ReactNode } from "react"
import Image from "next/image"
import {
  Hash,
  Megaphone,
  Repeat,
  ShoppingCart,
  UserMinus,
  ClipboardList,
  Users as UsersIcon,
  Calendar,
  Crown,
  Scale,
  ArrowRight,
  Settings,
  Flame,
  TrendingUp,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  standings,
  matchups,
  activity,
  news,
  players,
  injuries,
  chatMessages,
  members,
  achievements,
  weeklyAwards,
  weeklyScores,
  HEATMAP_WEEKS,
  userLeagues,
  type Team,
  type UserLeague,
} from "@/lib/mock"
import { TeamAvatar, PlayerAvatar, PositionPill, Tag } from "./primitives"
import { DynamicIcon } from "./icon"

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

/* ---------------- Commissioner control (admin quick-actions grid) ---------------- */
const COMMISH_CONTROL = [
  { icon: Calendar, label: "Schedule draft", status: "Not set", cta: "Set time", tint: "var(--pos-qb)" },
  { icon: UsersIcon, label: "Members", status: "9 / 12 joined", cta: "Invite", tint: "var(--pos-def)" },
  { icon: Scale, label: "Scoring & rules", status: "PPR · standard", cta: "Edit", tint: "var(--pos-flex)" },
  { icon: Repeat, label: "Trade approvals", status: "2 pending", cta: "Review", tint: "var(--pos-rb)" },
  { icon: Megaphone, label: "Announcement", status: "Post to league", cta: "Write", tint: "var(--pos-te)" },
] as const

export function CommishControl() {
  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <Tag tone="warning">
          <Crown size={11} /> Admin
        </Tag>
        <button className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-destructive hover:opacity-80">
          Open console <ArrowRight size={13} />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 xl:grid-cols-5">
        {COMMISH_CONTROL.map((c) => (
          <div key={c.label} className="flex flex-col rounded-xl border border-border bg-secondary/30 p-3">
            <span
              className="grid h-9 w-9 place-items-center rounded-lg"
              style={{ background: `color-mix(in oklch, ${c.tint} 20%, transparent)`, color: c.tint }}
            >
              <c.icon size={17} />
            </span>
            <div className="mt-2.5 text-sm font-semibold leading-tight">{c.label}</div>
            <div className="mt-0.5 text-[11px] text-muted-foreground">{c.status}</div>
            <button className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-destructive hover:opacity-80">
              {c.cta} <ArrowRight size={12} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ---------------- Win probability gauge (red → amber → green semicircle) ---------------- */
const GAUGE = { W: 240, R: 96, SW: 18, CX: 120, CY: 116 }

function gaugePoint(t: number, radius = GAUGE.R) {
  const a = Math.PI * (1 + t) // t=0 → left (180°), t=1 → right (360°)
  return [GAUGE.CX + radius * Math.cos(a), GAUGE.CY + radius * Math.sin(a)] as const
}

function gaugeArc(t0: number, t1: number) {
  const [x0, y0] = gaugePoint(t0)
  const [x1, y1] = gaugePoint(t1)
  return `M ${x0.toFixed(2)} ${y0.toFixed(2)} A ${GAUGE.R} ${GAUGE.R} 0 0 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`
}

export function WinProbGauge({ value = 78, vs }: { value?: number; vs?: string }) {
  const t = Math.min(1, Math.max(0, value / 100))
  const bands = [
    { from: 0, to: 0.4, color: "#f23b3b" },
    { from: 0.4, to: 0.62, color: "#f5a524" },
    { from: 0.62, to: 1, color: "#22c55e" },
  ]
  const [tx0, ty0] = gaugePoint(t, GAUGE.R - GAUGE.SW / 2 - 3)
  const [tx1, ty1] = gaugePoint(t, GAUGE.R + GAUGE.SW / 2 + 3)
  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 240 134" className="w-full max-w-[260px]" aria-hidden>
        {/* track */}
        <path d={gaugeArc(0, 1)} fill="none" stroke="var(--secondary)" strokeWidth={GAUGE.SW} strokeLinecap="round" />
        {/* colored bands */}
        {bands.map((b, i) => (
          <path key={i} d={gaugeArc(b.from, b.to)} fill="none" stroke={b.color} strokeWidth={GAUGE.SW} />
        ))}
        {/* value tick */}
        <line x1={tx0} y1={ty0} x2={tx1} y2={ty1} stroke="#fff" strokeWidth={3.5} strokeLinecap="round" />
      </svg>
      <div className="-mt-2 text-center">
        <div className="text-xl font-bold tabular-nums text-success">{value}% to win</div>
        {vs && <div className="text-xs text-muted-foreground">vs {vs}</div>}
      </div>
    </div>
  )
}

/* ---------------- League banner hero (banner image + league icon + meta + stats) ---------------- */
export function LeagueBanner({ league = userLeagues[0], className }: { league?: UserLeague; className?: string }) {
  const me = standings[0]
  const stats = [
    { label: "My Rank", value: `#${league.myRank}`, icon: <DynamicIcon name="trophy" size={13} /> },
    { label: "Record", value: league.record, icon: <Flame size={13} /> },
    { label: "Points For", value: league.pointsFor, icon: <TrendingUp size={13} /> },
    { label: "Teams", value: league.teams, icon: <UsersIcon size={13} /> },
    { label: "Moves", value: me.moves, icon: <Repeat size={13} /> },
  ]
  return (
    <div className={cn("relative overflow-hidden rounded-2xl border border-border bg-card", className)}>
      <div className="relative h-24 w-full sm:h-28">
        <Image src="/league-banner.png" alt="" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/70 to-card/10" />
        <div className="absolute right-3 top-3 flex gap-1.5">
          <span className="rounded-full bg-background/70 px-2.5 py-1 text-[11px] font-semibold backdrop-blur">{league.format}</span>
          <span className="rounded-full bg-background/70 px-2.5 py-1 text-[11px] font-semibold backdrop-blur">Week 7</span>
        </div>
      </div>
      <div className="relative -mt-9 flex items-end gap-4 px-5">
        <span className="rounded-2xl ring-4 ring-card">
          <TeamAvatar seed={league.hue} label={league.name} size={60} className="rounded-2xl" />
        </span>
        <div className="flex-1 pb-1">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold tracking-tight">{league.name}</h2>
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
      <div className="mt-3.5 grid grid-cols-2 gap-px overflow-hidden border-t border-border bg-border sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((s) => (
          <div key={s.label} className="flex flex-col gap-0.5 bg-card px-5 py-2.5">
            <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              {s.icon} {s.label}
            </span>
            <span className="text-base font-bold tabular-nums">{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ---------------- League roster (starters + bench, with availability) ---------------- */
const ROSTER_STATUS: Record<string, string> = {
  active: "var(--success)",
  questionable: "var(--warning)",
  out: "var(--destructive)",
  bye: "var(--muted-foreground)",
}
export function LeagueRoster({ limit = 9, starters = 6 }: { limit?: number; starters?: number }) {
  const roster = players.slice(0, limit)
  return (
    <ul className="-my-1">
      {roster.map((p, i) => (
        <li
          key={p.id}
          className={cn("flex items-center gap-2.5 py-2", i === starters && "mt-1 border-t border-dashed border-border pt-3")}
        >
          <PositionPill pos={p.pos} className="w-10" />
          <PlayerAvatar name={p.name} pos={p.pos} size={28} />
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-medium">{p.name}</div>
            <div className="text-[11px] text-muted-foreground">
              {i < starters ? "Starter" : "Bench"} · {p.team}
            </div>
          </div>
          <span
            className="h-2 w-2 shrink-0 rounded-full"
            style={{ background: ROSTER_STATUS[p.status] ?? "var(--muted-foreground)" }}
            title={p.status}
          />
          <span className="w-11 text-right text-sm font-bold tabular-nums">{p.points.toFixed(1)}</span>
        </li>
      ))}
    </ul>
  )
}

/* ---------------- Injury / availability report ---------------- */
const INJ_TONE: Record<string, "warning" | "destructive"> = {
  questionable: "warning",
  doubtful: "warning",
  out: "destructive",
  ir: "destructive",
}
export function InjuryReport({ limit }: { limit?: number }) {
  const data = limit ? injuries.slice(0, limit) : injuries
  return (
    <ul className="divide-y divide-border/60">
      {data.map((p) => (
        <li key={p.player} className="flex items-center gap-2.5 py-2">
          <PlayerAvatar name={p.player} pos={p.pos} size={30} />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="truncate text-sm font-medium">{p.player}</span>
              <PositionPill pos={p.pos} />
            </div>
            <div className="truncate text-[11px] text-muted-foreground">
              {p.team} · {p.note}
            </div>
          </div>
          <Tag tone={INJ_TONE[p.status]} className="uppercase">
            {p.status}
          </Tag>
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

/* ---------------- Scoring heatmap (teams × weeks) ----------------
   Discrete point buckets — cool (low) → warm (high). */
const HEAT_BUCKETS = [
  { max: 95, label: "<95", bg: "#1c2438", fg: "var(--muted-foreground)" },
  { max: 110, label: "95–109", bg: "#3b5bd9", fg: "#fff" },
  { max: 125, label: "110–124", bg: "#7c4ddb", fg: "#fff" },
  { max: 140, label: "125–139", bg: "#c33a5e", fg: "#fff" },
  { max: Number.POSITIVE_INFINITY, label: "140+", bg: "#f23b3b", fg: "#fff" },
] as const

function heatBucket(v: number) {
  return HEAT_BUCKETS.find((b) => v < b.max) ?? HEAT_BUCKETS[HEAT_BUCKETS.length - 1]
}

export function ScoringHeatmap({
  weeks = HEATMAP_WEEKS,
  limit = 8,
  showLegend = true,
  showAvg = false,
  highlight = "t1",
}: {
  weeks?: number
  limit?: number
  showLegend?: boolean
  showAvg?: boolean
  highlight?: string
}) {
  const rows = weeklyScores.slice(0, limit).map((r) => ({ ...r, weeks: r.weeks.slice(0, weeks) }))
  const cols = `minmax(104px,1.2fr) repeat(${weeks}, minmax(0,1fr))${showAvg ? " 48px" : ""}`

  return (
    <div className="overflow-x-auto no-scrollbar">
      <div className="min-w-[560px]">
        {/* Header */}
        <div className="grid items-center gap-1.5 pb-1.5 text-[10px] font-medium text-muted-foreground" style={{ gridTemplateColumns: cols }}>
          <span className="pl-1">Team</span>
          {Array.from({ length: weeks }).map((_, i) => (
            <span key={i} className="text-center tabular-nums">
              W{i + 1}
            </span>
          ))}
          {showAvg && <span className="pr-1 text-right">Avg</span>}
        </div>
        {/* Rows */}
        <div className="space-y-1.5">
          {rows.map((r) => {
            const avg = r.weeks.reduce((s, v) => s + v, 0) / r.weeks.length
            return (
              <div
                key={r.team.id}
                className={cn(
                  "grid items-center gap-1.5 rounded-lg",
                  r.team.id === highlight && "bg-primary/5 ring-1 ring-primary/30",
                )}
                style={{ gridTemplateColumns: cols }}
              >
                <div className="flex min-w-0 items-center gap-2 py-0.5 pl-1">
                  <TeamAvatar seed={r.team.avatar} label={r.team.name} size={22} />
                  <span className="truncate text-xs font-medium">{r.team.name}</span>
                </div>
                {r.weeks.map((v, i) => {
                  const b = heatBucket(v)
                  return (
                    <div
                      key={i}
                      title={`${r.team.name} · W${i + 1}: ${v.toFixed(1)} pts`}
                      className="grid h-7 place-items-center rounded-md text-[11px] font-bold tabular-nums"
                      style={{ background: b.bg, color: b.fg }}
                    >
                      {Math.round(v)}
                    </div>
                  )
                })}
                {showAvg && <span className="pr-1 text-right text-xs font-bold tabular-nums">{avg.toFixed(0)}</span>}
              </div>
            )
          })}
        </div>
        {showLegend && (
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[10px] font-medium text-muted-foreground">
            <span className="uppercase tracking-wide">Points</span>
            {HEAT_BUCKETS.map((b) => (
              <span key={b.label} className="inline-flex items-center gap-1.5">
                <span className="h-3 w-5 rounded" style={{ background: b.bg }} />
                {b.label}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

