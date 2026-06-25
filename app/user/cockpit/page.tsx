import { Shell } from "@/components/fpl/shell"
import { Panel, PanelHeader, TeamAvatar, Progress, Tag } from "@/components/fpl/primitives"
import { ActivityFeed, PlayerNews } from "@/components/fpl/widgets"
import { BadgeRail } from "@/components/fpl/user-widgets"
import { getNav } from "@/lib/concepts"
import { userLeagues, upcomingEvents } from "@/lib/mock"
import { Circle, Gauge, Activity, Newspaper, CalendarClock, Trophy, Flame } from "lucide-react"

function MatchupTile({ league }: { league: (typeof userLeagues)[number] }) {
  const live = league.matchupStatus === "live"
  const total = league.myScore + league.oppScore || 1
  const winning = league.myScore >= league.oppScore
  return (
    <Panel className="p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TeamAvatar seed={league.hue} label={league.name} size={26} />
          <span className="truncate text-xs font-semibold">{league.name}</span>
        </div>
        {live ? (
          <span className="flex items-center gap-1 text-[10px] font-bold text-primary">
            <Circle size={6} className="animate-pulse fill-current" /> LIVE
          </span>
        ) : league.draftIn ? (
          <Tag tone="info">Draft {league.draftIn}</Tag>
        ) : (
          <Tag tone="muted">Upcoming</Tag>
        )}
      </div>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[11px] text-muted-foreground">grayson</div>
          <div className={`text-2xl font-bold tabular-nums ${winning ? "text-foreground" : "text-muted-foreground"}`}>
            {live ? league.myScore.toFixed(1) : "—"}
          </div>
        </div>
        <span className="text-xs text-muted-foreground">vs</span>
        <div className="text-right">
          <div className="truncate text-[11px] text-muted-foreground">{league.nextOpponent}</div>
          <div className={`text-2xl font-bold tabular-nums ${!winning && live ? "text-foreground" : "text-muted-foreground"}`}>
            {live ? league.oppScore.toFixed(1) : "—"}
          </div>
        </div>
      </div>
      {live && (
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary">
          <div className="h-full rounded-full bg-primary" style={{ width: `${(league.myScore / total) * 100}%` }} />
        </div>
      )}
      <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
        <span>#{league.myRank} · {league.record}</span>
        <span className="tabular-nums">{league.pointsFor} PF</span>
      </div>
    </Panel>
  )
}

export default function Page() {
  const { prev, next } = getNav("user", "cockpit")
  const liveCount = userLeagues.filter((l) => l.matchupStatus === "live").length
  const leadingLive = userLeagues.filter((l) => l.matchupStatus === "live" && l.myScore >= l.oppScore).length
  const totalLive = userLeagues.filter((l) => l.matchupStatus === "live").reduce((s, l) => s + l.myScore, 0)
  const kpis = [
    { label: "Live matchups", value: liveCount, icon: <Circle size={14} className="text-primary" /> },
    { label: "Winning now", value: `${leadingLive}/${liveCount}`, icon: <Trophy size={14} /> },
    { label: "Live points", value: totalLive.toFixed(1), icon: <Flame size={14} /> },
    { label: "Leagues", value: userLeagues.length, icon: <Gauge size={14} /> },
  ]
  return (
    <Shell variant="user" title="Cockpit" index={13} conceptName="Cockpit" prev={prev} next={next}>
      {/* Identity + KPI strip */}
      <Panel className="mb-4 flex flex-col gap-4 p-4 lg:flex-row lg:items-center">
        <div className="flex items-center gap-3">
          <span className="h-12 w-12 overflow-hidden rounded-xl ring-2 ring-border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/user-avatar.png" alt="grayson" className="h-full w-full object-cover" />
          </span>
          <div>
            <div className="font-bold">grayson</div>
            <div className="text-[11px] text-muted-foreground">Mission control · Week 7</div>
          </div>
        </div>
        <div className="hidden h-10 w-px bg-border lg:block" />
        <div className="grid flex-1 grid-cols-2 gap-3 sm:grid-cols-4">
          {kpis.map((k) => (
            <div key={k.label} className="rounded-xl bg-secondary/40 px-3 py-2">
              <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                {k.icon} {k.label}
              </span>
              <div className="mt-0.5 text-xl font-bold tabular-nums">{k.value}</div>
            </div>
          ))}
        </div>
        <div className="hidden lg:block">
          <BadgeRail limit={5} />
        </div>
      </Panel>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* Matchup wall */}
        <div className="lg:col-span-8">
          <div className="mb-2 flex items-center gap-1.5 text-sm font-semibold">
            <Gauge size={16} /> All Matchups
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {userLeagues.map((l) => (
              <MatchupTile key={l.id} league={l} />
            ))}
          </div>

          <Panel className="mt-4">
            <PanelHeader title="Win Probability" icon={<Gauge size={16} />} />
            <ul className="space-y-3 px-5 pb-5">
              {userLeagues.map((l) => {
                const prob = l.matchupStatus === "live" ? Math.min(95, Math.max(8, Math.round((l.myScore / (l.myScore + l.oppScore || 1)) * 100))) : 50
                return (
                  <li key={l.id} className="flex items-center gap-3">
                    <TeamAvatar seed={l.hue} label={l.name} size={24} />
                    <span className="w-40 truncate text-xs font-medium">{l.name}</span>
                    <Progress value={prob} className="h-2 flex-1" tone={prob >= 50 ? "success" : "warning"} />
                    <span className="w-10 text-right text-xs font-bold tabular-nums">{prob}%</span>
                  </li>
                )
              })}
            </ul>
          </Panel>
        </div>

        {/* Side rails */}
        <div className="space-y-4 lg:col-span-4">
          <Panel>
            <PanelHeader title="Upcoming" icon={<CalendarClock size={16} />} />
            <ul className="space-y-2 px-4 pb-4">
              {upcomingEvents.map((e) => (
                <li key={e.id} className="flex items-center justify-between rounded-lg bg-secondary/40 px-3 py-2.5">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">{e.title}</div>
                    <div className="truncate text-[11px] text-muted-foreground">{e.league}</div>
                  </div>
                  <span className="shrink-0 text-[11px] font-semibold">{e.when}</span>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel>
            <PanelHeader title="Live Feed" icon={<Activity size={16} />} />
            <div className="px-3 pb-4">
              <ActivityFeed limit={6} />
            </div>
          </Panel>
          <Panel>
            <PanelHeader title="Player News" icon={<Newspaper size={16} />} />
            <div className="px-5 pb-4">
              <PlayerNews layout="list" limit={3} />
            </div>
          </Panel>
        </div>
      </div>
    </Shell>
  )
}
