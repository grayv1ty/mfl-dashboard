"use client"

import { useEffect, useMemo, useState } from "react"
import { Play, Dumbbell, Radio, ChevronRight, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

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
