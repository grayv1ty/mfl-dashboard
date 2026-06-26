"use client"

import { useEffect, useMemo, useState } from "react"
import {
  Play,
  Dumbbell,
  Radio,
  ChevronRight,
  Sparkles,
  Clock,
  CheckCircle2,
  CalendarClock,
  TrendingUp,
  TrendingDown,
  Trophy,
  ArrowRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { players } from "@/lib/mock"
import { PlayerAvatar, PositionPill } from "./primitives"

/* Parse a loose "in 2d 4h 30m" string into a ms offset from now. */
function parseOffset(draftIn: string): number {
  const grab = (re: RegExp) => {
    const m = re.exec(draftIn)
    return m ? Number(m[1]) : 0
  }
  const days = grab(/(\d+)\s*d/)
  const hours = grab(/(\d+)\s*h/)
  const mins = grab(/(\d+)\s*m/)
  return ((days * 24 + hours) * 60 + mins) * 60_000
}

const pad = (n: number) => String(n).padStart(2, "0")

/* ---------------- League home: live draft countdown + live / practice ---------------- */
export function DraftEntry({ draftIn = "in 2d 4h" }: { draftIn?: string }) {
  // Lock a concrete target time once, derived from the loose offset string.
  const target = useMemo(() => Date.now() + parseOffset(draftIn), [draftIn])
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const remaining = Math.max(0, target - now)
  const live = remaining === 0
  const total = Math.floor(remaining / 1000)
  const units = [
    { label: "Days", value: Math.floor(total / 86400) },
    { label: "Hrs", value: Math.floor((total % 86400) / 3600) },
    { label: "Min", value: Math.floor((total % 3600) / 60) },
    { label: "Sec", value: total % 60 },
  ]

  return (
    <div className="flex flex-col gap-3">
      <div
        className={cn(
          "overflow-hidden rounded-xl border bg-gradient-to-br p-3",
          live ? "border-success/50 from-success/15 to-success/5" : "border-border from-secondary/60 to-secondary/20",
        )}
      >
        <div className="mb-2.5 flex items-center gap-2 text-xs font-medium">
          <span className="relative flex h-2 w-2">
            <span
              className={cn(
                "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
                live ? "bg-success" : "bg-primary",
              )}
            />
            <span className={cn("relative inline-flex h-2 w-2 rounded-full", live ? "bg-success" : "bg-primary")} />
          </span>
          {live ? (
            <span className="font-semibold text-success">Draft room is live</span>
          ) : (
            <span className="text-muted-foreground">Live draft starts in</span>
          )}
          <Radio size={14} className="ml-auto text-muted-foreground" />
        </div>

        {live ? (
          <div className="py-1.5 text-center text-2xl font-bold tracking-tight text-success">LIVE NOW</div>
        ) : (
          <div className="grid grid-cols-4 gap-1.5">
            {units.map((u) => (
              <div key={u.label} className="flex flex-col items-center rounded-lg bg-card/70 px-1 py-1.5">
                <span className="text-xl font-bold tabular-nums leading-none">{pad(u.value)}</span>
                <span className="mt-1 text-[10px] uppercase tracking-wide text-muted-foreground">{u.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <button
          className={cn(
            "inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90",
            live ? "animate-pulse bg-success" : "bg-primary",
          )}
        >
          <Play size={15} className="fill-current" /> {live ? "Enter draft room" : "Live draft"}
        </button>
        <button className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-border px-3 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary">
          <Dumbbell size={15} /> Practice draft
        </button>
      </div>
    </div>
  )
}

/* ---------------- User home: quick mock draft with simple options ---------------- */
const TEAM_SIZES = [8, 10, 12, 14] as const

const DRAFT_TYPES = [
  { id: "ppr", label: "PPR", desc: "Point per reception" },
  { id: "superflex", label: "Superflex", desc: "Two-QB flex slot" },
  { id: "dynasty", label: "Dynasty Rookie", desc: "Rookies only" },
  { id: "custom", label: "Custom", desc: "Your own rules" },
] as const

export function QuickMockDraft() {
  const [teams, setTeams] = useState<number>(12)
  const [type, setType] = useState<string>("ppr")
  const typeLabel = DRAFT_TYPES.find((t) => t.id === type)?.label ?? "Custom"

  return (
    <div>
      <p className="mb-3 text-xs text-muted-foreground">Spin up a solo mock against the clock — no league required.</p>

      <div className="mb-1.5 text-[11px] font-medium text-muted-foreground">Team size</div>
      <div className="mb-3 flex gap-1.5">
        {TEAM_SIZES.map((s) => (
          <button
            key={s}
            onClick={() => setTeams(s)}
            className={cn(
              "flex-1 rounded-lg border py-1.5 text-sm font-semibold transition-colors",
              teams === s ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:bg-secondary",
            )}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="mb-1.5 text-[11px] font-medium text-muted-foreground">Draft type</div>
      <div className="grid grid-cols-2 gap-1.5">
        {DRAFT_TYPES.map((t) => (
          <button
            key={t.id}
            onClick={() => setType(t.id)}
            className={cn(
              "rounded-lg border px-2.5 py-2 text-left transition-colors",
              type === t.id ? "border-primary bg-primary/10" : "border-border hover:bg-secondary",
            )}
          >
            <div className="text-xs font-semibold">{t.label}</div>
            <div className="truncate text-[10px] text-muted-foreground">{t.desc}</div>
          </button>
        ))}
      </div>

      <button className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90">
        <Sparkles size={15} /> Start {teams}-team {typeLabel} mock
        <ChevronRight size={15} />
      </button>
    </div>
  )
}

/* ---------------- Practice drafts (saved solo mocks) ---------------- */
export type PracticeStatus = "ongoing" | "scheduled" | "completed"

export interface PracticeDraft {
  id: string
  name: string
  teams: number
  type: string
  rounds: number
  status: PracticeStatus
  /** Your draft slot. */
  slot: number
  /** Picks made so far (= teams*rounds when completed). */
  picksMade: number
  when: string
  /** Letter grade once completed. */
  grade?: string
  /** True when it's your turn in an ongoing draft. */
  onClock?: boolean
}

export const practiceDrafts: PracticeDraft[] = [
  { id: "d1", name: "Sunday Superflex Tuner", teams: 12, type: "Superflex", rounds: 16, status: "ongoing", slot: 4, picksMade: 52, when: "Started 12m ago", onClock: true },
  { id: "d2", name: "PPR Speed Run", teams: 10, type: "PPR", rounds: 15, status: "ongoing", slot: 7, picksMade: 18, when: "Paused 1h ago" },
  { id: "d3", name: "Zero-RB Experiment", teams: 12, type: "PPR", rounds: 16, status: "completed", slot: 4, picksMade: 192, when: "Yesterday", grade: "A-" },
  { id: "d4", name: "Dynasty Rookie Mock", teams: 12, type: "Dynasty Rookie", rounds: 5, status: "completed", slot: 9, picksMade: 60, when: "3 days ago", grade: "B+" },
  { id: "d5", name: "Best Ball Bonanza", teams: 12, type: "PPR", rounds: 18, status: "completed", slot: 2, picksMade: 216, when: "Last week", grade: "B" },
  { id: "d6", name: "Friday Night Draft", teams: 14, type: "PPR", rounds: 16, status: "scheduled", slot: 11, picksMade: 0, when: "Starts in 2d 4h" },
  { id: "d7", name: "2-QB Showdown", teams: 12, type: "Superflex", rounds: 16, status: "scheduled", slot: 6, picksMade: 0, when: "Draft when ready" },
]

const STATUS_META: Record<PracticeStatus, { label: string; icon: typeof Clock; tone: string }> = {
  ongoing: { label: "In progress", icon: Clock, tone: "text-warning" },
  scheduled: { label: "Scheduled", icon: CalendarClock, tone: "text-info" },
  completed: { label: "Completed", icon: CheckCircle2, tone: "text-success" },
}

function PracticeRow({ d, onView }: { d: PracticeDraft; onView?: () => void }) {
  const meta = STATUS_META[d.status]
  const StatusIcon = meta.icon
  const totalPicks = d.teams * d.rounds
  const pct = Math.round((d.picksMade / totalPicks) * 100)
  const round = Math.min(d.rounds, Math.floor(d.picksMade / d.teams) + (d.status === "completed" ? 0 : 1))

  const cta =
    d.status === "completed"
      ? { label: "View results", solid: false }
      : d.status === "scheduled"
        ? { label: "Start", solid: true }
        : { label: d.onClock ? "You're on the clock" : "Resume", solid: Boolean(d.onClock) }

  return (
    <li className="rounded-xl border border-border bg-secondary/30 p-3 transition-colors hover:bg-secondary/50">
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate text-sm font-semibold">{d.name}</span>
            {d.onClock && (
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-warning opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-warning" />
              </span>
            )}
          </div>
          <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-muted-foreground">
            <span>{d.teams}-team {d.type}</span>
            <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
            <span>{d.rounds} rounds</span>
            <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
            <span>Pick {d.slot}</span>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <StatusIcon size={13} className={meta.tone} />
          <span className={cn("text-[11px] font-medium", meta.tone)}>
            {d.status === "completed" && d.grade ? `Graded ${d.grade}` : meta.label}
          </span>
        </div>
      </div>

      {d.status === "ongoing" && (
        <div className="mt-2.5">
          <div className="mb-1 flex items-center justify-between text-[10px] text-muted-foreground">
            <span>Round {round} of {d.rounds}</span>
            <span className="tabular-nums">{d.picksMade}/{totalPicks} picks</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-border">
            <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
          </div>
        </div>
      )}

      <div className="mt-2.5 flex items-center justify-between">
        <span className="text-[11px] text-muted-foreground">{d.when}</span>
        <button
          onClick={d.status === "completed" ? onView : undefined}
          className={cn(
            "inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition",
            cta.solid
              ? "bg-primary text-primary-foreground hover:opacity-90"
              : "border border-border text-foreground hover:bg-secondary",
          )}
        >
          {cta.label}
          <ChevronRight size={13} />
        </button>
      </div>
    </li>
  )
}

export function PracticeDraftList({ onViewResults }: { onViewResults?: () => void }) {
  const groups: { key: PracticeStatus; title: string }[] = [
    { key: "ongoing", title: "Continue drafting" },
    { key: "scheduled", title: "Queued" },
    { key: "completed", title: "Past drafts" },
  ]
  return (
    <div className="space-y-4">
      {groups.map((g) => {
        const items = practiceDrafts.filter((d) => d.status === g.key)
        if (!items.length) return null
        return (
          <div key={g.key}>
            <div className="mb-1.5 flex items-center gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{g.title}</span>
              <span className="rounded-full bg-secondary px-1.5 text-[10px] font-semibold text-muted-foreground">{items.length}</span>
            </div>
            <ul className="space-y-2">
              {items.map((d) => (
                <PracticeRow key={d.id} d={d} onView={onViewResults} />
              ))}
            </ul>
          </div>
        )
      })}
    </div>
  )
}

/* ---------------- Results recap ---------------- */
/* A completed practice draft, graded pick-by-pick against ADP.
   value = overall pick − ADP; positive means the player fell to you (a steal). */
interface ResultPick {
  round: number
  overall: number
  playerId: string
}

const RESULT_PICKS: ResultPick[] = [
  { round: 1, overall: 4, playerId: "p3" },
  { round: 2, overall: 21, playerId: "p8" },
  { round: 3, overall: 28, playerId: "p11" },
  { round: 4, overall: 45, playerId: "p24" },
  { round: 5, overall: 52, playerId: "p15" },
  { round: 6, overall: 69, playerId: "p13" },
  { round: 7, overall: 76, playerId: "p14" },
  { round: 8, overall: 93, playerId: "p16" },
]

function valueTone(v: number) {
  if (v >= 5) return "text-success"
  if (v <= -5) return "text-destructive"
  return "text-muted-foreground"
}

function valueLabel(v: number) {
  if (v >= 5) return "Steal"
  if (v <= -5) return "Reach"
  return "On value"
}

export function DraftResults() {
  const rows = RESULT_PICKS.map((rp) => {
    const player = players.find((p) => p.id === rp.playerId)!
    return { ...rp, player, value: rp.overall - player.adp }
  })

  const best = rows.reduce((a, b) => (b.value > a.value ? b : a))
  const reach = rows.reduce((a, b) => (b.value < a.value ? b : a))
  const projTotal = rows.reduce((s, r) => s + r.player.proj, 0)
  const netValue = rows.reduce((s, r) => s + r.value, 0)

  return (
    <div className="space-y-4">
      {/* Recap header with overall grade */}
      <div className="flex items-center gap-4 rounded-xl border border-border bg-gradient-to-br from-primary/10 to-transparent p-4">
        <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl border border-primary/40 bg-primary/10">
          <span className="text-2xl font-bold text-primary">A-</span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 text-sm font-semibold">
            <Trophy size={15} className="text-primary" /> Zero-RB Experiment
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">
            12-team PPR · Pick 4 · You drafted from the 4-slot and let value come to you.
          </p>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px]">
            <span className="text-muted-foreground">Proj. starters <span className="font-semibold text-foreground">{projTotal.toFixed(1)} pts</span></span>
            <span className="text-muted-foreground">Net draft value <span className={cn("font-semibold", valueTone(netValue))}>{netValue > 0 ? "+" : ""}{netValue}</span></span>
          </div>
        </div>
      </div>

      {/* Best pick / biggest reach callouts */}
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        <div className="flex items-center gap-3 rounded-xl border border-success/30 bg-success/5 p-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-success/15 text-success">
            <TrendingUp size={17} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="text-[11px] font-medium text-success">Best value</div>
            <div className="truncate text-sm font-semibold">{best.player.name}</div>
            <div className="text-[11px] text-muted-foreground">Pick {best.overall} · ADP {best.player.adp} · +{best.value}</div>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-destructive/15 text-destructive">
            <TrendingDown size={17} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="text-[11px] font-medium text-destructive">Biggest reach</div>
            <div className="truncate text-sm font-semibold">{reach.player.name}</div>
            <div className="text-[11px] text-muted-foreground">Pick {reach.overall} · ADP {reach.player.adp} · {reach.value}</div>
          </div>
        </div>
      </div>

      {/* Pick-by-pick board */}
      <div>
        <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Your picks</div>
        <ul className="divide-y divide-border/60 overflow-hidden rounded-xl border border-border">
          {rows.map((r) => (
            <li key={r.overall} className="flex items-center gap-3 bg-card px-3 py-2.5">
              <div className="flex w-9 shrink-0 flex-col items-center">
                <span className="text-[10px] text-muted-foreground">R{r.round}</span>
                <span className="text-sm font-bold tabular-nums">{r.overall}</span>
              </div>
              <PlayerAvatar name={r.player.name} pos={r.player.pos} size={30} />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">{r.player.name}</div>
                <div className="text-[11px] text-muted-foreground">{r.player.team} · ADP {r.player.adp}</div>
              </div>
              <PositionPill pos={r.player.pos} />
              <div className="w-16 shrink-0 text-right">
                <div className={cn("text-sm font-bold tabular-nums", valueTone(r.value))}>
                  {r.value > 0 ? "+" : ""}{r.value}
                </div>
                <div className={cn("text-[10px] font-medium", valueTone(r.value))}>{valueLabel(r.value)}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <button className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-border px-3 py-2.5 text-sm font-semibold transition-colors hover:bg-secondary">
        Re-run this draft <ArrowRight size={15} />
      </button>
    </div>
  )
}
