"use client"

import { useState } from "react"
import { ChevronDown, SlidersHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  scoreboard,
  getBoxScore,
  nflTeamNames,
  type ScoreGame,
  type ScoreSide,
  type PassRow,
  type RushRow,
  type Position,
} from "@/lib/mock"
import { TeamLogo, PlayerAvatar } from "./primitives"

const WEEKS = Array.from({ length: 18 }, (_, i) => `Week ${i + 1}`)
const TABS = ["Box Score", "Play-By-Play", "Scoring Summary"] as const

const dash = (n: number) => (n ? n : "—")

/* ---------------- Box-score header ---------------- */
function TeamBlock({ side, align }: { side: ScoreSide; align: "left" | "right" }) {
  return (
    <div className={cn("flex min-w-0 items-center gap-3", align === "right" && "flex-row-reverse text-right")}>
      <TeamLogo abbr={side.abbr} size={52} />
      <div className="min-w-0">
        <div className="truncate text-lg font-bold leading-tight sm:text-xl">{nflTeamNames[side.abbr] ?? side.abbr}</div>
        <div className="text-xs text-muted-foreground">{align === "left" ? "Away" : "Home"}</div>
      </div>
    </div>
  )
}

function LineScore({ away, home }: { away: ScoreSide; home: ScoreSide }) {
  return (
    <table className="text-center text-sm tabular-nums">
      <thead>
        <tr className="text-xs text-muted-foreground">
          <th className="w-10" />
          {[1, 2, 3, 4].map((q) => (
            <th key={q} className="w-8 pb-1 font-medium">
              {q}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {[away, home].map((t) => (
          <tr key={t.abbr}>
            <td className="pr-2 text-left text-xs font-semibold text-muted-foreground">{t.abbr}</td>
            {t.quarters.map((v, i) => (
              <td key={i} className="px-1 font-medium">
                {v}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function BoxHeader({ game }: { game: ScoreGame }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card">
      {/* Angled team-color wash */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-16 -top-16 h-56 w-72 -rotate-12 bg-primary/25 blur-2xl" />
        <div className="absolute -bottom-16 -right-16 h-56 w-72 -rotate-12 bg-destructive/25 blur-2xl" />
      </div>
      <div className="relative grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-5 py-6 sm:gap-6 sm:px-8">
        <TeamBlock side={game.away} align="left" />
        <div className="flex items-center gap-4 sm:gap-6">
          <span className="text-4xl font-bold tabular-nums sm:text-5xl">{game.away.score}</span>
          <div className="flex flex-col items-center gap-1">
            <span className="text-xs font-semibold text-muted-foreground">{game.status === "final" ? "Final." : game.status}</span>
            <LineScore away={game.away} home={game.home} />
          </div>
          <span className="text-4xl font-bold tabular-nums sm:text-5xl">{game.home.score}</span>
        </div>
        <TeamBlock side={game.home} align="right" />
      </div>
    </div>
  )
}

/* ---------------- Stat tables ---------------- */
function sumPass(rows: PassRow[]): PassRow {
  const t = rows.reduce(
    (a, r) => ({ att: a.att + r.att, comp: a.comp + r.comp, yds: a.yds + r.yds, td: a.td + r.td, int: a.int + r.int, sk: a.sk + r.sk, fd: a.fd + r.fd }),
    { att: 0, comp: 0, yds: 0, td: 0, int: 0, sk: 0, fd: 0 },
  )
  return { name: "Team", pos: "", avg: t.att ? Math.round((t.yds / t.att) * 10) / 10 : 0, ...t }
}
function sumRush(rows: RushRow[]): RushRow {
  const t = rows.reduce(
    (a, r) => ({ rush: a.rush + r.rush, yds: a.yds + r.yds, td: a.td + r.td, long: Math.max(a.long, r.long), fd: a.fd + r.fd }),
    { rush: 0, yds: 0, td: 0, long: 0, fd: 0 },
  )
  return { name: "Team", pos: "", avg: t.rush ? Math.round((t.yds / t.rush) * 10) / 10 : 0, ...t }
}

const POS_TONE: Record<string, string> = { QB: "text-pos-qb", RB: "text-pos-rb", WR: "text-pos-wr", TE: "text-pos-te" }

function PlayerCell({ name, pos }: { name: string; pos: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <PlayerAvatar name={name} pos={(pos || "RB") as Position} size={26} />
      <span className="font-medium">{name}</span>
      {pos && <span className={cn("text-[10px] font-bold", POS_TONE[pos] ?? "text-muted-foreground")}>{pos}</span>}
    </div>
  )
}

function StatTable<T extends { name: string; pos: string }>({
  abbr,
  cols,
  rows,
  total,
  cell,
}: {
  abbr: string
  cols: string[]
  rows: T[]
  total: T
  cell: (r: T, c: string) => number
}) {
  const render = (r: T, isTotal: boolean) => (
    <tr className={cn("border-b border-border/50 last:border-0", isTotal && "bg-secondary/30 font-semibold")}>
      <td className="py-2 pl-3">
        {isTotal ? <span className="text-xs uppercase tracking-wide text-muted-foreground">Team {abbr}</span> : <PlayerCell name={r.name} pos={r.pos} />}
      </td>
      {cols.map((c) => {
        const v = cell(r, c)
        const dashCol = c === "TD" || c === "Int" || c === "SK" || c === "Long"
        return (
          <td key={c} className="px-2 py-2 text-right tabular-nums">
            {isTotal && dashCol ? (v ? v : "") : dashCol ? dash(v) : v}
          </td>
        )
      })}
    </tr>
  )
  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-secondary/40 text-xs text-muted-foreground">
            <th className="py-2.5 pl-3 text-left font-medium">Player</th>
            {cols.map((c) => (
              <th key={c} className="px-2 py-2.5 text-right font-medium">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <Row key={i}>{render(r, false)}</Row>
          ))}
          {render(total, true)}
        </tbody>
      </table>
    </div>
  )
}
/* tbody requires <tr> children directly; small passthrough keeps keys tidy. */
function Row({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

const PASS_COLS = ["Att", "Comp", "Yds", "Avg", "TD", "Int", "SK", "FD"]
const RUSH_COLS = ["Rush", "Yds", "Avg", "TD", "Long", "FD"]
const passCell = (r: PassRow, c: string): number =>
  ({ Att: r.att, Comp: r.comp, Yds: r.yds, Avg: r.avg, TD: r.td, Int: r.int, SK: r.sk, FD: r.fd }[c] ?? 0)
const rushCell = (r: RushRow, c: string): number =>
  ({ Rush: r.rush, Yds: r.yds, Avg: r.avg, TD: r.td, Long: r.long, FD: r.fd }[c] ?? 0)

function StatSection({ label, away, home }: { label: string; away: React.ReactNode; home: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-center gap-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        {label}
        <span className="h-px flex-1 bg-border" />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {away}
        {home}
      </div>
    </div>
  )
}

/* ---------------- Matches rail ---------------- */
function MatchCard({ game, active, onSelect }: { game: ScoreGame; active: boolean; onSelect: () => void }) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        "flex w-full items-center gap-2 rounded-xl border px-3 py-2.5 text-left transition-colors",
        active ? "border-primary bg-primary/15" : "border-border bg-card hover:bg-secondary/60",
      )}
    >
      <div className="flex w-14 flex-col items-center gap-1">
        <TeamLogo abbr={game.away.abbr} size={20} />
        <span className="text-xs font-bold">{game.away.abbr}</span>
        <span className="text-[10px] text-muted-foreground">({game.away.record})</span>
      </div>
      <div className="flex flex-1 flex-col items-center">
        <span className="text-base font-bold tabular-nums">
          {game.away.score}-{game.home.score}
        </span>
        <span className={cn("text-[10px]", active ? "text-primary-foreground/80" : "text-muted-foreground")}>
          {game.day} {game.time}
        </span>
      </div>
      <div className="flex w-14 flex-col items-center gap-1">
        <TeamLogo abbr={game.home.abbr} size={20} />
        <span className="text-xs font-bold">{game.home.abbr}</span>
        <span className="text-[10px] text-muted-foreground">({game.home.record})</span>
      </div>
    </button>
  )
}

function WeekSelect({ week, onChange }: { week: string; onChange: (w: string) => void }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 rounded-lg border border-border bg-secondary/60 px-2.5 py-1.5 text-xs font-semibold uppercase tracking-wide hover:bg-secondary"
      >
        {week}
        <span className="h-1.5 w-1.5 rounded-full bg-success" />
        <ChevronDown size={13} className={cn("transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-20" onClick={() => setOpen(false)} aria-hidden />
          <div className="absolute right-0 top-10 z-30 max-h-72 w-36 overflow-y-auto rounded-xl border border-border bg-popover p-1 shadow-xl no-scrollbar">
            {WEEKS.map((w) => (
              <button
                key={w}
                onClick={() => {
                  onChange(w)
                  setOpen(false)
                }}
                className={cn(
                  "flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-sm hover:bg-secondary",
                  w === week ? "font-semibold text-foreground" : "text-muted-foreground",
                )}
              >
                {w}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

/* ---------------- Page ---------------- */
export function ScoresPage() {
  const [selectedId, setSelectedId] = useState(scoreboard[0].id)
  const [week, setWeek] = useState("Week 1")
  const [tab, setTab] = useState<(typeof TABS)[number]>("Box Score")

  const game = scoreboard.find((g) => g.id === selectedId) ?? scoreboard[0]
  const box = getBoxScore(game)

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
      {/* Box score */}
      <div className="space-y-4">
        <BoxHeader game={game} />

        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-base font-semibold">Match stats</h2>
            <div className="ml-auto flex items-center gap-1.5">
              {TABS.map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors",
                    t === tab ? "border-border bg-secondary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground",
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {tab === "Box Score" ? (
            <div className="mt-5 space-y-6">
              <StatSection
                label="Passing"
                away={<StatTable abbr={game.away.abbr} cols={PASS_COLS} rows={box.passing.away} total={sumPass(box.passing.away)} cell={passCell} />}
                home={<StatTable abbr={game.home.abbr} cols={PASS_COLS} rows={box.passing.home} total={sumPass(box.passing.home)} cell={passCell} />}
              />
              <StatSection
                label="Rushing"
                away={<StatTable abbr={game.away.abbr} cols={RUSH_COLS} rows={box.rushing.away} total={sumRush(box.rushing.away)} cell={rushCell} />}
                home={<StatTable abbr={game.home.abbr} cols={RUSH_COLS} rows={box.rushing.home} total={sumRush(box.rushing.home)} cell={rushCell} />}
              />
            </div>
          ) : (
            <div className="mt-5 grid place-items-center rounded-xl border border-dashed border-border py-16 text-sm text-muted-foreground">
              {tab} view is coming soon.
            </div>
          )}
        </div>
      </div>

      {/* Matches rail */}
      <aside className="rounded-2xl border border-border bg-card p-3">
        <div className="mb-3 flex items-center gap-2 px-1">
          <h2 className="text-sm font-semibold uppercase tracking-wide">Matches</h2>
          <div className="ml-auto flex items-center gap-1.5">
            <WeekSelect week={week} onChange={setWeek} />
            <button
              className="grid h-8 w-8 place-items-center rounded-lg border border-border text-muted-foreground hover:bg-secondary hover:text-foreground"
              aria-label="Filter matches"
            >
              <SlidersHorizontal size={15} />
            </button>
          </div>
        </div>
        <div className="space-y-2">
          {scoreboard.map((g) => (
            <MatchCard key={g.id} game={g} active={g.id === selectedId} onSelect={() => setSelectedId(g.id)} />
          ))}
        </div>
      </aside>
    </div>
  )
}
