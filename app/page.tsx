"use client"

import { useState } from "react"
import Image from "next/image"
import { Shell } from "@/components/fpl/shell"
import { Stat, Ring, TeamAvatar, Tag, PlayerAvatar, PositionPill, Progress, Sparkline } from "@/components/fpl/primitives"
import { ActivityFeed, PlayerNews, WeeklyAwards, AchievementsGrid } from "@/components/fpl/widgets"
import {
  LeagueCard,
  BadgeRail,
  ActionQueue,
  AlertsList,
  TrendingPlayers,
  ManagerRatings,
  RecentForm,
  GetStarted,
  UnlockFeatures,
} from "@/components/fpl/user-widgets"
import { BoardWidget, BoardGrid, useBoard, AddWidgetPicker, CustomizeToggle, BoardHint } from "@/components/fpl/board"
import { QuickMockDraft } from "@/components/fpl/draft-entry"
import { userLeagues, userProfile, upcomingEvents, players, pickEffects, seasonTrend } from "@/lib/mock"
import {
  Trophy,
  Flame,
  Newspaper,
  Award,
  Activity as ActivityIcon,
  CalendarClock,
  Gauge,
  Heart,
  Lock,
  Sparkles,
  Zap,
  Snowflake,
  Crown,
  Music,
  Check,
  ListChecks,
  Bell,
  TrendingUp,
  BarChart3,
  LineChart,
  Rocket,
  Swords,
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

const SEASONS = ["2026", "2025", "2024", "All-time"]

const WIDGETS = [
  { id: "getstarted", label: "Get Started", icon: <Rocket size={14} /> },
  { id: "mock", label: "Quick Mock Draft", icon: <Swords size={14} /> },
  { id: "unlock", label: "Unlock Features", icon: <Sparkles size={14} /> },
  { id: "snapshot", label: "Season Snapshot", icon: <Trophy size={14} /> },
  { id: "roster", label: "My Roster", icon: <ListChecks size={14} /> },
  { id: "week", label: "This Week", icon: <Gauge size={14} /> },
  { id: "queue", label: "Action Queue", icon: <Zap size={14} /> },
  { id: "effects", label: "Pick Effect", icon: <Sparkles size={14} /> },
  { id: "leagues", label: "My Leagues", icon: <Trophy size={14} /> },
  { id: "upcoming", label: "Upcoming", icon: <CalendarClock size={14} /> },
  { id: "news", label: "Roster News", icon: <Newspaper size={14} /> },
  { id: "activity", label: "Activity", icon: <ActivityIcon size={14} /> },
  { id: "alerts", label: "Alerts", icon: <Bell size={14} /> },
  { id: "trending", label: "Trending Players", icon: <TrendingUp size={14} /> },
  { id: "form", label: "Recent Form", icon: <LineChart size={14} /> },
  { id: "ratings", label: "Manager Ratings", icon: <BarChart3 size={14} /> },
  { id: "awards", label: "Weekly Awards", icon: <Flame size={14} /> },
  { id: "trophies", label: "Trophy Case", icon: <Award size={14} /> },
  { id: "badges", label: "All Badges", icon: <Award size={14} /> },
]

/* Widgets grouped by area so the Add-widget picker can add one-by-one or a whole group. */
const WIDGET_GROUPS: { label: string; ids: string[] }[] = [
  { label: "Getting Started", ids: ["getstarted", "unlock", "mock"] },
  { label: "My Season", ids: ["snapshot", "roster", "week", "form", "ratings"] },
  { label: "Action", ids: ["queue", "alerts", "upcoming"] },
  { label: "Leagues & Players", ids: ["leagues", "news", "trending"] },
  { label: "Activity", ids: ["activity", "awards"] },
  { label: "Profile & Rewards", ids: ["effects", "trophies", "badges"] },
]

/* ---------------- Pinned profile hero (Mobile-Legends style) ---------------- */
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
      <div className="absolute inset-x-0 top-0 h-28">
        <Image src="/user-banner.png" alt="" fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-card/20 via-card/70 to-card" />
      </div>

      <div className="relative flex flex-col items-center px-2 pt-6 text-center">
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

      <div className="relative mt-4 px-1">
        <div className="mb-1 flex items-center justify-between text-[11px] text-muted-foreground">
          <span>Level {userProfile.level}</span>
          <span className="tabular-nums">
            {userProfile.xp.toLocaleString()} / {userProfile.xpToNext.toLocaleString()} XP
          </span>
        </div>
        <Progress value={pct} className="h-2" />
      </div>

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

      <div className="relative mt-3">
        <div className="mb-1.5 text-[11px] font-medium text-muted-foreground">Showcase badges</div>
        <BadgeRail limit={8} />
      </div>
    </div>
  )
}

export default function Page() {
  const board = useBoard()
  const [liked, setLiked] = useState(false)
  const [equippedId, setEquippedId] = useState(userProfile.equippedEffect)

  const equipped = pickEffects.find((e) => e.id === equippedId) ?? pickEffects[0]
  const likes = userProfile.likes + (liked ? 1 : 0)
  const starters = players.slice(0, 6)

  return (
    <Shell variant="user" title="Home">
      <div className="mb-3 flex items-center gap-2">
        <BoardHint editMode={board.editMode}>
          {board.editMode
            ? "Edit mode — drag tiles, hide or duplicate. Customize each widget's data from its ⋯ menu. Your profile stays pinned."
            : "Drag tiles to arrange your board · hide, duplicate or customize data · profile is always pinned"}
        </BoardHint>
        <div className="ml-auto flex items-center gap-2">
          {board.editMode && <AddWidgetPicker board={board} catalog={WIDGETS} groups={WIDGET_GROUPS} />}
          <CustomizeToggle editMode={board.editMode} onToggle={() => board.setEditMode((e) => !e)} />
        </div>
      </div>

      <BoardGrid>
        {/* Pinned profile */}
        <BoardWidget title="My Profile" icon={<Crown size={16} />} span="lg:col-span-4 lg:row-span-2" locked editMode={board.editMode}>
          <ProfileHero equipped={equipped} liked={liked} likes={likes} onToggleLike={() => setLiked((l) => !l)} />
        </BoardWidget>

        {board.visible("getstarted") && (
          <BoardWidget
            title="Get Started"
            icon={<Rocket size={16} className="text-primary" />}
            span="lg:col-span-8"
            editMode={board.editMode}
            onHide={() => board.hide("getstarted")}
          >
            <GetStarted />
          </BoardWidget>
        )}

        {board.visible("mock") && (
          <BoardWidget
            title="Quick Mock Draft"
            icon={<Swords size={16} className="text-primary" />}
            span="lg:col-span-4"
            editMode={board.editMode}
            onHide={() => board.hide("mock")}
          >
            <QuickMockDraft />
          </BoardWidget>
        )}

        {board.visible("unlock") && (
          <BoardWidget
            title="Unlock Features"
            icon={<Sparkles size={16} className="text-primary" />}
            span="lg:col-span-4"
            editMode={board.editMode}
            onHide={() => board.hide("unlock")}
          >
            <UnlockFeatures />
          </BoardWidget>
        )}

        {board.visible("snapshot") && (
          <BoardWidget
            title="Season Snapshot"
            icon={<Trophy size={16} />}
            span="lg:col-span-8"
            editMode={board.editMode}
            onHide={() => board.hide("snapshot")}
            data={{ years: SEASONS, types: ["Points", "Wins", "Efficiency"] }}
          >
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
          </BoardWidget>
        )}

        {board.visible("roster") && (
          <BoardWidget
            title="My Roster"
            icon={<ListChecks size={16} />}
            span="lg:col-span-4"
            editMode={board.editMode}
            onHide={() => board.hide("roster")}
            data={{ types: ["Starters", "Bench", "All"] }}
          >
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
          </BoardWidget>
        )}

        {board.visible("week") && (
          <BoardWidget
            title="This Week"
            icon={<Gauge size={16} />}
            span="lg:col-span-4"
            editMode={board.editMode}
            onHide={() => board.hide("week")}
            data={{ types: ["Win prob", "Proj margin", "Live"] }}
          >
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
          </BoardWidget>
        )}

        {board.visible("queue") && (
          <BoardWidget
            title="Action Queue"
            icon={<Zap size={16} className="text-warning" />}
            span="lg:col-span-4"
            editMode={board.editMode}
            onHide={() => board.hide("queue")}
            data={{ types: ["All", "Urgent", "This week"] }}
          >
            <ActionQueue />
          </BoardWidget>
        )}

        {board.visible("effects") && (
          <BoardWidget title="Pick Effect" icon={<Sparkles size={16} />} span="lg:col-span-4" editMode={board.editMode} onHide={() => board.hide("effects")}>
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
          </BoardWidget>
        )}

        {board.visible("leagues") && (
          <BoardWidget
            title="My Leagues"
            icon={<Trophy size={16} />}
            span="lg:col-span-8"
            editMode={board.editMode}
            onHide={() => board.hide("leagues")}
            data={{ types: ["All", "Leading", "Live"] }}
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {userLeagues.slice(0, 4).map((l) => (
                <LeagueCard key={l.id} league={l} />
              ))}
            </div>
          </BoardWidget>
        )}

        {board.visible("upcoming") && (
          <BoardWidget title="Upcoming" icon={<CalendarClock size={16} />} span="lg:col-span-4" editMode={board.editMode} onHide={() => board.hide("upcoming")}>
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
          </BoardWidget>
        )}

        {board.visible("news") && (
          <BoardWidget
            title="News On Your Roster"
            icon={<Newspaper size={16} />}
            span="lg:col-span-8"
            editMode={board.editMode}
            onHide={() => board.hide("news")}
            data={{ types: ["My roster", "Watchlist", "All"] }}
          >
            <PlayerNews layout="cards" limit={3} />
          </BoardWidget>
        )}

        {board.visible("activity") && (
          <BoardWidget title="Activity" icon={<ActivityIcon size={16} />} span="lg:col-span-4" editMode={board.editMode} onHide={() => board.hide("activity")}>
            <ActivityFeed limit={5} />
          </BoardWidget>
        )}

        {board.visible("awards") && (
          <BoardWidget title="Weekly Awards" icon={<Flame size={16} />} span="lg:col-span-4" editMode={board.editMode} onHide={() => board.hide("awards")}>
            <WeeklyAwards />
          </BoardWidget>
        )}

        {board.visible("alerts") && (
          <BoardWidget
            title="Alerts"
            icon={<Bell size={16} />}
            span="lg:col-span-4"
            editMode={board.editMode}
            onHide={() => board.hide("alerts")}
            data={{ types: ["All", "Unread", "Mentions"] }}
          >
            <AlertsList />
          </BoardWidget>
        )}

        {board.visible("trending") && (
          <BoardWidget
            title="Trending Players"
            icon={<TrendingUp size={16} />}
            span="lg:col-span-4"
            editMode={board.editMode}
            onHide={() => board.hide("trending")}
            data={{ types: ["Risers", "Fallers", "Watchlist"] }}
          >
            <TrendingPlayers />
          </BoardWidget>
        )}

        {board.visible("form") && (
          <BoardWidget
            title="Recent Form"
            icon={<LineChart size={16} />}
            span="lg:col-span-8"
            editMode={board.editMode}
            onHide={() => board.hide("form")}
            data={{ years: SEASONS, ranges: ["6 weeks", "Full season"] }}
          >
            <RecentForm />
          </BoardWidget>
        )}

        {board.visible("ratings") && (
          <BoardWidget
            title="Manager Ratings"
            icon={<BarChart3 size={16} />}
            span="lg:col-span-4"
            editMode={board.editMode}
            onHide={() => board.hide("ratings")}
          >
            <ManagerRatings />
          </BoardWidget>
        )}

        {board.visible("trophies") && (
          <BoardWidget
            title="Trophy Case"
            icon={<Award size={16} />}
            span="lg:col-span-4"
            editMode={board.editMode}
            onHide={() => board.hide("trophies")}
          >
            <AchievementsGrid columns={5} />
          </BoardWidget>
        )}

        {board.visible("badges") && (
          <BoardWidget title="All Badges" icon={<Award size={16} />} span="lg:col-span-4" editMode={board.editMode} onHide={() => board.hide("badges")}>
            <BadgeRail showLabels />
          </BoardWidget>
        )}
      </BoardGrid>
    </Shell>
  )
}
