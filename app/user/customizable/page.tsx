"use client"

import { useState } from "react"
import type { ReactNode } from "react"
import Image from "next/image"
import { Shell } from "@/components/fpl/shell"
import { Stat, Ring, TeamAvatar, Tag, PlayerAvatar, PositionPill, Progress, Sparkline } from "@/components/fpl/primitives"
import { ActivityFeed, PlayerNews, WeeklyAwards } from "@/components/fpl/widgets"
import { LeagueCard, BadgeRail } from "@/components/fpl/user-widgets"
import { getNav } from "@/lib/concepts"
import { userLeagues, userProfile, upcomingEvents, players, pickEffects, seasonTrend } from "@/lib/mock"
import {
  Plus,
  Settings2,
  Trophy,
  Flame,
  Newspaper,
  Award,
  Activity as ActivityIcon,
  CalendarClock,
  Gauge,
  Heart,
  Lock,
  GripVertical,
  MoreHorizontal,
  Sparkles,
  Zap,
  Snowflake,
  Crown,
  Music,
  Check,
  Copy,
  EyeOff,
  Settings,
  ListChecks,
} from "lucide-react"
import { cn } from "@/lib/utils"

const EFFECT_ICON: Record<string, typeof Flame> = {
  moonwalk: Music,
  fire: Flame,
  neon: Sparkles,
  lightning: Zap,
  frost: Snowflake,
  champion: Crown,
}

const SIZE_PRESETS = ["2×2", "3×2", "4×2", "4×3"]

/* ---------------- Customizable widget shell (drag handle + context menu) ---------------- */
function CustomWidget({
  title,
  icon,
  span,
  locked,
  editMode,
  onHide,
  children,
}: {
  title: string
  icon: ReactNode
  span: string
  locked?: boolean
  editMode: boolean
  onHide?: () => void
  children: ReactNode
}) {
  const [open, setOpen] = useState(false)
  const [size, setSize] = useState("3×2")

  return (
    <section
      className={cn(
        "group/widget relative flex flex-col rounded-2xl border bg-card",
        span,
        editMode ? "border-dashed border-primary/40" : "border-border",
      )}
    >
      <header className="flex items-center gap-2 px-4 pb-2.5 pt-3.5">
        <GripVertical
          size={15}
          className={cn(
            "-ml-1 cursor-grab text-muted-foreground/40 transition-opacity",
            editMode ? "opacity-100" : "opacity-0 group-hover/widget:opacity-100",
          )}
        />
        <span className="text-muted-foreground">{icon}</span>
        <h3 className="text-sm font-semibold tracking-tight">{title}</h3>
        {locked && (
          <span title="Pinned widget" className="text-muted-foreground/70">
            <Lock size={12} />
          </span>
        )}
        <div className="relative ml-auto">
          <button
            onClick={() => setOpen((o) => !o)}
            className="grid h-6 w-6 place-items-center rounded-md text-muted-foreground/60 hover:bg-secondary hover:text-foreground"
            aria-label="Widget options"
          >
            <MoreHorizontal size={15} />
          </button>
          {open && (
            <>
              <div className="fixed inset-0 z-20" onClick={() => setOpen(false)} aria-hidden />
              <div className="absolute right-0 top-7 z-30 w-52 rounded-xl border border-border bg-card p-1.5 shadow-xl">
                <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Size · W×H
                </div>
                <div className="mb-1 flex gap-1 px-1">
                  {SIZE_PRESETS.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      className={cn(
                        "flex-1 rounded-md border px-1.5 py-1 text-xs font-medium",
                        s === size
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <div className="my-1 h-px bg-border" />
                {locked ? (
                  <div className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-muted-foreground">
                    <Lock size={14} /> Pinned · can&apos;t remove
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setOpen(false)
                      onHide?.()
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-foreground hover:bg-secondary"
                  >
                    <EyeOff size={14} /> Hide widget
                  </button>
                )}
                <button className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-foreground hover:bg-secondary">
                  <Copy size={14} /> Duplicate
                </button>
                <button className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-foreground hover:bg-secondary">
                  <Settings size={14} /> Widget settings
                </button>
              </div>
            </>
          )}
        </div>
      </header>
      <div className="flex-1 px-4 pb-4">{children}</div>
    </section>
  )
}

/* ---------------- Locked profile hero (Mobile-Legends style) ---------------- */
function ProfileHero({
  equipped,
  liked,
  likes,
  onToggleLike,
}: {
  equipped: (typeof pickEffects)[number]
  liked: boolean
  likes: number
  onToggleLike: () => void
}) {
  const EffectIcon = EFFECT_ICON[equipped.id] ?? Sparkles
  const pct = Math.round((userProfile.xp / userProfile.xpToNext) * 100)
  return (
    <div className="relative overflow-hidden rounded-xl">
      {/* Faded banner */}
      <div className="absolute inset-x-0 top-0 h-28">
        <Image src="/user-banner.png" alt="" fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-card/20 via-card/70 to-card" />
      </div>

      <div className="relative flex flex-col items-center px-2 pt-6 text-center">
        {/* Avatar with champion border ring */}
        <span
          className="relative grid place-items-center rounded-full p-[3px]"
          style={{ background: "conic-gradient(from 210deg, var(--pos-k), var(--pos-flex), var(--pos-te), var(--pos-k))" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/user-avatar.png" alt="grayson" className="h-24 w-24 rounded-full border-2 border-card object-cover" />
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">
            LV {userProfile.level}
          </span>
        </span>

        <h2 className="mt-3 flex items-center gap-1.5 text-lg font-bold">
          {userProfile.name}
          <Crown size={15} className="text-pos-k" />
        </h2>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{userProfile.handle}</span>
          <span className="h-1 w-1 rounded-full bg-muted-foreground/50" />
          <span className="font-medium text-foreground">{userProfile.rank}</span>
        </div>
        <p className="mt-2 max-w-[15rem] text-pretty text-xs leading-relaxed text-muted-foreground">{userProfile.bio}</p>

        {/* Likes + share */}
        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={onToggleLike}
            className={cn(
              "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-semibold transition-colors",
              liked ? "border-destructive/40 bg-destructive/10 text-destructive" : "border-border text-muted-foreground hover:text-foreground",
            )}
          >
            <Heart size={15} className={liked ? "fill-current" : ""} />
            {likes.toLocaleString()}
          </button>
          <span className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground">
            Member since {userProfile.memberSince}
          </span>
        </div>
      </div>

      {/* XP bar */}
      <div className="relative mt-4 px-1">
        <div className="mb-1 flex items-center justify-between text-[11px] text-muted-foreground">
          <span>Level {userProfile.level}</span>
          <span className="tabular-nums">
            {userProfile.xp.toLocaleString()} / {userProfile.xpToNext.toLocaleString()} XP
          </span>
        </div>
        <Progress value={pct} className="h-2" />
      </div>

      {/* Equipped pick effect */}
      <div className="relative mt-3 flex items-center gap-2.5 rounded-xl border border-border bg-secondary/40 px-3 py-2.5">
        <span
          className="grid h-9 w-9 shrink-0 place-items-center rounded-lg"
          style={{ background: `color-mix(in oklch, ${equipped.color} 22%, transparent)`, color: equipped.color }}
        >
          <EffectIcon size={18} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="text-[11px] text-muted-foreground">Equipped pick effect</div>
          <div className="truncate text-sm font-semibold">{equipped.name}</div>
        </div>
        <Tag tone="primary">Active</Tag>
      </div>

      {/* Badges */}
      <div className="relative mt-3">
        <div className="mb-1.5 text-[11px] font-medium text-muted-foreground">Showcase badges</div>
        <BadgeRail limit={8} />
      </div>
    </div>
  )
}

export default function Page() {
  const { prev, next } = getNav("user", "customizable")
  const [editMode, setEditMode] = useState(false)
  const [hidden, setHidden] = useState<Set<string>>(new Set())
  const [liked, setLiked] = useState(false)
  const [equippedId, setEquippedId] = useState(userProfile.equippedEffect)

  const equipped = pickEffects.find((e) => e.id === equippedId) ?? pickEffects[0]
  const likes = userProfile.likes + (liked ? 1 : 0)
  const starters = players.slice(0, 6)

  const hide = (id: string) => setHidden((s) => new Set(s).add(id))
  const show = (id: string) =>
    setHidden((s) => {
      const n = new Set(s)
      n.delete(id)
      return n
    })
  const visible = (id: string) => !hidden.has(id)

  return (
    <Shell
      variant="user"
      title="My Board"
      index={15}
      conceptName="Customizable Board"
      prev={prev}
      next={next}
      headerExtra={
        <>
          <button
            onClick={() => setEditMode((e) => !e)}
            className={cn(
              "hidden items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium lg:flex",
              editMode ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground",
            )}
          >
            <Settings2 size={15} /> {editMode ? "Done" : "Customize"}
          </button>
          <button className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground">
            <Plus size={15} /> Add widget
          </button>
        </>
      }
    >
      <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <span className="grid grid-cols-2 gap-0.5" aria-hidden>
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i} className="h-1 w-1 rounded-full bg-current" />
          ))}
        </span>
        {editMode ? "Edit mode — drag tiles, resize, hide or duplicate. Your profile is pinned." : "Drag tiles to arrange your board · profile is always pinned"}
        {hidden.size > 0 && (
          <span className="ml-1 flex items-center gap-1.5">
            ·
            {[...hidden].map((id) => (
              <button
                key={id}
                onClick={() => show(id)}
                className="rounded-full border border-border px-2 py-0.5 text-[11px] font-medium hover:text-foreground"
              >
                + Restore {id}
              </button>
            ))}
          </span>
        )}
      </div>

      <div className="grid auto-rows-[minmax(0,auto)] grid-cols-1 gap-4 lg:grid-cols-12">
        {/* Locked profile — always present */}
        <CustomWidget title="My Profile" icon={<Crown size={16} />} span="lg:col-span-4 lg:row-span-2" locked editMode={editMode}>
          <ProfileHero equipped={equipped} liked={liked} likes={likes} onToggleLike={() => setLiked((l) => !l)} />
        </CustomWidget>

        {/* Season snapshot */}
        {visible("snapshot") && (
          <CustomWidget title="Season Snapshot" icon={<Trophy size={16} />} span="lg:col-span-8" editMode={editMode} onHide={() => hide("snapshot")}>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <Stat label="Leagues" value={userProfile.leaguesJoined} />
              <Stat label="Win rate" value={`${userProfile.winRate}%`} />
              <Stat label="Titles" value={userProfile.championships} />
              <Stat label="Streak" value={userProfile.currentStreak} />
            </div>
            <div className="mt-3 rounded-xl border border-border bg-secondary/30 p-3">
              <div className="mb-1 flex items-center justify-between text-[11px] text-muted-foreground">
                <span>Points for — last 9 weeks</span>
                <span className="font-semibold text-success">+12% vs league avg</span>
              </div>
              <Sparkline data={seasonTrend.map((d) => d.pf)} width={620} height={56} className="w-full" />
            </div>
          </CustomWidget>
        )}

        {/* My roster */}
        {visible("roster") && (
          <CustomWidget title="My Roster" icon={<ListChecks size={16} />} span="lg:col-span-4" editMode={editMode} onHide={() => hide("roster")}>
            <ul className="divide-y divide-border/60">
              {starters.map((p) => (
                <li key={p.id} className="flex items-center gap-2.5 py-2">
                  <PlayerAvatar name={p.name} pos={p.pos} size={30} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">{p.name}</div>
                    <div className="text-[11px] text-muted-foreground">{p.team}</div>
                  </div>
                  <PositionPill pos={p.pos} />
                  <span className="w-10 text-right text-sm font-bold tabular-nums">{p.points.toFixed(1)}</span>
                </li>
              ))}
            </ul>
          </CustomWidget>
        )}

        {/* This week win prob */}
        {visible("week") && (
          <CustomWidget title="This Week" icon={<Gauge size={16} />} span="lg:col-span-4" editMode={editMode} onHide={() => hide("week")}>
            <div className="flex items-center gap-4">
              <Ring value={71} size={72} color="var(--primary)">
                71
              </Ring>
              <div className="text-sm">
                <div className="font-medium">Win probability</div>
                <p className="text-xs text-muted-foreground">Leading in 2 of 3 live matchups</p>
                <p className="mt-1 text-xs font-semibold text-success">88.4 — 72.1 vs Blitz</p>
              </div>
            </div>
          </CustomWidget>
        )}

        {/* Pick effect selector */}
        {visible("effects") && (
          <CustomWidget title="Pick Effect" icon={<Sparkles size={16} />} span="lg:col-span-4" editMode={editMode} onHide={() => hide("effects")}>
            <p className="mb-2 text-xs text-muted-foreground">Choose the celebration that plays when you make a draft pick.</p>
            <div className="grid grid-cols-1 gap-2">
              {pickEffects.map((e) => {
                const Icon = EFFECT_ICON[e.id] ?? Sparkles
                const active = e.id === equippedId
                return (
                  <button
                    key={e.id}
                    disabled={e.locked}
                    onClick={() => setEquippedId(e.id)}
                    className={cn(
                      "flex items-center gap-2.5 rounded-xl border px-3 py-2 text-left transition-colors",
                      active ? "border-primary bg-primary/10" : "border-border hover:bg-secondary/60",
                      e.locked && "cursor-not-allowed opacity-55",
                    )}
                  >
                    <span
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-lg"
                      style={{ background: `color-mix(in oklch, ${e.color} 22%, transparent)`, color: e.color }}
                    >
                      <Icon size={16} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium">{e.name}</div>
                      <div className="truncate text-[11px] text-muted-foreground">{e.desc}</div>
                    </div>
                    {e.locked ? (
                      <Lock size={14} className="text-muted-foreground" />
                    ) : active ? (
                      <Check size={16} className="text-primary" />
                    ) : null}
                  </button>
                )
              })}
            </div>
          </CustomWidget>
        )}

        {/* My leagues */}
        {visible("leagues") && (
          <CustomWidget title="My Leagues" icon={<Trophy size={16} />} span="lg:col-span-8" editMode={editMode} onHide={() => hide("leagues")}>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {userLeagues.slice(0, 4).map((l) => (
                <LeagueCard key={l.id} league={l} />
              ))}
            </div>
          </CustomWidget>
        )}

        {/* Upcoming */}
        {visible("upcoming") && (
          <CustomWidget title="Upcoming" icon={<CalendarClock size={16} />} span="lg:col-span-4" editMode={editMode} onHide={() => hide("upcoming")}>
            <ul className="space-y-2.5">
              {upcomingEvents.map((e) => (
                <li key={e.id} className="flex items-center gap-3 rounded-lg bg-secondary/40 px-3 py-2.5">
                  <TeamAvatar seed={userLeagues.find((l) => l.name === e.league)?.hue ?? "26"} label={e.league} size={28} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">{e.title}</div>
                    <div className="truncate text-[11px] text-muted-foreground">{e.league}</div>
                  </div>
                  <span className="shrink-0 text-[11px] font-semibold">{e.when}</span>
                </li>
              ))}
            </ul>
          </CustomWidget>
        )}

        {/* Roster news */}
        {visible("news") && (
          <CustomWidget title="News On Your Roster" icon={<Newspaper size={16} />} span="lg:col-span-8" editMode={editMode} onHide={() => hide("news")}>
            <PlayerNews layout="cards" limit={3} />
          </CustomWidget>
        )}

        {/* Activity */}
        {visible("activity") && (
          <CustomWidget title="Activity" icon={<ActivityIcon size={16} />} span="lg:col-span-4" editMode={editMode} onHide={() => hide("activity")}>
            <ActivityFeed limit={5} />
          </CustomWidget>
        )}

        {/* Weekly awards */}
        {visible("awards") && (
          <CustomWidget title="Weekly Awards" icon={<Flame size={16} />} span="lg:col-span-4" editMode={editMode} onHide={() => hide("awards")}>
            <WeeklyAwards />
          </CustomWidget>
        )}

        {/* Badges */}
        {visible("badges") && (
          <CustomWidget title="All Badges" icon={<Award size={16} />} span="lg:col-span-4" editMode={editMode} onHide={() => hide("badges")}>
            <BadgeRail showLabels />
          </CustomWidget>
        )}
      </div>
    </Shell>
  )
}
