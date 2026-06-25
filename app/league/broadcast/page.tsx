import { Circle, Radio, Trophy, Flame, Newspaper, Swords, Tv } from "lucide-react"
import { Shell } from "@/components/fpl/shell"
import { getNav } from "@/lib/concepts"
import {
  Widget,
  StandingsTable,
  MatchupCard,
  ActivityFeed,
  PlayerNews,
  NflSchedule,
} from "@/components/fpl/widgets"
import { Panel, TeamAvatar } from "@/components/fpl/primitives"
import { matchups, activity } from "@/lib/mock"

export default function Page() {
  const { prev, next } = getNav("league", "broadcast")
  return (
    <Shell
      variant="league"
      index={12}
      conceptName="Broadcast Desk"
      title="Game Day"
      activeLeagueId="zxjalkzjf"
      prev={prev}
      next={next}
    >
      {/* Live ticker bar */}
      <div className="mb-4 flex items-center gap-3 overflow-hidden rounded-xl border border-border bg-card px-4 py-2.5">
        <span className="flex shrink-0 items-center gap-1.5 rounded-md bg-destructive/15 px-2 py-1 text-[11px] font-bold uppercase text-destructive">
          <Circle size={7} className="animate-pulse fill-current" /> Live
        </span>
        <div className="flex items-center gap-6 overflow-x-auto no-scrollbar text-sm">
          {activity.slice(0, 5).map((a) => (
            <span key={a.id} className="flex shrink-0 items-center gap-1.5 whitespace-nowrap">
              <span className="font-semibold capitalize">{a.actor}</span>
              <span className="text-muted-foreground">{a.text}</span>
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* Main broadcast area */}
        <div className="space-y-4 lg:col-span-8">
          {/* Featured game */}
          <Panel className="overflow-hidden">
            <div className="flex items-center justify-between border-b border-border px-5 py-3">
              <span className="flex items-center gap-2 text-sm font-semibold">
                <Tv size={16} className="text-primary" /> Featured Matchup
              </span>
              <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase text-destructive">
                <Circle size={7} className="animate-pulse fill-current" /> 2nd Quarter
              </span>
            </div>
            <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
              {[
                { t: matchups[0].home, s: matchups[0].homeScore, proj: matchups[0].homeProj },
                null,
                { t: matchups[0].away, s: matchups[0].awayScore, proj: matchups[0].awayProj },
              ].map((side, i) =>
                side === null ? (
                  <div key="vs" className="text-center">
                    <div className="text-[11px] font-medium uppercase text-muted-foreground">Live</div>
                    <div className="text-2xl font-black text-muted-foreground">VS</div>
                  </div>
                ) : (
                  <div key={i} className={i === 0 ? "text-center sm:text-left" : "text-center sm:text-right"}>
                    <div className={`flex items-center gap-3 ${i === 2 ? "sm:flex-row-reverse" : ""} justify-center sm:justify-start`}>
                      <TeamAvatar seed={side.t.avatar} label={side.t.name} size={52} />
                      <div className={i === 2 ? "sm:text-right" : ""}>
                        <div className="font-bold">{side.t.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {side.t.wins}-{side.t.losses} · proj {side.proj}
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 text-5xl font-black tabular-nums">{side.s.toFixed(1)}</div>
                  </div>
                ),
              )}
            </div>
          </Panel>

          {/* All matchups grid */}
          <Widget title="Around the League" icon={<Swords size={16} />}>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {matchups.map((m) => (
                <MatchupCard key={m.id} m={m} />
              ))}
            </div>
          </Widget>

          <Widget title="NFL Scoreboard" icon={<Radio size={16} />}>
            <NflSchedule count={8} />
          </Widget>
        </div>

        {/* Sidebar */}
        <div className="space-y-4 lg:col-span-4">
          <Widget title="Live Standings" icon={<Trophy size={16} />}>
            <StandingsTable variant="compact" limit={12} />
          </Widget>
          <Widget title="Breaking News" icon={<Newspaper size={16} />}>
            <PlayerNews layout="list" limit={4} />
          </Widget>
          <Widget title="Play-by-Play" icon={<Flame size={16} />}>
            <ActivityFeed limit={6} />
          </Widget>
        </div>
      </div>
    </Shell>
  )
}
