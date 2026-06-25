import { TrendingUp, BarChart3, Crown, Trophy, Target, Activity } from "lucide-react"
import { Shell } from "@/components/fpl/shell"
import { getNav } from "@/lib/concepts"
import { PowerRankings, StandingsTable, AdpTable } from "@/components/fpl/widgets"
import { Panel, PanelHeader, Sparkline, Ring, Progress, TeamAvatar } from "@/components/fpl/primitives"
import { standings, seasonTrend } from "@/lib/mock"
import { TrendPill } from "@/components/fpl/widgets"

const POINTS_BY_WEEK = [98, 112, 104, 131, 88, 142, 119]

export default function Page() {
  const { prev, next } = getNav("league", "analytics")
  const maxPf = Math.max(...standings.map((t) => t.pf))
  return (
    <Shell
      variant="league"
      index={4}
      conceptName="Analytics First"
      title="Insights"
      activeLeagueId="zxjalkzjf"
      prev={prev}
      next={next}
    >
      {/* KPI band */}
      <div className="mb-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Panel className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">League avg PF</span>
            <TrendPill value={4.2} />
          </div>
          <div className="mt-1 text-2xl font-bold tabular-nums">112.4</div>
          <Sparkline data={POINTS_BY_WEEK} width={180} height={36} className="mt-2 w-full" />
        </Panel>
        <Panel className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Trades this season</span>
            <TrendPill value={2} />
          </div>
          <div className="mt-1 text-2xl font-bold tabular-nums">18</div>
          <Sparkline data={[1, 2, 1, 3, 2, 4, 5]} width={180} height={36} className="mt-2 w-full" color="var(--info)" />
        </Panel>
        <Panel className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Waiver activity</span>
            <TrendPill value={-3} />
          </div>
          <div className="mt-1 text-2xl font-bold tabular-nums">47</div>
          <Sparkline data={[8, 6, 9, 7, 5, 6, 4]} width={180} height={36} className="mt-2 w-full" color="var(--warning)" />
        </Panel>
        <Panel className="flex items-center gap-4 p-4">
          <Ring value={91} size={64} color="var(--success)">
            91
          </Ring>
          <div>
            <div className="text-sm font-semibold">Competitive index</div>
            <p className="text-xs text-muted-foreground">Very balanced league parity</p>
          </div>
        </Panel>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {/* Points by week bar chart */}
          <Panel>
            <PanelHeader title="Points For — Week over Week" icon={<BarChart3 size={16} />} />
            <div className="px-5 pb-5">
              <div className="flex h-48 gap-3">
                {POINTS_BY_WEEK.map((v, i) => (
                  <div key={i} className="flex h-full flex-1 flex-col items-center gap-2">
                    <div className="flex h-full w-full items-end">
                      <div
                        className="group relative w-full rounded-t-md bg-primary/80 transition-colors hover:bg-primary"
                        style={{ height: `${(v / Math.max(...POINTS_BY_WEEK)) * 100}%` }}
                        title={`Week ${i + 1}: ${v}`}
                      >
                        <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[11px] font-semibold tabular-nums text-foreground opacity-0 transition-opacity group-hover:opacity-100">
                          {v}
                        </span>
                      </div>
                    </div>
                    <span className="text-[11px] text-muted-foreground">W{i + 1}</span>
                  </div>
                ))}
              </div>
            </div>
          </Panel>

          {/* PF leaderboard with bars */}
          <Panel>
            <PanelHeader title="Points For Leaderboard" icon={<Target size={16} />} />
            <div className="space-y-2.5 px-5 pb-5">
              {standings.slice(0, 8).map((t) => (
                <div key={t.id} className="flex items-center gap-3">
                  <TeamAvatar seed={t.avatar} label={t.name} size={26} />
                  <span className="w-32 truncate text-sm font-medium">{t.name}</span>
                  <Progress value={(t.pf / maxPf) * 100} className="h-2 flex-1" />
                  <span className="w-14 text-right text-sm font-semibold tabular-nums">{t.pf}</span>
                </div>
              ))}
            </div>
          </Panel>

          <Panel>
            <PanelHeader title="Season Scoring Trend" icon={<TrendingUp size={16} />} />
            <div className="px-5 pb-5">
              <Sparkline data={seasonTrend.map((d) => d.pf)} width={760} height={120} className="w-full" />
            </div>
          </Panel>
        </div>

        <div className="space-y-4">
          <Panel>
            <PanelHeader title="Power Rankings" icon={<Crown size={16} />} />
            <div className="px-5 pb-5">
              <PowerRankings limit={6} />
            </div>
          </Panel>
          <Panel>
            <PanelHeader title="Standings" icon={<Trophy size={16} />} />
            <div className="px-5 pb-5">
              <StandingsTable variant="compact" limit={6} />
            </div>
          </Panel>
          <Panel>
            <PanelHeader title="Draft Value (ADP)" icon={<Activity size={16} />} />
            <div className="px-5 pb-5">
              <AdpTable showFilters={false} limit={6} />
            </div>
          </Panel>
        </div>
      </div>
    </Shell>
  )
}
