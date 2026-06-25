import { Trophy, Flame, Newspaper, Crown, MessageSquare, Swords, ListOrdered, Activity } from "lucide-react"
import { Shell } from "@/components/fpl/shell"
import { getNav } from "@/lib/concepts"
import {
  StandingsTable,
  MatchupCard,
  ActivityFeed,
  PowerRankings,
  PlayerNews,
  AdpTable,
  NflSchedule,
  Transactions,
  LeagueChat,
} from "@/components/fpl/widgets"
import { Panel, PanelHeader } from "@/components/fpl/primitives"
import { matchups } from "@/lib/mock"

export default function Page() {
  const { prev, next } = getNav("league", "espn")
  return (
    <Shell
      variant="league"
      index={2}
      conceptName="ESPN Classic"
      title="Scoreboard"
      activeLeagueId="zxjalkzjf"
      prev={prev}
      next={next}
    >
      {/* Scoreboard strip */}
      <Panel className="mb-4 overflow-hidden">
        <div className="flex items-center justify-between border-b border-border bg-secondary/40 px-4 py-2">
          <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Week 7 Scoreboard</span>
          <span className="text-xs font-medium text-primary">● 3 games live</span>
        </div>
        <div className="grid grid-cols-1 gap-px bg-border sm:grid-cols-2 xl:grid-cols-4">
          {matchups.map((m) => (
            <MatchupCard key={m.id} m={m} className="rounded-none border-0 bg-card" />
          ))}
        </div>
      </Panel>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_320px]">
        {/* Main column */}
        <div className="space-y-4">
          <Panel>
            <PanelHeader title="League Standings" icon={<Trophy size={16} />} />
            <div className="px-5 pb-5">
              <StandingsTable variant="full" />
            </div>
          </Panel>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Panel>
              <PanelHeader title="Power Rankings" icon={<Crown size={16} />} />
              <div className="px-5 pb-5">
                <PowerRankings limit={6} />
              </div>
            </Panel>
            <Panel>
              <PanelHeader title="Players by ADP" icon={<ListOrdered size={16} />} />
              <div className="px-5 pb-5">
                <AdpTable limit={7} />
              </div>
            </Panel>
          </div>

          <Panel>
            <PanelHeader title="Latest Player News" icon={<Newspaper size={16} />} />
            <div className="px-5 pb-5">
              <PlayerNews layout="cards" limit={3} />
            </div>
          </Panel>
        </div>

        {/* Right rail */}
        <div className="space-y-4">
          <Panel>
            <PanelHeader title="NFL Schedule" icon={<Swords size={16} />} />
            <div className="px-5 pb-5">
              <NflSchedule count={4} className="flex-col" />
            </div>
          </Panel>
          <Panel>
            <PanelHeader title="Recent Activity" icon={<Flame size={16} />} />
            <div className="px-3 pb-4">
              <ActivityFeed limit={6} />
            </div>
          </Panel>
          <Panel>
            <PanelHeader title="Transactions" icon={<Activity size={16} />} />
            <div className="px-3 pb-4">
              <Transactions limit={5} />
            </div>
          </Panel>
          <Panel>
            <PanelHeader title="League Chat" icon={<MessageSquare size={16} />} />
            <div className="h-72 px-5 pb-5">
              <LeagueChat limit={4} />
            </div>
          </Panel>
        </div>
      </div>
    </Shell>
  )
}
