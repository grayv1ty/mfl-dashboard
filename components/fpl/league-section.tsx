"use client"

import { useState } from "react"
import { Search, Gavel, ChevronDown, ArrowUp, ArrowDown, Plus, List, LayoutGrid, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { players, standings, transactions, POSITION_COLORS, type Player, type Position } from "@/lib/mock"
import { Panel, PanelHeader, Tag, TeamAvatar, PlayerAvatar, PositionPill } from "./primitives"
import { DraftEntry } from "./draft-entry"

const MY_TEAM_ID = standings[0].id

interface SlotDef {
  id: string
  pos: string
}
const SLOT_DEFS: SlotDef[] = [
  { id: "QB", pos: "QB" },
  { id: "RB1", pos: "RB" },
  { id: "RB2", pos: "RB" },
  { id: "WR1", pos: "WR" },
  { id: "WR2", pos: "WR" },
  { id: "TE", pos: "TE" },
  { id: "FLEX", pos: "FLEX" },
]

/** Can a player fill a given lineup slot? FLEX takes RB/WR/TE. */
function eligible(slotPos: string, playerPos: string): boolean {
  if (slotPos === "FLEX") return playerPos === "RB" || playerPos === "WR" || playerPos === "TE"
  return slotPos === playerPos
}

/* Page header shared by the filtered league sections. */
function SectionHeader({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="mb-4">
      <h1 className="text-xl font-bold tracking-tight">{title}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
    </div>
  )
}

/* Pill filter bar — the on-page replacement for sub-menus. */
function FilterBar({
  options,
  value,
  onChange,
  children,
}: {
  options: string[]
  value: string
  onChange: (v: string) => void
  children?: React.ReactNode
}) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => (
          <button
            key={o}
            onClick={() => onChange(o)}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
              o === value ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground",
            )}
          >
            {o}
          </button>
        ))}
      </div>
      {children}
    </div>
  )
}

function TradesList() {
  return (
    <ul className="divide-y divide-border/60">
      {transactions.map((t) => (
        <li key={t.id} className="flex items-center gap-3 py-3">
          <Tag tone={t.type === "trade" ? "info" : t.type === "add" ? "success" : "muted"}>{t.type}</Tag>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-medium">{t.player}</div>
            <div className="truncate text-[11px] text-muted-foreground">
              {t.team} · {t.detail}
            </div>
          </div>
          <span className="shrink-0 text-[11px] text-muted-foreground">{t.time}</span>
        </li>
      ))}
    </ul>
  )
}

/* ---------------- Roster model ---------------- */
interface Lineup {
  slots: Record<string, Player | null>
  bench: Player[]
}

/** Build a deterministic lineup for a team (rotated pool so teams differ). */
function rosterFor(teamIdx: number): Lineup {
  const rot = (teamIdx * 5) % players.length
  const pool = [...players.slice(rot), ...players.slice(0, rot)]
  const slots: Record<string, Player | null> = {}
  const used = new Set<string>()
  for (const d of SLOT_DEFS) {
    const p = pool.find((pl) => !used.has(pl.id) && eligible(d.pos, pl.pos))
    slots[d.id] = p ?? null
    if (p) used.add(p.id)
  }
  return { slots, bench: pool.filter((pl) => !used.has(pl.id)) }
}

const filledStarters = (l: Lineup) => Object.values(l.slots).filter((p): p is Player => Boolean(p))

/* ---------------- Player rows / cards ---------------- */
function PlayerLine({ player, slot, onBench }: { player: Player; slot?: string; onBench?: () => void }) {
  return (
    <div className="flex items-center gap-3 py-2">
      {slot && <span className="w-9 shrink-0 text-center text-[11px] font-bold uppercase text-muted-foreground">{slot}</span>}
      <PlayerAvatar name={player.name} pos={player.pos} size={32} />
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium">{player.name}</div>
        <div className="text-[11px] text-muted-foreground">{player.team}</div>
      </div>
      <PositionPill pos={player.pos} />
      <span className="w-12 text-right text-sm font-bold tabular-nums">{player.points.toFixed(1)}</span>
      {onBench && (
        <button
          onClick={onBench}
          title="Move to bench"
          className="grid h-7 w-7 shrink-0 place-items-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <ArrowDown size={14} />
        </button>
      )}
    </div>
  )
}

function PlayerCard({ player, onBench }: { player: Player; onBench?: () => void }) {
  return (
    <div className="flex min-w-0 flex-col items-center rounded-xl border border-border bg-secondary/30 p-3 text-center">
      <PlayerAvatar name={player.name} pos={player.pos} size={44} />
      <div className="mt-2 w-full truncate text-sm font-medium">{player.name}</div>
      <div className="mb-2 flex max-w-full items-center gap-1.5 text-[11px] text-muted-foreground">
        <PositionPill pos={player.pos} /> <span className="truncate">{player.team}</span>
      </div>
      <div className="text-lg font-bold tabular-nums">{player.points.toFixed(1)}</div>
      {onBench && (
        <button
          onClick={onBench}
          className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-md border border-border py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <ArrowDown size={13} /> Bench
        </button>
      )}
    </div>
  )
}

function EmptySlotLine({ pos }: { pos: string }) {
  return (
    <div className="flex items-center gap-3 py-2">
      <span className="w-9 shrink-0 text-center text-[11px] font-bold uppercase text-muted-foreground">{pos}</span>
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-dashed border-border text-muted-foreground/70">
        <Plus size={14} />
      </span>
      <span className="flex-1 text-sm text-muted-foreground">Empty slot</span>
    </div>
  )
}

function EmptySlotCard({ pos }: { pos: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-secondary/10 p-3 text-center">
      <span className="grid h-11 w-11 place-items-center rounded-full border border-dashed border-border text-muted-foreground/70">
        <Plus size={18} />
      </span>
      <div className="mt-2 text-sm font-medium text-muted-foreground">{pos}</div>
      <div className="text-[11px] text-muted-foreground">Empty</div>
    </div>
  )
}

/* Bench player with a slot picker — promoting requires choosing a slot. */
interface SlotOption {
  id: string
  pos: string
  player: Player | null
}
function BenchItem({
  player,
  view,
  slots,
  onStart,
}: {
  player: Player
  view: "table" | "cards"
  slots: SlotOption[]
  onStart: (p: Player, slotId: string) => void
}) {
  const [open, setOpen] = useState(false)
  const menu = open && (
    <>
      <div className="fixed inset-0 z-20" onClick={() => setOpen(false)} aria-hidden />
      <div className="absolute right-0 top-9 z-30 w-56 rounded-xl border border-border bg-popover p-1 shadow-xl">
        <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Move to slot</div>
        {slots.map((s) => (
          <button
            key={s.id}
            onClick={() => {
              onStart(player, s.id)
              setOpen(false)
            }}
            className="flex w-full items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-left text-sm hover:bg-secondary"
          >
            <span className="font-semibold">{s.pos}</span>
            <span className="truncate text-xs text-muted-foreground">{s.player ? `Replace ${s.player.name}` : "Empty"}</span>
          </button>
        ))}
        {slots.length === 0 && <div className="px-2 py-1.5 text-xs text-muted-foreground">No eligible slot</div>}
      </div>
    </>
  )

  if (view === "cards") {
    return (
      <div className="flex min-w-0 flex-col items-center rounded-xl border border-border bg-secondary/30 p-3 text-center">
        <PlayerAvatar name={player.name} pos={player.pos} size={44} />
        <div className="mt-2 w-full truncate text-sm font-medium">{player.name}</div>
        <div className="mb-2 flex max-w-full items-center gap-1.5 text-[11px] text-muted-foreground">
          <PositionPill pos={player.pos} /> <span className="truncate">{player.team}</span>
        </div>
        <div className="text-lg font-bold tabular-nums">{player.points.toFixed(1)}</div>
        <div className="relative mt-2 w-full">
          <button
            onClick={() => setOpen((o) => !o)}
            className="flex w-full items-center justify-center gap-1.5 rounded-md border border-border py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <ArrowUp size={13} /> Start
          </button>
          {menu}
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3 py-2">
      <PlayerAvatar name={player.name} pos={player.pos} size={32} />
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium">{player.name}</div>
        <div className="text-[11px] text-muted-foreground">{player.team}</div>
      </div>
      <PositionPill pos={player.pos} />
      <span className="w-12 text-right text-sm font-bold tabular-nums">{player.points.toFixed(1)}</span>
      <div className="relative">
        <button
          onClick={() => setOpen((o) => !o)}
          title="Add to lineup"
          className="grid h-7 w-7 shrink-0 place-items-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <ArrowUp size={14} />
        </button>
        {menu}
      </div>
    </div>
  )
}

/* ---------------- Starters / Bench views ---------------- */
function StartersView({
  lineup,
  view,
  editable,
  onBench,
  dense = false,
}: {
  lineup: Lineup
  view: "table" | "cards"
  editable: boolean
  onBench: (slotId: string) => void
  dense?: boolean
}) {
  const slots = SLOT_DEFS.map((d) => ({ id: d.id, pos: d.pos, player: lineup.slots[d.id] ?? null }))
  if (view === "cards") {
    return (
      <div className={cn("grid gap-2.5", dense ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4")}>
        {slots.map((s) =>
          s.player ? (
            <PlayerCard key={s.id} player={s.player} onBench={editable ? () => onBench(s.id) : undefined} />
          ) : (
            <EmptySlotCard key={s.id} pos={s.pos} />
          ),
        )}
      </div>
    )
  }
  return (
    <div className="divide-y divide-border/60">
      {slots.map((s) =>
        s.player ? (
          <PlayerLine key={s.id} player={s.player} slot={s.pos} onBench={editable ? () => onBench(s.id) : undefined} />
        ) : (
          <EmptySlotLine key={s.id} pos={s.pos} />
        ),
      )}
    </div>
  )
}

function BenchView({
  lineup,
  view,
  editable,
  onStart,
  dense = false,
}: {
  lineup: Lineup
  view: "table" | "cards"
  editable: boolean
  onStart: (p: Player, slotId: string) => void
  dense?: boolean
}) {
  const slotsFor = (p: Player): SlotOption[] =>
    SLOT_DEFS.filter((d) => eligible(d.pos, p.pos)).map((d) => ({ id: d.id, pos: d.pos, player: lineup.slots[d.id] ?? null }))

  if (lineup.bench.length === 0) return <p className="py-4 text-center text-sm text-muted-foreground">No bench players.</p>

  if (view === "cards") {
    return (
      <div className={cn("grid gap-2.5", dense ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4")}>
        {lineup.bench.map((p) =>
          editable ? (
            <BenchItem key={p.id} player={p} view="cards" slots={slotsFor(p)} onStart={onStart} />
          ) : (
            <PlayerCard key={p.id} player={p} />
          ),
        )}
      </div>
    )
  }
  return (
    <div className="divide-y divide-border/60">
      {lineup.bench.map((p) =>
        editable ? (
          <BenchItem key={p.id} player={p} view="table" slots={slotsFor(p)} onStart={onStart} />
        ) : (
          <PlayerLine key={p.id} player={p} />
        ),
      )}
    </div>
  )
}

/* ---------------- Controls ---------------- */
function TeamSelect({ teamId, onChange }: { teamId: string; onChange: (id: string) => void }) {
  const [open, setOpen] = useState(false)
  const team = standings.find((t) => t.id === teamId)
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-lg border border-border bg-secondary/50 py-1.5 pl-2 pr-2.5 text-sm font-medium hover:bg-secondary"
      >
        {team ? (
          <TeamAvatar seed={team.avatar} label={team.name} size={22} />
        ) : (
          <span className="grid h-[22px] w-[22px] place-items-center rounded-md bg-primary/15 text-primary">
            <LayoutGrid size={13} />
          </span>
        )}
        <span className="max-w-[10rem] truncate">{team ? team.name : "All teams"}</span>
        {team?.id === MY_TEAM_ID && <Tag tone="primary">You</Tag>}
        <ChevronDown size={14} className={cn("text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-20" onClick={() => setOpen(false)} aria-hidden />
          <div className="absolute left-0 top-11 z-30 max-h-80 w-64 overflow-y-auto rounded-xl border border-border bg-popover p-1 shadow-xl no-scrollbar">
            <button
              onClick={() => {
                onChange("all")
                setOpen(false)
              }}
              className={cn(
                "flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-sm hover:bg-secondary",
                teamId === "all" && "bg-secondary",
              )}
            >
              <span className="grid h-6 w-6 place-items-center rounded-md bg-primary/15 text-primary">
                <LayoutGrid size={14} />
              </span>
              <span className="flex-1 truncate font-medium">All teams</span>
              {teamId === "all" && <Check size={15} className="text-primary" />}
            </button>
            <div className="my-1 h-px bg-border" />
            {standings.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  onChange(t.id)
                  setOpen(false)
                }}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-sm hover:bg-secondary",
                  t.id === teamId && "bg-secondary",
                )}
              >
                <TeamAvatar seed={t.avatar} label={t.name} size={24} />
                <span className="flex-1 truncate">{t.name}</span>
                {t.id === MY_TEAM_ID && <Tag tone="primary">You</Tag>}
                {t.id === teamId && <Check size={15} className="text-primary" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function ViewToggle({ view, onChange }: { view: "table" | "cards"; onChange: (v: "table" | "cards") => void }) {
  return (
    <div className="flex items-center gap-1 rounded-lg border border-border bg-secondary/50 p-0.5">
      {(["table", "cards"] as const).map((v) => (
        <button
          key={v}
          onClick={() => onChange(v)}
          title={v === "table" ? "Table view" : "Card view"}
          className={cn(
            "grid h-7 w-7 place-items-center rounded-md transition-colors",
            view === v ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
          )}
        >
          {v === "table" ? <List size={15} /> : <LayoutGrid size={15} />}
        </button>
      ))}
    </div>
  )
}

/* One team's roster inside a single panel — used in the "All teams" grid. */
function TeamRosterBlock({
  teamIdx,
  lineup,
  view,
  editable,
  onBench,
  onStart,
}: {
  teamIdx: number
  lineup: Lineup
  view: "table" | "cards"
  editable: boolean
  onBench: (slotId: string) => void
  onStart: (p: Player, slotId: string) => void
}) {
  const team = standings[teamIdx]
  const [showBench, setShowBench] = useState(false)
  return (
    <Panel>
      <div className="flex items-center gap-2.5 px-4 pb-1.5 pt-3.5">
        <TeamAvatar seed={team.avatar} label={team.name} size={26} />
        <h3 className="truncate text-sm font-semibold tracking-tight">{team.name}</h3>
        {team.id === MY_TEAM_ID && <Tag tone="primary">You</Tag>}
        <span className="ml-auto shrink-0 text-[11px] tabular-nums text-muted-foreground">
          {team.wins}-{team.losses} · {team.pf} PF
        </span>
      </div>
      <div className="px-4 pb-4">
        <StartersView lineup={lineup} view={view} editable={editable} onBench={onBench} dense />
        <button
          onClick={() => setShowBench((s) => !s)}
          className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg border border-border py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <ChevronDown size={13} className={cn("transition-transform", showBench && "rotate-180")} />
          {showBench ? "Hide bench" : `Show bench (${lineup.bench.length})`}
        </button>
        {showBench && (
          <div className="mt-2">
            <BenchView lineup={lineup} view={view} editable={editable} onStart={onStart} dense />
          </div>
        )}
      </div>
    </Panel>
  )
}

/* ---------------- Table (position matrix) ---------------- */
const POS_COLUMNS: { key: string; label: string; color: string; slots: string[] }[] = [
  { key: "QB", label: "Quarterback", color: "var(--pos-qb)", slots: ["QB"] },
  { key: "RB", label: "Running Back", color: "var(--pos-rb)", slots: ["RB1", "RB2"] },
  { key: "WR", label: "Wide Receiver", color: "var(--pos-wr)", slots: ["WR1", "WR2"] },
  { key: "TE", label: "Tight End", color: "var(--pos-te)", slots: ["TE"] },
  { key: "FLEX", label: "Flex", color: "var(--pos-flex)", slots: ["FLEX"] },
  { key: "K", label: "Kicker", color: "var(--pos-k)", slots: [] },
  { key: "DEF", label: "Defense", color: "var(--pos-def)", slots: [] },
]

function PlayerMini({ player }: { player: Player }) {
  return (
    <div className="flex items-center gap-2">
      <PlayerAvatar name={player.name} pos={player.pos} size={26} />
      <div className="min-w-0">
        <div className="truncate text-sm font-medium leading-tight">{player.name}</div>
        <div className="text-[10px] text-muted-foreground">{player.team}</div>
      </div>
    </div>
  )
}

/** Teams × positions overview — one row per team, starters grouped by slot. */
function MatrixTable({ teamIdxs, lineupFor }: { teamIdxs: number[]; lineupFor: (idx: number) => Lineup }) {
  return (
    <Panel className="overflow-hidden">
      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full min-w-[1040px] border-collapse text-left">
          <thead>
            <tr className="border-b border-border">
              <th className="sticky left-0 z-10 bg-card px-4 py-3 text-sm font-semibold">Team</th>
              {POS_COLUMNS.map((c) => (
                <th key={c.key} className="px-3 py-3 text-sm font-medium text-muted-foreground">
                  <span className="flex items-center gap-1.5 whitespace-nowrap">
                    <span className="h-2 w-2 rounded-full" style={{ background: c.color }} />
                    {c.label}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {teamIdxs.map((idx) => {
              const team = standings[idx]
              const lineup = lineupFor(idx)
              return (
                <tr key={team.id} className="border-b border-border/60 last:border-0 hover:bg-secondary/20">
                  <td className="sticky left-0 z-10 bg-card px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <TeamAvatar seed={team.avatar} label={team.name} size={28} />
                      <span className="whitespace-nowrap text-sm font-semibold">{team.name}</span>
                    </div>
                  </td>
                  {POS_COLUMNS.map((c) => {
                    const ps = c.slots.map((s) => lineup.slots[s]).filter((p): p is Player => Boolean(p))
                    return (
                      <td key={c.key} className="px-3 py-3 align-middle">
                        {ps.length > 0 ? (
                          <div className="space-y-1.5">
                            {ps.map((p) => (
                              <PlayerMini key={p.id} player={p} />
                            ))}
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground/40">—</span>
                        )}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </Panel>
  )
}

function TradesPanel() {
  return (
    <Panel>
      <PanelHeader title="Recent Trades & Moves" />
      <div className="px-4 pb-3">
        <TradesList />
      </div>
    </Panel>
  )
}

function SummaryPanel({ lineup, isAll }: { lineup: Lineup; isAll: boolean }) {
  const starters = filledStarters(lineup)
  const stats = [
    { label: "Starters", value: `${starters.length}/${SLOT_DEFS.length}` },
    { label: "Bench", value: lineup.bench.length },
    { label: "Proj. PF", value: starters.reduce((s, p) => s + p.proj, 0).toFixed(1) },
    { label: "Total Pts", value: starters.reduce((s, p) => s + p.points, 0).toFixed(1) },
  ]
  return (
    <Panel>
      <PanelHeader title={isAll ? "Your Roster Summary" : "Roster Summary"} />
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border">
        {stats.map((s) => (
          <div key={s.label} className="bg-card px-4 py-3">
            <div className="text-lg font-bold tabular-nums">{s.value}</div>
            <div className="text-[11px] text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>
    </Panel>
  )
}

function RosterView() {
  const [teamId, setTeamId] = useState<string>("all")
  const [view, setView] = useState<"table" | "cards">("table")
  const [myLineup, setMyLineup] = useState<Lineup>(() => rosterFor(0))

  const isAll = teamId === "all"
  const isMine = teamId === MY_TEAM_ID
  const teamIdx = standings.findIndex((t) => t.id === teamId)

  const benchSlot = (slotId: string) =>
    setMyLineup((cur) => {
      const p = cur.slots[slotId]
      if (!p) return cur
      return { slots: { ...cur.slots, [slotId]: null }, bench: [...cur.bench, p] }
    })
  const startInSlot = (player: Player, slotId: string) =>
    setMyLineup((cur) => {
      const occupant = cur.slots[slotId]
      const bench = cur.bench.filter((x) => x.id !== player.id)
      if (occupant) bench.push(occupant)
      return { slots: { ...cur.slots, [slotId]: player }, bench }
    })

  const lineupFor = (idx: number): Lineup => (standings[idx].id === MY_TEAM_ID ? myLineup : rosterFor(idx))
  const selected = isMine ? myLineup : teamIdx >= 0 ? rosterFor(teamIdx) : myLineup
  const summary = isAll ? myLineup : selected

  return (
    <div>
      <SectionHeader title="Rosters" desc="Browse every team's lineup, switch views, and set your starters." />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <TeamSelect teamId={teamId} onChange={setTeamId} />
        {isAll ? (
          <span className="text-xs text-muted-foreground">All teams · your lineup is editable</span>
        ) : isMine ? (
          <Tag tone="success">Editing your lineup</Tag>
        ) : (
          <span className="text-xs text-muted-foreground">Viewing — switch to your team to edit</span>
        )}
        <div className="ml-auto">
          <ViewToggle view={view} onChange={setView} />
        </div>
      </div>

      {view === "table" ? (
        <div className="space-y-4">
          <MatrixTable teamIdxs={isAll ? standings.map((_, i) => i) : [teamIdx >= 0 ? teamIdx : 0]} lineupFor={lineupFor} />
          <div className="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
            <SummaryPanel lineup={summary} isAll={isAll} />
            <TradesPanel />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
          {isAll ? (
            <div className="grid items-start gap-4 md:grid-cols-2 2xl:grid-cols-3">
              {standings.map((t, idx) => (
                <TeamRosterBlock
                  key={t.id}
                  teamIdx={idx}
                  lineup={lineupFor(idx)}
                  view="table"
                  editable={t.id === MY_TEAM_ID}
                  onBench={benchSlot}
                  onStart={startInSlot}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <Panel>
                <PanelHeader
                  title="Starters"
                  action={<Tag tone="muted">{filledStarters(selected).length}/{SLOT_DEFS.length}</Tag>}
                />
                <div className="px-4 pb-4">
                  <StartersView lineup={selected} view="table" editable={isMine} onBench={benchSlot} />
                </div>
              </Panel>
              <Panel>
                <PanelHeader title="Bench" action={<Tag tone="muted">{selected.bench.length}</Tag>} />
                <div className="px-4 pb-4">
                  <BenchView lineup={selected} view="table" editable={isMine} onStart={startInSlot} />
                </div>
              </Panel>
            </div>
          )}

          <aside className="space-y-4">
            <TradesPanel />
            <SummaryPanel lineup={summary} isAll={isAll} />
          </aside>
        </div>
      )}
    </div>
  )
}

/* ---------------- Players ---------------- */
const POSITIONS: (Position | "All")[] = ["All", "QB", "RB", "WR", "TE", "FLEX", "K", "DEF"]
const FLEX_POSITIONS: Position[] = ["RB", "WR", "TE"]
type Availability = "all" | "free" | "rostered"
const AVAILABILITY: { id: Availability; label: string }[] = [
  { id: "all", label: "All" },
  { id: "free", label: "Free agents" },
  { id: "rostered", label: "Rostered" },
]

/** Does a player match the selected position pill? FLEX takes RB/WR/TE. */
function matchesPos(p: Player, sel: string): boolean {
  if (sel === "All") return true
  if (sel === "FLEX") return FLEX_POSITIONS.includes(p.pos)
  return p.pos === sel
}

/* Compact position filter — square buttons with an animated colored fill that
   grows from a top accent bar on hover / when active. Mirrors the slot colors. */
function PositionTabs({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
      {POSITIONS.map((o) => {
        const active = o === value
        const color = o === "All" ? "var(--primary)" : POSITION_COLORS[o as Position]
        return (
          <button
            key={o}
            onClick={() => onChange(o)}
            title={o === "All" ? "All positions" : o}
            aria-pressed={active}
            className={cn(
              "group relative grid size-9 shrink-0 place-items-center overflow-hidden rounded-md border text-xs font-bold transition-colors",
              active && "!text-white",
            )}
            style={{ color, borderColor: color }}
          >
            <span
              aria-hidden
              className={cn(
                "absolute inset-x-0 top-0 transition-all duration-200 ease-in-out group-hover:h-full",
                active ? "h-full" : "h-1",
              )}
              style={{ background: color }}
            />
            <span className="relative z-10 transition-colors group-hover:text-white">{o === "All" ? "ALL" : o}</span>
          </button>
        )
      })}
    </div>
  )
}

/* Segmented availability control (All / Free agents / Rostered). */
function AvailabilityToggle({ value, onChange }: { value: Availability; onChange: (v: Availability) => void }) {
  return (
    <div className="flex items-center gap-1 rounded-lg border border-border bg-secondary/50 p-0.5">
      {AVAILABILITY.map((a) => (
        <button
          key={a.id}
          onClick={() => onChange(a.id)}
          className={cn(
            "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
            value === a.id ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
          )}
        >
          {a.label}
        </button>
      ))}
    </div>
  )
}

const ownerName = (id?: string) => (id ? standings.find((t) => t.id === id)?.name ?? "—" : null)

function PlayersView() {
  const [pos, setPos] = useState<string>("All")
  const [avail, setAvail] = useState<Availability>("all")
  const [query, setQuery] = useState("")
  const rows = players
    .filter((p) => matchesPos(p, pos))
    .filter((p) => (avail === "all" ? true : avail === "free" ? !p.owner : Boolean(p.owner)))
    .filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => b.proj - a.proj)

  return (
    <div>
      <SectionHeader title="Players" desc="Search the player pool, filter by position and availability, and compare projections." />

      <div className="mb-4 flex flex-wrap items-center gap-2.5">
        <PositionTabs value={pos} onChange={setPos} />
        <AvailabilityToggle value={avail} onChange={setAvail} />
        <div className="relative ml-auto min-w-[12rem] flex-1 sm:max-w-xs">
          <Search size={15} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search players…"
            className="h-9 w-full rounded-lg border border-border bg-secondary/60 pl-8 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:border-ring"
          />
        </div>
      </div>

      <Panel>
        <PanelHeader title="Players" action={<Tag tone="muted">{rows.length} results</Tag>} />
        <div className="px-4 pb-4">
          <div className="overflow-hidden rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/40 text-left text-xs text-muted-foreground">
                  <th className="py-2.5 pl-3 font-medium">Player</th>
                  <th className="py-2.5 font-medium">Pos</th>
                  <th className="hidden py-2.5 font-medium sm:table-cell">Team</th>
                  <th className="hidden py-2.5 font-medium md:table-cell">Status</th>
                  <th className="py-2.5 font-medium">ADP</th>
                  <th className="py-2.5 text-right font-medium">Proj</th>
                  <th className="py-2.5 pr-3 text-right font-medium">Pts</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((p) => (
                  <tr key={p.id} className="border-b border-border/60 last:border-0">
                    <td className="py-2 pl-3">
                      <div className="flex items-center gap-2.5">
                        <PlayerAvatar name={p.name} pos={p.pos} size={28} />
                        <div className="min-w-0">
                          <div className="truncate font-medium leading-tight">{p.name}</div>
                          <div className="text-[11px] text-muted-foreground">
                            {p.owner ? ownerName(p.owner) : <span className="text-emerald-500">Free agent</span>}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-2">
                      <PositionPill pos={p.pos} />
                    </td>
                    <td className="hidden py-2 text-muted-foreground sm:table-cell">{p.team}</td>
                    <td className="hidden py-2 md:table-cell">
                      <Tag tone={p.status === "active" ? "success" : p.status === "out" ? "destructive" : "warning"}>{p.status}</Tag>
                    </td>
                    <td className="py-2 tabular-nums text-muted-foreground">{p.adp}</td>
                    <td className="py-2 text-right tabular-nums text-muted-foreground">{p.proj.toFixed(1)}</td>
                    <td className="py-2 pr-3 text-right font-bold tabular-nums">{p.points.toFixed(1)}</td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-sm text-muted-foreground">
                      No players match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Panel>
    </div>
  )
}

/* ---------------- Draft Center ---------------- */
function DraftView() {
  const [filter, setFilter] = useState("Big Board")
  const board = [...players].sort((a, b) => a.adp - b.adp)
  return (
    <div>
      <SectionHeader title="Draft Center" desc="Prep your board, run a mock, and review results." />
      <FilterBar options={["Big Board", "Mock Draft", "Results"]} value={filter} onChange={setFilter} />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Panel>
            <PanelHeader title={filter} action={<Tag tone="muted">Best available</Tag>} />
            <div className="px-4 pb-4">
              {filter === "Big Board" && (
                <ol className="space-y-1.5">
                  {board.map((p, i) => (
                    <li key={p.id} className="flex items-center gap-3 rounded-lg bg-secondary/40 px-3 py-2">
                      <span className="w-5 text-center text-xs font-bold tabular-nums text-muted-foreground">{i + 1}</span>
                      <PlayerAvatar name={p.name} pos={p.pos} size={28} />
                      <span className="flex-1 truncate text-sm font-medium">{p.name}</span>
                      <span className="text-[11px] text-muted-foreground">{p.team}</span>
                      <PositionPill pos={p.pos} />
                    </li>
                  ))}
                </ol>
              )}
              {filter !== "Big Board" && (
                <div className="grid place-items-center rounded-xl border border-dashed border-border py-16 text-center text-sm text-muted-foreground">
                  <Gavel size={22} className="mb-2 opacity-60" />
                  {filter} workspace is coming soon.
                </div>
              )}
            </div>
          </Panel>
        </div>
        <Panel>
          <PanelHeader title="Draft Room" />
          <div className="px-4 pb-4">
            <DraftEntry draftIn="in 2d 4h" />
          </div>
        </Panel>
      </div>
    </div>
  )
}

export function LeagueSection({ section }: { section: string }) {
  if (section === "players") return <PlayersView />
  if (section === "draft") return <DraftView />
  return <RosterView />
}
