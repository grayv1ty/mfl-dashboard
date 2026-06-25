import { Shell } from "@/components/fpl/shell"
import { Panel, PanelHeader, Sparkline } from "@/components/fpl/primitives"
import { Kpi, LeagueCard } from "@/components/fpl/user-widgets"
import { ActivityFeed, PlayerNews } from "@/components/fpl/widgets"
import { getNav } from "@/lib/concepts"
import { userLeagues, seasonTrend } from "@/lib/mock"
import { Trophy, Crown, Flame, Zap, TrendingUp, Activity, Newspaper } from "lucide-react"

export default function Page() {
  const { prev, next } = getNav("user", "executive")
  const totalPf = userLeagues.reduce((s, l) => s + l.pointsFor, 0)
  return (
    <Shell variant="user" title="Dashboard" index={1} conceptName="Executive Dashboard" prev={prev} next={next}>
      {/* KPI hero band */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Kpi label="Active leagues" value={userLeagues.length} delta="+1" sub="2 leading their division" icon={<Trophy size={16} />} />
        <Kpi label="Win rate" value="65%" delta="+4%" sub="Across all leagues" icon={<TrendingUp size={16} />} />
        <Kpi label="Championships" value={3} sub="Career titles" icon={<Crown size={16} />} />
        <Kpi label="Total points for" value={totalPf.toLocaleString()} delta="+6%" sub="Season to date" icon={<Zap size={16} />} />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {/* Performance chart */}
          <Panel>
            <PanelHeader
              title="Season Performance"
              icon={<TrendingUp size={16} />}
              action={<span className="text-xs text-muted-foreground">Points for · last 6 weeks</span>}
            />
            <div className="px-5 pb-5">
              <div className="mb-2 flex items-end gap-2">
                <span className="text-2xl font-bold tabular-nums">467</span>
                <span className="mb-1 inline-flex items-center text-xs font-semibold text-success">
                  <TrendingUp size={12} /> +12% vs avg
                </span>
              </div>
              <Sparkline data={seasonTrend.map((d) => d.pf)} width={780} height={130} className="w-full" />
              <div className="mt-2 flex justify-between text-[11px] text-muted-foreground">
                {seasonTrend.map((d) => (
                  <span key={d.week}>{d.week}</span>
                ))}
              </div>
            </div>
          </Panel>

          {/* My leagues */}
          <Panel>
            <PanelHeader title="My Leagues" icon={<Trophy size={16} />} action={<button className="text-xs font-medium text-primary">Manage</button>} />
            <div className="grid grid-cols-1 gap-3 px-5 pb-5 sm:grid-cols-2">
              {userLeagues.map((l) => (
                <LeagueCard key={l.id} league={l} />
              ))}
            </div>
          </Panel>
        </div>

        <div className="space-y-4">
          <Panel>
            <PanelHeader title="Recent Activity" icon={<Activity size={16} />} />
            <div className="px-3 pb-4">
              <ActivityFeed limit={6} />
            </div>
          </Panel>
          <Panel>
            <PanelHeader title="Player News" icon={<Newspaper size={16} />} />
            <div className="px-5 pb-4">
              <PlayerNews layout="list" limit={4} />
            </div>
          </Panel>
          <Panel className="overflow-hidden">
            <div className="flex items-center gap-3 bg-gradient-to-br from-primary/20 to-transparent p-5">
              <Flame size={28} className="text-primary" />
              <div>
                <div className="text-sm font-semibold">3-game win streak</div>
                <div className="text-xs text-muted-foreground">Your hottest run this season</div>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </Shell>
  )
}
