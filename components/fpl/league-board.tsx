"use client"

import { useState, type ReactNode } from "react"
import Image from "next/image"
import {
  StandingsTable,
  ActivityFeed,
  MatchupCard,
  CommishControl,
  WinProbGauge,
  ScoringHeatmap,
  LeagueRoster,
  InjuryReport,
  LeagueChat,
  MembersList,
} from "@/components/fpl/widgets"
import { DraftEntry } from "@/components/fpl/draft-entry"
import { Panel, PanelHeader, Tag, TeamAvatar } from "@/components/fpl/primitives"
import { BoardWidget, BoardGrid, useBoard, CustomizeToggle, BoardHint } from "@/components/fpl/board"
import { matchups, type UserLeague } from "@/lib/mock"
import { cn } from "@/lib/utils"
import {
  Crown,
  Gauge,
  Swords,
  Gavel,
  Grid3x3,
  Activity,
  ClipboardList,
  AlertTriangle,
  Trophy,
  MessageSquare,
  Flame,
  Calendar,
  Plus,
  Check,
} from "lucide-react"

interface WidgetMeta {
  id: string
  label: string
  icon: ReactNode
}

const LEAGUE_WIDGETS: WidgetMeta[] = [
  { id: "commish", label: "Commissioner Control", icon: <Crown size={15} /> },
  { id: "winprob", label: "Win Probability", icon: <Gauge size={15} /> },
  { id: "draft", label: "Enter Draft", icon: <Gavel size={15} /> },
  { id: "roster", label: "My Roster", icon: <ClipboardList size={15} /> },
  { id: "injuries", label: "Injury Report", icon: <AlertTriangle size={15} /> },
  { id: "heatmap", label: "Scoring Heatmap", icon: <Grid3x3 size={15} /> },
  { id: "matchups", label: "Live Matchups", icon: <Swords size={15} /> },
  { id: "activity", label: "Activity Log", icon: <Activity size={15} /> },
]

/* Widgets grouped by area so the Add-widget picker can add one-by-one or a whole group. */
const WIDGET_GROUPS: { label: string; ids: string[] }[] = [
  { label: "Commissioner", ids: ["commish"] },
  { label: "Scoring & Matchups", ids: ["winprob", "matchups", "heatmap"] },
  { label: "My Team", ids: ["roster", "injuries", "draft"] },
  { label: "Activity", ids: ["activity"] },
]

/* ------------------------------------------------------------------ *
 * Left-rail league identity card (compact banner) + key stats.
 * ------------------------------------------------------------------ */
function LeagueCard({ league }: { league: UserLeague }) {
  const stats = [
    { label: "Rank", value: `#${league.myRank}` },
    { label: "Record", value: league.record },
    { label: "Points", value: league.pointsFor },
  ]
  return (
    <Panel className="overflow-hidden">
      <div className="relative h-20">
        <Image src="/league-banner.png" alt="" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/60 to-card/10" />
        <div className="absolute right-2.5 top-2.5 flex gap-1.5">
          <span className="rounded-full bg-background/70 px-2 py-0.5 text-[10px] font-semibold backdrop-blur">{league.format}</span>
          <span className="rounded-full bg-background/70 px-2 py-0.5 text-[10px] font-semibold backdrop-blur">Week 7</span>
        </div>
      </div>

      <div className="relative z-10 -mt-7 px-4">
        <span className="inline-block rounded-2xl ring-4 ring-card">
          <TeamAvatar seed={league.hue} label={league.name} size={52} className="rounded-2xl" />
        </span>
        <div className="mt-2 flex items-center gap-2">
          <h2 className="truncate text-base font-bold tracking-tight">{league.name}</h2>
          <Tag tone="primary">Active</Tag>
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {league.format} · {league.teams} teams · Season 2026
        </p>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-px border-t border-border bg-border">
        {stats.map((s) => (
          <div key={s.label} className="flex flex-col gap-0.5 bg-card px-3 py-2.5">
            <span className="text-[10px] uppercase tracking-wide text-muted-foreground">{s.label}</span>
            <span className="text-sm font-bold tabular-nums">{s.value}</span>
          </div>
        ))}
      </div>

      <div className="p-3">
        <button className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90">
          <Calendar size={15} /> Set Lineup
        </button>
      </div>
    </Panel>
  )
}

/* ------------------------------------------------------------------ *
 * Add-widget picker — grouped checklist. Check a row to put it on the
 * board, uncheck to remove; each group can be added/removed at once.
 * ------------------------------------------------------------------ */
function AddWidgetPicker({ board }: { board: ReturnType<typeof useBoard> }) {
  const [open, setOpen] = useState(false)
  const onCount = LEAGUE_WIDGETS.filter((w) => board.visible(w.id)).length

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
      >
        <Plus size={15} /> Add widget
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-20" onClick={() => setOpen(false)} aria-hidden />
          <div className="absolute right-0 top-11 z-30 w-72 rounded-xl border border-border bg-popover p-2 shadow-xl">
            <div className="flex items-center justify-between px-1 pb-1.5">
              <span className="text-sm font-semibold">Widgets</span>
              <span className="text-[11px] tabular-nums text-muted-foreground">{onCount}/{LEAGUE_WIDGETS.length} on board</span>
            </div>

            <div className="max-h-[60vh] space-y-2 overflow-y-auto no-scrollbar">
              {WIDGET_GROUPS.map((g) => {
                const items = g.ids
                  .map((id) => LEAGUE_WIDGETS.find((w) => w.id === id))
                  .filter((w): w is WidgetMeta => Boolean(w))
                const allOn = items.every((w) => board.visible(w.id))
                return (
                  <div key={g.label}>
                    <div className="flex items-center justify-between px-1 py-1">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{g.label}</span>
                      <button
                        onClick={() => items.forEach((w) => (allOn ? board.hide(w.id) : board.show(w.id)))}
                        className="text-[11px] font-medium text-primary hover:underline"
                      >
                        {allOn ? "Remove all" : "Add all"}
                      </button>
                    </div>
                    <div className="space-y-0.5">
                      {items.map((w) => {
                        const on = board.visible(w.id)
                        return (
                          <button
                            key={w.id}
                            onClick={() => (on ? board.hide(w.id) : board.show(w.id))}
                            className="flex w-full items-center gap-2.5 rounded-lg px-1.5 py-1.5 text-left text-sm hover:bg-secondary"
                          >
                            <span
                              className={cn(
                                "grid h-7 w-7 place-items-center rounded-md transition-colors",
                                on ? "bg-primary/15 text-primary" : "bg-secondary text-muted-foreground",
                              )}
                            >
                              {w.icon}
                            </span>
                            <span className={cn("flex-1 truncate", !on && "text-muted-foreground")}>{w.label}</span>
                            <span
                              className={cn(
                                "grid h-[18px] w-[18px] place-items-center rounded-md border transition-colors",
                                on ? "border-primary bg-primary text-primary-foreground" : "border-border text-transparent",
                              )}
                            >
                              <Check size={12} strokeWidth={3} />
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export function LeagueWorkspace({ league }: { league: UserLeague }) {
  // A couple of widgets start off the board so "Add widget" has immediate value.
  const board = useBoard(["heatmap", "injuries"])

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[300px_minmax(0,1fr)_344px]">
      {/* Left: league banner card + standings */}
      <div className="space-y-4">
        <LeagueCard league={league} />

        <Panel>
          <PanelHeader title="Standings" icon={<Trophy size={16} />} action={<Tag tone="muted">{league.teams} teams</Tag>} />
          <div className="px-3 pb-3">
            <StandingsTable variant="compact" limit={8} />
          </div>
        </Panel>
      </div>

      {/* Center: drag-and-drop widget board */}
      <div>
        <div className="mb-3 flex items-center gap-2">
          <BoardHint editMode={board.editMode} />
          <div className="ml-auto flex items-center gap-2">
            {board.editMode && <AddWidgetPicker board={board} />}
            <CustomizeToggle editMode={board.editMode} onToggle={() => board.setEditMode((e) => !e)} />
          </div>
        </div>

        <BoardGrid>
          {board.visible("commish") && (
            <BoardWidget
              title="Commissioner Control"
              icon={<Crown size={16} className="text-pos-k" />}
              span="lg:col-span-12"
              editMode={board.editMode}
              onHide={() => board.hide("commish")}
            >
              <CommishControl />
            </BoardWidget>
          )}

          {board.visible("winprob") && (
            <BoardWidget
              title="Win Probability"
              icon={<Gauge size={16} />}
              span="lg:col-span-6"
              editMode={board.editMode}
              onHide={() => board.hide("winprob")}
              bodyClassName="grid place-items-center"
            >
              <WinProbGauge value={78} vs={league.nextOpponent} />
            </BoardWidget>
          )}

          {board.visible("draft") && (
            <BoardWidget
              title="Enter Draft"
              icon={<Gavel size={16} />}
              span="lg:col-span-6"
              editMode={board.editMode}
              onHide={() => board.hide("draft")}
            >
              <DraftEntry draftIn={league.draftIn ?? "in 2d 4h"} />
            </BoardWidget>
          )}

          {board.visible("roster") && (
            <BoardWidget
              title="My Roster"
              icon={<ClipboardList size={16} />}
              span="lg:col-span-6"
              editMode={board.editMode}
              onHide={() => board.hide("roster")}
              data={{ types: ["Starters", "Bench", "All"] }}
            >
              <LeagueRoster />
            </BoardWidget>
          )}

          {board.visible("injuries") && (
            <BoardWidget
              title="Injury Report"
              icon={<AlertTriangle size={16} className="text-warning" />}
              span="lg:col-span-6"
              editMode={board.editMode}
              onHide={() => board.hide("injuries")}
            >
              <InjuryReport />
            </BoardWidget>
          )}

          {board.visible("heatmap") && (
            <BoardWidget
              title="Weekly Scoring Heatmap"
              icon={<Grid3x3 size={16} />}
              span="lg:col-span-12"
              editMode={board.editMode}
              onHide={() => board.hide("heatmap")}
              data={{ types: ["PPR points", "Standard", "Half-PPR"] }}
            >
              <p className="mb-3 text-xs text-muted-foreground">
                Each cell = that team&apos;s <span className="font-semibold text-foreground">fantasy points</span> that week.
                Cool = low, warm = high.
              </p>
              <ScoringHeatmap limit={6} />
            </BoardWidget>
          )}

          {board.visible("matchups") && (
            <BoardWidget
              title="Live Matchups"
              icon={<Swords size={16} />}
              span="lg:col-span-6"
              editMode={board.editMode}
              onHide={() => board.hide("matchups")}
            >
              <div className="space-y-2.5">
                <MatchupCard m={matchups[0]} />
                <MatchupCard m={matchups[1]} />
              </div>
            </BoardWidget>
          )}

          {board.visible("activity") && (
            <BoardWidget
              title="Activity Log"
              icon={<Activity size={16} />}
              span="lg:col-span-6"
              editMode={board.editMode}
              onHide={() => board.hide("activity")}
            >
              <ActivityFeed limit={6} />
            </BoardWidget>
          )}
        </BoardGrid>
      </div>

      {/* Right: chat + online */}
      <div className="space-y-4">
        <Panel className="flex h-[28rem] flex-col">
          <PanelHeader title="#general" icon={<MessageSquare size={16} />} action={<Tag tone="success">live</Tag>} />
          <div className="flex-1 px-5 pb-5">
            <LeagueChat limit={5} />
          </div>
        </Panel>
        <Panel>
          <PanelHeader title="Online" icon={<Flame size={16} />} action={<Tag tone="muted">4</Tag>} />
          <div className="px-5 pb-5">
            <MembersList />
          </div>
        </Panel>
      </div>
    </div>
  )
}
