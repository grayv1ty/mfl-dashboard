"use client"

import type { ReactNode } from "react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { POSITION_COLORS, playerImg, teamLogo, type Position, type PlayerImgSize } from "@/lib/mock"

/* ---------- Card ---------- */
export function Panel({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card text-card-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function PanelHeader({
  title,
  icon,
  action,
  draggable,
  className,
}: {
  title: ReactNode
  icon?: ReactNode
  action?: ReactNode
  draggable?: boolean
  className?: string
}) {
  return (
    <div className={cn("flex items-center gap-2.5 px-5 pt-4 pb-3", className)}>
      {draggable && (
        <span className="grid grid-cols-2 gap-0.5 text-muted-foreground/50" aria-hidden>
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className="h-1 w-1 rounded-full bg-current" />
          ))}
        </span>
      )}
      {icon && <span className="text-muted-foreground">{icon}</span>}
      <h3 className="text-[15px] font-semibold tracking-tight">{title}</h3>
      <div className="ml-auto flex items-center gap-2">{action}</div>
    </div>
  )
}

/* ---------- Team avatar (gradient by hue seed) ---------- */
export function TeamAvatar({
  seed,
  label,
  size = 36,
  className,
}: {
  seed: string
  label: string
  size?: number
  className?: string
}) {
  const initials = label
    .replace(/['']/g, "")
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
  const h = Number(seed)
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-xl font-semibold text-white",
        className,
      )}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.36,
        background: `linear-gradient(135deg, oklch(0.6 0.17 ${h}), oklch(0.42 0.13 ${(h + 40) % 360}))`,
      }}
      aria-hidden
    >
      {initials}
    </span>
  )
}

/* ---------- Player headshot (mflimages, falls back to initials) ---------- */
function pickImgSize(size: number): PlayerImgSize {
  if (size <= 28) return "xs"
  if (size <= 44) return "sm"
  if (size <= 72) return "md"
  return "lg"
}

export function PlayerAvatar({
  name,
  pos,
  size = 36,
  className,
}: {
  name: string
  pos: Position
  size?: number
  className?: string
}) {
  const [failed, setFailed] = useState(false)
  const initials = name
    .replace(/['’.]/g, "")
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase()

  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-secondary font-semibold text-muted-foreground",
        className,
      )}
      style={{ width: size, height: size, fontSize: size * 0.36 }}
    >
      {failed ? (
        <span aria-hidden>{initials}</span>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={playerImg(name, pos, pickImgSize(size)) || "/placeholder.svg"}
          alt={name}
          width={size}
          height={size}
          loading="lazy"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover"
        />
      )}
    </span>
  )
}

/* ---------- NFL team logo (mflstorage, falls back to abbr chip) ---------- */
export function TeamLogo({
  abbr,
  size = 24,
  className,
}: {
  abbr: string
  size?: number
  className?: string
}) {
  const [failed, setFailed] = useState(false)
  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center",
        failed && "rounded-md bg-secondary font-bold text-muted-foreground",
        className,
      )}
      style={{ width: size, height: size, fontSize: size * 0.34 }}
    >
      {failed ? (
        <span aria-hidden>{abbr.toUpperCase()}</span>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={teamLogo(abbr, pickImgSize(size)) || "/placeholder.svg"}
          alt={`${abbr} logo`}
          width={size}
          height={size}
          loading="lazy"
          onError={() => setFailed(true)}
          className="h-full w-full object-contain"
        />
      )}
    </span>
  )
}

/* ---------- Position pill ---------- */
export function PositionPill({ pos, className }: { pos: Position; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-5 min-w-9 items-center justify-center rounded-md px-1.5 text-[11px] font-bold tracking-wide",
        className,
      )}
      style={{
        color: POSITION_COLORS[pos],
        backgroundColor: `color-mix(in oklch, ${POSITION_COLORS[pos]} 16%, transparent)`,
      }}
    >
      {pos}
    </span>
  )
}

/* ---------- Generic badge ---------- */
export function Tag({
  children,
  tone = "muted",
  className,
}: {
  children: ReactNode
  tone?: "muted" | "primary" | "success" | "warning" | "info" | "destructive"
  className?: string
}) {
  const tones: Record<string, string> = {
    muted: "bg-secondary text-muted-foreground",
    primary: "bg-primary/15 text-primary",
    success: "bg-success/15 text-success",
    warning: "bg-warning/15 text-warning",
    info: "bg-info/15 text-info",
    destructive: "bg-destructive/15 text-destructive",
  }
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}

/* ---------- Progress ---------- */
export function Progress({
  value,
  className,
  barClassName,
  tone = "primary",
}: {
  value: number
  className?: string
  barClassName?: string
  tone?: "primary" | "success" | "info" | "warning"
}) {
  const tones: Record<string, string> = {
    primary: "bg-primary",
    success: "bg-success",
    info: "bg-info",
    warning: "bg-warning",
  }
  return (
    <div className={cn("h-1.5 w-full overflow-hidden rounded-full bg-secondary", className)}>
      <div
        className={cn("h-full rounded-full", tones[tone], barClassName)}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  )
}

/* ---------- Sparkline ---------- */
export function Sparkline({
  data,
  width = 120,
  height = 36,
  className,
  color = "var(--primary)",
}: {
  data: number[]
  width?: number
  height?: number
  className?: string
  color?: string
}) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const pts = data
    .map((d, i) => {
      const x = (i / (data.length - 1)) * width
      const y = height - ((d - min) / range) * (height - 4) - 2
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(" ")
  const areaPts = `0,${height} ${pts} ${width},${height}`
  const id = `spark-${color.replace(/[^a-z0-9]/gi, "")}`
  return (
    <svg width={width} height={height} className={className} aria-hidden>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={areaPts} fill={`url(#${id})`} />
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/* ---------- Stat tile ---------- */
export function Stat({
  label,
  value,
  sub,
  className,
}: {
  label: string
  value: ReactNode
  sub?: ReactNode
  className?: string
}) {
  return (
    <div className={cn("rounded-xl bg-secondary/60 px-4 py-3.5", className)}>
      <div className="text-2xl font-bold tracking-tight tabular-nums">{value}</div>
      <div className="mt-0.5 text-xs text-muted-foreground">{label}</div>
      {sub && <div className="mt-1 text-xs">{sub}</div>}
    </div>
  )
}

/* ---------- Ring gauge ---------- */
export function Ring({
  value,
  size = 56,
  stroke = 6,
  color = "var(--primary)",
  children,
}: {
  value: number
  size?: number
  stroke?: number
  color?: string
  children?: ReactNode
}) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const off = c - (value / 100) * c
  return (
    <div className="relative inline-grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--secondary)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={c}
          strokeDashoffset={off}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute text-xs font-semibold tabular-nums">{children}</span>
    </div>
  )
}
