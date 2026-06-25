import { cn } from "@/lib/utils"
import {
  achievements,
  actionQueue,
  managerAttributes,
  recentForm,
  notifications,
  players,
  seasonTrend,
  type UserLeague,
} from "@/lib/mock"
import { Panel, TeamAvatar, Tag, Progress, PlayerAvatar, Sparkline } from "./primitives"
import { DynamicIcon } from "./icon"
import {
  Circle,
  ChevronRight,
  Trophy,
  Clipboard,
  Bell,
  ShoppingCart,
  AlertTriangle,
  Repeat,
  TrendingUp,
  CheckCircle2,
  Plus,
  Sparkles,
  Lock,
  Swords,
  BarChart3,
} from "lucide-react"

const NOTI_ICON = { waiver: ShoppingCart, injury: AlertTriangle, trade: Repeat, system: Bell }

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

/* Cross-league to-do queue */
export function ActionQueue({ limit }: { limit?: number }) {
  const items = limit ? actionQueue.slice(0, limit) : actionQueue
  return (
    <ul className="-mx-1">
      {items.map((a) => (
        <li key={a.id}>
          <button className="flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-left hover:bg-secondary/60">
            <span
              className={cn(
                "grid h-7 w-7 place-items-center rounded-lg",
                a.urgent ? "bg-warning/15 text-warning" : "bg-secondary text-muted-foreground",
              )}
            >
              <Clipboard size={14} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium">{a.label}</div>
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <TeamAvatar seed={a.hue} label={a.league} size={14} /> <span className="truncate">{a.league}</span>
              </div>
            </div>
            {a.urgent && <Tag tone="destructive">Now</Tag>}
            <ChevronRight size={15} className="text-muted-foreground" />
          </button>
        </li>
      ))}
    </ul>
  )
}

/* Onboarding checklist — guides new users through setup */
const ONBOARDING_STEPS = [
  { id: "league", label: "Create or join a league", done: true },
  { id: "mock", label: "Run a mock draft", done: false },
  { id: "watchlist", label: "Build your watchlist", done: false },
  { id: "profile", label: "Complete your profile", done: true },
  { id: "customize", label: "Customize your dashboard", done: false },
]

export function GetStarted() {
  const done = ONBOARDING_STEPS.filter((s) => s.done).length
  const pct = Math.round((done / ONBOARDING_STEPS.length) * 100)
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-xs">
        <span className="text-muted-foreground">
          {done} of {ONBOARDING_STEPS.length} complete
        </span>
        <span className="font-semibold tabular-nums text-primary">{pct}%</span>
      </div>
      <Progress value={pct} className="mb-3 h-2" />
      <ul className="space-y-1.5">
        {ONBOARDING_STEPS.map((s) => (
          <li
            key={s.id}
            className="flex items-center gap-3 rounded-lg border border-border bg-secondary/30 px-3 py-2.5"
          >
            {s.done ? (
              <CheckCircle2 size={18} className="shrink-0 text-success" />
            ) : (
              <Circle size={18} className="shrink-0 text-muted-foreground/50" />
            )}
            <span className={cn("flex-1 text-sm font-medium", s.done && "text-muted-foreground line-through")}>
              {s.label}
            </span>
            {!s.done && (
              <button className="inline-flex items-center gap-0.5 text-xs font-semibold text-primary hover:opacity-80">
                Start <ChevronRight size={13} />
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

/* Quick-start actions + premium feature teaser */
const PREMIUM_FEATURES = [
  { icon: BarChart3, label: "Advanced analytics", desc: "Deep weekly & season trends" },
  { icon: Repeat, label: "AI trade analyzer", desc: "Grade any trade instantly" },
  { icon: Trophy, label: "Dynasty rankings", desc: "Live values + rookie picks" },
]

export function UnlockFeatures() {
  return (
    <div>
      <div className="mb-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
        <button className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90">
          <Plus size={15} /> Create league
        </button>
        <button className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-border px-3 py-2.5 text-sm font-semibold text-foreground hover:bg-secondary">
          <Swords size={15} /> Run mock draft
        </button>
      </div>
      <div className="rounded-xl border border-primary/30 bg-primary/5 p-3">
        <div className="mb-2.5 flex items-center gap-2">
          <Sparkles size={15} className="text-primary" />
          <span className="text-sm font-semibold">Unlock with Premium</span>
        </div>
        <ul className="space-y-2.5">
          {PREMIUM_FEATURES.map((f) => (
            <li key={f.label} className="flex items-center gap-2.5">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-secondary text-muted-foreground">
                <f.icon size={15} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">{f.label}</div>
                <div className="truncate text-[11px] text-muted-foreground">{f.desc}</div>
              </div>
              <Lock size={14} className="shrink-0 text-muted-foreground" />
            </li>
          ))}
        </ul>
        <button className="mt-3 w-full rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90">
          Go Premium
        </button>
      </div>
    </div>
  )
}

/* Notification / alerts list */
export function AlertsList({ limit }: { limit?: number }) {
  const items = limit ? notifications.slice(0, limit) : notifications
  return (
    <ul>
      {items.map((n) => {
        const Icon = NOTI_ICON[n.kind]
        return (
          <li key={n.id} className="flex items-start gap-3 border-b border-border/60 py-2.5 last:border-0">
            <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-secondary text-muted-foreground">
              <Icon size={14} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm leading-snug">{n.text}</p>
              <span className="text-[11px] text-muted-foreground">{n.time}</span>
            </div>
            {n.unread && <Circle size={7} className="mt-1 shrink-0 fill-primary text-primary" />}
          </li>
        )
      })}
    </ul>
  )
}

/* Trending players by points momentum */
export function TrendingPlayers({ limit = 6 }: { limit?: number }) {
  return (
    <ul>
      {players.slice(0, limit).map((p) => (
        <li key={p.id} className="flex items-center gap-3 border-b border-border/60 py-2 last:border-0">
          <PlayerAvatar name={p.name} pos={p.pos} size={28} />
          <span className="flex-1 truncate text-sm font-medium">{p.name}</span>
          <span className={cn("text-xs font-semibold", p.trend >= 0 ? "text-success" : "text-destructive")}>
            {p.trend >= 0 ? "+" : ""}
            {p.trend}
          </span>
        </li>
      ))}
    </ul>
  )
}

/* FUT-style manager skill ratings */
export function ManagerRatings() {
  const overall = Math.round(managerAttributes.reduce((s, a) => s + a.value, 0) / managerAttributes.length)
  return (
    <div>
      <div className="mb-3 flex items-baseline gap-2">
        <span className="text-3xl font-black tabular-nums text-primary">{overall}</span>
        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Overall</span>
      </div>
      <div className="grid grid-cols-2 gap-x-5 gap-y-3">
        {managerAttributes.map((a) => (
          <div key={a.key} className="flex items-center gap-2">
            <span className="w-8 text-sm font-black tabular-nums text-primary">{a.value}</span>
            <div className="min-w-0 flex-1">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{a.label}</div>
              <Progress value={a.value} className="mt-0.5 h-1.5" tone={a.value >= 85 ? "success" : "primary"} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* Recent W/L form + points trend */
export function RecentForm() {
  return (
    <div>
      <div className="mb-3 flex gap-1.5">
        {recentForm.map((r, i) => (
          <span
            key={i}
            className={cn(
              "grid h-8 flex-1 place-items-center rounded-lg text-xs font-bold",
              r === "W" ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive",
            )}
          >
            {r}
          </span>
        ))}
      </div>
      <div className="mb-1 flex items-center justify-between text-[11px] text-muted-foreground">
        <span>Points for — last 9 weeks</span>
        <span className="inline-flex items-center font-semibold text-success">
          <TrendingUp size={12} /> +12%
        </span>
      </div>
      <Sparkline data={seasonTrend.map((d) => d.pf)} width={620} height={56} className="w-full" />
    </div>
  )
}
