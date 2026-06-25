import {
  Trophy,
  Flame,
  Repeat,
  Newspaper,
  Crown,
  MessageSquare,
  Swords,
  Users,
  Award,
  ListOrdered,
  Gavel,
  CalendarClock,
} from "lucide-react"
import { Shell } from "@/components/fpl/shell"
import { getNav } from "@/lib/concepts"
import {
  Widget,
  LeagueBanner,
  StandingsTable,
  MatchupCard,
  ActivityFeed,
  PowerRankings,
  PlayerNews,
  LeagueChat,
  Transactions,
  NflSchedule,
  AdpTable,
  CommishTools,
  MembersList,
  WeeklyAwards,
} from "@/components/fpl/widgets"
import { Stat, Ring } from "@/components/fpl/primitives"
import { matchups, upcomingEvents } from "@/lib/mock"

export default function Page() {
  const { prev, next } = getNav("league", "hq")
  return (
    <Shell
      variant="league"
      index={11}
      conceptName="League HQ"
      title="HQ"
      activeLeagueId="zxjalkzjf"
      prev={prev}
      next={next}
    >
      {/* Banner hero with league icon + key stats */}
      <LeagueBanner tags={["Keeper", "Dynasty", "PPR"]} className="mb-4" />

      {/* NFL schedule ticker */}
      <Widget title="NFL Schedule · Week 1" icon={<Swords size={16} />} className="mb-4">
        <NflSchedule count={8} />
      </Widget>

      {/* Dense everything grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <Widget title="My Matchup" icon={<Swords size={16} />} className="lg:col-span-5">
          <MatchupCard m={matchups[0]} className="border-0 bg-transparent p-0" />
          <div className="mt-3 grid grid-cols-3 gap-2">
            <Stat label="Win prob" value="71%" />
            <Stat label="Proj margin" value="+11.7" />
            <Stat label="Left" value="6" />
          </div>
        </Widget>

        <Widget title="Standings" icon={<Trophy size={16} />} className="lg:col-span-4 lg:row-span-2">
          <StandingsTable variant="compact" limit={12} />
        </Widget>

        <Widget title="League Pulse" icon={<Flame size={16} />} className="lg:col-span-3">
          <div className="flex items-center gap-4">
            <Ring value={84} size={64} color="var(--primary)">
              84
            </Ring>
            <div className="text-sm">
              <div className="font-medium">High activity</div>
              <p className="text-xs text-muted-foreground">14 moves · 2 trades pending</p>
            </div>
          </div>
        </Widget>

        <Widget title="Power Rankings" icon={<Crown size={16} />} className="lg:col-span-5">
          <PowerRankings limit={4} />
        </Widget>

        <Widget title="Trade Block" icon={<Repeat size={16} />} className="lg:col-span-3">
          <Transactions limit={4} />
        </Widget>

        <Widget title="Player News" icon={<Newspaper size={16} />} className="lg:col-span-5">
          <PlayerNews layout="list" limit={3} />
        </Widget>

        <Widget title="League Activity" icon={<Flame size={16} />} className="lg:col-span-4">
          <ActivityFeed limit={5} />
        </Widget>

        <Widget title="League Chat" icon={<MessageSquare size={16} />} className="lg:col-span-3 lg:row-span-2">
          <LeagueChat limit={5} />
        </Widget>

        <Widget title="Weekly Awards" icon={<Award size={16} />} className="lg:col-span-5">
          <WeeklyAwards />
        </Widget>

        <Widget title="Players by ADP" icon={<ListOrdered size={16} />} className="lg:col-span-4">
          <AdpTable limit={6} />
        </Widget>

        <Widget title="Commissioner Tasks" icon={<Gavel size={16} />} className="lg:col-span-5">
          <CommishTools />
        </Widget>

        <Widget title="Members" icon={<Users size={16} />} className="lg:col-span-4">
          <MembersList />
        </Widget>

        <Widget title="Upcoming" icon={<CalendarClock size={16} />} className="lg:col-span-3">
          <ul className="space-y-2.5">
            {upcomingEvents.map((e) => (
              <li key={e.id} className="rounded-lg bg-secondary/40 px-3 py-2.5">
                <div className="text-sm font-medium">{e.title}</div>
                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span className="truncate">{e.league}</span>
                  <span className="shrink-0 font-semibold text-foreground">{e.when}</span>
                </div>
              </li>
            ))}
          </ul>
        </Widget>
      </div>
    </Shell>
  )
}
